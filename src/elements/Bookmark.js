import { CapsuleElement } from "../CapsuleElement";
import { RDF, RDFS, FOAF, LDP, OWL, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { SOLID } from "@inrupt/vocab-solid";

const model = {
    type: {
        propertyUrl : RDF.type,
        propertyType : "URL",
    },  
    label : {
        propertyUrl : RDFS.label,
        propertyType : "StringNoLocale",
        unique: true,
    },
}

export class Bookmark extends CapsuleElement{
    constructor() {
        super()
        this.name = "bookmark"
        this.setModel(model)
        this.data = {}
    }
}