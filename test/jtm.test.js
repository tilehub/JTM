/* eslint-disable no-unexpected-multiline */
/* eslint-env jest */
let fs = require('fs')
let promisify = require('util').promisify
// Packages for test usage
let jtm = require('../src/converter').JTM
let xml2js = require('xml2js')
let parser = new xml2js.Parser() // Parser Objekt

test('tmx to jtm', async () => {
    let eyy = new jtm()

    let promise = new Promise(async (resolve, reject) => {
        const readFilePromise = promisify(fs.readFile)
        let jsonMapOrig = JSON.parse(await readFilePromise('./test/space_includedSrc.json'))
        let tuple = eyy.TMXJsonToJTM(jsonMapOrig, {})
        let jtmMap = tuple[0]
        let tsx = tuple[1]
        fs.writeFile('./test/space.jtm', JSON.stringify(jtmMap, null, '\t'), async (err) => {
            if (err) { reject(err) }
            for (let i in tsx) {
                fs.writeFile('./test/__' + i, JSON.stringify(tsx[i], null, '\t'), async (err) => {
                    if (err) { reject(err) }

                    jtmMap = JSON.parse(await readFilePromise('./test/space.jtm'))
                    let jsonMap = eyy.JTMToTMXJson(jtmMap)[0]

                    fs.writeFile('./test/space.json', JSON.stringify(jsonMap, null, '\t'), (err) => {
                        if (err) { reject(err) }
                    })

                    expect(jsonMap).toEqual(JSON.parse(await readFilePromise('./test/space_externalSrc.json')))
                    expect(JSON.parse(await readFilePromise('./test/space_tiles.json'))).toEqual(
                        JSON.parse(await readFilePromise('./test/__' + i)))
                    resolve()
                })
            }
        })
    })
    await promise
})

test('tmxXML to tmxJSON', async () => {
    let eyy = new jtm()
    // Datei einlesen
    const readFilePromise = promisify(fs.readFile)
    let promise = new Promise((resolve, reject) => {
        fs.readFile('./test/space_orig.tmx', async (err, data) => {
            if (err) { reject(err) }
            let json_map = await eyy.TMXxmlToTMXJson(data)

            console.log(json_map)
            fs.writeFile('./test/test.json', JSON.stringify(json_map, null, '\t'), async (err) => {
                if (err) { reject(err) }
                expect(json_map).toEqual(JSON.parse(await readFilePromise('./test/space.json')))
                resolve()
            })
        })
    })
    await promise
})

test('tmxJSON to tmxXML', async () => {
    let eyy = new jtm()
    // Datei einlesen
    const readFilePromise = promisify(fs.readFile)
    let promise = new Promise(async (resolve, reject) => {
        fs.readFile('./test/space_orig.tmx', async (err, data) => {
            if (err) { reject(err) }
            let xml = await eyy.TMXJsonToTMXxml(String(data))

            fs.writeFile('./test/test.tmx', xml, async (err) => {
                if (err) { reject(err) }
                expect(xml).toEqual(String(await readFilePromise('./test/space_orig.tmx')))
                resolve()
            })
        })
    })
    await promise
})
