let xml2js = require('xml2js')
let parser = new xml2js.Parser({explicitArray: true}) // Parser Objekt
const objectTypes = require('object-types')

class JTM {
    constructor () {

    }

    async TMXJsonToJTM (tmx, tsx = {}) {
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
                        /* if (typeof tsx === typeof undefined || !tsx.hasOwnProperty(jtm['tilesets'][i]['source'])) {
                            throw Error('Tileset has not been Supplied')
                        } */
                    } else {
                        throw Error('Tileset has to be embedded or in JSON')
                        // TODO: Convert to JSON
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

    async JTMToTMXJson (jtm, tsx = {}) {
        /**
         * tsx: {'filename of tileset': 'data inside the file'}
         */
        let tmx = JTM.DeepCopy(jtm)
        /*
        if (tmx['tiledversion'] !== '1.0.3') {
            console.log(jtm)
            console.log(jtm['tiledversion'])
            throw Error('Not correct jtm version')
        }
        */
        if (typeof jtm['layers'] !== typeof {}) {
            throw Error('Not correct jtm format')
        } else {
            let layers = jtm['layers']
            tmx['layers'] = []
            for (let i in layers) {
                tmx['layers'].push(layers[i])
            }
        }
        return [tmx, tsx]
    }

    async TMXJsonToTMXxml (tmx, tsx = {}) {
        /**
         * tsx: {'filename of tileset': 'data inside the file'}
         */
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'

        let keys = Object.keys(tmx)

        // <map>
        xml += '<' + tmx['type']

        let rec = function (json) {
            let keys = Object.keys(json)
            for (let i of keys) {
                if (objectTypes(Object(json[i])) !== 'array' && i !== 'type') {
                    if (objectTypes(Object(json[i])) === 'object') {
                    } else {
                        xml += ' ' + i + '="' + json[i] + '"'
                    }
                }
            }

            xml += '>\n'

            // correct dictionaries and lists
            for (let i of keys) {
                if (objectTypes(Object(json[i])) === 'array') {
                    // special case of data
                    if (i !== 'data') {
                        // special case of layer
                        let str
                        if (i !== 'layers') {
                            for (let j in json[i]) {
                                str = i
                                switch (str) {
                                        case 'tilesets':
                                            str = 'tileset'
                                            break
                                        default:
                                            break
                                }
                                xml += '<' + str
                                rec(json[i][j])
                            }
                        } else {
                            for (let j in json[i]) {
                                str = json[i][j]['type']
                                switch (str) {
                                        case 'tilelayer':
                                            str = 'layer'
                                            break
                                        default:
                                            break
                                }

                                xml += '<' + str
                                rec(json[i][j])
                                xml += '</' + str + '>\n'
                            }
                        }
                    } else {
                        xml += '<data encoding="csv">\n' + json[i].toString() + '\n</data'
                    }
                } else {
                }
            }
        }

        rec(tmx)

        // </map>
        xml += '</' + tmx['type'] + '>'
        return [xml, tsx]
    }

    async TMXxmlToTMXJson (tmx, tsx = {}) {
        return new Promise((resolve, reject) => {
            parser.parseString(tmx, (err, result) => {
                if (err) { reject(err) }
                result = result['map']

                // Recursive Function to iterate through the whole JSON
                let rec = function (json) {
                    // Keys to the next objects
                    let keys = Object.keys(json)
                    for (let i of keys) {
                        // Recursivly go through arrays
                        if (objectTypes(Object(json[i])) === 'array') {
                            for (let j in json[i]) {
                                json[i][j] = rec(json[i][j])
                            }
                        }

                        if (i === '_') {
                            // fix data
                            let str = json[i]
                            str = str.replace(/ /g, '')
                            str = str.replace(/\n/g, '')
                            json[i] = str.split(',')
                            for (let j in json[i]) {
                                json[i][j] = parseInt(json[i][j])
                            }
                        } else if (i === '$') {
                            // reformat argumets
                            let sub = JTM.DeepCopy(json[i])

                            for (let  j in sub) {
                                if (objectTypes(Object(sub[j])) === 'string') {
                                    if (!isNaN(parseFloat(sub[j]))) {
                                        sub[j] = parseFloat(sub[j])
                                    }
                                }
                            }

                            delete json[i]
                            json = Object.assign(json, sub)
                        } else {
                            // convert number strings to float
                            console.log(objectTypes(Object(json[i])))
                            if (objectTypes(Object(json[i])) === 'string') {
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
                    // move tile data to correct object
                    i['data'] = i['data'][0]['_']
                }

                // remove false objects
                delete result['layer']
                delete result['objectgroup']

                // add correct object
                result['layers'] = tileLayer[0].concat(tileLayer[1])
                resolve([JTM.DeepCopy(result), tsx])
            })
        })
    }

    async JTMToTMXxml (jtm, tsx = {}) {
        let a = await this.JTMToTMXJson(jtm, tsx)
        return this.TMXJsonToTMXxml(a[0], a[1])
    }

    async TMXxmlToJTM (tmx, tsx = {}) {
        let a = await this.TMXxmlToTMXJson(tmx, tsx)
        return this.TMXJsonToJTM(a[0], a[1])
    }

    static DeepCopy (json) {
        /**
         * Copies a JSON Object
         */
        return JSON.parse(JSON.stringify(json))
    }
}

module.exports = {
    JTM: JTM
}
