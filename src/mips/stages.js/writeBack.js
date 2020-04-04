// WB stage with functionality
import processor from '../processor'

const writeBack = instr => {
    console.log("WB", instr)
    if(instr["result"] !== undefined && instr["dest"] !== undefined){ 
        console.log(instr.dest, instr.result)
        processor.setRegister(instr.dest, instr.result)
    }
    if(instr.operator === 'sw'){
        instr.src1.val = processor.getRegister(instr.src1.reg)
        const addr = parseInt(processor.getRegister(instr.dest) + (instr.offset * 4)) - 268500992
        var val = instr.src1.val.toString(2)
        const len = val.length
        for(let i=0; i<32-len; i++){
            val = "0" + val
        }
        
        processor.memory[addr] = val.slice(0, 8)
        processor.memory[addr + 1] = val.slice(8, 16)
        processor.memory[addr + 2] = val.slice(16, 24)
        processor.memory[addr + 3] = val.slice(24, 32)
    }
    if(instr.operator === "jr"){
        processor.running = false
    }
    instr.completed = true

    return instr
}

export default writeBack