import { CapsuleElement } from "../CapsuleElement";
import { RDF, RDFS, FOAF, LDP, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { SOLID } from "@inrupt/vocab-solid";


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
    seeAlso : {
        property : RDFS.seeAlso,
        propertyType : "URL",
    },   
}

export class SolidWebIDProfile extends CapsuleElement{
    constructor() {
        super()
        this.name = "SolidWebIDProfile"
        this.spec = "https://solid.github.io/webid-profile/"
        this.setModel(model)
        this.data = {}
    }


}