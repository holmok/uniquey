import Tape from 'tape'
import Sinon from 'sinon'
import Uniquee from '../src/index'
import Crypto from 'crypto'
import { TestContext } from './types'

function pre (): TestContext {
  const sandbox = Sinon.createSandbox()
  return {
    mocks: {
      crypto: sandbox.mock(Crypto)
    },
    sandbox
  }
}

function post (ctx: TestContext): void {
  ctx.sandbox.verifyAndRestore()
}

Tape('default', (t) => {
  t.plan(3)
  const context = pre()
  context.mocks?.crypto?.expects('randomFillSync')?.once()?.callsFake((x: Uint8Array): Uint8Array => { x = Uint8Array.from(Array(256)); return x })
  const uniquee = new Uniquee()
  const result = uniquee.create()
  t.equal(result.length, 8, 'should return 8 characters')
  t.equal(result, '00000000', 'should return 8 zeros')
  t.pass('success')
  post(context)
})

Tape('good options', (t) => {
  t.plan(3)
  const context = pre()
  context.mocks?.crypto?.expects('randomFillSync')?.once()?.callsFake((x: Uint8Array): Uint8Array => { x = Uint8Array.from(Array(256)); return x })
  const uniquee = new Uniquee({ characters: 'za', length: 4, allocate: 123 })
  const result = uniquee.create()
  t.equal(result.length, 4, 'should return 4 characters')
  t.equal(result, 'zzzz', 'should return 4 z\'s')
  t.pass('success')
  post(context)
})

Tape('re-allocate', (t) => {
  t.plan(1)
  const context = pre()
  context.mocks?.crypto?.expects('randomFillSync')?.twice()?.callsFake((x: Uint8Array): Uint8Array => { x = Uint8Array.from(Array(256)); return x })
  const uniquee = new Uniquee({ length: 8, allocate: 8 })
  uniquee.create()
  uniquee.create()
  t.pass('success')
  post(context)
})

Tape('do not re-allocate', (t) => {
  t.plan(1)
  const context = pre()
  context.mocks?.crypto?.expects('randomFillSync')?.once()?.callsFake((x: Uint8Array): Uint8Array => { x = Uint8Array.from(Array(256)); return x })
  const uniquee = new Uniquee({ length: 8, allocate: 32 })
  uniquee.create()
  uniquee.create()
  t.pass('success')
  post(context)
})

Tape('bad options in constructor', (t) => {
  t.plan(8)

  t.throws(() => {
    const uniquee = new Uniquee({ length: 0 })
    t.fail(`should not create instance of ${typeof uniquee}`)
  }, 'length low')

  t.throws(() => {
    const uniquee = new Uniquee({ characters: '' })
    t.fail(`should not create instance of ${typeof uniquee}`)
  }, 'empty characters')

  t.throws(() => {
    const uniquee = new Uniquee({ characters: 'a' })
    t.fail(`should not create instance of ${typeof uniquee}`)
  }, 'one character')

  t.throws(() => {
    const uniquee = new Uniquee({ characters: 'aa' })
    t.fail(`should not create instance of ${typeof uniquee}`)
  }, 'dupe character')

  t.throws(() => {
    const uniquee = new Uniquee({ characters: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
    t.fail(`should not create instance of ${typeof uniquee}`)
  }, 'too many character')

  t.throws(() => {
    const uniquee = new Uniquee({ allocate: 2, length: 5 })
    t.fail(`should not create instance of ${typeof uniquee}`)
  }, 'allocate less than length')

  t.throws(() => {
    const uniquee = new Uniquee({ allocate: 0 })
    t.fail(`should not create instance of ${typeof uniquee}`)
  }, 'allocate less than 1')

  t.pass('success')
})
