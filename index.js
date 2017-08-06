function append(buffer, index) {
  var freeIndex = buffer.readUInt32BE(0)
}

function available(buffer) {
  //the location of the next available free space
  //is stored at the first 32bit int
  return buffer.length - (buffer.readUInt32BE(0)+4)
}

function alloc (buffer, size, append_index) {
  var index = buffer.readUInt32BE(0)+4
  //pointer to free memory
  buffer.writeUInt32BE(index+size+8-4, 0)
  //size of this block
  buffer.writeUInt32BE(size, index)
  //if we are appending to a previous buffer
  //update that index's pointers
  if(append_index)
    buffer.writeUInt32BE(index, append_index+4)
  //the next Uint32BE is the location of the next buffer
  return index
}

function writeUInt32BE(buffer, value, block_index, index) {
  //follow pointers and update block_index && index
  var size
  while(index >= (size = buffer.readUInt32BE(block_index))) {
    block_index = buffer.readUInt32BE(block_index+4)
    if(block_index === 0) throw new Error('out of bounds read')
    index -= size
  }
  //^^ this code also copied into read function
  buffer.writeUInt32BE(value, block_index+8+index)
}

function readUInt32BE(buffer, block_index, index) {
  //follow pointers and update block_index && index
  var size
  while(index >= (size = buffer.readUInt32BE(block_index))) {
    block_index = buffer.readUInt32BE(block_index+4)
    if(block_index === 0) throw new Error('out of bounds read')
    index -= size
  }

  return buffer.readUInt32BE(block_index+8+index)
}

function size (buffer, block_index) {
  var size = 0
  do {
    size += buffer.readUInt32BE(block_index)
    block_index = buffer.readUInt32BE(block_index+4)
  }
  while(block_index)
  return size
}

module.exports = function (buffer) {
  return {
    available: available.bind(null, buffer),
    alloc: alloc.bind(null, buffer),
    writeUInt32BE: writeUInt32BE.bind(null, buffer),
    readUInt32BE: readUInt32BE.bind(null, buffer),
    size: size.bind(null, buffer)
  }
}

