const {df,createFunction} = require('@faasit/runtime')


// stateless function
const workerAdd = df.createDurable(async (frt) => {
  const { lhs, rhs } = frt.input()

  return frt.output({
    res: lhs + rhs
  })
})

const durChain2 = df.createDurable(async (frt) => {
  const {lhs,rhs} = frt.input()

  const r = await frt.call('workerAdd', {
    input: { lhs:lhs, rhs:rhs }
  })
  return frt.output({
    res: r.output.res
  })
})

// durable function
const durChain = df.createDurable(async (frt) => {
  const r1 = await frt.call('durChain2', {
    input: { lhs: 1, rhs: 2 }
  })

  // const r2 = await frt.call('durChain2', {
  //   input: { lhs: r1.output.res, rhs: 3 }
  // })

  // const r3 = await frt.call('durChain2', {
  //   input: { lhs: r2.output.res, rhs: 4 }
  // })

  return frt.output({
    res: r1.output.res
  })
})


// Root calls other durable function
const durRecursive = df.createDurable(async (frt) => {
  // calls chaining

  const r1 = await frt.call('durChain', {})
  const r2 = await frt.call('durChain', {})

  const r3 = await frt.call('workerAdd', {
    input: { lhs: r1.output.res, rhs: r2.output.res }
  })

  return frt.output({ res: r3.output.res })
})

// executor
const executor = createFunction(async (frt) => {
    r = await frt.call('durRecursive', {})
    return frt.output({ res: r.output.res })
})

module.exports = {
  workerAdd,
  durChain,
  durChain2,
  durRecursive,
  executor
}