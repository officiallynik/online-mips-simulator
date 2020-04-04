// ID/RF stage with functionality
// fetch values of registers, branch taken or not

import processor from '../processor'

const r3Types = ['add', 'sub', 'slt'],
      r2Types = ['addi', 'slti'],
      bTypes = ['beq', 'bne'],
      wTypes = ['lw', 'li', 'la', 'lui'],
      jTypes = ['j', 'jr'],
      sTypes = ['sw']

const decodeInstruction = instr => {
    console.log("ID/RF", instr)
    if(r3Types.indexOf(instr.operator) >= 0){
        instr.src1 = {
            val: parseInt(processor.getRegister(instr.src1)),
            reg: instr.src1
        }
        instr.src2 = {
            val: parseInt(processor.getRegister(instr.src2)),
            reg: instr.src2
        }
        return instr
    } 
    else if(r2Types.indexOf(instr.operator) >= 0){
        instr.src1 = {
            val: parseInt(processor.getRegister(instr.src1)),
            reg: instr.src1
        }
        return instr
    }
    else if(bTypes.indexOf(instr.operator) >= 0){
        instr.src1 = {
            val: parseInt(processor.getRegister(instr.src1)),
            reg: instr.src1
        }
        instr.src2 = {
            val: parseInt(processor.getRegister(instr.src2)),
            reg: instr.src2
        }

        if(instr.operator === 'beq' && instr.src1.val === instr.src2.val){
            processor.pc = instr.label
        }
        else if(instr.operator === 'bne' && instr.src1.val !== instr.src2.val){
            processor.pc = instr.label
        }

        return instr
    }
    else if(wTypes.indexOf(instr.operator) >= 0){
        if(instr.operator === 'lw') instr.src1 = {val: parseInt(processor.getRegister(instr.src1)), reg: instr.src1}    
        return instr
    }
    else if(jTypes.indexOf(instr.operator) >= 0){
        if(instr.operator === 'jr'){
            instr.src1 = {val: parseInt(processor.getRegister(instr.src1)), reg: instr.src1}
            processor.pc = instr.src1.val
        }
        else{
            processor.pc = instr.label
        }
        return instr
    }
    else if (sTypes.indexOf(instr.operator) >= 0){
        instr.src1 = {val: parseInt(processor.getRegister(instr.src1)), reg: instr.src1}

        return instr
    }
    else if(instr.operator === "syscall"){
        instr.src1 = {val: parseInt(processor.getRegister(instr.src1)), reg: instr.src1}

        return instr
    }  
}

export default decodeInstruction