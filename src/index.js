
var hyperscript = require("./render/hyperscript")
hyperscript.trust = require("./render/trust")
hyperscript.fragment = require("./render/fragment")

var caps = function caps() { return hyperscript.apply(this, arguments) }
caps.mount = require("./mount")
caps.render = require("./render")
module.exports = caps

const LoginForm = require("./component/loginForm")
const TextField = require("./component/TextField")

// consume your component

caps.render(document.body, caps(TextField, {label: "Name"}))