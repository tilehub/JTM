
class JTM {
    constructor () {

    }

    TMXJsonToJTM (tmx, tsx) {
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

    // Optional

    /*
    var TMXxmlToTMXJson = (tmx) => {
       //ToDo: convert TMX to JTM
    }

    var TMXJsonToTMXxml = (tmx) => {
       //ToDo: convert TMX to JTM
    }

    var JTMToTMXxml = (jtm) => {
       //ToDo: convert TMX to JTM
    }

    var TMXxmlToJTM = (tmx) => {
        //ToDo: convert TMX to JTM
    }
    */
}

module.exports = {
    JTM: JTM
}