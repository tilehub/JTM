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

test('JTM to tmxJSON', async () => {
    let promise = new Promise(async (resolve, reject) => {
        let data = await readFilePromise('./test/space.jtm')

        let tmx = (await eyy.JTMToTMXJson(JSON.parse(data)))[0]

        expect(tmx).toEqual(JSON.parse(await readFilePromise('./test/space_externalSrc.json')))
        resolve()
    })
    await promise
})

test('JTM to tmxXML', async () => {
    let promise = new Promise(async (resolve, reject) => {
        let data = JSON.parse(await readFilePromise('./test/space.jtm'))
        let tmx = (await eyy.JTMToTMXxml(data))[0]

        expect(tmx).toEqual((await readFilePromise('./test/space_orig.tmx')).toString())
        resolve()
    })
    await promise
})

test('tmxJSON to JTM', async () => {
    let jsonMapOrig = JSON.parse(await readFilePromise('./test/space_includedSrc.json'))
    let tuple = await eyy.TMXJsonToJTM(jsonMapOrig, {})
    let jtmMap = tuple[0]
    let tsx = tuple[1]

    let promise = new Promise(async (resolve, reject) => {
        await writeFilePromise('./test/out/space.jtm', JSON.stringify(jtmMap, null, '\t'))
        for (let i in tsx) {
            await writeFilePromise('./test/out/' + i, JSON.stringify(tsx[i], null, '\t'))

            expect(jtmMap).toEqual(JSON.parse(await readFilePromise('./test/space.jtm')))
            expect(JSON.parse(await readFilePromise('./test/space_tiles.json'))).toEqual(
                JSON.parse(await readFilePromise('./test/out/' + i)))
            resolve()
        }
    })
    await promise
})

test('tmxJSON to tmxXML', async () => {
    let promise = new Promise(async (resolve, reject) => {
        let data = JSON.parse(await readFilePromise('./test/space_externalSrc.json'))
        let xml = (await eyy.TMXJsonToTMXxml(data))[0]

        await writeFilePromise('./test/out/test.tmx', xml)

//        expect(xml).toEqual(String(await readFilePromise('./test/space_orig.tmx')))
        resolve()
    })
    await promise
})

test('tmxXML to JTM', async () => {
    let promise = new Promise((resolve, reject) => {
        fs.readFile('./test/space_orig.tmx', async (err, data) => {
            if (err) { reject(err) }
            let jtm = (await eyy.TMXxmlToJTM(String(data)))[0]

            writeFilePromise('./test/out/tmxXMLto_JTM.jtm', JSON.stringify(jtm, null, '\n'))

            expect(jtm).toEqual(JSON.parse(await readFilePromise('./test/space.jtm')))
            resolve()
        })
    })
    await promise
})

test('tmxXML to tmxJSON', async () => {
    let promise = new Promise(async (resolve, reject) => {
        let data = await readFilePromise('./test/space_orig.tmx')
        let json_map = (await eyy.TMXxmlToTMXJson(data.toString()))[0]

        fs.writeFile('./test/out/test.json', JSON.stringify(json_map, null, '\t'), async (err) => {
            if (err) { reject(err) }
            expect(json_map).toEqual(JSON.parse(await readFilePromise('./test/space.json')))
            resolve()
        })
    })
    await promise
})
