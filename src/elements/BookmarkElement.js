import { CapsuleElement } from "../CapsuleElement";
import { RDF, RDFS, FOAF, LDP, OWL, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf";
import { SOLID } from "@inrupt/vocab-solid";

const properties = { 
    title : {
        uri : RDFS.label,
        datatype : "StringNoLocale",
        multiple: true,
    },
    url : {
        uri : RDFS.label,
        datatype : "URL",
    },
}

export class BookmarkElement extends CapsuleElement{
    constructor() {
        super(properties)
    }
}