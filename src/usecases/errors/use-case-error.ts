export class UseCaseError extends Error {
  constructor(message: string, public fields = {}) {
    super(message)
  }
}
