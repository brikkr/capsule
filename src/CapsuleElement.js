import { handleIncomingRedirect, login, fetch, getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { universalAccess, getSolidDataset, saveSolidDatasetAt, createSolidDataset, getThingAll,addStringNoLocale, addStringWithLocale, addStringEnglish, getThing, getUrl, getUrlAll, getBoolean, getBooleanAll, getDate, getDateAll, getDatetime, getDatetimeAll, getStringNoLocale, getStringWithLocale, getStringWithLocaleAll, getStringNoLocaleAll, getStringEnglish, getStringEnglishAll, getInteger, getIntegerAll, getDecimal, getDecimalAll, buildThing, setThing, addUrl, createThing, setUrl, setStringNoLocale} from "@inrupt/solid-client"
import { RDF, SCHEMA_INRUPT } from "@inrupt/vocab-common-rdf"

/**
 * @param {name} Name of the element.
 * @param {dataModel} Data model representation of the element.
 * @param {dataValues} Data values of the element.
 * @param {thing} Thing of the element.
 * @param {container} Container of the element.
 */

export class CapsuleElement {

    //
    // Initialization
    //
    constructor(name) {
        this.name = name
        this.resource = null
        this.properties = {}
        this.values = {}
        this.thing = null
    }
    
    //
    // Define all properties with predicates
    //
    setProperties(properties) {
        for (const [property, predicate] of Object.entries(properties)) {
            if (!predicate.hasOwnProperty('uri') || !property.hasOwnProperty('datatype')) {
                throw new Error(`${predicate} predicate is invalid.`)
            }
        }
        this.properties = properties
    }

    //
    // Return available properties
    //
    getProperties(){
        let properties = []
        for (const [property] of Object.entries(this.properties)) {
            properties.push(property)
        }
        return properties
    }

    //
    // Check if property exists
    //
    checkIfPropertyExists(property){
        let properties  = this.getProperties()
        if(properties.includes(property)){
            return true
        }else{
            return false
        }
    }

    //
    // Return predicate from property
    //
    getPredicate(property){
        return this.properties[property]
    }

    //
    // Get all data of element
    //
    getAllData(){
        return this.data
    }

    //
    // Get a specific data of element
    //
    getData(propertyName){
        return this.data[propertyName]
    }

    //
    // Add data of element
    //
    setData(propertyName, value, locale){
        if(locale){  // Check if local code is correct
            try {
                Intl.getCanonicalLocales(locale);
            } catch (err) {
                console.log(err.toString());
            }
        }
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
                case 'StringWithLocale':
                    if (typeof value != "string") {
                        console.log(`"${propertyName}" property value must be a string.`)
                        return false
                    }
                    if (!locale) {
                        console.log(`"${propertyName}" requires local tag.`)
                        return false
                    }
                case 'StringNoLocale' :
                case 'StringEnglish' :         
                    if (typeof value != "string") {
                        console.log(`"${propertyName}" property value must be a string.`)
                        return false
                    }
                    break
                default:
                  console.log(`Sorry, property type "${propertyInfo['propertyType']}" is unknown.`)
            }
            this.data[propertyName] = value
        }
    }

    //
    // Create new element
    //
    async create(resourceUrl, name){
        const session = getDefaultSession()
        let dataset
        try {
            dataset = await getSolidDataset(
                resourceUrl, 
                { ...(session.info.isLoggedIn && {fetch: fetch}) }
              );    
        } catch (error) {
            if (typeof error.statusCode === "number" && error.statusCode === 401) {
                console.error("Your are not authorized")
                return false
            }
            if (typeof error.statusCode === "number" && error.statusCode === 404) {
                dataset = createSolidDataset();
            }
        } 

        this.thing = createThing({ name: name });

        const properties = this.getAllProperties();
        for (const propertyName of properties) {
            const propertyInfo = this.getProperty(propertyName)
            if(Array.isArray(propertyInfo['propertyUrl'])){
                propertyInfo['propertyUrl'].forEach(element => {
                    this.addSolidData(propertyName, element)
                });
            }else{
                this.addSolidData(propertyName, propertyInfo['propertyUrl'])
            }
        }

        dataset = setThing(dataset, this.thing);
        console.log(dataset)

        const savedSolidDataset = await saveSolidDatasetAt(
            resourceUrl,
            dataset,
            { ...(session.info.isLoggedIn && {fetch: fetch}) }
        );


    }

    //
    // Load data from ressource url
    //
    async load(resourceUrl){
        const session = getDefaultSession();
        try {
            const dataset = await getSolidDataset(
              resourceUrl, 
              { ...(session.info.isLoggedIn && {fetch: fetch}) }
            );
            // Get thing (= dataset) from ressource url
            this.thing =  getThing(dataset, resourceUrl)
            // Get all model properties
            const properties = this.getAllProperties();
            for (const propertyName of properties) {
                const property = this.getProperty(propertyName)
                // Check if property has multi URLs
                if(Array.isArray(property['propertyUrl'])){
                    property['propertyUrl'].forEach(url => {
                        this.getSolidData(propertyName, url)
                    });
                }else{
                    this.getSolidData(propertyName, property['propertyUrl'])
                }
            }
        } catch (error) {
            if (typeof error.statusCode === "number" && error.statusCode === 404) {
                console.error("Ressource not found")
                return null
            }
            if (typeof error.statusCode === "number" && error.statusCode === 401) {
                console.error("Not authorized to load this resource.")
                return false
            }
        } 
    }
    
    //
    // Check public access
    //
    checkPublicAccess(resourceUrl){
        universalAccess.getPublicAccess(
            resourceUrl,   // Resource
            { fetch: fetch }                  // fetch function from authenticated session
          ).then((returnedAccess) => {
            if (returnedAccess === null) {
              console.log("Could not load access details for this Resource.");
            } else {
              console.log("Returned Public Access:: ", JSON.stringify(returnedAccess));
            }
          });
    }

    //
    // Check agent access
    //
    checkAgentAccess(resourceUrl, webId){
        universalAccess.getAgentAccess(
            resourceUrl,      
            webId,   // agent
            { fetch: fetch }                      // fetch function from authenticated session
          ).then((returnedAccess) => {
            if (returnedAccess === null) {
                console.log("Could not load access details for this Resource.");
              } else {
                console.log("Returned Agent Access:: ", JSON.stringify(returnedAccess));
              }
          });
    }

    //
    // Extract data from Solid dataset
    //
    getSolidData(propertyName, propertyUrl){
        const propertyInfo = this.getProperty(propertyName)
        let value = null
        switch (propertyInfo['propertyType']) {
            case 'Boolean':    
                if(propertyInfo['unique'])
                value = getBoolean(this.thing, propertyUrl)
                else
                value = getBooleanAll(this.thing, propertyUrl)
                break
            case 'URL':
                if(propertyInfo['unique'])
                value = getUrl(this.thing, propertyUrl)
                else
                value = getUrlAll(this.thing, propertyUrl)
                break
            case 'Date':
                if(propertyInfo['unique'])
                value = getDate(this.thing, propertyUrl)
                else
                value = getDateAll(this.thing, propertyUrl)
                break
            case 'Datetime':
                if(propertyInfo['unique'])
                value = getDatetime(this.thing, propertyUrl)
                else
                value = getDatetimeAll(this.thing, propertyUrl)
                break
            case 'Integer':
                if(propertyInfo['unique'])
                value = getInteger(this.thing, propertyUrl)
                else
                value = getIntegerAll(this.thing, propertyUrl)
                break
            case 'Decimal':
                if(propertyInfo['unique'])
                value = getDecimal(this.thing, propertyUrl)
                else
                value = getDecimalAll(this.thing, propertyUrl)
                break
            case 'StringWithLocale':
                if(propertyInfo['unique'])
                value = getStringWithLocale(this.thing, propertyUrl)
                else
                value = getStringWithLocaleAll(this.thing, propertyUrl)
                break
            case 'StringNoLocale' :
                if(propertyInfo['unique'])
                value = getStringNoLocale(this.thing, propertyUrl)
                else
                value = getStringNoLocaleAll(this.thing, propertyUrl)
                break
            case 'StringEnglish' :         
                if(propertyInfo['unique'])
                value = getStringEnglish(this.thing, propertyUrl)
                else
                value = getStringEnglishAll(this.thing, propertyUrl)
                break
            default:  
        }
        this.data[propertyName] = value
    }

    //
    // Save data to ressource 
    //
    async save(resourceUrl, name){
        const session = getDefaultSession();
        try {
            const dataset = await getSolidDataset(
              resourceUrl, 
              { ...(session.info.isLoggedIn && {fetch: fetch}) }
            );
            
            this.thing = getThing(dataset,  `${resourceUrl}#${name}`)

            const properties = this.getAllProperties();
            for (const propertyName of properties) {
                const propertyInfo = this.getProperty(propertyName)
                if(Array.isArray(propertyInfo['propertyUrl'])){
                    propertyInfo['propertyUrl'].forEach(element => {
                        this.setSolidData(propertyName, element)
                    });
                }else{
                    this.setSolidData(propertyName, propertyInfo['propertyUrl'])
                }
            }

            console.log(this.thing)

            dataset = setThing(dataset, this.thing)

            try{
                const savedSolidDataset = await saveSolidDatasetAt(
                    resourceUrl+'#'+name,
                    dataset,
                    { ...(session.info.isLoggedIn && {fetch: fetch}) }
                );
            }catch(error){
                console.error('Oups:'+error.message);
            }
            
        }catch(error){
            if (typeof error.statusCode === "number" && error.statusCode === 404) {
                const dataset = createSolidDataset();
                const properties = this.getAllProperties();
               
                for (const propertyName of properties) {
                    const propertyInfo = this.getProperty(propertyName)
                    if(Array.isArray(propertyInfo['propertyUrl'])){
                        propertyInfo['propertyUrl'].forEach(element => {
                            this.addSolidData(propertyName, element)
                        });
                    }else{
                        this.addSolidData(propertyName, propertyInfo['propertyUrl'])
                    }
                }

                console.log("I must")

                try{
                    const savedSolidDataset = await saveSolidDatasetAt(
                        resourceUrl+'#'+name,
                        dataset,
                        { ...(session.info.isLoggedIn && {fetch: fetch}) }
                    );
                }catch(error){
                    console.error('Oups:'+error.message);
                }
            } else {
                console.error(error.message);
            }
        }
    }

    //
    // Set data to Solid dataset
    //
    setSolidData(propertyName, property){
        const propertyInfo = this.getProperty(propertyName)
        if(this.data[propertyName] && !propertyInfo['readOnly'] && this.data[propertyName] && this.data[propertyName].length !== 0){
            switch (propertyInfo['propertyType']) {
                case 'Boolean':    
                    break
                case 'URL':   
                    if(Array.isArray(this.data[propertyName])){
                        for (const value of this.data[propertyName]) {
                            this.thing = setUrl(this.thing, property, value)
                        }
                    }   
                    else{
                        this.thing = setUrl(this.thing, property, this.data[propertyName])
                    }
                    break
                case 'Date':
                    this.thing = buildThing(this.thing).addDate(property, this.data[propertyName])
                    break
                case 'Datetime':
                    this.thing = buildThing(this.thing).addDatetime(property, this.data[propertyName])
                    break
                case 'Integer':
                    this.thing = buildThing(this.thing).addInteger(property, this.data[propertyName])
                    break
                case 'Decimal':
                    this.thing = buildThing(this.thing).addDecimal(property, this.data[propertyName])
                    break
                case 'StringWithLocale':
                    this.thing = buildThing(this.thing).addStringWithLocale(property, this.data[propertyName])
                    break
                case 'StringNoLocale' :
                    this.thing = setStringNoLocale(this.thing, property, this.data[propertyName])
                    break
                case 'StringEnglish' :         
                    this.thing = buildThing(this.thing).addStringEnglish(property, this.data[propertyName])
                    break
                default:  
            }  
        }
        /*
         // Check if element has pre save value
         if (propertyInfo['defaultValue']){
            this.data[propertyName] = propertyInfo['defaultValue']
        }else{
            this.data[propertyName] = value
        }
        */
    }
    
    //
    // Add data to Solid dataset
    //
    addSolidData(propertyName, property){
        const propertyInfo = this.getProperty(propertyName)
        
        if(this.data[propertyName] && !propertyInfo['readOnly'] && this.data[propertyName] && this.data[propertyName].length !== 0){
        
            switch (propertyInfo['propertyType']) {
                case 'Boolean':    
                    break
                case 'URL':   
                    if(Array.isArray(this.data[propertyName])){
                        for (const value of this.data[propertyName]) {
                            this.thing = addUrl(this.thing, property, value)
                        }
                    }   
                    else{
                        this.thing = addUrl(this.thing, property, this.data[propertyName])
                    }
                    break
                case 'Date':
                    this.thing = addDate(this.thing, property, this.data[propertyName])
                    break
                case 'Datetime':
                    this.thing = addDatetime(this.thing, property, this.data[propertyName])
                    break
                case 'Integer':
                    this.thing = addInteger(this.thing, property, this.data[propertyName])
                    break
                case 'Decimal':
                    this.thing = addDecimal(this.thing, property, this.data[propertyName])
                    break
                case 'StringWithLocale':
                    this.thing = addStringWithLocale(this.thing, property, this.data[propertyName])
                    break
                case 'StringNoLocale' :
                    this.thing = addStringNoLocale(this.thing, property, this.data[propertyName])
                    break
                case 'StringEnglish' :         
                    this.thing = addStringEnglish(this.thing, property, this.data[propertyName])
                    break
                default:  
            }  
        }
    }
}