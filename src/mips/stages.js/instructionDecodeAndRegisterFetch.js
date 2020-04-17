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
    // console.log("ID/RF", instr)
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
        var src1 = instr.src1.val
        var src2 = instr.src2.val

        if(instr.dep1 !== undefined && instr.dep1 !== ""){
            src1 = instr.dep1
            instr.dep1 = ""
        }

        if(instr.dep2 !== undefined && instr.dep2 !== ""){
            src2 = instr.dep2
            instr.dep2 = ""
        }

        // console.log("SRC1: " + src1 +"SRC2: " + src2)

        if(instr.operator === 'beq' && src1 === src2){
            processor.pc = instr.label
        }
        else if(instr.operator === 'bne' && src1 !== src2){
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
            src1 = instr.src1.val
            if(instr.dep1 !== undefined && instr.dep1 !== ""){
                src1 = instr.dep1
                instr.dep1 = ""
            }
            processor.pc = src1
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