import caps from "mithril";

import { buildThing, createThing, createSolidDataset } from "@inrupt/solid-client";
import { RDF, FOAF, LDP, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { SOLID } from "@inrupt/vocab-solid";
import { CapsuleElement } from "./CapsuleElement";
let solidDataset = createSolidDataset();

let profile = new CapsuleElement('Solid_WebID_Profile', 'https://solid.github.io/webid-profile/');

const model = {
    type: {
        property : RDF.type,
        propertyType : "URL",
        value: FOAF.Agent,
    },  
    solidIssuer : {
        property : SOLID.oidcIssuer,
        propertyType : "URL",
    },
    inbox : {
        property : LDP.inbox,
        propertyType : "URL",
    },
    storage : {
        property : "http://www.w3.org/ns/pim/space#storage",
        propertyType : "URL",
    },
    preferencesFile : {
        property : "http://www.w3.org/ns/pim/space#preferencesFile",
        propertyType : "URL",
    },  
}

console.log(model)
profile.setModel(model)

console.log(profile.spec)


// Define structure of USER element


// Get element user


caps.render(document.body, "Capsule by Brikkr");