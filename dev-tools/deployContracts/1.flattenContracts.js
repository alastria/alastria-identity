const ora = require('ora')
const truffleFlattener = require('truffle-flattener')
const fs = require('fs')

let rawdata = fs.readFileSync('./config.json')
let config = JSON.parse(rawdata)

let files = config.filesManager
let filePath = config.filePath
let writeTofile = true

async function flatten(files, filePath, writeTofile) {
  const spinner = ora(`Flattening .sol file ${filePath} ...`).start()
  let flattened = await truffleFlattener(files)
  if(writeTofile) {
    fs.writeFileSync(filePath, flattened)
    spinner.succeed()
    console.log(`Flattened file ${filePath} written!`)
    return flattened
  } else {
    spinner.fail()
  }
}

flatten(files, filePath, writeTofile)