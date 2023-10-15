var caps = require("..");

const WebID = require("../models/WebID");


const RessourceTreeView = {
    oninit: vnode => new Promise((resolve) => {
        vnode.state.loading = true;
        WebID.loadResources()
            .then((webID) => {
                const treedata = toTree(webID.resources, webID.podUrls);
                vnode.state.tree = treedata;
                vnode.state.loading = false;
                caps.redraw();
                resolve();
            })
            .catch((err) => {
                caps.redraw();
                resolve();
            });
    }),

    view: vnode => {
        return vnode.state.loading ? caps('.loader') : caps('.tree', createTreeText(vnode.state.tree, null, vnode))
    }
}


//
// Generate a json tree from array
//

const SEPARATOR_EXPRESSION = /[\\\/¥₩]+/i;

const toTree = (resources, pods) => {
    const tree = {};
    for (const resource of resources) {
        for (const pod of pods) {
            let node = tree;
            node = node[pod] ?? (node[pod] = {});
            if(resource.includes(pod)){
                const ressourcePath = resource.replace(pod, '');
                if(ressourcePath.length !== 0){
                    const pathParts = ressourcePath.split(SEPARATOR_EXPRESSION);    
                    if(ressourcePath.endsWith("/")){
                        let emptyElement = pathParts.pop();
                        if(!emptyElement){
                            let lastElement = pathParts.pop();
                            pathParts.push(lastElement+'/');
                        }  
                    }
                    for (const part of pathParts) {
                        if (part) {
                            node = node[part] ?? (node[part] = {});
                        }
                    }
                }      
            }
        }
    }
    return tree;
};

//
// Display tree from json object
//

function createTreeText(obj, parent, vnode) {
    let li = [];
    for (let key in obj) {
        let ressource = key;
        if(parent){
            ressource  = parent+key
        }
        li.push(caps(parent ? 'li.ressource'  : 'li.pod' , [caps(parent ? 'label' : 'label.pod', {onclick: function() {
            caps.redraw();
            return caps.route.set("/explore/:url", {url: ressource}) ;
            }
        },  vnode.attrs.current == ressource ? caps('strong' , key) : key ), createTreeText(obj[key], key, vnode)]))
    }
    return caps('ul', li) || '';
  }


module.exports = RessourceTreeView;