const parse = require('./parse.js')

const { init, parse_operants } = require('./vm.js')

const variables = {
  a: 0,
  pc: 0,
  rp: 0,
  one: 1,
  minus_one: Math.pow(2, 25)-1
}

const memory = new Array(Math.pow(2, 20))


// magic constant; this is used by inc / dec; imagine this as some kind of calling convention with arguments placed at specific memory addresses. This is the only way to do this as only one register is accessible. Could consider the first few memory addresses (like the first 2-4 maybe) as pseudo-registers.
// Could also implement some kind of stack using a convention for what memory address ranges have what purpose (for example: stack height at 4 (5th address), stack builds up starting from 5 (6th address))
const a = 0
const b = 1
const x = 2
const y = 3

memory[a] = 0;
memory[b] = 0;
memory[x] = 0;
memory[y] = 5;

const {instructions, labels} = parse(`
      ; init
      JMP loop
      ; inc
inc:  LDC ${variables.one}
      ADD ${a}
      STV ${a}
      RET
      ; dec
dec:  LDC ${variables.minus_one}
      ADD ${a}
      STV ${a}
      RET
      ; main code
loop: LDC 0
      EQL ${y}
      JMN end

      LDV ${x}
      STV ${a}
      ; INC ${x}
      SRC inc
      LDV ${a}
      STV ${x}

      LDV ${y}
      STV ${a}
      ; DEC ${y}
      SRC dec
      LDV ${a}
      STV ${y}

      ; LDV ${y}
      JMP loop
end:  HALT
`, parse_operants(variables)
)

console.log('labels:')
console.log(labels)

console.log('instructions:')
console.log(instructions.map((item, i) => `${i} ${item[0]} ${item[1]}`).join('\n'))

init({ instructions, labels, memory, variables }).execute()

console.log(variables)
console.log(memory)