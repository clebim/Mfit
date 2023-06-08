export class SizeNotCompatibleError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SizeNotCompatibleError'
    this.message = message
  }
}
