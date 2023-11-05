import { handleIncomingRedirect, login, fetch, getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { getSolidDataset, saveSolidDatasetAt, createSolidDataset, getThingAll, getThing, getUrl, getUrlAll, getBoolean, getBooleanAll, getDate, getDateAll, getDatetime, getDatetimeAll, getStringNoLocale, getStringWithLocale, getStringWithLocaleAll, getStringNoLocaleAll, getStringEnglish, getStringEnglishAll, getInteger, getIntegerAll, getDecimal, getDecimalAll} from "@inrupt/solid-client"
import { RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"

/**
 * @param {name} Name of the element.
 * @param {model} Model of the element.
 * @param {data} Data of the element.
 */

export class CapsuleElement {

    // Constructor
    constructor(name, spec = null) {
        this.name = name
        this.spec = spec
        this.model = {}
        this.data = {}
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
                case 'Integer':
                    if(!Number.isInteger(value)){
                        console.log(`"${propertyName}" property value must be an integer.`)
                        return false
                    }
                    break
                case 'Decimal':
                    if (typeof value === 'number' && !Number.isNaN(value) && !Number.isInteger(value)) {
                        // Need some improvements...
                        
                    }else{
                        console.log(`"${propertyName}" property value must be a decimal.`)
                        return false;
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

    async load(url, fetch = null){
        
        const dataset = await getSolidDataset(
            url
        );
        
        if(fetch){
            const dataset = await getSolidDataset(
                url,
                { fetch : fetch}
            );
        }

        const properties = this.getAllProperties();
        const thing =  getThing(dataset, url)

        for (const propertyName of properties) {
            const propertyInfo = this.getProperty(propertyName)
            if(Array.isArray(propertyInfo['property'])){
                propertyInfo['property'].forEach(element => {
                    this.getSolidData(propertyName, element, thing)
                });
            }else{
                this.getSolidData(propertyName, propertyInfo['property'], thing)
            }
        }
    }

    getSolidData(propertyName, property, thing){
        const propertyInfo = this.getProperty(propertyName)
        let value = null
        switch (propertyInfo['propertyType']) {
            case 'Boolean':    
                if(propertyInfo['unique'])
                value = getBoolean(thing, property)
                else
                value = getBooleanAll(thing, property)
                break
            case 'URL':
                if(propertyInfo['unique'])
                value = getUrl(thing, property)
                else
                value = getUrlAll(thing, property)
                break
            case 'Date':
                if(propertyInfo['unique'])
                value = getDate(thing, property)
                else
                value = getDateAll(thing, property)
                break
            case 'Datetime':
                if(propertyInfo['unique'])
                value = getDatetime(thing, property)
                else
                value = getDatetimeAll(thing, property)
                break
            case 'Integer':
                if(propertyInfo['unique'])
                value = getInteger(thing, property)
                else
                value = getIntegerAll(thing, property)
                break
            case 'Decimal':
                if(propertyInfo['unique'])
                value = getDecimal(thing, property)
                else
                value = getDecimalAll(thing, property)
                break
            case 'StringWithLocale':
                if(propertyInfo['unique'])
                value = getStringWithLocale(thing, property)
                else
                value = getStringWithLocaleAll(thing, property)
                break
            case 'StringNoLocale' :
                if(propertyInfo['unique'])
                value = getStringNoLocale(thing, property)
                else
                value = getStringNoLocaleAll(thing, property)
                break
            case 'StringEnglish' :         
                if(propertyInfo['unique'])
                value = getStringEnglish(thing, property)
                else
                value = getStringEnglishAll(thing, property)
                break
            default:  
        }

        // Check if element has pre save value
        if (propertyInfo['defaultValue']){
            this.data[propertyName] = propertyInfo['defaultValue']
        }else{
            this.data[propertyName] = value
        }
    }


    async save(url){
        const dataset = await getSolidDataset(
            url
        );
        const properties = this.getAllProperties();
        const thing =  getThing(dataset, url)

        for (const propertyName of properties) {
            const propertyInfo = this.getProperty(propertyName)
            if(Array.isArray(propertyInfo['property'])){
                propertyInfo['property'].forEach(element => {
                    this.getSolidData(propertyName, element, thing)
                });
            }else{
                this.getSolidData(propertyName, propertyInfo['property'], thing)
            }
        }
    }
}