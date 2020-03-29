// Exe stage with functionality

const execution = instr => {
    switch (instr.operator) {
        case 'add':
            instr.result = instr.src1 + instr.src2
            break
        case 'addi':
            instr.result = instr.src1 + instr.val
            break
        case 'sub':
            instr.result = instr.src1 - instr.src2
            break
        case 'slt':
            var res = instr.src1 < instr.src2
            instr.result = res? 1 : 0
            break
        case 'slti':
            res = instr.src1 < instr.val
            instr.result = res? 1 : 0
            break
        default:
    }

    return instr
}

export default execution