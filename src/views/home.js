var caps = require("..");
const RessourceTreeView = require("../components/RessourceTreeView");
const { getDefaultSession} = require("@inrupt/solid-client-authn-browser");
module.exports = {
    oninit: function(){
        if (!getDefaultSession().info.isLoggedIn) {
            caps.route.set("/login")
        }else{
            caps.route.set("/home")
        }
    },
    view: function() {
        return caps("div", [caps(RessourceTreeView)] )
    }
}
