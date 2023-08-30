
var hyperscript = require("./render/hyperscript")
hyperscript.trust = require("./render/trust")
hyperscript.fragment = require("./render/fragment")

var caps = function caps() { return hyperscript.apply(this, arguments) }
caps.mount = require("./mount")
caps.render = require("./render")
module.exports = caps

const IssuerLoginButton = require("./component/IssuerLoginButton")

// consume your component

caps.render(document.body, caps(IssuerLoginButton, {name: "Inrupt", url:"https://login.inrupt.com"}))