import caps from "mithril";
import {  login, getDefaultSession } from '@inrupt/solid-client-authn-browser'

export class LoginButton {
    constructor(vnode) {
        this.kind = "class component"
    }
    view() {
        return caps("button", `Hello from a ${this.kind}`)
    }
    oncreate() {
        console.log(`A ${this.kind} was created`)
    }
}