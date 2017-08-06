var tape = require('tape')

var Appendable = require('../')

tape('create a new appendable', function (t) {
  var b = new Buffer(1024*1024)
  b.fill(0)
  var a = Appendable(b)
  t.equal(a.available(), 1024*1024-4)
  var index = a.alloc(8)
  t.equal(index, 4) //the first allocation should be right after the free memory pointer.

  a.writeUInt32BE(0x01010101, index, 0)
  a.writeUInt32BE(0x01010101, index, 4)
  t.equal(a.size(index), 8)
  console.log(b)

  t.throws(function () {
    a.writeUInt32BE(0xffffffff, index, 8)
  }, 'Cannot write past the end')

  var index2 = a.alloc(16, index)
  t.equal(a.size(index), 24)

  console.log('index2')
  t.equal(index2, 4+8+8) //the first allocation should be right after the free memory pointer.


  a.writeUInt32BE(0x02020202, index2, 0)
  a.writeUInt32BE(0x02020202, index2, 4)
  a.writeUInt32BE(0x02020202, index2, 8)
  a.writeUInt32BE(0x02020202, index2, 12)

  console.log(b)

  console.log("01")
  t.equal(a.readUInt32BE(index, 0), 0x01010101)
  t.equal(a.readUInt32BE(index, 4), 0x01010101)

  console.log('02')
  t.equal(a.readUInt32BE(index, 8), 0x02020202, 'first int in 2nd block')
  t.equal(a.readUInt32BE(index, 12), 0x02020202, '2nd int in 2nd block')
  
  t.equal(a.readUInt32BE(index, 16), 0x02020202)
  t.equal(a.readUInt32BE(index, 20), 0x02020202)

  t.end()
})



