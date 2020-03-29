// WB stage with functionality
import processor from '../processor'

const writeBack = instr => {
    if(instr.result){
        processor.setRegister(instr.dest, instr.result)
    }
    if(instr.operator === 'sw'){
        const addr = parseInt(processor.getRegister(instr.dest) + (instr.offset * 4)) - 268500992
        var val = instr.src.toString(2)
        const len = val.length
        for(let i=0; i<32-len; i++){
            val = "0" + val
        }
        
        processor.memory[addr] = val.slice(0, 8)
        processor.memory[addr + 1] = val.slice(8, 16)
        processor.memory[addr + 2] = val.slice(16, 24)
        processor.memory[addr + 3] = val.slice(24, 32)
    }
    instr.completed = true

    return instr
}

export default writeBack