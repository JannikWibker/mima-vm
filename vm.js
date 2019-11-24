const parse_operants = variables => operant => operant !== undefined
  ? operant.startsWith('variables.')
    ? variables[operant.substring(10)]
    : !isNaN(parseInt(operant))
      ? parseInt(operant)
      : operant
  : operant

const init = ({ instructions, labels, memory, variables }) => {
  const fetch = (pc) => instructions[pc] || []

  const execute = (instruction, operant) => {
    console.log(variables.pc, instruction, operant)
    switch(instruction) {
      case 'INC':
        memory[operant]++
        break
      case 'DEC':
        memory[operant]--
        break
      case 'LDC': 
        variables.a = operant
        break
      case 'LDV':
        variables.a = memory[operant]
        break
      case 'STV':
        memory[operant] = variables.a
        break
      case 'LDIV':
        variables.a = memory[memory[operant]]
        break
      case 'STIV':
        memory[memory[operant]] = variables.a
        break
      case 'ADD':
        variables.a = (variables.a + memory[operant]) & variables.minus_one
        break
      case 'AND':
        variables.a = (variables.a & memory[operant]) & variables.minus_one
        break
      case 'OR':
        variables.a = (variables.a | memory[operant]) & variables.minus_one
        break
      case 'XOR':
        variables.a = (variables.a ^ memory[operant]) & variables.minus_one
        break
      case 'NOT':
        variables.a = (~variables.a) & variables.minus_one
        break
      case 'RAR':
        variables.a = ((variables.a & 1) << 24) | (variables.a >>> 1)
        break
      case 'EQL':
        variables.a = variables.a === memory[operant] ? variables.minus_one : 0
        break
      case 'JMP':
        variables.pc = labels[operant]-1
        break
      case 'JMN':
        if((variables.a >>> 24) === variables.one) {
          variables.pc = labels[operant]-1
        }
        break
      case 'SRC': // non-standard; subroutine call
        variables.rp = variables.pc + 1
        variables.pc = labels[operant]-1
        break
      case 'RET': // non-standard; subroutine return
        variables.pc = variables.rp - 1
        break
      case 'NOP':
        break
      case 'HALT':
      default: return
    }
    return execute(...fetch(++variables.pc))
  }

  console.log('labels:')
  console.log(labels)

  console.log('instructions:')
  console.log(instructions.map((item, i) => `${i} ${item[0]} ${item[1]}`).join('\n'))

  console.log('\nruntime:')

  execute(...fetch(variables.pc))

  console.log(variables, memory)
}

module.exports = {
  parse_operants, init
}