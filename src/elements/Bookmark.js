import { CapsuleElement } from "../CapsuleElement";
import { RDF, RDFS, FOAF, LDP, OWL, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { SOLID } from "@inrupt/vocab-solid";

const properties = {
    type: {
        uri : RDF.type,
        datatype : "URL",
        default: FOAF.Agent
    },  
    label : {
        uri : RDFS.label,
        datatype : "StringNoLocale",
        multiple: true,
    },
}

export class Bookmark extends CapsuleElement{
    constructor() {
        super(properties)
    }
}