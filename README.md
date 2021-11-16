# Uniquee

Uniquee _(you-KNEE-key)_ is a node library that generates random unique strings __(or keys)__.

## Why?
Yeah, there are uuids and we mostly use v4 (random) ones. But we normally store these 128bit keys as TEXT in a database. Which is 32 characters which is bigger than 128 bits. So rather than hex why not base62 (A-Za-z0-9) or even any alphabet, and how about just always 8 characters, that will give us a total of 2.18*10^14 unique keys.

## Are Collisions Possible?
Yes, but you can make it less possible by adjusting the length to 22 and you will get a slightly small less of a collision as uuid v4. With the added bonus of only being 22 characters (or even fewer with a larger alphabet).

## How random?

Yeah, there are a bunch of less than good ways to generate random stuff in node/javascript. The base of this library uses `Crypto.randomFillSync` to allocate a bunch of random bytes.  This is similar to how the `uuid` library generates v4 uuids.

------

## How to Use

__Install it with__

```yarn add uniquee``` 

or 

```npm i uniquee```

__Sample code:__

```javascript
import Uniqee from 'uniquee'

const uniquee = new Uniquee()

console.log(uniquee.create())

// outputs random string like `HqiId0Sj`
```

------

## Options

You can create a __Uniquee__ instance with the following optional options:

* `length` [number]: _(default: 8)_ the length of string to create. Must be greater than 0, and less than `allocation`
* `characters` [string]: _(default: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')_ the characters to use in the random output.  Must be at least 2 characters and no more than 256 and not have any duplicates.
* `allocate` [number]: _(default: 256)_ number of random bytes to allocate, this helps with performance.  Must be larger than `length` and greater than 0.

__Example using options:__
```javascript
import Uniqee from 'uniquee'

const uniquee = new Uniquee({length: 4, characters: '🐈🐕🐎', allocate: 4000})

console.log(uniquee.create())

// outputs random string like `🐎🐈🐎🐕` 
// not very random but fun!
// also this will allocate new random bytes 
// after generating 1000 random keys (4000/4)
```