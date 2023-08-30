var caps = require("../");
const TextField = require("./TextField");


const webID = {
    label: 'WebID',
    value: '',
    error: ''
  }

var LoginForm = {
    view: function(vnode) {
        return caps(TextField, {label:"yahoo"})
    }
}

module.exports = LoginForm