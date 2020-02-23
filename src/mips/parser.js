import processor from "./operations";

var parser = {
  instruction: [],
  pointer: new Map(),
  dataAddr: new Map(),
  ptrArray: []
};

parser.parse = code => {
  const lineWiseSplit = [];

  code.split("\n").forEach(line => {
    lineWiseSplit.push(line.split(/[ ,.]+/));
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

  var memPtr = 0;

  lineWiseSplit.forEach((line, idx) => {
    if (line[1] === "text") {
      return;
    }
    if (line[1] === "word") {
      parser.dataAddr[parser.ptrArray[memPtr]] = memPtr;
      line.forEach((word, idx) => {
        if (idx > 1) {
          // each val is of size 32 bits
          var val = parseInt(word).toString(2);
          const len = val.length;
          for (let i = 0; i < 32 - len; i++) {
            val = "0" + val;
          }
          // console.log(val)
          processor.memory[memPtr] = val.slice(0, 8);
          processor.memory[memPtr + 1] = val.slice(8, 16);
          processor.memory[memPtr + 2] = val.slice(16, 24);
          processor.memory[memPtr + 3] = val.slice(24, 32);

          memPtr += 4;
        }
      });
    }
  });
};

export default parser;