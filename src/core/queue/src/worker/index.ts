import { parentPort } from 'worker_threads'

type OnMessageProps = {
  fnPath: string
  args: any[]
}

const onMessage = async ({ fnPath, args }: OnMessageProps) => {
  try {
    const fn = require(fnPath)
    const response = await fn.default.apply(this, args)

    parentPort?.postMessage({ isSuccess: true, value: response })
    parentPort?.close()
  } catch (error) {
    parentPort?.postMessage({ isSuccess: false, value: error })
    parentPort?.close()
  }
}

parentPort?.on('message', onMessage)
