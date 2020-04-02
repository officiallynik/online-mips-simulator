import './App.css';
import React, { Component } from 'react';

import IDE from './container/IDE/ide';
import Navbar from './component/navbar/Navbar';
import Console from './component/console/Console'
import SideBar from './component/sidebar/SideBar'

import { bubbleSort, sumOfNum } from './samplePrograms'

// importing from mips
import processor from './mips/processor'
import parser from './mips/parser'
import instrFetch from './mips/stages.js/instructionFetch'
import instrDecodeRegFetch from './mips/stages.js/instructionDecodeAndRegisterFetch'
import execute from './mips/stages.js/execute'
import memory from './mips/stages.js/memory'
import writeBack from './mips/stages.js/writeBack'

var currentOperations = []
var current_cycle = 0
var nerdyInfo = []
var stalls = 0

class App extends Component {

  state = {
    instructions: null,
    registers: processor.registers,
    pc: 0,
    print: "//console...read-only\n",
    clicked: "registers",
    sampleProgramTriggered: false,
    dataForwarding: false,
    running: 0
  }

  // --- logic to upload and clear file ---
  setFile = async (event) => {
    let file = event.target.files[0];
    //creating a reader object
    var reader = new FileReader();
    //reading file
    reader.onload = function () {
      // console.log(reader.result);
      localStorage.setItem('result', String(reader.result));
      window.location.reload();
      //  x.showUploadAlert();
      //  setTimeout(this.showUploadAlert,5000);
    }

    reader.readAsText(file);
  }

  deleteFile = (event) => {
    localStorage.removeItem("result");
    window.location.reload()
    // this.showCleanAlert();
  }

  // --- assemble the code from file ---
  assemble = () => {
    processor.reset()
    parser.reset()

    this.setState({
      running: 0
    })

    currentOperations = []
    current_cycle = 0
    nerdyInfo = []
    stalls = 0

    var textArea = localStorage.getItem("result")
    // console.log(textArea)
    if (textArea === null || textArea.length === 0) {
      alert("Upload or write assembly code first!")
      return
    }
    this.setState({
      instructions: parser.parse(textArea)
    })

    if (!!parser.pointer.get("main")) {
      processor.pc = parseInt(parser.pointer.get("main"))
    }
    else {
      processor.running = false
    }
    // console.log("Assembled")
    // console.log(parser.pointer)
    // console.log(processor.pc)
    // console.log(processor.memory)
    this.setState({
      print: this.state.print + "Successfully Assembled...\n"
    })
  }

  // use stepRunV2 to execute in one step
  executeV2 = () => {
    if (!this.state.instructions) {
      alert("Assemble your code first!")
      return
    }
    this.setState({
      running: 1
    })

    const run = window.setInterval(() => {
      if (!processor.running) {
        // console.log("END OF INSTRUCTIONS")
        this.setState({
          print: this.state.print + "\nEnd of Instructions...",
          running: 2
        })
        window.clearInterval(run)
        console.log("No. of cycles: " + current_cycle)
        console.log(nerdyInfo)
        console.log("No. of stalls: " + stalls)
        var cpi = 1 + (stalls/current_cycle)
        console.log("IPC: " + (1/cpi))
        return
      }
      this.stepRunV2()

    }, 0)
  }

  // new step-run function
  stepRunV2 = () => {
    if(processor.pc >= this.state.instructions.length){
      processor.endOfInstr = true
      if(currentOperations[currentOperations.length - 1].completed){
        processor.running = false
      }
    }
    if (!processor.running) {
      console.clear()
      console.log("DONE :)")
      console.log(currentOperations)
      console.log(nerdyInfo)
      return
    }

    console.clear()
    console.log("Cycle: " + current_cycle)
    console.log(currentOperations)
    var stall = 0
    var idx = 0

    while (idx < currentOperations.length) {
      if (currentOperations[idx].issue_cycle == null) break;

      if (stall !== 1) {
        switch (currentOperations[idx].stage) {
          case "ID/RF":
            for (let i = idx - 1; i >= 0; i--) {
              if (
                currentOperations[i].dest
                &&
                (currentOperations[i].dest === currentOperations[idx].src1
                  ||
                  currentOperations[i].dest === currentOperations[idx].src2
                  ||
                  currentOperations[i].dest === currentOperations[idx].src)
              ) {
                console.log("----MAYBE A STALL :( ----")
                if (this.state.dataForwarding) {
                  // logic
                  
                }
                else{
                  console.log("IN ELSE: ", currentOperations[i])
                  // logic
                  if(currentOperations[i].stage !== " "){
                    console.log("STALL :( ")
                    stall = 1
                    stalls += 1
                    break
                  }
                }
              }
            }

            if (stall !== 1) {
              currentOperations[idx] = instrDecodeRegFetch(currentOperations[idx])
              currentOperations[idx].stage = "EX"
              nerdyInfo[idx].push("ID/RF")
            }
            break;
          case "EX":
            if(currentOperations[idx].operator === 'syscall'){
              this.printToConsole(processor.getRegister("v0"), processor.getRegister("a0")) // need to correct this
            }
            currentOperations[idx] = execute(currentOperations[idx])
            currentOperations[idx].stage = "MEM"
            nerdyInfo[idx].push("EX")
            break;
          case "MEM":
            memory(currentOperations[idx])
            currentOperations[idx].stage = "WB"
            nerdyInfo[idx].push("MEM")
            break;
          case "WB":
            currentOperations[idx] = writeBack(currentOperations[idx])
            currentOperations[idx].stage = " "
            nerdyInfo[idx].push("WB")
            break;
          default: break
        }
        if (stall === 1) {
          nerdyInfo[idx].push("S")
        }
      }
      else {
        nerdyInfo[idx].push("S")
      }
      idx += 1
    }

    if (!processor.endOfInstr && stall !== 1) {
      if (currentOperations.length > 0 && (currentOperations[currentOperations.length - 1].operator === "bne" || currentOperations[currentOperations.length - 1].operator === "beq") && currentOperations[currentOperations.length - 1].stage === "ID/RF") {
        console.log("STALL :( ")
        stalls += 1
      }
      var fetchedInstr = instrFetch(processor.pc, this.state.instructions)
      if (fetchedInstr) {
        fetchedInstr.issue_cycle = current_cycle
        fetchedInstr.stage = "ID/RF"
        currentOperations.push(fetchedInstr)
        nerdyInfo.push(["IF"])
      }
    }

    current_cycle += 1
    this.setState({
      registers: processor.registers
    })
  }

