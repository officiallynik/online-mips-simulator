// Exe stage with functionality

import processor from "../processor"

const execution = instr => {
    // console.log("EX", instr)
        // alert("DF")
        switch (instr.operator) {
            case 'add':
                instr.src1.val = processor.getRegister(instr.src1.reg)
                instr.src2.val = processor.getRegister(instr.src2.reg)
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
                instr.result = parseInt(src1) + parseInt(src2)
                break
            case 'addi':
                instr.src1.val = processor.getRegister(instr.src1.reg)
                src1 = instr.src1.val

                if(instr.dep1 !== undefined && instr.dep1 !== ""){
                    src1 = instr.dep1
                    instr.dep1 = ""
                }
                instr.result = parseInt(src1) + parseInt(instr.val)            
                break
            case 'sub':
                instr.src1.val = processor.getRegister(instr.src1.reg)
                instr.src2.val = processor.getRegister(instr.src2.reg)
                src1 = instr.src1.val
                src2 = instr.src2.val

                if(instr.dep1 !== undefined && instr.dep1 !== ""){
                    src1 = instr.dep1
                    instr.dep1 = ""
                }

                if(instr.dep2 !== undefined && instr.dep2 !== ""){
                    src2 = instr.dep2
                    instr.dep2 = ""
                }
                instr.result = parseInt(src1) - parseInt(src2)
                break
            case 'slt':
                instr.src1.val = processor.getRegister(instr.src1.reg)
                instr.src2.val = processor.getRegister(instr.src2.reg)
                src1 = instr.src1.val
                src2 = instr.src2.val

                if(instr.dep1 !== undefined && instr.dep1 !== ""){
                    src1 = instr.dep1
                    instr.dep1 = ""
                }

                if(instr.dep2 !== undefined && instr.dep2 !== ""){
                    src2 = instr.dep2
                    instr.dep2 = ""
                }
                var res = parseInt(src1) < parseInt(src2)
                instr.result = res? 1 : 0
                break
            case 'slti':
                instr.src1.val = processor.getRegister(instr.src1.reg)
                src1 = instr.src1.val

                if(instr.dep1 !== undefined && instr.dep1 !== ""){
                    src1 = instr.dep1
                    instr.dep1 = ""
                }
                res = parseInt(src1) < parseInt(instr.val) 
                instr.result = res? 1 : 0
                break
            case 'li' || 'lw' || 'la' || 'lui':
                if(instr.operator === 'li'){
                    instr.result = instr.val
                }
                else if(instr.operator === 'lui'){
                    instr.result = instr.val << 16
                }
                else if(instr.operator === 'la'){
                    instr.result = instr.addr
                }
                else{
                    src1 = instr.src1.val

                    if (instr.dep1 !== undefined && instr.dep1 !== "") {
                        src1 = instr.dep1
                        instr.dep1 = ""
                    }

                    const addr = parseInt((src1) + (instr.offset * 4)) - 268500992
                    const val = processor.memory[addr] + processor.memory[addr + 1] + processor.memory[addr + 2] + processor.memory[addr + 3]
                    const valDec = parseInt(val, 2)

                    instr.result = valDec
                    
                }
                break
            default: break;
        }
    return instr
}

export default execution