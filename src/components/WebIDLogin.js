var caps = require("..")

// Load Solid libraries
const { login, handleIncomingRedirect } = require("@inrupt/solid-client-authn-browser")
const { 
    getProfileAll, 
    getThing,
    getUrlAll,
  } = require("@inrupt/solid-client");
const { 
SOLID
} = require("@inrupt/vocab-solid");


// Configure input attributes
var LoginInput = {
    label: "",
    oninit: async function(vnode) {
        this.label = vnode.attrs.label
        this.type = vnode.attrs.type
        this.value = vnode.attrs.value
        this.class = "div.webid-login";
        if(this.value){
            this.class = "div.webid-login.filled";
        }
        const url = new URL(window.location.href);
        if (url.searchParams.has('code') && url.searchParams.has('state')) {
            await logged();  
        }
    },
    oncreate: function(vnode) {
      const url = new URL(window.location.href);
      if (url.searchParams.has('code') && url.searchParams.has('state')) {
        vnode.dom.classList.add('valid', 'loading', 'success')
      }
    },
    view: function(vnode) {
        return caps(this.class, [caps("input#webid-input", { 
            value: vnode.attrs.value,
            type: vnode.attrs.type,
            oninput: e => {
                e.preventDefault;
                e.srcElement.parentElement.classList.remove(
                    'error', 'sucess', 'loading',
                  )
                if(e.target.value){
                    if(isValidUrl(e.target.value)){
                        e.srcElement.parentElement.classList.add(
                            'valid',
                          )
                    }else{
                        e.srcElement.parentElement.classList.remove(
                            'valid',
                          )
                    }
                    e.srcElement.parentElement.classList.add(
                        'filled',
                      )
                }else{
                    e.srcElement.parentElement.classList.remove(
                        'filled',
                      )
                }
                vnode.attrs.value = e.target.value
                vnode.attrs.error && validate()
            }
        }),caps("button", {
            onclick: async e =>  {
                e.srcElement.parentElement.disabled = true;
                e.srcElement.parentElement.parentElement.classList.add(
                    'loading',
                  )
                const webIDinput = document.getElementById('webid-input');
                issuer = await getIssuerFrom(webIDinput.value);
                if(issuer){  
                    e.srcElement.parentElement.parentElement.classList.add(
                        'success',
                      )
                    await login({
                    oidcIssuer: issuer,
                    redirectUrl: new URL("/", window.location.href).toString(),
                    clientName: appName,
                    });
                }else{
                    e.srcElement.parentElement.parentElement.classList.add(
                        'error',
                      )
                    e.srcElement.parentElement.parentElement.classList.remove(
                        'loading'
                      )
                      e.srcElement.parentElement.disabled = false;
                }
               
            }
        }, [caps("div.arrow"), caps("div.loader")]),caps("label", vnode.attrs.label), caps("span", "You will be redirected...")])
    }
}

//
// Get Issuer from WebID
//
async function getIssuerFrom(webId){
  try {
    // Fetch WebID profile document
    const profiles = await getProfileAll(
      webId,
      { fetch }
    );
    let webIDProfileSolidDataset = profiles.webIdProfile;
    // Extract the profile object from the document
    const profile = getThing(
      webIDProfileSolidDataset,
      webId
    );
    // Find Issuers URL
    const oidcIssuers = getUrlAll(profile, SOLID.oidcIssuer);
    if(oidcIssuers.length > 0){
      const issuer = oidcIssuers[0];
      return issuer;
    }else{
      return null;
    }
  } catch (err) {
    return null;
  }
}

// Check if URL is valid
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

// Logged 
async function logged() {
  await handleIncomingRedirect();
  caps.route.set("/");
}


module.exports = LoginInput
