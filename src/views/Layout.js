var caps = require("..")
const { getDefaultSession } = require("@inrupt/solid-client-authn-browser")

module.exports = {
    onupdate:function(vnode) {
        if (!getDefaultSession().info.isLoggedIn) {
            caps.route.set("/login")
        }
    },
    view: function(vnode) {
        return caps("main", [
            caps("nav.top", [caps('.left', caps('.brand', 'Capsule Beta version')),caps('.right',[
                caps("button.rounded", {
                    onclick: async e =>  {
                        const session = getDefaultSession();
                        session.logout();
                        caps.route.set("/")
                    }}, "Logout")
            ])]),
            caps("section.main", vnode.children)
        ])
    }
}