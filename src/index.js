import caps from "mithril";

import { buildThing, createThing, createSolidDataset } from "@inrupt/solid-client";

import { SolidWebIDProfile } from "./elements/SolidWebIDProfile";
import { LoginButton } from "./widgets/LoginButton";
let solidDataset = createSolidDataset();

let profile = new SolidWebIDProfile()
const webID = "https://id.inrupt.com/lapic23"
//const webID = "https://solid.brikkr.com/vincent-plateel/profile/card#me"
await profile.load(webID)
console.log(profile.data)


caps.render(document.body, caps(LoginButton));