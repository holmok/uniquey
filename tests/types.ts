import Sinon from 'sinon'

export interface TestContext {
  mocks?: {[key: string]: Sinon.SinonMock}
  stubs?: {[key: string]: Sinon.SinonStub}
  sandbox: Sinon.SinonSandbox
}
