const { Session } = require("@inrupt/solid-client-authn-node");


var caps = require("../")

async function clickedButton(issuer) {
   
}

var IssuerLoginButton = {
    label: "",
    oninit: function(vnode) {
        this.issuerLoginName = vnode.attrs.name
        this.issuerLoginURL = vnode.attrs.url
        this.issuerLoginIcon = ""
    },
    view: function(vnode) {
        return caps("button", {onclick: () => clickedButton(this)}, this.issuerLoginName)
    }
}

module.exports = IssuerLoginButton