const parse = str => str
  .split('\n')
  .map(x => x.trim())
  .filter(x => !!x)
  .filter(x => !x.startsWith(';'))
  .map(x => x.split(' '))
  .map(x => x.filter(y => y.length > 0))
  .map(x => x[0].endsWith(':') 
    ? { label: x[0].substring(0, x[0].length-1), opcode: x[1], operant: x[2]} 
    : { opcode: x[0], operant: x[1] })

const transform = (lines, cb) => {
  const labels = []
  const instructions = []
  
  lines.forEach(({ opcode, operant }) => 
    instructions.push([opcode, cb(operant)]))
  lines.forEach(({ label }, i) => 
    label && (labels[label] = i))

  return {
    labels, instructions
  }
}

module.exports = (str, cb=op=>op) => transform(parse(str), cb)