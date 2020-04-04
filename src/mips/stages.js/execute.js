// Exe stage with functionality

import processor from "../processor"

const execution = instr => {
    console.log("EX", instr)
    // if(instr.latch.length > 0){
    //     console.log(instr.latch)
    //     // alert("DF")
    //     switch (instr.operator) {
    //         case 'add':
    //             var src1 = parseInt(instr.src1)
    //             var src2 = parseInt(instr.src2)
    //             instr.latch.forEach(item => {
    //                 if(item.reg === "src1"){
    //                     src1 = parseInt(item.val)
    //                     console.log("Updated src1: " + src1)
    //                 }

    //                 if(item.reg === "src2"){
    //                     src2 = parseInt(item.val)
    //                     console.log("Updated src2: " +src2)
    //                 }
    //             })
    //             instr.result = src1 + src2
    //             break
    //         case 'addi':
    //             src1 = parseInt(instr.src1)
    //             instr.latch.forEach(item => {
    //                 if(item.reg === "src1"){
    //                     src1 = parseInt(item.val)
    //                     console.log("Updated src1: " + src1)
    //                 }
    //             })
    //             instr.result = src1 + parseInt(instr.val)            
    //             break
    //         case 'sub':
    //             src1 = parseInt(instr.src1)
    //             src2 = parseInt(instr.src2)
    //             instr.latch.forEach(item => {
    //                 if(item.reg === "src1"){
    //                     src1 = parseInt(item.val)
    //                     console.log("Updated src1: " + src1)
    //                 }

    //                 if(item.reg === "src2"){
    //                     src2 = parseInt(item.val)
    //                     console.log("Updated src2: " +src2)
    //                 }
    //             })
    //             instr.result = src1 - src2
    //             break
    //         case 'slt':
    //             src1 = parseInt(instr.src1)
    //             src2 = parseInt(instr.src2)
    //             instr.latch.forEach(item => {
    //                 if(item.reg === "src1"){
    //                     src1 = parseInt(item.val)
    //                     console.log("Updated src1: " + src1)
    //                 }

    //                 if(item.reg === "src2"){
    //                     src2 = parseInt(item.val)
    //                     console.log("Updated src2: " +src2)
    //                 }
    //             })
    //             var res = src1 < src2
    //             instr.result = res? 1 : 0
    //             break
    //         case 'slti':
    //             src1 = parseInt(instr.src1)
    //             instr.latch.forEach(item => {
    //                 if(item.reg === "src1"){
    //                     src1 = parseInt(item.val)
    //                     console.log("Updated src1: " + src1)
    //                 }
    //             })
    //             res = src1 < parseInt(instr.val) 
    //             instr.result = res? 1 : 0
    //             break
    //         default:
    //     }
    // }
    // else{
        switch (instr.operator) {
            case 'add':
                instr.src1.val = processor.getRegister(instr.src1.reg)
                instr.src2.val = processor.getRegister(instr.src2.reg)
                instr.result = parseInt(instr.src1.val) + parseInt(instr.src2.val)
                break
            case 'addi':
                instr.src1.val = processor.getRegister(instr.src1.reg)
                instr.result = parseInt(instr.src1.val) + parseInt(instr.val)            
                break
            case 'sub':
                instr.src1.val = processor.getRegister(instr.src1.reg)
                instr.src2.val = processor.getRegister(instr.src2.reg)
                instr.result = parseInt(instr.src1.val) - parseInt(instr.src2.val)
                break
            case 'slt':
                instr.src1.val = processor.getRegister(instr.src1.reg)
                instr.src2.val = processor.getRegister(instr.src2.reg)
                var res = parseInt(instr.src1.val) < parseInt(instr.src2.val)
                instr.result = res? 1 : 0
                break
            case 'slti':
                instr.src1.val = processor.getRegister(instr.src1.reg)
                res = parseInt(instr.src1.val) < parseInt(instr.val) 
                instr.result = res? 1 : 0
                break
            default:
        }
    // }

    return instr
}

export default execution