var caps = require("../")

var TextField = {
    label: "",
    oninit: function(vnode) {
        this.label = vnode.attrs.label
    },
    view: function(vnode) {
        return caps("div", this.label)
    }
}

module.exports = TextField
