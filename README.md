# MIPS Simulator build using react and javascript

Online link: https://mips-online.herokuapp.com/

#### How to use it locally?
* 1. download the zip
* 2. run "npm install"
* 3. run "npm start"

*Node and npm are required to run Simulator locally

#### Pipeline Stages
* 1. Instruction Fetch
* 2. Instruction Decode/Register Fetch
* 3. Execute
* 4. Memory
* 5. Writeback

#### Supported instructions

['add', 'addi', 'sub', 'beq', 'bne', 'lw', 'li', 'lui', 'la', 'sw', 'slt', 'slti', 'j', 'jr', 'syscall']

#### Assumptions
* 1. Each pipeline stage takes 1 clk cycle for any instruction
* 2. Ideal IPC = 1
* 3. Each 'stall' also takes 1 clk cycle

#### Using the online IDE
* 1. write or upload your assembly code
* 2. enable dataforwarding or more stats as you like
* 3. assemble the code
* 4. use step-run or run to execute the code

*Warning: Do Not Turn On More Stats For Large Programs Like 'Bubble Sort', As Time Taken To Complete The Task May Increase By Large Amount Or System May Hang!!

*View the instructions in their pipeline stage by enabling and navigating to 'Pipeline' in lower screen

*This simulator is not bug free, feel free to hit a pull request on noticing one or to make improvements