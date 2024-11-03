/* eslint-disable @typescript-eslint/prefer-destructuring -- annoying */
/* eslint-disable @typescript-eslint/no-magic-numbers -- annoying */

import Crypto from 'crypto'

/**
 * Options to create an instance of Uniquey
 */
export interface UniqueyOptions {
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

  /**
   * support multi-byte characters?
   */
  multiByteCharacters?: boolean
}

interface ValidOptions {
  length: number
  characters: string[]
  allocate: number
}

function isMultiByte(characters: string): boolean {
  return /[\uD800-\uDFFF]/.test(characters)
}
function splitMultiByte(characters: string): string[] {
  // first split with multi-byte characters
  const splitMulti = characters
    .split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)
    .filter((i) => i.length > 1)
  const output: string[] = []
  // split the other chunks
  splitMulti.forEach((i) => {
    if (isMultiByte(i)) {
      output.push(i)
    } else {
      output.push(...i.split(''))
    }
  })
  return output
}

// Validate the options and set defaults
function validateAndDefaultOptions(options: UniqueyOptions): ValidOptions {
  const { length, characters, allocate, multiByteCharacters } = options
  const chars = splitMultiByte(
    characters ??
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  )
  const multiByte = multiByteCharacters ?? false

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
    throw new Error(
      'Length option must be less than or equal to allocate option'
    )
  }

  // characters need to have at least two characters and have unique characters and be less than 256 characters

  if (chars.length < 2) {
    throw new Error('Characters option must be at least 2 character long')
  }
  if (chars.length > 256) {
    throw new Error('Characters option must be less than 256 characters')
  }

  if (!multiByte && isMultiByte(chars.join(''))) {
    throw new Error('Characters option must not contain multi-byte characters')
  }

  const charSet = new Set(chars)
  if (charSet.size !== chars.length) {
    throw new Error('Characters option must have unique characters')
  }

  return {
    length: options.length ?? 8,
    characters: chars,
    allocate: options.allocate ?? 256
  }
}

/**
 * Generate a unique string
 */
export default class Uniquey {
  private readonly length: number
  private readonly characters: string[]
  private readonly allocate: number
  private readonly pool: Uint8Array
  private pointer: number
  private readonly numberOfCharacters: number

  /**
   * Creates an instance of Uniquey.
   * @param options {UniqueyOptions} options to create the unique key.
   */
  constructor(options: UniqueyOptions = {}) {
    const { length, characters, allocate } = validateAndDefaultOptions(options)
    this.length = length
    this.characters = characters
    this.allocate = allocate
    this.pool = new Uint8Array(this.allocate)
    this.pointer = this.pool.length
    this.numberOfCharacters = this.characters.length
  }

  private random(): Uint8Array {
    if (this.pointer > this.pool.length - this.length) {
      Crypto.randomFillSync(this.pool)
      this.pointer = 0
    }
    return this.pool.slice(this.pointer, (this.pointer += this.length))
  }

  /**
   * Create a unique key.
   * @returns {string} random string based on the options passed to Uniquey.
   */
  create(): string {
    const indexer = this.random()
      .map((x) => x % this.numberOfCharacters)
      .values()
    let output = ''
    for (let i = indexer.next().value; i != null; i = indexer.next().value) {
      output = `${output}${this.characters[i]}`
    }
    return output
  }
}
