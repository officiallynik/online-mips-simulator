import processor from "./processor"
import parser from './parser'

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

        if(diff >= Math.pow(2, 31)){
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

        return processor.pc
    },
    bne: (reg1, reg2, label) => {
        const regVal1 = parseInt(processor.getRegister(reg1))
        const regVal2 = parseInt(processor.getRegister(reg2))

        if(regVal1 !== regVal2){
            processor.pc = label
        }

        return processor.pc
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
        const addr = parseInt(processor.getRegister(reg) + (offset * 4)) - 268500992
        const val = processor.memory[addr] + processor.memory[addr + 1] + processor.memory[addr + 2] + processor.memory[addr + 3]
        const valDec = parseInt(val, 2)
        console.log(addr, val, valDec)

        processor.setRegister(dest, valDec)
    },
    li: (dest, val) => {
        processor.setRegister(dest, parseInt(val))
    },
    la: (dest, label) => {
        // i think some mistake is their
        processor.setRegister(dest, label)
    },
    lui: (dest, val) => {
        processor.setRegister(dest, val<<16)
    },
    sw: (reg, offset, dest) => {
        const addr = parseInt(processor.getRegister(dest) + (offset * 4)) - 268500992
        var val = processor.getRegister(reg).toString(2)
        const len = val.length
        for(let i=0; i<32-len; i++){
            val = "0" + val
        }
        console.log(addr, val)

        processor.memory[addr] = val.slice(0, 8)
        processor.memory[addr + 1] = val.slice(8, 16)
        processor.memory[addr + 2] = val.slice(16, 24)
        processor.memory[addr + 3] = val.slice(24, 32)

        // processor.wordAddr.push(addr - 1)
    },
    j: (label) => {
        processor.pc = label

        return processor.pc
    },
    jr: (reg) => {
        processor.running = false
        processor.pc = processor.getRegister(reg)
        return processor.pc
    }
}

processor.execute = instruction => {
    console.log(instruction)
    //arthemetic operations
    if(instruction[0] === "add"){
        const reg1 = instruction[2].split("$")[1]
        const reg2 = instruction[3].split("$")[1]
        const dest = instruction[1].split("$")[1]

        return processor.operations.add(dest, reg1, reg2)
    }
    if(instruction[0] === "addi"){
        const reg = instruction[2].split("$")[1]
        const dest = instruction[1].split("$")[1]

        return processor.operations.addi(dest, reg, instruction[3])
    }
    if(instruction[0] === "sub"){
        const reg1 = instruction[2].split("$")[1]
        const reg2 = instruction[3].split("$")[1]
        const dest = instruction[1].split("$")[1]

        return processor.operations.sub(dest, reg1, reg2)
    }

    //load operations
    if(instruction[0] === "la"){
        const reg = instruction[1].split("$")[1]
        const addr = parser.pointer.get(instruction[2])

        return processor.operations.la(reg, addr)
    }
    if(instruction[0] === "lw"){
        const dest = instruction[1].split("$")[1]
        const offset = parseInt(instruction[2].split("(")[0])
        const reg = instruction[2].split("$")[1].split(")")[0]

        console.log(dest, offset, reg)

        return processor.operations.lw(dest, offset, reg)
    }
    if(instruction[0] === "li"){
        const reg = instruction[1].split("$")[1]
        const val = parseInt(instruction[2])

        return processor.operations.li(reg, val)
    }
    if(instruction[0] === "lui"){
        const reg = instruction[1].split("$")[1]
        const val = parseInt(instruction[2])

        return processor.operations.lui(reg, val)
    }

    //store operation
    if(instruction[0] === "sw"){
        const reg = instruction[1].split("$")[1]
        const offset = parseInt(instruction[2].split("(")[0])
        const dest = instruction[2].split("$")[1].split(")")[0]
        // console.log(dest);
        // alert(dest);
        return processor.operations.sw(reg, offset, dest)
    }
    
    //branch instructions
    if(instruction[0] === "beq"){
        const reg1 = instruction[1].split("$")[1]
        const reg2 = instruction[2].split("$")[1]
        const label = parser.pointer.get(instruction[3])

        return processor.operations.beq(reg1, reg2, label)
    }
    if(instruction[0] === "bne"){
        const reg1 = instruction[1].split("$")[1]
        const reg2 = instruction[2].split("$")[1]
        const label = parser.pointer.get(instruction[3])

        return processor.operations.bne(reg1, reg2, label)
    }

    //compare operations
    if(instruction[0] === "slt"){
        const dest = instruction[1].split("$")[1]
        const reg1 = instruction[2].split("$")[1]
        const reg2 = instruction[3].split("$")[1]

        return processor.operations.slt(dest, reg1, reg2)
    }
    if(instruction[0] === "slti"){
        const dest = instruction[1].split("$")[1]
        const reg = instruction[2].split("$")[1]
        const val = parseInt(instruction[3])
        
        return processor.operations.slti(dest, reg, val)
    }

    //jump instructions
    if(instruction[0] === "j"){
        const label = parser.pointer.get(instruction[1])

        return processor.operations.j(label)
    }
    if(instruction[0] === "jr"){
        const reg = instruction[1].split("$")[1]

        return processor.operations.jr(reg)
    }
}

export default processor