// WB stage with functionality
import processor from '../processor'

const writeBack = instr => {
    // console.log("WB", instr)
    if(instr["result"] !== undefined && instr["dest"] !== undefined){ 
        // console.log(instr.dest, instr.result)
        processor.setRegister(instr.dest, instr.result)
    }
    if(instr.operator === 'sw'){
        instr.src1.val = processor.getRegister(instr.src1.reg)
        const addr = (parseInt(processor.getRegister(instr.dest) - 268500992)/4) + parseInt(instr.offset/4)
        var val = instr.src1.val.toString(2)
        const len = val.length
        for(let i=0; i<32-len; i++){
            val = "0" + val
        }
        
        processor.memory[addr] = val
    }
    if(instr.operator === "jr"){
        processor.running = false
    }
    instr.completed = true

    return instr
}

export default writeBack