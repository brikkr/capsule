
var hyperscript = require("./render/hyperscript")
hyperscript.trust = require("./render/trust")
hyperscript.fragment = require("./render/fragment")

var mountRedraw = require("./mount/mount")

var caps = function caps() { return hyperscript.apply(this, arguments) }
caps.mount = mountRedraw.mount
caps.redraw = mountRedraw.redraw
caps.render = require("./render")
caps.route = require("./route")

module.exports = caps


///////////////////////
const { login, getDefaultSession } = require("@inrupt/solid-client-authn-browser");

require('./styles/style.css');


var Login = require("./views/Login");
var Home = require("./views/Home");
var Explore = require("./views/Explore");
var Layout= require("./views/Layout");

caps.route(document.body, "/", {
    "/": {
        onmatch: async function() {
            if (!getDefaultSession().info.isLoggedIn) {
                caps.route.set("/login")
            }else{
                caps.route.set("/explore")
            }
        }
    },
    "/login": Login,
    "/home": {
        render: function() {
            return caps(Layout, caps(Home))
        }
    },
    "/explore": {
        render: function() {
            return caps(Layout, caps(Explore))
        }
    },
    "/explore/:url": {
        render: function(vnode) {
            return caps(Layout, caps(Explore, vnode.attrs))
        }
    },
})



