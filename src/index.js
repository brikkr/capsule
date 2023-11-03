import caps from "mithril";

import { buildThing, createThing, createSolidDataset } from "@inrupt/solid-client";
import { RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";

import { CapsuleElement } from "./CapsuleElement";
let solidDataset = createSolidDataset();

let person = new CapsuleElement('Person');

const model = {
    type: {
        property : RDF.type,
        propertyType : "URL",
        value: SCHEMA_INRUPT.Person,
    },  
    firstname: {
        property : SCHEMA_INRUPT.givenName,
        propertyType : "StringNoLocale"
    },
    lastname :{
        property: SCHEMA_INRUPT.familyName,
        propertyType : "StringNoLocale"
    },
    available :{
        property: SCHEMA_INRUPT.address,
        propertyType : "Date"
    }
}
person.setModel(model)

// person.saveSolidDataset(url)
// person.loadSolidDataset(url)


person.setData('firstname',  new Date())
person.setData('lastname', 'Plateel')
person.setData('available', new Date())
console.log(person.getData('firstname'))


// Define structure of USER element

const me = buildThing(createThing({ name: "user"}))
  .addUrl(RDF.type, SCHEMA_INRUPT.Person)
  .addStringNoLocale(SCHEMA_INRUPT.givenName, undefined)
  .addStringNoLocale(SCHEMA_INRUPT.familyName, undefined)
  .build();

//console.log(solidDataset);



// Get element user


caps.render(document.body, "Capsule by Brikkr");