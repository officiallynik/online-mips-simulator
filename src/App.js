import './App.css';
import React, { Component } from 'react';

import IDE from './container/IDE/ide';
import Navbar from './component/navbar/Navbar';
import Console from './component/console/Console'
import SideBar from './component/sidebar/SideBar'

import { bubbleSort, sumOfNum, tryOutPipeline } from './samplePrograms'

// importing from mips
import processor from './mips/processor'
import parser from './mips/parser'
import instrFetch from './mips/stages.js/instructionFetch'
import instrDecodeRegFetch from './mips/stages.js/instructionDecodeAndRegisterFetch'
import execute from './mips/stages.js/execute'
import memory from './mips/stages.js/memory'
import writeBack from './mips/stages.js/writeBack'

// some necessary elements
var currentOperations = []
var current_cycle = 1
var nerdyInfo = []

class App extends Component {

	state = {
		code: "",
		instructions: null,
		registers: processor.registers,
		pc: 0,
		print: "//console...read-only\n",
		clicked: "registers",
		sampleProgramTriggered: false,
		dataForwarding: false,
		running: 0,
		performance: {},
		pipeline: [],
		enableMoreStats: false
	}

	// --- logic to upload and clear file ---
	setFile = async (event) => {
		let file = event.target.files[0];
		//creating a reader object
		var reader = new FileReader();

		//reading file
		reader.onload = () => {
			// console.log(reader.result);
			this.setState({
				code: String(reader.result)
			})
		}

		reader.readAsText(file);
	}

	deleteFile = (event) => {
		// localStorage.removeItem("result");
		// window.location.reload()
		this.setState({
			code: ""
		})
	}

