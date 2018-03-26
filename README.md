# JTM

JTM is a derivative of the TMX map format ([http://doc.mapeditor.org/en/latest/reference/tmx-map-format/](http://doc.mapeditor.org/en/latest/reference/tmx-map-format/)).

# Installation

To install type:

```
npm install https://github.com/tilehub/jtm --save
```

# Usage

to use the package import it by typing:
```
jtm = require('jtm').JTM
```

and then instanciate it with:

```
let converter = jtm()
```

## TMXJsonToJTM
Converts TMX Json Data into JTM Data. If a Tileset is integrated into the TMX Data, it is extracted.

**tmx**: is the TMX Json Data

**tsx**: is a js Object with every Tileset filename as the key and it's content as value

**return**: TMXJsonToJTM() returns a list with **tmx** on index 0 and **tsx** on index 1

## JTMToTMXJson
Converts JTM Data into TMX Json Data.

**tmx**: is the TMX Json Data

**tsx**: is a js Object with every Tileset filename as the key and it's content as value

**return**: JTMToTMXJson() returns a list with **tmx** on index 0 and **tsx** on index 1

