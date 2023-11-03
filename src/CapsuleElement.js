import { handleIncomingRedirect, login, fetch, getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { getSolidDataset, saveSolidDatasetAt, createSolidDataset } from "@inrupt/solid-client"
import { RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"

/**
 * @param {name} Name of the element.
 * @param {data} Data of the element.
 * @param {model} Model of the element.
 */

export class CapsuleElement {

    // Constructor
    constructor(name) {
        this.name = name
        this.data = {}
        this.model = {}
    }

    // Set model of element
    setModel(model) {
        for (const [propertyName, details] of Object.entries(model)) {
            //Check if model is valid
            if (!details.hasOwnProperty('property')){
                throw new Error(`${this.name} model is invalid, any property attribute have found for "${propertyName}".`)
            }
        }
        this.model = model
    }

    // Get properties of element
    getAllProperties(){
        let properties = []
        for (const [propertyName] of Object.entries(this.model)) {
            properties.push(propertyName)
        }
        return properties
    }

    // Get a specific property of element
    getProperty(propertyName){
        return this.model[propertyName]
    }

    // Get all data of element
    getAllData(){
        return this.data
    }

    // Get a specific data of element
    getData(propertyName){
        return this.data[propertyName]
    }

    // Add data of element
    setData(propertyName, value, locale){
        //Check if propertyName exists
        if (!this.model.hasOwnProperty(propertyName)){
            throw new Error(`The property "${propertyName}" doesn\'t exist in ${this.name} element.`)
        }else{
            // Check if propertyType is correct
            const propertyInfo = this.getProperty(propertyName)
            switch (propertyInfo['propertyType']) {
                case 'Boolean':
                    if (typeof value != "boolean") {
                        console.log(`"${propertyName}" property value must be a boolean.`)
                        return false
                    }
                    break
                case 'URL':
                    try {
                        new URL(value)
                    } catch (err) {
                        console.log(`"${propertyName}" property value must be an URL.`)
                        return false
                    }
                    break
                case 'Date':
                case 'Datetime':
                    if (value instanceof Date && !isNaN(value)) {
                        
                    }else{
                        console.log(`"${propertyName}" property value must be a valid Date.`)
                        return false
                    }
                    break
                // Time type not implemented //
                case 'StringWithLocale':
                case 'StringNoLocale' :
                case 'StringEnglish' :         
                    if (typeof value != "string") {
                        console.log(`"${propertyName}" property value must be a string.`)
                        return false
                    }
                    // Check if Locale exists and valid must be implemented //
                    break
                default:
                  console.log(`Sorry, property type "${propertyInfo['propertyType']}" is unknown.`)
              }
            this.data[propertyName] = value
        }
    }

    static buildSolidDataset(){
        let newSolidDataset = createSolidDataset()
        return newSolidDataset
    }

    save(url){
        const me = buildThing(createThing({ name: "user"}))
        .addUrl(RDF.type, SCHEMA_INRUPT.Person)
        .addStringNoLocale(SCHEMA_INRUPT.givenName, undefined)
        .addStringNoLocale(SCHEMA_INRUPT.familyName, undefined)
        .build()
    }

    load(){

    }

    remove(){

    }

    // 
    async loadFrom(url){
        // Check access rules (public, private,...)
        

        // Fetch Solid Dataset from URL

        // Return element data
    }

   

    
}