
var hyperscript = require("./render/hyperscript")
hyperscript.trust = require("./render/trust")
hyperscript.fragment = require("./render/fragment")

var caps = function caps() { return hyperscript.apply(this, arguments) }
caps.mount = require("./mount")
caps.render = require("./render")

var root = document.body

// Your code here

caps.mount(root, {
    view: function() {
        return caps("h1", "Try me out")
    }
})

var count = 0 

caps.render(root, caps("h1", "Capsule - Solid UI Framework"));


//caps.mount(root, Hello)