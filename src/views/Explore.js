var caps = require("..");
const RessourceTreeView = require("../components/RessourceTreeView");
const RessourcePreview = require("../components/RessourcePreview");

const { getDefaultSession} = require("@inrupt/solid-client-authn-browser");
const WebID = require("../models/WebID");


module.exports = {
    oninit: function(vnode){
        if (!getDefaultSession().info.isLoggedIn) {
            caps.route.set("/login")
        }
    },

    view: function(vnode) {
        return caps("div"),
            [
                caps(".block", [
                    caps('h2.title', 
                    [
                        caps('i', { class: "icon gg-folder"}), 
                        caps('span','Browse')
                    ]),
                    caps(RessourceTreeView, {current: vnode.attrs.url})
                ]),
                caps(RessourcePreview, {ressource: vnode.attrs.url}),
                caps(".block", [
                    caps('h2.title', 
                    [
                        caps('i', { class: "icon gg-more-r"}), 
                        caps('span','Actions')
                    ]),
                   // caps(RessourceTreeView, {current: vnode.attrs.url})
                ]),
            ]
    }
}