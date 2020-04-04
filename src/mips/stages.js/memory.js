// mem stage with functionality

import processor from '../processor'

const memory = instr => {
    console.log("MEM", instr)
    if(instr.operator === 'lw'){
        console.log(instr)
        instr.src1.val = processor.getRegister(instr.src1.reg)
        const addr = parseInt((instr.src1.val) + (instr.offset * 4)) - 268500992
        const val = processor.memory[addr] + processor.memory[addr + 1] + processor.memory[addr + 2] + processor.memory[addr + 3]
        const valDec = parseInt(val, 2)

        console.log(addr, val, valDec)
    
        processor.setRegister(instr.dest, valDec)
    }
    else if(instr.operator === 'li' || instr.operator === 'lui'){
        // console.log("LIing")
        if(instr.operator === 'li'){
            processor.setRegister(instr.dest, parseInt(instr.val))
        }
        else{
            processor.setRegister(instr.dest, instr.val<<16)
        }
    }
    else if(instr.operator === 'la'){
        processor.setRegister(instr.dest, instr.addr)
    }
}

export default memory