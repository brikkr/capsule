var caps = require("../");
const TextInput= require("./TextInput");


const webID = {
    label: 'WebID',
    value: 'Test',
    error: ''
  }

var LoginForm = {
    view: function(vnode) {
        return caps("form.inline", [caps(TextInput, webID),caps("button", "Connect")])
    }
}

module.exports = LoginForm