# MIPS Simulator Build Using React and Javascript

Online link: https://officiallynik.github.io/online-mips-simulator

#### How to use it locally?
1. download the zip
2. run "npm install"
3. run "npm start"

*Node and npm are required to run Simulator locally

#### Pipeline Stages
1. Instruction Fetch
2. Instruction Decode/Register Fetch
3. Execute
4. Memory
5. Writeback

#### Cache Feature
Simulator can simulate two levels of cache which can be configured. Cache contents can be seen anytime while running the code by navigating to Cache Table.</br>
* Due to performance issues cache table is not live (i.e., does not get updated automatically), use refresh button or close and open the navigator to refresh the cache table to display the current contents of the cache.

#### Supported instructions

['add', 'addi', 'sub', 'beq', 'bne', 'lw', 'li', 'lui', 'la', 'sw', 'slt', 'slti', 'j', 'jr', 'syscall']

#### Assumptions
1. Each pipeline stage takes 1 clk cycle for any instruction except the load and store instructions
2. Ideal IPC = 1
3. Each 'stall' also takes 1 clk cycle

#### Using the online IDE
1. write or upload your assembly code
2. use cache settings to configure the two levels of cache
3. enable dataforwarding or more stats as you like
4. assemble the code
5. use step-run or run to execute the code
6. check the performance of simulator and code in performance analysis

* Warning: Do Not Turn On More Stats For Large Programs Like 'Bubble Sort', As Time Taken To Complete The Task May Increase By Large Amount Or System May Hang!!

* View the instructions in their pipeline stage by enabling and navigating to 'Pipeline' in lower screen

* View the contents of the cache in 'cache table' in the sidebar of the simulator  

* This simulator is not bug free, feel free to hit a pull request on noticing one or to make improvements
