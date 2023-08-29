var hyperscript = require("./render/hyperscript")
hyperscript.trust = require("./render/trust")
hyperscript.fragment = require("./render/fragment")

var caps = function caps() { return hyperscript.apply(this, arguments) }
caps.mount = require("./mount")
caps.render = require("./render")
module.exports = caps

const TextField = require("./component/TextField")

// define your component
var Example = {
    view: function(vnode) {
        return caps("div", "Hello")
    }
}

// consume your component

caps.render(document.body, caps(TextField))