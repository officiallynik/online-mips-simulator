// logic for checking hazards and increment stalls
// need to change parser and operation logic also
// main file which combines stages and hazards will be app.js file (execute function)

/* 
all potential hazards
1. RAW : 
    dest reg. of prev instr is one of the reg in current instr
        -> data_forwarding is enabled  -> RAW only if prev instr is a load instr && if prev is just before current instr
        -> data_forwarding is disabled -> RAW if prev instr and current instr index is less or equal to 2

2. WAR and WAW :
    we will not encounter this in our pipeline design since we consider each process to execute in one cycle

3. Structural Hazard :
    If two instructions use the same functional unit and the difference between the two instructions is less than the 
	execution cycles of the earlier instruction.

*/

/*
    In code:
    // lets ignore structural hazard for now
    1. dest[prev] == src1[curr] || src2[curr]
        -> df: enabled  -> stall only if prev instr is load or store
        -> df: disabled -> 
*/

