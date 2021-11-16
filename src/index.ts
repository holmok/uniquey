import Crypto from 'crypto'

/**
 * Options to create an instance of Uniquee
 */
export interface UniqueeOptions {
  /**
   * Length of the unique string to generate
   * default: 8
   */
  length?: number
  /**
   * Characters to use in the unique string
   * default: 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
   */
  characters?: string
  /**
   * Number of random bytes to allocate
   * default: 256
   */
  allocate?: number
}

interface ValidOptions {
  length: number
  characters: string
  allocate: number
}

// Validate the options and set defaults
function validateAndDefaultOptions (options: UniqueeOptions): ValidOptions {
  const { length, characters, allocate } = options

  // length must be greater than 0
  if (length != null && length < 1) {
    throw new Error('Length option must be greater than 0')
  }

  // allocate must be greater than 0
  if (allocate != null && allocate < 1) {
    throw new Error('Allocate option must be greater than 0')
  }

  // length must be less than or equal to allocate
  if (allocate != null && length != null && length > allocate) {
    throw new Error('Length option must be less than or equal to allocate option')
  }

  // characters need to have at least two characters and have unique characters and be less than 256 characters
  if (characters != null) {
    if (characters.length < 2) {
      throw new Error('Characters option must be at least 2 character long')
    }
    if (characters.length > 256) {
      throw new Error('Characters option must be less than 256 characters')
    }
    const charSet = new Set(characters.split(''))
    if (charSet.size !== characters.length) {
      throw new Error('Characters option must have unique characters')
    }
  }

  return {
    length: options.length ?? 8,
    characters: options.characters ?? '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    allocate: options.allocate ?? 256
  }
}

/**
 * Generate a unique string
 */
export default class Uniquee {
  private readonly length: number
  private readonly characters: string[]
  private readonly allocate: number
  private readonly pool: Uint8Array
  private pointer: number
  private readonly numberOfCharacters: number

  /**
   * Creates an instance of Uniquee.
   * @param options {UniqueeOptions} options to create the unique key.
   */
  constructor (options: UniqueeOptions = {}) {
    const validOptions = validateAndDefaultOptions(options)
    this.length = validOptions.length
    this.characters = validOptions.characters.split('')
    this.allocate = validOptions.allocate
    this.pool = new Uint8Array(this.allocate)
    this.pointer = this.pool.length
    this.numberOfCharacters = this.characters.length
  }

  private random (): Uint8Array {
    if (this.pointer > this.pool.length - this.length) {
      Crypto.randomFillSync(this.pool)
      this.pointer = 0
    }
    return this.pool.slice(this.pointer, (this.pointer += this.length))
  }

  /**
   * Create a unique key.
   * @returns {string} random string based on the options passed to Uniquee.
   */
  create (): string {
    const indexer = this.random().map(x => x % this.numberOfCharacters).values()
    let output = ''
    for (let i = indexer.next().value; i != null; i = indexer.next().value) {
      output = `${output}${this.characters[i] as string}`
    }
    return output
  }
}
