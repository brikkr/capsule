
var hyperscript = require("./render/hyperscript")
hyperscript.trust = require("./render/trust")
hyperscript.fragment = require("./render/fragment")

var caps = function caps() { return hyperscript.apply(this, arguments) }
caps.mount = require("./mount")
caps.render = require("./render")
caps.route = require("./route")
module.exports = caps


///////////////////////
const { login, getDefaultSession } = require("@inrupt/solid-client-authn-browser");

require('./styles/style.css');

var Login = require("./views/login");
var Home = require("./views/home")

caps.route(document.body, "/", {
    "/": {
        onmatch: async function() {
            if (!getDefaultSession().info.isLoggedIn) {
                caps.route.set("/login")
            }else{
                caps.route.set("/home")
            }
        }
    },
    "/login": Login,
    "/home": Home
})



