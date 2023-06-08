export class ClassDoesNotExtendsUseCaseCore extends Error {
  constructor() {
    super("Class does not extends use case core. Make sure it's extended")
    super.name = ClassDoesNotExtendsUseCaseCore.name
  }
}
