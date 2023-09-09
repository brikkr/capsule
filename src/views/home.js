var caps = require("..");

const { getDefaultSession } = require("@inrupt/solid-client-authn-browser")

function initialize() {
    const session = getDefaultSession();
    if (!session.info.isLoggedIn) {
        caps.route.set("/login")
    }else{
        caps.route.set("/home")
    }
}

module.exports = {
    oninit: initialize,
    view: function() {
        return caps("div", ["You are connected.", caps("button", {
            onclick: async e =>  {
                const session = getDefaultSession();
                session.logout();
                caps.route.set("/")
            }}, "Logout")])
    }
}
