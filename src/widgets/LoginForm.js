import capsuleUI from "mithril";
import {  login, handleIncomingRedirect, getDefaultSession } from '@inrupt/solid-client-authn-browser'

const issuer = {
    label: 'issuer',
    value: '',
    error: ''
}
  
const input = (attrs) =>
    capsuleUI('label',
        capsuleUI('span', attrs.label),
        capsuleUI('input', {
        type: 'url',    
        value: attrs.value,
        oninput: e => {
            attrs.value = e.target.value
            attrs.error && validate()
        }
        }),
        attrs.error && capsuleUI('span', attrs.error)
)
  
const onsubmit = e => {
    e.preventDefault()
    startLogin(issuer.value) 
}

async function startLogin(issuer) {
    // Start the Login Process if not already logged in.
    let solidIssuer = issuer
    if(issuer.length == 0){
        //solidIssuer =  'https://solid.brikkr.com/'
       solidIssuer =  'https://login.inrupt.com' 
    }

   if (!getDefaultSession().info.isLoggedIn ) {
        await login({
        oidcIssuer: solidIssuer,
        redirectUrl: new URL("/", window.location.href).toString(),
        clientName: "Capsule"
        });
    }
}

async function completeLogin() {
    await handleIncomingRedirect();
 }


export class LoginForm {
    view() {
        return capsuleUI('form', {
                onsubmit,
            },
            input(issuer),
            capsuleUI('button', 'login')
        )
    }
}