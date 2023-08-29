var caps = require("../")

class TextField {
    constructor(vnode) {
        this.kind = "class component"
    }
    view() {
        return caps("div", `Hello from a ${this.kind}`)
    }
    oncreate() {
        console.log(`A ${this.kind} was created`)
    }
}

module.exports = TextField
