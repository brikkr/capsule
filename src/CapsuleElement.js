import { fetch, getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { getSolidDataset, saveSolidDatasetAt, createSolidDataset, addStringNoLocale, addStringWithLocale, getThing, getUrl, getUrlAll, getBoolean, getBooleanAll, getDate, getDateAll, getDatetime, getDatetimeAll, getStringNoLocale, getStringWithLocale, getStringWithLocaleAll, getStringNoLocaleAll, getStringEnglish, getStringEnglishAll, getInteger, getIntegerAll, getDecimal, getDecimalAll, buildThing, setThing, addUrl, createThing, setUrl, setStringNoLocale, setBoolean, setDate, setDatetime, setInteger, setDecimal, setStringWithLocale, addBoolean, addDate, addDatetime, addDecimal, addInteger} from "@inrupt/solid-client"

/**
 * @param {properties} Data model representation of the element.
 * @param {thingName} Thing name of the element.
 * @param {thing} Solid Thing.
 * @param {datasetUrl} URL of the element.
 * @param {dataset} Owner Solid Dataset of the element.
 */

export class CapsuleElement {

    //
    // Initialization
    //
    constructor(properties) {
        this.properties = this.#setProperties(properties)
        this.solidDatasetUrl = null
        this.solidDataset = createSolidDataset()
        this.thingName = this.#createUniqueName()
        this.thing = createThing({ name: this.thingName })
        this.defaultContainer = this.constructor.name.toLowerCase()
    }

    // Generate an unique element name
    #createUniqueName(){
        return this.constructor.name + Date.now()
    }

    //
    // Define properties with predicates of element
    //
    #setProperties(properties) {
        for (const [property, predicate] of Object.entries(properties)) {
            if (!predicate.hasOwnProperty('uri') || !predicate.hasOwnProperty('datatype')) {
                throw new Error(`The ${property}'s property is not valid in ${this.constructor.name} element definition.`)
            }
        }
        return properties
    }

    //
    // Return predicate from property
    //
    #getPredicate(property){
        return this.properties[property]
    }

    //
    // Return the list of properties
    //
    getProperties(){
        let properties = []
        for (const [property] of Object.entries(this.properties)) {
            properties.push(property)
        }
        return properties
    }

    //
    // Fetch thing in SolidDataset
    //
    async fetch(thingUrl){
        const dataset = await this.loadSolidDatasetAt(thingUrl)
        if(dataset){
            const thing = getThing(this.solidDataset, thingUrl)
            if(thing)
                this.thing = thing
        }
    }

    //
    // Update thing in SolidDataset
    //
    async update(){
        const session = getDefaultSession();
        try {
            this.solidDataset = setThing(this.solidDataset, this.thing)
            await saveSolidDatasetAt(
              this.solidDatasetUrl,
              this.solidDataset,
              { ...(session.info.isLoggedIn && {fetch: fetch}) }
            );
            return true
        } catch (error) {
            if (typeof error.statusCode === "number" && error.statusCode === 404) {
                console.error("Ressource not found")
                return null
            }
            if (typeof error.statusCode === "number" && error.statusCode === 401) {
                console.error("Not authorized to append this dataset.")
                return false
            }
        } 
    }

    //
    // Create new thing in SolidDataset
    //
    async create(solidDatasetUrl){
        if(!solidDatasetUrl){
            console.log('A SolidDataset URL is required.')
            return false
        }
        try {
            const session = getDefaultSession();
            await this.loadSolidDatasetAt(solidDatasetUrl)
            this.setDefaultValues()
            this.solidDataset = setThing(this.solidDataset, this.thing)
            await saveSolidDatasetAt(
              solidDatasetUrl,
              this.solidDataset,
              { ...(session.info.isLoggedIn && {fetch: fetch}) }
            );
            return true
        } catch (error) {
            console.log(error)
            if (typeof error.statusCode === "number" && error.statusCode === 401) {
                console.error("Not authorized to append/write in SolidDataset.")
                return false
            }
        } 
    }

    //
    // Create new thing in specific Webid
    //
    async createInWebId(webID){
        
    }

    
    //
    // Load SolidDataset at specific url
    //
    async loadSolidDatasetAt(url){
        const session = getDefaultSession();
        try {
            this.solidDataset = await getSolidDataset(
              url, 
              { ...(session.info.isLoggedIn && {fetch: fetch}) }
            );
            this.solidDatasetUrl = url
            return true
        } catch (error) {
            if (typeof error.statusCode === "number" && error.statusCode === 404) {
                this.solidDataset  =  createSolidDataset()
                this.solidDatasetUrl = url
                return true
            }
            if (typeof error.statusCode === "number" && error.statusCode === 401) {
                console.error("Not authorized to read this dataset.")
                return false
            }
        } 
    }


    //
    // Return value for a specific property
    //
    getValue(property){
        if (this.#checkIfPropertyExists(property)){
            return this.getValueFromThing(property)
        }else{
            return false
        }
    }

    //
    // Check if property exists
    //
    #checkIfPropertyExists(property){
        let properties  = this.getProperties()
        if(properties.includes(property)){
            return true
        }else{
            return false
        }
    }

    //
    // Set a property value
    //
    set(property, value, locale){
        if (this.#checkIfPropertyExists(property) ){
            this.#addValueToThing(property, value, locale)
        }else{
            return false
        }
    }

    //
    // Set default values
    //
    setDefaultValues(){
        for (const [property] of Object.entries(this.properties)) {
            const predicate = this.#getPredicate(property)
            if(predicate['default']){
                this.set(property, predicate['default'])
            }
        }
    }

    //
    // Check if value is valid
    //
    #checkIfValueIsValid(property, value, locale){
        const predicate = this.#getPredicate(property)
        switch (predicate['datatype']) {
            case 'Boolean':
                if (typeof value != "boolean") {
                    console.log(`"${property}" property value must be a boolean.`)
                    return false
                }
                break
            case 'URL':
                try {
                    new URL(value)
                } catch (err) {
                    console.log(`"${property}" property value must be an URL.`)
                    return false
                }
                break
            case 'Date':
            case 'Datetime':
                if (value instanceof Date && !isNaN(value)) {
                    
                }else{
                    console.log(`"${property}" property value must be a valid Date.`)
                    return false
                }
                break
            case 'Integer':
                if(!Number.isInteger(value)){
                    console.log(`"${property}" property value must be an integer.`)
                    return false
                }
                break
            case 'Decimal':
                if (typeof value === 'number' && !Number.isNaN(value) && !Number.isInteger(value)) {
                    // Need some improvements...
                }else{
                    console.log(`"${property}" property value must be a decimal.`)
                    return false;
                }
                break
            case 'StringWithLocale':
                if(locale){  // Check if local code is correct
                    try {
                        Intl.getCanonicalLocales(locale);
                    } catch (err) {
                        console.log(err.toString());
                        return false
                    }
                }else{
                    console.log(`"${property}" requires local tag.`)
                    return false
                }
                if (typeof value != "string") {
                    console.log(`"${property}" property value must be a string.`)
                    return false
                }
            case 'StringNoLocale' :
            case 'StringEnglish' :         
                if (typeof value != "string") {
                    console.log(`"${property}" property value must be a string.`)
                    return false
                }
                break
            default:
                console.log(`Sorry, property type "${predicate['datatype']}" is unknown.`)
                return false
        }
        return true
    }

    //
    // Return data value from Thing
    //
    getValueFromThing(property){
        const predicate = this.#getPredicate(property)
        switch (predicate['datatype']) {
            case 'Boolean':    
                if(!predicate['multiple'])
                    return getBoolean(this.thing, predicate['uri'])
                else
                    return getBooleanAll(this.thing, predicate['uri'])
            case 'URL':
                if(!predicate['multiple'])
                    return getUrl(this.thing, predicate['uri'])
                else
                    return getUrlAll(this.thing, predicate['uri'])
            case 'Date':
                if(!predicate['multiple'])
                    return getDate(this.thing, predicate['uri'])
                else
                    return getDateAll(this.thing, predicate['uri'])
            case 'Datetime':
                if(!predicate['multiple'])
                    return getDatetime(this.thing, predicate['uri'])
                else
                    return getDatetimeAll(this.thing, predicate['uri'])
            case 'Integer':
                if(!predicate['multiple'])
                    return getInteger(this.thing, predicate['uri'])
                else
                    return getIntegerAll(this.thing, predicate['uri'])
            case 'Decimal':
                if(!predicate['multiple'])
                    return getDecimal(this.thing, predicate['uri'])
                else
                    return getDecimalAll(this.thing, predicate['uri'])
            case 'StringWithLocale':
                if(!predicate['multiple'])
                    return getStringWithLocale(this.thing, predicate['uri'])
                else
                    return getStringWithLocaleAll(this.thing, predicate['uri'])
            case 'StringNoLocale' :
                if(!predicate['multiple'])
                    return getStringNoLocale(this.thing, predicate['uri'])
                else
                    return getStringNoLocaleAll(this.thing, predicate['uri'])
            case 'StringEnglish' :         
                if(!predicate['multiple'])
                    return getStringEnglish(this.thing, predicate['uri'])
                else
                    return getStringEnglishAll(this.thing, predicate['uri'])
            default:  
                return null
        }
    }

    //
    // Add data value to Thing
    //
    #addValueToThing(property, value, locale){
        const predicate = this.#getPredicate(property)
        if(Array.isArray(value) && predicate['multiple']){
            for (const el of value ) {
                this.#setValueToThing(property, el, locale)
            }
        }else{
            this.#setValueToThing(property, value, locale)
        }
    }

    //
    // Set data to Thing
    //
    #setValueToThing(property, value, locale){
        const predicate = this.#getPredicate(property)
        if(this.#checkIfValueIsValid(property, value, locale)&& !predicate['value']){
            switch (predicate['datatype']) {
                case 'Boolean':
                    if(!predicate['multiple'])  
                        this.thing = setBoolean(this.thing, predicate['uri'], value)
                    else
                        this.thing = addBoolean(this.thing, predicate['uri'], value)
                    break
                case 'URL':
                    if(!predicate['multiple'])    
                        this.thing = setUrl(this.thing, predicate['uri'], value)
                    else
                        this.thing = addUrl(this.thing, predicate['uri'], value)
                    break
                case 'Date':
                    if(!predicate['multiple'])  
                        this.thing = setDate(this.thing, predicate['uri'], value)
                    else
                        this.thing =  addDate(this.thing, predicate['uri'], value)             
                    break
                case 'Datetime':
                    if(!predicate['multiple'])  
                        this.thing = setDatetime(this.thing, predicate['uri'], value)
                    else
                        this.thing =  addDatetime(this.thing, predicate['uri'], value)                 
                    break
                case 'Integer':
                    if(!predicate['multiple'])  
                        this.thing = setInteger(this.thing, predicate['uri'], value)
                    else
                        this.thing = addInteger(this.thing, predicate['uri'], value)  
                    break
                case 'Decimal':
                    if(!predicate['multiple']) 
                        this.thing = setDecimal(this.thing, predicate['uri'], value)
                    else
                        this.thing = addDecimal(this.thing, predicate['uri'], value)     
                    break
                case 'StringWithLocale':
                    if(!predicate['multiple']) 
                        this.thing = setStringWithLocale(this.thing, predicate['uri'], value, locale)
                    else
                        this.thing = addStringWithLocale(this.thing, predicate['uri'], value, locale)  
                    break
                case 'StringNoLocale' :
                    if(!predicate['multiple']) 
                        this.thing = setStringNoLocale(this.thing, predicate['uri'], value)
                    else
                        this.thing = addStringNoLocale(this.thing, predicate['uri'], value)
                    break
                case 'StringEnglish' :
                    if(!predicate['multiple']) 
                        this.thing = setWithLocale(this.thing, predicate['uri'], value, "en")
                    else
                        this.thing = addStringWithLocale(this.thing, predicate['uri'], value, "en")                
                    break
                default:  
            }  
        }
    }
}