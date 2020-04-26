// mem stage with functionality

import processor from '../processor'

const memory = (instr, cacheController, currentCycle) => {
    // console.log("MEM", instr)
    if (instr.operator === 'lw') {
        // console.log(instr)
        instr.src1.val = processor.getRegister(instr.src1.reg)
        var src1 = instr.src1.val

        if (instr.dep1 !== undefined && instr.dep1 !== "") {
            src1 = instr.dep1
            instr.dep1 = ""
        }

        const addr = (src1 - 268500992)/4 + parseInt(instr.offset/4)
        // const val = processor.memory[addr]
        // const valDec = parseInt(val, 2)

        // console.log(addr, val, valDec)
        instr.result = cacheController.readFromCache(addr, currentCycle)[0]
        processor.setRegister(instr.dest, instr.result)
    }
    else if (instr.operator === 'li' || instr.operator === 'lui') {
        // console.log("LIing")
        if (instr.operator === 'li') {
            processor.setRegister(instr.dest, parseInt(instr.val))
        }
        else {
            processor.setRegister(instr.dest, instr.val << 16)
        }
    }
    else if (instr.operator === 'la') {
        processor.setRegister(instr.dest, instr.addr)
    }
}

export default memory