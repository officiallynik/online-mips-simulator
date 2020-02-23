import processor from "./processor"

processor.operations = {
    add: (dest, reg1, reg2) => {
        const regVal1 = parseInt(processor.getRegister(reg1))
        const regVal2 = parseInt(processor.getRegister(reg2))

        var sum = regVal1 + regVal2

        if(sum >= Math.pow(2, 31)){
            console.log("Arthemetic Error")
            return
        }
        processor.setRegister(dest, sum)
    },
    addi: (dest, reg1, val) => {
        const regVal1 = parseInt(processor.getRegister(reg1))
        const regVal2 = parseInt(val)

        var sum = regVal1 + regVal2

        if(sum >= Math.pow(2, 31)){
            console.log("Arthemetic Error")
            return
        }
        processor.setRegister(dest, sum)
    },
    sub: (dest, reg1, reg2) => {
        const regVal1 = parseInt(processor.getRegister(reg1))
        const regVal2 = parseInt(processor.getRegister(reg2))

        var diff = regVal1 - regVal2

        if(sum >= Math.pow(2, 31)){
            console.log("Arthemetic Error")
            return
        }
        processor.setRegister(dest, diff)
    },
    beq: (reg1, reg2, label) => {
        const regVal1 = parseInt(processor.getRegister(reg1))
        const regVal2 = parseInt(processor.getRegister(reg2))

        if(regVal1 === regVal2){
            processor.pc = label
        }
    },
    bne: (reg1, reg2, label) => {
        const regVal1 = parseInt(processor.getRegister(reg1))
        const regVal2 = parseInt(processor.getRegister(reg2))

        if(regVal1 !== regVal2){
            processor.pc = label
        }
    },
    slt: (dest, reg1, reg2) => {
        const regVal1 = parseInt(processor.getRegister(reg1))
        const regVal2 = parseInt(processor.getRegister(reg2))
        if(regVal1<regVal2){
            processor.setRegister(dest, 1)
        }
        else{
            processor.setRegister(dest, 0)
        }
    },
    slti: (dest, reg1, val) => {
        const regVal1 = parseInt(processor.getRegister(reg1))
        const regVal2 = parseInt(val)
        if(regVal1<regVal2){
            processor.setRegister(dest, 1)
        }
        else{
            processor.setRegister(dest, 0)
        }
    },
    lw: (dest, offset, reg) => {
        const addr = parseInt(processor.getRegister(reg)) + (offset * 4)
        const val = processor.memory.get(1024*4 - addr)
        processor.setRegister(dest, val)
    },
    li: (dest, val) => {
        processor.setRegister(dest, parseInt(val))
    },
    la: (dest, label) => {
        processor.setRegister(dest, label)
    },
    lui: (dest, val) => {
        processor.setRegister(dest, val<<16)
    },
    sw: (reg, offset, dest) => {
        const addr = parseInt(processor.getRegister(dest)) + (offset * 4)
        const val = processor.getRegister(reg)
        processor.memory[addr] = val
    },
    j: (label) => {
        processor.pc = label
    },
    jr: (reg) => {
        processor.running = false
        processor.pc = processor.getRegister(reg)
    }
}

export default processor