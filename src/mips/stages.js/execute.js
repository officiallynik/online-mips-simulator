// Exe stage with functionality

const execution = instr => {
    console.log("EX", instr)
    switch (instr.operator) {
        case 'add':
            instr.result = parseInt(instr.src1) + parseInt(instr.src2)
            break
        case 'addi':
            instr.result = parseInt(instr.src1) + parseInt(instr.val)            
            break
        case 'sub':
            instr.result = parseInt(instr.src1) - parseInt(instr.src2)
            break
        case 'slt':
            var res = parseInt(instr.src1) < parseInt(instr.src2)
            instr.result = res? 1 : 0
            break
        case 'slti':
            res = parseInt(instr.src1) < parseInt(instr.val) 
            instr.result = res? 1 : 0
            break
        default:
    }

    return instr
}

export default execution