import caps from "mithril";

import {
    handleIncomingRedirect,
    getDefaultSession,
    fetch
  } from "@inrupt/solid-client-authn-browser";

import { BookmarkElement } from "./elements/BookmarkElement";
import { LoginForm } from "./widgets/LoginForm";

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
    if (session.info.isLoggedIn) {
        let bookmark = new BookmarkElement()
        //await bookmark.fetch('https://solid.brikkr.com/Vincent-Plateel/bookmarks/personal#1701031823769')
      //  bookmark.set('label', 'NUCLEAR')
        bookmark.set('label', ['DANGER', 'test', "youpi"])
        // console.log(bookmark.dataset)
        await bookmark.create('https://solid.brikkr.com/Vincent-Plateel/bookmarks/personal')
       // await bookmark.update()
       console.log(bookmark.getValue('label'))
    }
}
  

handleRedirectAfterLogin();

//bookmark.load(`${container}#book2`)


caps.render(document.body, caps(LoginForm));