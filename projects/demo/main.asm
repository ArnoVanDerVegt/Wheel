#include "standard"

; proc header remark
proc test2(number qq)
	set 	REG_DRAW_X, 		0
	set 	REG_DRAW_Y, 		0
	print 	qq
endp
;xx
proc test(number q, number r)
	number 	a
	set 	a, 					0
testLabel: ; another remark
	number 	b
	set 	b, 					a
	mul 	b, 					10 ; this is remark
	set 	REG_DRAW_X, 		b
	set 	REG_DRAW_Y, 		b
	set 	REG_DRAW_WIDTH, 	10
	set		REG_DRAW_HEIGHT, 	10
	rect

	inc 	a
	cmp 	a,					2
	jl 		testLabel
	test2(q)
endp

proc main()
	test(67, 1)
	set 	REG_MOTOR_POWER, 	5
	set 	REG_MOTOR_TARGET, 	4000
	motorw 	MOTOR1_A

	set 	REG_MOTOR_POWER, 	1
	set 	REG_MOTOR_TARGET, 	6000
	motorw 	MOTOR1_B
loop:
	jmp loop
endp