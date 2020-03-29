import './App.css';
import React, { Component } from 'react';

import IDE from './container/IDE/ide';
import Navbar from './component/navbar/Navbar';
import Console from './component/console/Console'
import SideBar from './component/sidebar/SideBar'

import parser from './mips/parser'
import processor from './mips/operations'

import { bubbleSort, sumOfNum } from './samplePrograms'

class App extends Component{

  state = {
    instructions: null,
    registers: processor.registers,
    pc: 0,
    print: "//console...read-only\n",
    clicked: "registers",
    sampleProgramTriggered: false
  }

  // --- logic to upload and clear file ---
  setFile = async (event) => {
    let file = event.target.files[0];
    //creating a reader object
    var reader = new FileReader();
    //reading file
    reader.onload = function() {
        // console.log(reader.result);
         localStorage.setItem('result', String(reader.result));
         window.location.reload();
        //  x.showUploadAlert();
        //  setTimeout(this.showUploadAlert,5000);
    }
    
    reader.readAsText(file);
  }

  deleteFile=(event)=>{
    localStorage.removeItem("result");
    window.location.reload()
    // this.showCleanAlert();
  }

  // --- assemble the code from file ---
  assemble = () => {
    processor.reset()
    parser.reset()

    var textArea = localStorage.getItem("result")
    // console.log(textArea)
    if(textArea === null || textArea.length === 0){
      alert("Upload or write assembly code first!")
      return
    }
    this.setState({
      instructions: parser.parse(textArea)
    })

    if(!!parser.pointer.get("main")){
      processor.pc = parseInt(parser.pointer.get("main"))
    }
    else{
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

  execute = () => {
    if(!this.state.instructions){
      alert("Assemble your code first!")
      return
    }

    const run = window.setInterval(() => {
      if(!processor.running){
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

    if(!this.state.instructions){
      alert("Assemble your code first!")
      return
    }
    
    
    if(!processor.running){
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
      instructions:this.state.instructions
    })
    processor.pc += 1
    
    if(this.state.instructions[processor.pc][0] === "syscall"){
      const regV0 = processor.getRegister("v0")
      // console.log("SYSCALLING", regV0)

      //printing logic
      if(regV0 === 1){
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

  onSampleProgramClick = program =>{
    if(program === "bubbleSort"){
      localStorage.setItem('result', bubbleSort);
    }
    else{
      localStorage.setItem('result', sumOfNum)
    }
    window.location.reload();
  }

  render=()=>{
    return(
      <div className="main-screen">
        <div>
          <Navbar 
            setFile = {this.setFile} 
            deleteFile = {this.deleteFile} 
            assemble = {this.assemble} 
            execute = {this.execute}
            stepRun = {this.stepRun}
          />
        </div>
        <div className="App">
          <div style={{width: '17%'}}>
            <SideBar 
              registers = {this.state.registers}
              pc = {this.state.pc}
              clicked = {this.state.clicked}
              onNavClick = {this.onSideNavClick}
              dataSegment = {processor.memory}
              memoryUsed = {parser.memPtr}
              sampleProgram = {this.onSampleProgramClick}
            />
          </div>
          <div style={{width: '83%'}}>
            <IDE
              pc = {this.state.pc}
            />
            <div style={{height: '1px', backgroundColor: 'white'}}></div>
            <Console
              console = {this.state.print}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;