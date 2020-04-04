import processor from "./processor";

var parser = {
  instruction: [],
  pointer: new Map(),
  dataAddr: new Map(),
  ptrArray: [],
  memPtr: 0
};

parser.parse = code => {
  const lineWiseSplit = [];

  code.split("\n").forEach(line => {
    var lineArr = line.trim().split(/[ ,.]+/)
    if(!(lineArr.length === 1 && lineArr[0] === "")) lineWiseSplit.push(lineArr);
  });
  // console.log(lineWiseSplit)

  lineWiseSplit.forEach((line, idx) => {
    // console.log(line, line[0])
    if (line[0][line[0].length - 1] === ":") {
      // console.log("Found One")
      parser.pointer.set(line[0].substring(0, line[0].length - 1), idx);
      parser.ptrArray.push(line[0].substring(0, line[0].length - 1));
    }
  });

  parser.memPtr = 0;

  lineWiseSplit.forEach((line, idx) => {
    if (line[1] === "text") {
      return;
    }
    if (line[1] === "word") {
      parser.dataAddr[parser.ptrArray[parser.memPtr]] = parser.memPtr;
      line.forEach((word, idx) => {
        if (idx > 1) {
          // each val is of size 32 bits
          var val = parseInt(word).toString(2);
          const len = val.length;
          for (let i = 0; i < 32 - len; i++) {
            val = "0" + val;
          }
          // console.log(val)
          processor.memory[parser.memPtr] = val.slice(0, 8);
          processor.memory[parser.memPtr + 1] = val.slice(8, 16);
          processor.memory[parser.memPtr + 2] = val.slice(16, 24);
          processor.memory[parser.memPtr + 3] = val.slice(24, 32);

          parser.memPtr += 4;
        }
      });
    }
  });

  return lineWiseSplit
};

parser.reset = () => {
  parser.instruction = []
  parser.pointer = new Map()
  parser.dataAddr = new Map()
  parser.ptrArray = []
}

export default parser;