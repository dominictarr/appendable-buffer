# appendable-buffer

A data structure on top of raw buffers that lets you append
to buffers.

First, allocate a large (say, 1mb) buffer fill with zeros.
Then inside of that, we create linked lists of contigious regions
(blocks). lets say we have a lot of lists of numbers, and we
don't know how many we'll need. We start of allocating enough
space for say 8 items - then when that fills, we append
another block but this time for 16 and so on. On average everything
will be half full, and we can access any point by following
the pointers - since each block gets bigger, we only need
to follow `O(log(N))` links, which is acceptable. Also,
it can be quickly read in or written to disk without parsing,
and it will not interact with garbage collection, since that
doesn't touch raw memory.

## example

``` js
var Appendable = require('appendable-buffer')
var b = new Buffer(1024*1024)
var a = Appendable(b)
//get a block that fits 8 32 bit ints
var i = a.alloc(4*8)
//write values to that block + offset within that block
a.writeUInt32BE(1, i, 0)
a.writeUInt32BE(2, i, 4)
a.writeUInt32BE(1, i, 8)
a.writeUInt32BE(3, i, 12)
a.writeUInt32BE(4, i, 16)
a.writeUInt32BE(5, i, 20)
a.writeUInt32BE(6, i, 24)
a.writeUInt32BE(7, i, 28)
a.writeUInt32BE(8, i, 32)
//we cannot write past the end!
assert.throws(function () {
  a.writeUInt32BE(9, i, 36)
})

//but we can extend the buffer
var i2 = a.alloc(16*4, i)
//i2 is the second block. we can access this directly,
//or via the first block.
a.writeUInt32BE(9, i, 36)

assert.equal(a.readUInt32BE(i, 36), a.readUInt32BE(i2, 0))
```

## License

MIT








