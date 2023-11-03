import caps from "mithril";

import { buildThing, createThing, createSolidDataset } from "@inrupt/solid-client";
import { RDF, FOAF, LDP, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { SOLID } from "@inrupt/vocab-solid";
import { CapsuleElement } from "./CapsuleElement";
import { SolidWebIProfile } from "./elements/SolidWebIDProfile";
let solidDataset = createSolidDataset();

let profile = new SolidWebIProfile()

console.log(profile.spec)


// Define structure of USER element


// Get element user


caps.render(document.body, "Capsule by Brikkr");