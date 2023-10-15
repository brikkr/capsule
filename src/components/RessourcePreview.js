var caps = require("..");

const WebID = require("../models/WebID");

const RessourcePreview = {
    oninit(vnode){
        vnode.state.containedResources = []
    },
    onupdate: vnode => new Promise((resolve) => {
        vnode.state.loading = true;
        if(vnode.attrs.ressource != vnode.state.ressource){
            WebID.loadContainedResources(vnode.attrs.ressource)
            .then((containedResources) => {
                vnode.state.containedResources = containedResources;
                vnode.state.ressource = vnode.attrs.ressource;
                vnode.state.loading = false;
                caps.redraw();
                resolve();
            })
            .catch((err) => {
                resolve();
            });
        }else{
            vnode.state.loading = false;
        }
    }),
    
    view: vnode => {
        return vnode.state.loading ? caps('.loader') : caps('.preview', vnode.state.containedResources.map(function(contained) {
            return caps(".card", contained.url)
        }))
    }
}

module.exports = RessourcePreview;