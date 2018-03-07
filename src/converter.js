let xml2js = require('xml2js')
let parser = new xml2js.Parser({explicitArray: true}) // Parser Objekt
const objectTypes = require('object-types')

class JTM {
    constructor () {

    }

    TMXJsonToJTM (tmx, tsx = {}) {
        /**
         * tsx: {'filename of tileset': 'data inside the file'}
         */
        let jtm = JSON.parse(JSON.stringify(tmx))
        /*
        if (jtm['tiledversion'] !== '1.0.3') {
            console.log(jtm)
            console.log(jtm['tiledversion'])
            throw Error('Not correct jtm version')
        }
        */
        if (typeof tmx['layers'] !== typeof {}) {
            throw Error('Not correct jtm format')
        } else {
            /* convert layers array in library */
            let layers = jtm['layers']
            jtm['layers'] = {}
            let j = 0
            for (let i of layers) {
                jtm['layers'][j] = i
                j++
            }
            /* export internal tilesets */
            for (let i in jtm['tilesets']) {
                let fgid = jtm['tilesets'][i]['firstgid']
                if (jtm['tilesets'][i].hasOwnProperty('source')) { /* if it has a source check if it is in json */
                    if (jtm['tilesets'][i]['source'].endsWith('.json')) {
                        if (typeof tsx === typeof undefined || !tsx.hasOwnProperty(jtm['tilesets'][i]['source'])) {
                            throw Error('Tileset has not been Supplied')
                        } /* else {
                            jtm['tilesets'][i] = tsx[jtm['tilesets'][i]['source']]
                            jtm['tilesets'][i]['firstgid'] = fgid
                        } */
                    } else {
                        throw Error('Tileset has to be embedded or in JSON')
                    }
                } else {
                    let name = jtm['tilesets'][i]['name']
                    while (tsx.hasOwnProperty(name + '.json')) {
                        name += '_'
                    }
                    name += '.json'
                    tsx[name] = jtm['tilesets'][i]
                    delete tsx[name]['firstgid']
                    jtm['tilesets'][i] = {'firstgid': fgid, 'source': name}
                }
            }
        }
        return [jtm, tsx]
    }

    JTMToTMXJson (jtm, tsx) {
        let tmx = JSON.parse(JSON.stringify(jtm))
        /*
        if (tmx['tiledversion'] !== '1.0.3') {
            console.log(jtm)
            console.log(jtm['tiledversion'])
            throw Error('Not correct jtm version')
        }
        */
        if (typeof jtm['layers'] !== typeof []) {
            throw Error('Not correct jtm format')
        } else {
            let layers = tmx['layers']
            tmx['layers'] = []
            for (let i in layers) {
                tmx['layers'].push(layers[i])
            }
        }
        return [tmx, tsx]
    }

    async TMXJsonToTMXxml (tmx) {
        let builder = new xml2js.Builder({headless: true, explicitRoot: true})
        let xml = builder.buildObject(tmx)
        xml = xml.replace(/&lt;/g, '<')
        xml = xml.replace(/&gt;/g, '>')
        xml = xml.replace(/<root>/g, '')
        xml = xml.replace(/<\/root>/g, '')
        return xml
    }

    async TMXxmlToTMXJson (tmx) {
        return new Promise((resolve, reject) => {
            parser.parseString(tmx, (err, result) => {
                if (err) { reject(err) }
                result = result['map']

                // Recursive Function to iterate through the whole JSON
                let rec = function (json) {
                    // Keys to the next objects
                    let keys = Object.keys(json)
                    for (let i of keys) {
                        //
                        if (objectTypes(Object(json[i])) === 'array') {
                            for (let j in json[i]) {
                                json[i][j] = rec(json[i][j])
                            }
                        }

                        if (i === '_') {
                            let str = json[i]
                            str = str.replace(/ /g, '')
                            str = str.replace(/\n/g, '')
                            json[i] = str.split(',')
                        } else if (i === '$') {
                            let sub = JSON.parse(JSON.stringify(json[i]))
                            delete json[i]
                            json = Object.assign(json, sub)
                            //                            console.log(json)
                        } else {
                            if (typeof json[i] === 'string') {
                                console.log(json[i])
                                if (!isNaN(parseFloat(json[i]))) {
                                    json[i] = parseFloat(json[i])
                                }
                            }
                        }
                    }
                    return json
                }

                result = rec(result)
                let tileLayer = []

                tileLayer.push(result['layer'])

                tileLayer.push(result['objectgroup'])

                for (let i of tileLayer[0]) {
                    console.log('some')
                    i['data'] = i['data'][0]['_']
                }

                delete result['layer']
                delete result['objectgroup']

                result['layers'] = tileLayer[0].concat(tileLayer[1])
                resolve(this.DeepCopy(result))
            })
        })
    }

    DeepCopy (json) {
        return JSON.parse(JSON.stringify(json))
    }

    // Optional

    /*

    var JTMToTMXxml = (jtm) => {
       // ToDo: convert TMX to JTM
    }

    var TMXxmlToJTM = (tmx) => {
        // ToDo: convert TMX to JTM
    }
    */
}

module.exports = {
    JTM: JTM
}
