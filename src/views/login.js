var caps = require("..")

const LoginButton = require("../components/IssuerLoginButton")
const WebIDLogin = require("../components/WebIDLoginInput")

const webID = {
    label: 'WebID',
    type: 'url',
    value: '',
    error: ''
}

const inrupt = {
    name: 'Inrupt',
    url: 'https://login.inrupt.com',
    icon: 'https://solidproject.org/assets/img/solid-emblem.svg',
    color: "#7C4DFF"
}

const brikkr = {
    name: 'Brikkr',
    url: 'https://solid.brikkr.com',
    icon: 'https://www.brikkr.com/wp-content/uploads/2023/08/birkkr-logo.png',
    color: "#ff988c"
}



module.exports = {
    view: function() {
        return caps("div.login", caps("div.align-vertically", [caps(WebIDLogin, webID), caps("div.buttons", [caps(LoginButton, inrupt), caps(LoginButton, brikkr)])]))
    }
}