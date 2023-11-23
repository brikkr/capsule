import caps from "mithril";

import {
    handleIncomingRedirect,
    getDefaultSession,
    fetch
  } from "@inrupt/solid-client-authn-browser";

import { Bookmark } from "./elements/Bookmark";
import { LoginForm } from "./widgets/LoginForm";

let bookmark = new Bookmark()
//const webID = "https://id.inrupt.com/lapic23"
//const webID = "https://storage.inrupt.com/c471876d-9177-4bbe-84d9-61a1484d499c/profile"
const webID = "https://solid.brikkr.com/Vincent-Plateel/profile/card#me"
const container = "https://solid.brikkr.com/Vincent-Plateel/bookmarks/public"


async function handleRedirectAfterLogin() {
    await handleIncomingRedirect(); // no-op if not part of login redirect
    const session = getDefaultSession();
    if (session.info.isLoggedIn) {
        console.log("Logged:"+session.info.webId)
        let loadedBookmark = await bookmark.load(`${container}#book2`)
       // bookmark.checkAgentAccess(container, webID)
        if(loadedBookmark == null){
            bookmark.setData('label','test')
            let createdBookmark = bookmark.create(container,`book2`)
            if(createdBookmark){
                console.log("Bookmark created")
            }
        }
        
    }
}
  

handleRedirectAfterLogin();

//bookmark.load(`${container}#book2`)


caps.render(document.body, caps(LoginForm));