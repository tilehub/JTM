
class JTM {
    constructor () {

    }

    TMXJsonToJTM (tmx) {
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
            let layers = jtm['layers']
            jtm['layers'] = {}
            let j = 0
            for (let i of layers) {
                jtm['layers'][j] = i
                j++
            }
        }
        return jtm
    }

    JTMToTMXJson (jtm) {
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
        return tmx
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