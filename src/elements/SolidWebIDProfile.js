import { CapsuleElement } from "../CapsuleElement";
import { RDF, RDFS, FOAF, LDP, OWL, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { SOLID } from "@inrupt/vocab-solid";


const model = {
    type: {
        propertyUrl : RDF.type,
        propertyType : "URL",
        defaultValue: FOAF.Agent,
        readOnly: true
    },  
    solidIssuer : {
        propertyUrl : SOLID.oidcIssuer,
        propertyType : "URL",
        unique: true,
        readOnly: true
    },
    inbox : {
        propertyUrl : LDP.inbox,
        propertyType : "URL",
        unique: true
    },
    storage : {
        propertyUrl : "http://www.w3.org/ns/pim/space#storage",
        propertyType : "URL",
    },
    preferencesFile : {
        propertyUrl : "http://www.w3.org/ns/pim/space#preferencesFile",
        propertyType : "URL",
        unique: true
    },
    seeAlso : {
        propertyUrl : [RDFS.seeAlso, OWL.sameAs, FOAF.isPrimaryTopicOf],
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