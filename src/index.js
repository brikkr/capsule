
var hyperscript = require("./render/hyperscript")
hyperscript.trust = require("./render/trust")
hyperscript.fragment = require("./render/fragment")

var caps = function caps() { return hyperscript.apply(this, arguments) }
caps.mount = require("./mount")
caps.render = require("./render")
caps.route = require("./route")

module.exports = caps

const IssuerLoginButton = require("./component/IssuerLoginButton")
const LoginForm = require("./component/loginForm")


require('./styles/style.css');

// consume your component

//caps.render(document.body, caps(IssuerLoginButton, {name: "Inrupt", url:"https://login.inrupt.com"}))

caps.render(document.body, caps(LoginForm))

/*
var count = 0

var Hello = {
    view: function() {
        return caps("main", [
            caps("h1", {
                class: "title"
            }, "My first app"),
            caps("button", {
                onclick: function() {count++}
            }, count + " clicks"),
        ])
    }
}

var Splash = {
    view: function() {
        return caps(IssuerLoginButton, {name: "Inrupt", url:"https://login.inrupt.com"})
    }
}


caps.route(document.body, "/login", {
    "/login": Splash,
    "/callback": Hello,
})
*/