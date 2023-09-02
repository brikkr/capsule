const { login, handleIncomingRedirect } = require("@inrupt/solid-client-authn-browser")
var caps = require("../")

async function clickedButton(issuer) {
    await login({
        oidcIssuer: issuer,
        redirectUrl: new URL("/", window.location.href).toString(),
        clientName: "My application",
      });
}

async function logged() {
    const session = await handleIncomingRedirect();
    console.log(session);
    if (session.isLoggedIn) {
        alert("yes, I am logged")
    }
}

var IssuerLoginButton = {
    label: "",
    oninit: async function(vnode) {
        this.issuerLoginName = vnode.attrs.name
        this.issuerLoginURL = vnode.attrs.url
        this.issuerLoginIcon = ""
        const url = new URL(window.location.href);
        if (url.searchParams.has('code') && url.searchParams.has('state')) {
            await logged();  
        }
    },
    view: function(vnode) {
        return caps("button", {onclick: () => clickedButton(vnode.attrs.url)}, this.issuerLoginName)
    }
}

module.exports = IssuerLoginButton