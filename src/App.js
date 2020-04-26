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
import cacheController from "./mips/cacheController";
import instrFetch from './mips/stages.js/instructionFetch'
import instrDecodeRegFetch from './mips/stages.js/instructionDecodeAndRegisterFetch'
import execute from './mips/stages.js/execute'
import memory from './mips/stages.js/memory'
import writeBack from './mips/stages.js/writeBack'

// some necessary elements
var currentOperations = []
var current_cycle = 1
var stalls = 0
var stalled = 0
var cacheControl = null
var numCompInstr = 0

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
		enableMoreStats: false,
		l1CacheConfig: {
			cacheSize: 32,
			blockSize: 8,
			associativity: 2,
			latency: 2
		},
		l2CacheConfig: {
			cacheSize: 128,
			blockSize: 32,
			associativity: 2,
			latency: 3
		},
		showCacheConfig: false,
		mainMemoryLatency: 4
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
	
	// cache configure
	CacheConfigure = () => {
		cacheControl = new cacheController(this.state.l1CacheConfig, this.state.l2CacheConfig)
	}

	// --- assemble the code from file ---
	assemble = () => {
		processor.reset()
		parser.reset()
		numCompInstr = 0
		this.CacheConfigure()
		// const cache = new cacheController(this.state.l1CacheConfig, this.state.l2CacheConfig)

		// this.setState({
		// 	cacheController: cache
		// })

		// console.log(cache.dataL1, cache.dataL2)		
		// cache.readFromCache("10101010100010010100100011110110")
		// cache.writeToCacheL1("101010101000100101001000111101", "1", [36, 72], 10)
		// cache.writeToCacheL1("101010101000100101001000110101", "1", [108, 144], 11)
		// cache.writeToCacheL1("101010101000100101001000001101", "0", [0, 18], 12)
		// cache.writeToCacheL1("101010101000100101001100001101", "1", [1, 2], 13)
		// cache.writeToCacheL1("101010101000100101001100001111", "0", [111, 1111], 14)
		// cache.writeToCacheL1("101010101000100101001100001111", "0", [1199, 1991], 15)
		// console.log(cache.cntL1, cache.dataL1)
		// console.log(cache.cntL2, cache.dataL2)

		this.setState({
			running: 0
		})

		currentOperations = []
		current_cycle = 1
		stalls = 0
		stalled = 0
		
		var table = document.getElementsByClassName("pipeline-screen")
		table[1].innerHTML = (
			`<table border='2' id="table-main">
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

		// cache.readFromCache(268500992, 1) // 6 -> 6, 10
		// cache.readFromCache(268500996, 2) // 10
		// cache.readFromCache(268501000, 3) // 8 -> 8, 1
		// cache.readFromCache(268501004, 4) // 1
		// cache.readFromCache(268501008, 5) // 4 -> 4, 2
		// cache.readFromCache(268501012, 6) // 2
		// cache.readFromCache(268501016, 7) // 9 -> 9, 3
		// cache.readFromCache(268501020, 8) // 3
		// cache.readFromCache(268501024, 9) // 5 -> 5, 7
		// cache.readFromCache(268501028, 10) // 7

		// console.log(cache.tagL1)
		// console.log(cache.cntL1)
		// console.log(cache.dataL1)

		// console.log(cache.tagL2)
		// console.log(cache.cntL2)
		// console.log(cache.dataL2)

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
						stalls: stalls
					}
				})
				window.clearInterval(run)
				// console.log("No. of cycles: " + parseInt(current_cycle - 1))
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
		stalls += 1
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
				print: this.state.print + "\nEnd of Instructions...",
				running: 2,
				performance: {
					cycles: current_cycle - 1,
					stalls: stalls
				}
			})
			// console.clear()
			// console.log("DONE :)")
			// console.log(currentOperations)
			return
		}

		// console.clear()
		// console.log("Cycle: " + current_cycle)
		// console.log(currentOperations)

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
						for (let i = (x - 1); i >= numCompInstr; i--) {
							// console.log("I: " + i)

							if (currentOperations[i].dest !== undefined && currentOperations[x].src1 !== undefined) {
								// We must check if data forwarding is enabled and handle that situation differently.
								if (currentOperations[i].dest === currentOperations[x].src1 && (currentOperations[x].operator === "beq" || currentOperations[x].operator === "bne")) {
									// console.log("HERE")
									if (!currentOperations[i].completed && this.state.dataForwarding) {
										// console.log("FORWARDING DATA 1")
										// console.log("Result: " + currentOperations[i].result)
										currentOperations[x].dep1 = currentOperations[i].result
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
							else if (currentOperations[i].dest !== undefined && currentOperations[x].src2 !== undefined) {
								// We must check if data forwarding is enabled and handle that situation differently.
								if (currentOperations[i].dest === currentOperations[x].src2 && (currentOperations[x].operator === "beq" || currentOperations[x].operator === "bne")) {
									if (!currentOperations[i].completed && this.state.dataForwarding) {
										// console.log("FORWARDING DATA 2")
										// console.log("Result: " + currentOperations[i].result)
										currentOperations[x].dep2 = currentOperations[i].result
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
						for (let i = (x - 1); i >= numCompInstr; i--) {
							// console.log("I: " + i)
							if (currentOperations[i].pipeline_stage === "EX" && currentOperations[i].operator === currentOperations[x].operator) {
								// *** Structural Hazard ***
								// alert("S1")
								stall = 1;
								break;
							}
							else if (currentOperations[i].dest !== undefined && currentOperations[x].src1 !== undefined) {
								if (currentOperations[i].dest === currentOperations[x].src1.reg) {
									if (!currentOperations[i].completed && this.state.dataForwarding) {
										currentOperations[x].dep1 = currentOperations[i].result
										if (currentOperations[i].pipeline_stage !== "MEM" && currentOperations[i].pipeline_stage !== "WB" && currentOperations[i].pipeline_stage !== " ") {
											// *** RAW Hazard **
											// alert("S2")				
											stall = 1;
											break;
										}
									}

									else {
										if (currentOperations[i].pipeline_stage !== " " && !this.state.dataForwarding) {
											// *** RAW Hazard **
											// alert("S2b")				
											stall = 1;
											break;
										}
									}
								}
							}
							else if (currentOperations[i].dest !== undefined && currentOperations[x].src2 !== undefined) {
								if (currentOperations[i].dest === currentOperations[x].src2.reg) {
									if (!currentOperations[i].completed && this.state.dataForwarding) {
										currentOperations[x].dep2 = currentOperations[i].result
										if (currentOperations[i].pipeline_stage !== "MEM" && currentOperations[i].pipeline_stage !== "WB" && currentOperations[i].pipeline_stage !== " ") {
											// *** RAW Hazard **
											// alert("S3")
											stall = 1;
											break;
										}
									}

									else {
										// If forwarding is disabled and the previous instruction is not completed, stall.
										if (currentOperations[i].pipeline_stage !== " " && !this.state.dataForwarding) {
											// *** RAW Hazard **
											// alert("S3b")
											stall = 1;
											break;
										}
									}
								}
							}
							else if (currentOperations[i].dest && (currentOperations[i].dest === currentOperations[x].dest)) {

								if ((currentOperations[i].pipeline_stage === "EX") && ((1 - currentOperations[i].execute_counter) >= 0)) {
									// *** WAW Hazard ***
									// alert("S4")
									stall = 1;
									break;
								}

							}

							else if ((currentOperations[i].pipeline_stage === "EX") && ((1 - currentOperations[i].execute_counter) === 0)) {

								// *** WB will happen at the same time ***
								// alert("S5")
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
							currentOperations[x] = execute(currentOperations[x], cacheControl, current_cycle)
							if(currentOperations[x].operator === "lw"){
								switch (currentOperations[x].foundAt) {
									case "l1":
										currentOperations[x].memoryLatency = this.state.l1CacheConfig.latency
										break;
									case "l2":
										currentOperations[x].memoryLatency = this.state.l2CacheConfig.latency
										break
									case "mm":
										currentOperations[x].memoryLatency = this.state.mainMemoryLatency
										break
									default:
										break;
								}
								currentOperations[x].memoryCounter = 0
							}
							currentOperations[x].execute_counter++;
						}
						break;

					case "EX":
						for(let i=(x-1); i>=numCompInstr; i--){
							// *** Structural Hazard ***
							if (currentOperations[i].operator === "lw" && currentOperations[i].memoryCounter <= currentOperations[i].memoryLatency) {
								// alert("S1")
								stall = 1;
								break;
							}
						}
						// If no stalls have been detected.
						if(currentOperations[x].operator === "lw"){
							currentOperations[x].pipeline_stage = "MEM";
							currentOperations[x].memoryCounter++
						}
						else if (stall !== 1) {
							// Move the instruction into the EX stage.
							currentOperations[x].pipeline_stage = "MEM";
							memory(currentOperations[x], cacheControl, current_cycle)
						}

						break;

					case "MEM":
						if(currentOperations[x].operator === 'lw' && currentOperations[x].memoryCounter === currentOperations[x].memoryLatency){
							currentOperations[x].memoryCounter++;
						}

						if (currentOperations[x].operator === 'lw' && currentOperations[x].memoryCounter < currentOperations[x].memoryLatency){
							currentOperations[x].pipeline_stage = "MEM";
							currentOperations[x].memoryCounter++;	
						}
						else{
							currentOperations[x].pipeline_stage = "WB";
							currentOperations[x] = writeBack(currentOperations[x], cacheControl, current_cycle)
						}

						if(currentOperations[x].operator === 'lw' && currentOperations[x].memoryCounter === currentOperations[x].memoryLatency){
							currentOperations[x].pipeline_stage = "MEM";
							memory(currentOperations[x], cacheControl, current_cycle)
						}
						break;

					case "WB":
						// Complete the execution of this instruction.
						numCompInstr++
						currentOperations[x].pipeline_stage = " ";
						break;

					case " ":
						currentOperations[x].pipeline_stage = " ";
						break;

					default:
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
				}
				// Display the value on the screen.
			}
			// console.log(numCompInstr)
			x++;
		}

		if (stall !== 1 && !processor.endOfInstr) {
			// Issue a new instruction.
			if (currentOperations.length > 0 && (currentOperations[currentOperations.length - 1].operator === "bne" || currentOperations[currentOperations.length - 1].operator === "beq") && currentOperations[currentOperations.length - 1].pipeline_stage === "ID/RF") {
				stall = 1
				stalled = 1
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
					if(stalled === 1){
						this.Display_Stall(x, current_cycle-1)
						stalled = 0
					}
					if (this.state.enableMoreStats) {
						cell = document.getElementsByClassName(`row${x}-col${current_cycle}`)
						cell[0].innerHTML = 'IF'
					}
				}
			}
		}

		// console.log("Registers: ")
		// console.log(processor.registers)
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

	configureCache = (level, cacheSize, blockSize, associativity, latency) => {
		if(level === 1){
			this.setState({
				l1CacheConfig: {
					cacheSize: cacheSize,
					blockSize: blockSize,
					associativity: associativity,
					latency: latency
				}
			})
		}
		if(level === 2){
			this.setState({
				l2CacheConfig: {
					cacheSize: cacheSize,
					blockSize: blockSize,
					associativity: associativity,
					latency: latency
				}
			})
		}
	}

	onToggleCacheSettings = (show = !this.state.showCacheConfig) => {
		this.setState({
			showCacheConfig: show
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
						toggleCacheSettings={this.onToggleCacheSettings}
						isShowing={this.state.showCacheConfig}
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
							memoryUsed={parser.memPtr * 4}
							sampleProgram={this.onSampleProgramClick}
							running={this.state.running}
							performance={this.state.performance}
							configureCache={this.configureCache}
							l1CacheInfo={this.state.l1CacheConfig}
							l2CacheInfo={this.state.l2CacheConfig}
							isShowing={this.state.showCacheConfig}
							hideCacheSettings={this.onToggleCacheSettings}
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