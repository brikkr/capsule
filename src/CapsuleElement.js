import { fetch, getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { getSolidDataset, saveSolidDatasetAt, createSolidDataset, addStringNoLocale, addStringWithLocale, getThing, getUrl, getUrlAll, getBoolean, getBooleanAll, getDate, getDateAll, getDatetime, getDatetimeAll, getStringNoLocale, getStringWithLocale, getStringWithLocaleAll, getStringNoLocaleAll, getStringEnglish, getStringEnglishAll, getInteger, getIntegerAll, getDecimal, getDecimalAll, buildThing, setThing, addUrl, createThing, setUrl, setStringNoLocale, setBoolean, setDate, setDatetime, setInteger, setDecimal, setStringWithLocale, addBoolean, addDate, addDatetime, addDecimal, addInteger} from "@inrupt/solid-client"


/** Class representing a CapsuleElement. */

export class CapsuleElement {

    #container
    #properties
    #dataset
    #thing
    #url

    /**
     * Create a CapsuleElement.
     * @param {object} properties - The properties definition of the element.
     * @param {string} container - The container name of the element.
     */
    constructor(container, properties) {
        this.#container = container
        this.#properties = properties
        this.#dataset = createSolidDataset()
    }

   /**
     * List all properties of the element.
     * @return {Array} list of properties.
     */
    getProperties(){
        let properties = []
        for (const [property] of Object.entries(this.#properties)) {
            properties.push(property)
        }
        return properties
    }

    /**
     * Get predicate of a property.
     * @param {string} property - The property name of the element.
     * @return {object} property's predicate or null if property is not defined.
     */
    #getPredicate(property){
        return this.#properties[property]
    }

    /**
     *  Fetch element
     * @param {string} url - The url of the element.
     * @return {boolean} true if success false if anything else.
    */
    async fetch(url){
        const dataset = await this.getDataset(url)
        if(dataset){
            this.#dataset = dataset
            const thing = getThing(this.#dataset, url)
            if(thing){
                this.#url = url
                this.#thing = thing
                return true
            }else{
                return false
            }
        }
    }

    /**
     *  Create empty element at url
     * @param {string} url - The url of the element.
    */
    create(url){
        this.#thing = createThing({url:url})
        this.#url = url
    }


    /**
     *  Save element
     * @param {string} url - The url of the element.
     * @return {boolean} true if success false if anything else.
    */
    async save(){
        const session = getDefaultSession();
        try {
            this.#dataset = setThing(this.#dataset, this.#thing)
            await saveSolidDatasetAt(
              this.#url,
              this.#dataset,
              { ...(session.info.isLoggedIn && {fetch: fetch}) }
            );
            return true
        } catch (error) {
            return false
        } 
    }

    /**
     *  Get the SolidDataset from element url
     * @param {string} url - The url of the element.
     * @return {dataset} solid dataset of the element.
    */
    async getDataset(url){
        const session = getDefaultSession();
        try {
            const dataset = await getSolidDataset(
              url, 
              { ...(session.info.isLoggedIn && {fetch: fetch}) }
            )
            return dataset
        } catch (error) {
            return false
        } 
    }
   
    /**
     * Set value of a property.
     * @param {string} property - The property name of the element.
     * @param{(Array|string|boolean|number)} property's value of the element.
     * @param {string} locale - The locale of string (optional).
     * @return {boolean} true if success false if anything else.
     */
    setValue(property, value, locale){
        if (this.#checkIfPropertyExists(property) ){
            this.#addValueToThing(property, value, locale)
        }else{
            return false
        }
    }

    /**
     * Get value of a property.
     * @param {string} property - The property name of the element.
     * @param {string} locale - The locale of string (optional).
     * @return {(Array|string|boolean|number)} property's value of the element or null if property or value is not defined.
     */
    getValue(property, locale){
        const predicate = this.#getPredicate(property)
        if(predicate.hasOwnProperty('datatype') &&  predicate.hasOwnProperty('uri')){
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
                    try {
                        Intl.getCanonicalLocales(locale);
                    } catch (err) {
                        return null
                    }
                    if(!predicate['multiple'])
                        return getStringWithLocale(this.thing, predicate['uri'], locale)
                    else
                        return getStringWithLocaleAll(this.thing, predicate['uri'], locale)
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
        }else{
            return null
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
    setValue(property, value, locale){
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