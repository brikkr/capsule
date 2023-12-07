import { CapsuleElement } from "../CapsuleElement";
import { RDF, RDFS, FOAF, LDP, OWL, SCHEMA_INRUPT,DCTERMS } from "@inrupt/vocab-common-rdf";
import { SOLID } from "@inrupt/vocab-solid";

const properties = { 
    title : {
        uri : DCTERMS.title,
        datatype : "StringNoLocale",
    },
    url : {
        uri : SCHEMA_INRUPT.url,
        datatype : "URL",
        required: true,
        default: "https://brikkr.com",
    },
}

export class BookmarkElement extends CapsuleElement{
    constructor() {
        super(properties)
    }
}