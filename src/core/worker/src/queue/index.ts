/* eslint-disable no-dupe-class-members */
import { resolve } from 'node:path'
import { Worker as NodeWorker } from 'node:worker_threads'

type QueueOptions = {
  workers?: number
  retries?: number
  delay?: number
  enableLogs?: boolean
}

type TaskData = {
  fnPath: string
  args: any[]
  attemptsMade: number
}

type EventName = 'data' | 'error' | 'finish' | 'init' | 'requeue'

type ExtendedFunctions = {
  setContext: (context: string) => void
}

export interface WorkerCore {
  on(event: 'data', listener: <T>(data: T, context: string) => void): void
  on(event: 'error', listener: (error: Error, context: string) => void): void
  on(event: 'finish', listener: () => void): void
  on(event: 'init', listener: (attempt: number, context: string) => void): void
  on(
    event: 'requeue',
    listener: (attemptsMade: number, context: string) => void,
  ): void
  addJob(fnPath: string, ...args: any[]): ExtendedFunctions
}

export class Worker implements WorkerCore {
  private tasks: TaskData[]
  private runningTasks: number
  private workers: number
  private retries: number
  private delay?: number
  private events: Map<EventName, (...args: any) => void>
  private contexts: Map<string, string>
  private extensionFile: string

  constructor(props?: QueueOptions) {
    this.tasks = []
    this.runningTasks = 0
    this.workers = props?.workers ?? 1
    this.retries = props?.retries ?? 1
    this.delay = props?.delay ?? 1 * 60 * 60 // 1 minuto de delay
    this.extensionFile = process.env.NODE_ENV === 'dev' ? 'ts' : 'js'
    this.events = new Map()
    this.contexts = new Map()
  }

  private getFilePath(path: string) {
    if (path.includes('.ts') && this.extensionFile === 'js') {
      return path.replace('.ts', '.js')
    }

    return path
  }

  private callEventFunction(event: EventName, fnPath = '', args?: any) {
    if (this.events.has(event)) {
      const fn = this.events.get(event)
      const context = this.contexts.get(fnPath)
      fn!.apply(this, [...args, context])
    }
  }

  private requeue({ fnPath, args, attemptsMade }: TaskData) {
    if (attemptsMade < this.retries) {
      this.callEventFunction('requeue', fnPath, attemptsMade)
      setTimeout(() => {
        this.tasks.push({ fnPath, args, attemptsMade })
        this.processTasks()
      }, this.delay)
    }
  }

  private processTasks() {
    while (this.runningTasks < this.workers && this.tasks.length > 0) {
      const task = this.tasks.shift() as TaskData
      const worker = new NodeWorker(
        resolve(__dirname, '..', 'worker', `index.${this.extensionFile}`),
      )
      const filePath = this.getFilePath(task.fnPath)

      task.attemptsMade++
      this.runningTasks++

      const { fnPath, args, attemptsMade } = task

      this.callEventFunction('init', fnPath, attemptsMade)

      worker.postMessage({ fnPath: filePath, args })

      worker.on('message', (workerResponse) => {
        const { isSuccess, value } = workerResponse

        if (isSuccess) {
          this.callEventFunction('data', fnPath, value)
        } else {
          this.callEventFunction('error', fnPath, value)
          this.requeue(task)
        }
      })

      worker.once('error', (error) => {
        if (this.retries !== 1) {
          this.requeue(task)
        }
        this.callEventFunction('error', fnPath, error)
      })

      worker.once('exit', (code) => {
        this.runningTasks--
        this.callEventFunction('finish')
        this.processTasks()
      })
    }
  }

  public on(
    event: 'data',
    listener: <T>(data: T, context: string) => void,
  ): void

  public on(
    event: 'error',
    listener: (error: Error, context: string) => void,
  ): void

  public on(event: 'finish', listener: () => void): void

  public on(
    event: 'init',
    listener: (attempt: number, context: string) => void,
  ): void

  public on(
    event: 'requeue',
    listener: (attemptsMade: number, context: string) => void,
  ): void

  public on(event: EventName, listener: (...args: any[]) => void): void {
    this.events.set(event, listener)
  }

  public addJob(fnPath: string, ...args: any[]): ExtendedFunctions {
    this.tasks.push({ fnPath, args, attemptsMade: 0 })
    this.processTasks()

    return {
      setContext: (context: string) => {
        this.contexts.set(fnPath, context)
      },
    }
  }
}
