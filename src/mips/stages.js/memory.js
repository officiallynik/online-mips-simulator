// mem stage with functionality

import processor from '../processor'

const memory = instr => {
    if(instr.operator === 'lw'){
        const addr = parseInt(processor.getRegister(instr.src) + (instr.offset * 4)) - 268500992
        const val = processor.memory[addr] + processor.memory[addr + 1] + processor.memory[addr + 2] + processor.memory[addr + 3]
        const valDec = parseInt(val, 2)
    
        processor.setRegister(instr.dest, valDec)
    }
    else if(instr.operator === 'li' || instr.operator === 'lui'){
        if(instr.operator === 'li'){
            processor.setRegister(instr.dest, parseInt(instr.val))
        }
        else{
            processor.setRegister(instr.dest, instr.val<<16)
        }
    }
    else {
        processor.setRegister(instr.dest, instr.addr)
    }
}

export default memory