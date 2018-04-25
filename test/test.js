/* eslint-disable no-unexpected-multiline */
/* eslint-env jest */
let fs = require('fs')
let promisify = require('util').promisify
// Packages for test usage
let jtm = require('../src/converter').JTM
let xml2js = require('xml2js')
let parser = new xml2js.Parser() // Parser Objekt

let eyy = new jtm()

const readFilePromise = promisify(fs.readFile)
const writeFilePromise = promisify(fs.writeFile)

test('tmxJSON to JTM', async () => {
    let jsonMapOrig = JSON.parse(await readFilePromise('./test/100-test-10tiles-1.json'))
    let tuple = await eyy.TMXJsonToJTM(jsonMapOrig, {})
    let jtmMap = tuple[0]
    let tsx = tuple[1]

    let promise = new Promise(async (resolve, reject) => {
        await writeFilePromise('./test/out/100-test-10tiles-1.jtm.json', JSON.stringify(jtmMap))
        resolve()
    })
    await promise

    jsonMapOrig = JSON.parse(await readFilePromise('./test/100-test-10tiles-2.json'))
    tuple = await eyy.TMXJsonToJTM(jsonMapOrig, {})
    jtmMap = tuple[0]
    tsx = tuple[1]

    promise = new Promise(async (resolve, reject) => {
        await writeFilePromise('./test/out/100-test-10tiles-2.jtm.json', JSON.stringify(jtmMap))
        resolve()
    })
    await promise
})
