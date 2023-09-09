const { login, handleIncomingRedirect } = require("@inrupt/solid-client-authn-browser")
var caps = require("..")

async function clickedButton(issuer) {
    await login({
        oidcIssuer: issuer,
        redirectUrl: new URL("/", window.location.href).toString(),
        clientName: appName,
      });
}

async function logged() {
    await handleIncomingRedirect();
}

var LoginButton = {
    label: "",
    oninit: async function(vnode) {
        const url = new URL(window.location.href);
        if (url.searchParams.has('code') && url.searchParams.has('state')) {
            await logged();  
        }
    },
    view: function(vnode) {
        var color = "#000"
        if(vnode.attrs.color){
            color = vnode.attrs.color;
        }
        if(vnode.attrs.icon){
            return caps("button.image", {
                style: "background-color:"+ color,
                onclick: () => clickedButton(vnode.attrs.url)
            }, [caps("img", { src: vnode.attrs.icon }), caps("span",vnode.attrs.name)])
            
        }
        return caps("button", {
            style: "background-color:"+ color,
            onclick: () => clickedButton(vnode.attrs.url)
        }, vnode.attrs.name)
        
    }
}

module.exports = LoginButton