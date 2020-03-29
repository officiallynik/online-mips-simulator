// IF stage with functionality
import processor from '../processor'
import parser from '../parser'

const r3Types = ['add', 'sub', 'slt'],
      r2Types = ['addi', 'slti'],
      bTypes = ['beq', 'bne'],
      wTypes = ['lw', 'li', 'la', 'lui'],
      jTypes = ['j', 'jr'],
      sTypes = ['sw']

const fetchInstruction = (pc, instructions) => {
    if(r3Types.indexOf(instructions[pc-1][0]) >= 0){
        processor.pc += 1
        return {
            operator: instructions[pc-1][0],
            dest: instructions[pc-1][1].split("$")[1],
            src1: instructions[pc-1][2].split("$")[1],
            src2: instructions[pc-1][3].split("$")[1],
            completed: false
        }
    }
    else if(r2Types.indexOf(instructions[pc-1][0]) >= 0){
        processor.pc += 1
        return {
            operator: instructions[pc-1][0],
            dest: instructions[pc-1][1].split("$")[1],
            src1: instructions[pc-1][2].split("$")[1],
            val: instructions[pc-1][3],
            completed: false
        }
    }
    else if(bTypes.indexOf(instructions[pc-1][0]) >= 0){
        processor.pc += 1
        return {
            operator: instructions[pc-1][0],
            src1: instructions[pc-1][1].split("$")[1],
            src2: instructions[pc-1][2].split("$")[1],
            label: parser.pointer.get(instructions[pc-1][3]),
            completed: false
        }
    }
    else if(wTypes.indexOf(instructions[pc-1][0]) >= 0){
        processor.pc += 1
        if(instructions[pc-1][0] === 'lw'){
            return {
                operator: instructions[pc-1][0],
                dest: instructions[pc-1][1].split("$")[1],
                src: instructions[pc-1][2].split("$")[1].split(")")[0],
                offset: parseInt(instructions[pc-1][2].split("(")[0]),
                completed: false
            }
        }
        else if(instructions[pc-1][0] === 'li' || instructions[pc-1][0] === 'lui'){
            return {
                operator: instructions[pc-1][0],
                dest: instructions[pc-1][1].split("$")[1],
                val: parseInt(instructions[pc-1][2]),
                completed: false
            }
        }
        else {
            return {
                operator: instructions[pc-1][0],
                dest: instructions[pc-1][1].split("$")[1],
                addr: parser.pointer.get(instructions[pc-1][2]),
                completed: false
            }
        }
    }
    else if(jTypes.indexOf(instructions[pc-1][0]) >= 0){
        processor.pc += 1
        if(instructions[pc-1][0] === 'j'){
            return {
                operator: instructions[pc-1][0],
                label: parser.pointer.get(instructions[pc-1][1]),
                completed: false
            }
        }
        else {
            return {
                operator: instructions[pc-1][0],
                src: instructions[pc-1][1].split("$")[1],
                completed: false
            }
        }
    }
    else if(sTypes.indexOf(instructions[pc-1][0]) >= 0){
        processor.pc += 1
        return{
            operator: instructions[pc-1][0],
            dest: instructions[pc-1][2].split("$")[1].split(")")[0],
            src: instructions[pc-1][1].split("$")[1],
            offset: parseInt(instructions[pc-1][2].split("(")[0]),
            completed: false
        }
    }
    else{
        alert("Operation not found: " + instructions[pc][0])
        processor.running = false
        return
    }
}

export default fetchInstruction