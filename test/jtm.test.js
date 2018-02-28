/* eslint-disable no-unexpected-multiline */
/* eslint-env jest */
let fs = require('fs')
let promisify = require('util').promisify
// Packages for test usage
let jtm = require('../src/converter').JTM

test('tmx to jtm', async () => {
    let eyy = new jtm()
    const readFilePromise = promisify(fs.readFile)
    let jsonMapOrig = JSON.parse(await readFilePromise('./test/space_includedSrc.json'))
    let tuple = eyy.TMXJsonToJTM(jsonMapOrig, {})
    let jtmMap = tuple[0]
    let tsx = tuple[1]
    fs.writeFile('./test/space.jtm', JSON.stringify(jtmMap, null, '\t'), async (err) => {
        if (err) { throw err }
        for (let i in tsx) {
            fs.writeFile('./test/__' + i, JSON.stringify(tsx[i], null, '\t'), async (err) => {
                if (err) { throw err }

                jtmMap = JSON.parse(await readFilePromise('./test/space.jtm'))
                let jsonMap = eyy.JTMToTMXJson(jtmMap)[0]

                fs.writeFile('./test/space.json', JSON.stringify(jsonMap, null, '\t'), (err) => {
                    if (err) { throw err }
                })

                expect(jsonMap).toEqual(JSON.parse(await readFilePromise('./test/space_externalSrc.json')))
                expect(JSON.parse(await readFilePromise('./test/space_tiles.json')).toEqual(
                    JSON.parse(await readFilePromise('./test/__' + i))))
            })
        }
    })
})
