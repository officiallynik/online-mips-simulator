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
            case 'lw':
                src1 = instr.src1.val

                if (instr.dep1 !== undefined && instr.dep1 !== "") {
                    src1 = instr.dep1
                    instr.dep1 = ""
                }
                // console.log(instr)
                const addr = (src1 - 268500992)/4 + parseInt(instr.offset/4)
                const val =  processor.memory[addr]
                const valDec = parseInt(val, 2)

                // console.log(valDec, addr, val)
                instr.result = valDec
                break
            case 'li':
                instr.result = instr.val
                break
            case 'lui':
                instr.result = instr.val << 16
                break
            case 'la':
                instr.result = instr.addr
                break

            default: break;
        }
    return instr
}

export default execution