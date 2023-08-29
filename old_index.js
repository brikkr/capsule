const { 
    getSessionFromStorage,
    Session
  } = require("@inrupt/solid-client-authn-node");

  exports.Issuer = class {

    icon = "";

    constructor(name, url) {
        this.name = name;
        this.url = new URL(url);
    }

    set icon(value){
        if(value){ 
            this.icon = value;
        }
    }
}


exports.loginForm = function(props) {
    const issuers = props.issuers;
    props.action ? action = props.action : action = "";
    let form = '<form method="post">';
    form += '<label class="solid-ui-label" for="webid"/>WebID</label>'
    form += '<input type="url" class="solid-ui-input" name="webid"/>'
    form += '<input type="submit"/>'
    form += '<p>'
    for (const issuer of issuers) {
        form += `<button type="submit" name="issuer" value="${issuer.url}"  class="solid-ui-button" formaction="${action}">${issuer.name}</button> `
    }
    form += '</p>'
    form += '</form>';
    return form;
}


exports.button = function(props){

}