  execute = () => {
    if (!this.state.instructions) {
      alert("Assemble your code first!")
      return
    }

    const run = window.setInterval(() => {
      if (!processor.running) {
        // console.log("END OF INSTRUCTIONS")
        this.setState({
          print: this.state.print + "\nEnd of Instructions..."
        })
        window.clearInterval(run)
        return
      }
      this.stepRun()

    }, 0)
  }

  stepRun = () => {
    console.clear()
    // console.log("PC = " + processor.pc)

    if (!this.state.instructions) {
      alert("Assemble your code first!")
      return
    }


    if (!processor.running) {
      // console.log("END OF INSTRUCTIONS")
      this.setState({
        print: this.state.print + "\nEnd of Instructions..."
      })
      return
    }


    processor.execute(this.state.instructions[processor.pc])

    this.setState({
      ...this.state,
      registers: processor.registers,
      pc: processor.pc
    })

    // console.log(processor.registers)
    // console.log(processor.memory)
    this.setState({
      instructions: this.state.instructions
    })
    processor.pc += 1

    if (this.state.instructions[processor.pc][0] === "syscall") {
      const regV0 = processor.getRegister("v0")
      // console.log("SYSCALLING", regV0)

      //printing logic
      if (regV0 === 1) {
        const regA0 = processor.getRegister("a0")
        // console.log("getting a0", regA0)

        const printNew = this.state.print + regA0 + " "

        this.setState({
          print: printNew
        })
      }
    }
    // console.log("parser is");
    // console.log(parser);
    // console.log("processor is");
    // console.log(processor);
  }


  // --- other dom logic ---
  onSideNavClick = (event) => {
    this.setState({
      clicked: event
    })
  }

  onSampleProgramClick = program => {
    if (program === "bubbleSort") {
      localStorage.setItem('result', bubbleSort);
    }
    else {
      localStorage.setItem('result', sumOfNum)
    }
    window.location.reload();
  }

  onDataForwardEnable = () => {
    const df = this.state.dataForwarding
    this.setState({
      dataForwarding: !df
    })
  }

  printToConsole = (regV0, regA0) => {
    //printing logic
    if (regV0 === 1) {
      // console.log("getting a0", regA0)
      const printNew = this.state.print + regA0 + " "
      this.setState({
        print: printNew
      })
    }
  }

  render = () => {
    return (
      <div className="main-screen">
        <div>
          <Navbar
            setFile={this.setFile}
            deleteFile={this.deleteFile}
            assemble={this.assemble}
            execute={this.executeV2}
            stepRun={this.stepRunV2}
            toggleDF={this.onDataForwardEnable}
            dataForw={this.state.dataForwarding}
            running={this.state.running}
          />
        </div>
        <div className="App">
          <div style={{ width: '17%' }}>
            <SideBar
              registers={this.state.registers}
              pc={this.state.pc}
              clicked={this.state.clicked}
              onNavClick={this.onSideNavClick}
              dataSegment={processor.memory}
              memoryUsed={parser.memPtr}
              sampleProgram={this.onSampleProgramClick}
            />
          </div>
          <div style={{ width: '83%' }}>
            <IDE
              pc={this.state.pc}
            />
            <div style={{ height: '1px', backgroundColor: 'white' }}></div>
            <Console
              console={this.state.print}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;