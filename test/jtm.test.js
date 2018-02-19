/* eslint-disable no-unexpected-multiline */
/* eslint-env jest */
let fs = require('fs')
let promisify = require('util').promisify
// Packages for test usage
let jtm = require('../src/converter').JTM

test('tmx to jtm', async () => {
    let eyy = new jtm()
    const readFilePromise = promisify(fs.readFile)
    let jsonMapOrig = JSON.parse(await readFilePromise('./test/space_orig.json'))
    let jtmMap = eyy.TMXJsonToJTM(jsonMapOrig)

    fs.writeFile('./test/space.jtm', JSON.stringify(jtmMap, null, '\t'), async (err) => {
        if (err) { throw err }

        jtmMap = JSON.parse(await readFilePromise('./test/space.jtm'))
        let jsonMap = eyy.JTMToTMXJson(jtmMap)

        fs.writeFile('./test/space.json', JSON.stringify(jsonMap, null, '\t'), (err) => {
            if (err) { throw err }
        })

        expect(jsonMap).toEqual(jsonMapOrig)
    })
})
