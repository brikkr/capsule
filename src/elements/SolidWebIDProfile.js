import { CapsuleElement } from "../CapsuleElement";

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

export class SolidWebIProfile extends CapsuleElement{
    constructor() {
        this.name = "SolidWebIDProfile"
        this.spec = "https://solid.github.io/webid-profile/"
        this.setModel(model)
        this.data = {}
    }


}