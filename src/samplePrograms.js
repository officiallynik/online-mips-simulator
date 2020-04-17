const bubbleSort = `.data
array: 
	.word 6, 10, 8, 1, 4, 2, 9, 3, 5, 7

.text
end:
    jr $ra
    
printLoop:
    beq $t0, $t1, end
    lw $s1, 0($s0)
    li $v0, 1
    add $a0, $zero, $s1
    syscall
    addi $s0, $s0, 4
    addi $t0, $t0, 1
    j printLoop
    
print:
    lui $s0, 0x1001
    li $t0, 0
    j printLoop

inc:
	addi $s0, $s0, 4
	j loop1

swap:
	sw $t4, 0($s0)
	sw $t6, 0($s2)

	lw $t6, 0($s0)

	addi $s2, $s2, 4
	addi $t3, $t3, 1

	j loop2

loop2:
	beq $t3, $t1, inc
	lw $t4, 0($s2)

	slt $t5, $t4, $t6 
	bne $t5, $zero, swap

	addi $s2, $s2, 4
	addi $t3, $t3, 1

	j loop2


loop1:
	lw $t6, 0($s0)

	beq $t0, $t1, print
	addi $t3, $t0, 1 

	addi $s2, $s0, 4

	addi $t0, $t0, 1

	j loop2

.globl main
main:
	lui $s0, 0x1001
	li $t0, 0
	li $t1, 10
    j loop1`
    
const sumOfNum = `.data
.text

end:
    li $v0, 1
    add $a0, $zero, $s1
    syscall
    jr $ra

sum:
    beq $t0, $s0, end
    add $s1, $s1, $t0
    addi $t0, $t0, 1
    j sum

.globl main
main:
    li $s0, 11
    li $s1, 0
    li $t0, 1
    j sum   `

const tryOutPipeline = `.globl main
main:
    addi $t0, $t0, 10
    addi $t1, $t0, 10
    addi $t2, $t1, 10
    addi $t3, $t2, 10
    addi $t4, $t3, 10
`

export {
    sumOfNum,
    bubbleSort,
    tryOutPipeline
}