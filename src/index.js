import capsuleUI from "mithril";

import {
    handleIncomingRedirect,
    getDefaultSession,
    fetch
  } from "@inrupt/solid-client-authn-browser";

import {
    WebsocketNotification,
} from "@inrupt/solid-client-notifications";

import { BookmarkElement } from "./elements/BookmarkElement";
import { LoginForm } from "./widgets/LoginForm";
import { CapsuleSet } from "./CapsuleSet";

//let bookmark = new Bookmark('https://solid.brikkr.com/Vincent-Plateel/bookmarks/public#book2')
//bookmark.setValue("label", "test")
//console.log(bookmark.resourceUrl)
//const webID = "https://id.inrupt.com/lapic23"
//const webID = "https://storage.inrupt.com/c471876d-9177-4bbe-84d9-61a1484d499c/profile"
//const webID = "https://solid.brikkr.com/Vincent-Plateel/profile/card#me"
//const container = "https://solid.brikkr.com/Vincent-Plateel/bookmarks/public"

async function handleRedirectAfterLogin() {
    await handleIncomingRedirect(); // no-op if not part of login redirect
    const session = getDefaultSession();
    
    if(session.info.isLoggedIn) {
        let dataset = new CapsuleSet()
        await dataset.fetch("https://storage.inrupt.com/c471876d-9177-4bbe-84d9-61a1484d499c/favorites/test")
        let elements = dataset.getAllElements()
        elements.forEach(async (element) => {
            console.log(element)
            let bookmark = new BookmarkElement()
            bookmark.find(dataset, element.url)
        });
    }
}
  

handleRedirectAfterLogin();


capsuleUI.render(document.body, capsuleUI(LoginForm));