	// --- assemble the code from file ---
	assemble = () => {
		processor.reset()
		parser.reset()

		this.setState({
			running: 0
		})

		currentOperations = []
		current_cycle = 1
		nerdyInfo = []

		var table = document.getElementsByClassName("pipeline-screen")
		table[1].innerHTML = (
			`<table border='1' id="table-main">
				<tr id="cycle-number">
					<td align='center' nowrap="nowrap" class="instr-cell" id="instr-cell-heading">Cycle/Instruction</td>
				</tr>
			</table>`
		)


		// var textArea = localStorage.getItem("result")
		var textArea = this.state.code
		// console.log(textArea)
		if (textArea === "") {
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
		this.setState({
			print: this.state.print + "Successfully Assembled...\n"
		})
	}

	// --- execute in single step using repeated step-run
	Execute = () => {
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
					running: 2,
					performance: {
						cycles: current_cycle - 1,
					}
				})
				window.clearInterval(run)
				console.log("No. of cycles: " + parseInt(current_cycle - 1))
				console.log(nerdyInfo)
				// console.log("No. of stalls: " + stalls)
				// var cpi = 1 + (stalls / current_cycle)
				// console.log("IPC: " + (1 / cpi))
				return
			}
			this.StepRun()

		}, 0)
	}


	// --- step-run function implementing pipeline
	Display_Stall = (row, col) => {
		if (this.state.enableMoreStats) {
			var cell = document.getElementsByClassName(`row${row}-col${col}`)
			cell[0].innerHTML = 'S'
		}
		nerdyInfo[row].push("S")
	}
	StepRun = () => {
		if (!this.state.instructions) {
			alert("Assemble your code first!")
			return
		}
		// Do not do anything if we have already gone through all of the cycles.
		if (processor.pc >= this.state.instructions.length) {
			processor.endOfInstr = true
			if (currentOperations[currentOperations.length - 1].completed) {
				processor.running = false
			}
		}
		if (!processor.running) {
			this.setState({
				performance: {
					cycles: current_cycle - 1,
				}
			})
			console.clear()
			console.log("DONE :)")
			console.log(currentOperations)
			console.log(nerdyInfo)
			return
		}

		console.clear()
		console.log("Cycle: " + current_cycle)
		console.log(currentOperations)

		var stall = 0;
		var x = 0;
		var s = ""

		while (x < currentOperations.length) {
			// console.log("INTRC: " + x)
			// console.log(currentOperations[x])
			// If the stall variable is set, then we should stall and not do any work.
			if (stall === 1) {
				this.Display_Stall(x, current_cycle);
			}
			else {
				// Find what stage the current instruciton is in and do work accordingly.
				switch (currentOperations[x].pipeline_stage) {


					case "IF":
						// Set the new stage to ID
						for (let i = (x - 1); i >= 0; i--) {
							// console.log("I: " + i)
							// If the destination register of a previous instruciton is the same and one of the source 
							// registers of the current instruction.
							if (!currentOperations[i].completed && currentOperations[i].dest !== undefined && currentOperations[x].src1 !== undefined) {
								// We must check if data forwarding is enabled and handle that situation differently.
								if (currentOperations[i].dest === currentOperations[x].src1 && (currentOperations[x].operator === "beq" || currentOperations[x].operator === "bne")) {
									console.log("HERE")
									if (this.state.dataForwarding) {
										console.log("FORWARDING DATA 1")
										console.log("Result: " + currentOperations[i].result)
										currentOperations[x].dep1 = currentOperations[i].result
										// If forwarding is enabled and the previous instruction is not a store or load
										// and is not in the MEM stage or further in the pipeline, stall.
										if (currentOperations[i].pipeline_stage !== "MEM" && currentOperations[i].pipeline_stage !== "WB" && currentOperations[i].pipeline_stage !== " ") {
											// *** RAW Hazard **
											stall = 1;
											break;
										}
									}

									else {
										// If forwarding is disabled and the previous instruction is not completed, stall.
										if (currentOperations[i].pipeline_stage !== " ") {
											// *** RAW Hazard **
											stall = 1;
											break;
										}
									}
								}
							}
							else if (!currentOperations[i].completed && currentOperations[i].dest !== undefined && currentOperations[x].src2 !== undefined) {
								// We must check if data forwarding is enabled and handle that situation differently.
								if (currentOperations[i].dest === currentOperations[x].src2 && (currentOperations[x].operator === "beq" || currentOperations[x].operator === "bne")) {
									if (this.state.dataForwarding) {
										console.log("FORWARDING DATA 2")
										console.log("Result: " + currentOperations[i].result)
										currentOperations[x].dep2 = currentOperations[i].result
										// If forwarding is enabled and the previous instruction is not a store or load
										// and is not in the MEM stage or further in the pipeline, stall.
										if (currentOperations[i].pipeline_stage !== "MEM" && currentOperations[i].pipeline_stage !== "WB" && currentOperations[i].pipeline_stage !== " ") {
											// *** RAW Hazard **
											stall = 1;
											break;
										}
									}

									else {
										// If forwarding is disabled and the previous instruction is not completed, stall.
										if (currentOperations[i].pipeline_stage !== " ") {
											// *** RAW Hazard **
											stall = 1;
											break;
										}
									}
								}
							}
						}

						// If no stalls have been detected.
						if (stall !== 1) {
							// Move the instruction into the EX stage.
							currentOperations[x] = instrDecodeRegFetch(currentOperations[x])
							currentOperations[x].pipeline_stage = "ID/RF"
						}
						break;

					case "ID/RF":
						// console.log("X: " + x)
						// Check if this instruction can be executed by comparing it against all previous instructions.
						for (let i = (x - 1); i >= 0; i--) {
							// console.log("I: " + i)

							// If a previous instruction is in the EX stage and both instructions use the same functional unit.
							if (currentOperations[i].pipeline_stage === "EX" && currentOperations[i].operator === currentOperations[x].operator) {
								// *** Structural Hazard ***
								stall = 1;
								break;
							}

							// If the destination register of a previous instruciton is the same and one of the source 
							// registers of the current instruction.
							else if (!currentOperations[i].completed && currentOperations[i].dest !== undefined && currentOperations[x].src1 !== undefined) {
								// We must check if data forwarding is enabled and handle that situation differently.
								if (currentOperations[i].dest === currentOperations[x].src1.reg) {
									if (this.state.dataForwarding) {
										currentOperations[x].dep1 = currentOperations[i].result
										// If forwarding is enabled and the previous instruction is not a store or load
										// and is not in the MEM stage or further in the pipeline, stall.
										if (currentOperations[i].pipeline_stage !== "MEM" && currentOperations[i].pipeline_stage !== "WB" && currentOperations[i].pipeline_stage !== " ") {
											// *** RAW Hazard **
											stall = 1;
											break;
										}
									}

									else {
										// If forwarding is disabled and the previous instruction is not completed, stall.
										if (currentOperations[i].pipeline_stage !== " ") {
											// *** RAW Hazard **
											stall = 1;
											break;
										}
									}
								}
							}
							else if (!currentOperations[i].completed && currentOperations[i].dest !== undefined && currentOperations[x].src2 !== undefined) {
								// We must check if data forwarding is enabled and handle that situation differently.
								if (currentOperations[i].dest === currentOperations[x].src2.reg) {
									if (this.state.dataForwarding) {
										currentOperations[x].dep2 = currentOperations[i].result
										// If forwarding is enabled and the previous instruction is not a store or load
										// and is not in the MEM stage or further in the pipeline, stall.
										if (currentOperations[i].pipeline_stage !== "MEM" && currentOperations[i].pipeline_stage !== "WB" && currentOperations[i].pipeline_stage !== " ") {
											// *** RAW Hazard **
											stall = 1;
											break;
										}
									}

									else {
										// If forwarding is disabled and the previous instruction is not completed, stall.
										if (currentOperations[i].pipeline_stage !== " ") {
											// *** RAW Hazard **
											stall = 1;
											break;
										}
									}
								}
							}

							// If the destination registers are the same for both instructions and the destination registers
							// are not equal to "null."  The destination register will only equal "null" for BR and SD 
							// instructions.
							else if (!currentOperations[i].completed && currentOperations[i].dest && (currentOperations[i].dest === currentOperations[x].dest)) {

								// If a previous instruction is in the EX stage and the remaining cycles for that
								// previous instruction is greater than or equal to the current instruction's 
								// execution cycles minus one.  (The minus one is there because the previous instructions
								// will have already been moved into their "next" stage while the current instruciton 
								// hasn't been executed yet.)
								if ((currentOperations[i].pipeline_stage === "EX") && ((1 - currentOperations[i].execute_counter) >= 0)) {
									// *** WAW Hazard ***
									stall = 1;
									break;
								}

							}

							// If a previous instruction is in the EX stage and the remaining cycles for that
							// previous instruction is equal to the current instruction's execution cycles minus one.
							// (The minus one is there because the previous instructions will have already been moved into
							// their "next" stage while the current instruciton hasn't been executed yet.)
							else if (!currentOperations[i].completed && (currentOperations[i].pipeline_stage === "EX") && ((1 - currentOperations[i].execute_counter) === 0)) {

								// *** WB will happen at the same time ***
								stall = 1;
								break;
							}
						}

						// If no stalls have been detected.
						if (stall !== 1) {
							// Move the instruction into the EX stage.
							currentOperations[x].pipeline_stage = "EX";
							if (currentOperations[x].operator === 'syscall') {
								if(this.state.dataForwarding){
									this.printToConsole(currentOperations[x-2].result, currentOperations[x-1].result) // need to correct this for all situations
								}
								else{
									this.printToConsole(processor.getRegister("v0"), processor.getRegister("a0"))
								}
							}
							currentOperations[x] = execute(currentOperations[x], this.state.dataForwarding)
							currentOperations[x].execute_counter++;
						}
						break;

					case "EX":
						currentOperations[x].pipeline_stage = "MEM";
						memory(currentOperations[x])
						break;

					case "MEM":
						currentOperations[x].pipeline_stage = "WB";
						currentOperations[x] = writeBack(currentOperations[x])
						break;

					case "WB":
						// Complete the execution of this instruction.
						currentOperations[x].pipeline_stage = " ";
						break;

					case " ":
						currentOperations[x].pipeline_stage = " ";
						break;

					default:
						// Handle the unlikely error that the instruction is in an undefined pipeline stage.
						alert("Unrecognized Pipeline Stage!");
						return;
				}

				// If a stall occured, set the output to "s".
				if (stall === 1) {
					this.Display_Stall(x, current_cycle);
				}
				else {
					s = currentOperations[x].pipeline_stage
					if (s !== " " && this.state.enableMoreStats) {
						var cell = document.getElementsByClassName(`row${x}-col${current_cycle}`)
						cell[0].innerHTML = s
					}
					nerdyInfo[x].push(s)
				}
				// Display the value on the screen.
			}
			x++;
		} // End of while loop

		// If we didn't encounter a stall in one of the previous instructions, and if not all of the instructions are in the pipeline.
		if (stall !== 1 && !processor.endOfInstr) {
			// Issue a new instruction.
			if (currentOperations.length > 0 && (currentOperations[currentOperations.length - 1].operator === "bne" || currentOperations[currentOperations.length - 1].operator === "beq") && currentOperations[currentOperations.length - 1].pipeline_stage === "ID/RF") {
				stall = 1
				nerdyInfo.push(["S"])
			}
			else {
				var fetchedInstr = instrFetch(processor.pc, this.state.instructions)
				if (fetchedInstr) {
					if (this.state.enableMoreStats) {
						this.addToTable(x, fetchedInstr.instr)
					}
					fetchedInstr.pipeline_stage = "IF"
					fetchedInstr.execute_counter = 0
					currentOperations.push(fetchedInstr)
					if (nerdyInfo[x] === undefined) {
						nerdyInfo.push(["IF"])
					}
					else {
						nerdyInfo[x].push("IF")
						this.Display_Stall(x, current_cycle - 1)
					}
					if (this.state.enableMoreStats) {
						cell = document.getElementsByClassName(`row${x}-col${current_cycle}`)
						cell[0].innerHTML = 'IF'
					}
				}
			}
		}

		console.log("Registers: ")
		console.log(processor.registers)
		this.setState({
			registers: processor.registers
		})

		// Increment the cycle count.
		current_cycle++;
	}


	// --- other dom logic ---
	addToTable = (x, instr) => {
		var table = document.getElementById("table-main")
		var cycleRow = document.getElementById("cycle-number")
		for (let i = 5 * x; i < 5 * x + 5; i++) {
			var cell = cycleRow.insertCell(i + 1)
			cell.setAttribute("align", "center")
			cell.setAttribute("nowrap", "nowrap")
			cell.className = "num-cell"
			cell.id = "num-cell-heading"
			cell.innerHTML = i + 1
		}
		var instrRow = table.insertRow(x + 1)
		var instrCell = instrRow.insertCell(0)
		instrCell.className = `instr-cell row${x}-col${0}`
		instrCell.innerHTML = instr.join(" ")
		instrCell.scrollTop = instrCell.scrollHeight
		for (let i = 1; i <= 5 * x + 5; i++) {
			var instrNum = instrRow.insertCell(i)
			instrNum.className = `num-cell row${x}-col${i}`
		}
	}


	onSideNavClick = (event) => {
		this.setState({
			clicked: event
		})
	}

	onSampleProgramClick = program => {
		if (program === "bubbleSort") {
			this.setState({
				code: bubbleSort
			})
		}
		else if(program === 'sumOfNums'){
			this.setState({
				code: sumOfNum
			})
		}
		else {
			this.setState({
				code: tryOutPipeline
			})
		}
	}

	onDataForwardEnable = () => {
		const df = this.state.dataForwarding
		if (!df) {
			this.assemble()
		}
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

	onEnableMoreStats = () => {
		const moreStats = this.state.enableMoreStats
		if (!moreStats) {
			this.assemble()
		}
		this.setState({
			enableMoreStats: !moreStats
		})
	}

	onCodeChange = changedCode => {
		this.setState({
			code: changedCode
		})
	}

	render = () => {
		return (
			<div className="main-screen">
				<div>
					<Navbar
						setFile={this.setFile}
						deleteFile={this.deleteFile}
						assemble={this.assemble}
						execute={this.Execute}
						stepRun={this.StepRun}
						toggleDF={this.onDataForwardEnable}
						dataForw={this.state.dataForwarding}
						running={this.state.running}
						toggleMS={this.onEnableMoreStats}
						moreStats={this.state.enableMoreStats}
					/>
				</div>
				<div className="App">
					<div style={{ width: '20%' }}>
						<SideBar
							registers={this.state.registers}
							pc={this.state.pc}
							clicked={this.state.clicked}
							onNavClick={this.onSideNavClick}
							dataSegment={processor.memory}
							memoryUsed={parser.memPtr}
							sampleProgram={this.onSampleProgramClick}
							running={this.state.running}
							performance={this.state.performance}
						/>
					</div>
					<div style={{ width: '80%' }}>
						<IDE
							onCodeChange={this.onCodeChange}
							code={this.state.code}
							pc={this.state.pc}
						/>
						<div style={{ height: '1px', backgroundColor: 'white' }}></div>
						<Console
							console={this.state.print}
							operations={currentOperations}
							moreStats={this.state.enableMoreStats}
						/>
					</div>
				</div>
			</div>
		)
	}
}


export default App;