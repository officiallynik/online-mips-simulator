const bubbleSort = `.data
array: 
	.word 4, 2, 1, 5, 3

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
    beq $t0, $t1, print
    
    lw $t6, 0($s0)
	addi $t3, $t0, 1 

	addi $s2, $s0, 4

	addi $t0, $t0, 1

	j loop2

.globl main
main:
	lui $s0, 0x1001
	li $t0, 0
	li $t1, 5
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

const checkOutCache = `.data
array:
    .word 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

.text
end:
    jr $ra

sumarray2:
    beq $t0, $t1, end
    lw $t2, 0($s1)
    add $s0, $t2, $s0
    addi $t0, $t0, 1
    addi $s1, $s1, 4
    j sumarray2    

sumagain:
    li $t0, 0
    li $t1, 10
    lui $s1, 0x1001
    j sumarray2  

sumarray:
    beq $t0, $t1, sumagain
    lw $t2, 0($s1)
    add $s0, $t2, $s0
    addi $t0, $t0, 1
    addi $s1, $s1, 4
    j sumarray

.globl main
main:
    li $s0, 0
    li $t0, 0
    li $t1, 10
    lui $s1, 0x1001
    j sumarray
`

export {
    sumOfNum,
    bubbleSort,
    tryOutPipeline,
    checkOutCache
}