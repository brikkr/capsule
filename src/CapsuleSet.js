import { fetch, getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { getSolidDataset, createSolidDataset, getThingAll} from "@inrupt/solid-client"
import {
    WebsocketNotification,
} from "@inrupt/solid-client-notifications";

/** Class representing a CapsuleSet. */

export class CapsuleSet {

    #dataset
    #url

    /**
     * Create a CapsuleSet.
     */
    constructor() {
        this.#dataset = createSolidDataset()
    }

    /**
     * Fetch dataset
     * @param {String} url - The url of the element.
     * @return {Boolean} true if success false if anything else.
    */
    async fetch(url){
        const dataset = await this.getDataset(url)
        this.#url = url
        if(dataset){
            this.#dataset = dataset
            this.#subscribeToNotifications()
        }
    }

    /**
     * Get the SolidDataset from url
     * @param {String} url - The url of dataset.
     * @return {dataset} solid dataset.
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
     * Subscribe at datasett
    */
    #subscribeToNotifications(){
        const session = getDefaultSession()
        const websocket = new WebsocketNotification(
            this.#url,
            { ...(session.info.isLoggedIn && {fetch: fetch}) }
          );
        websocket.on("message", (message) => { console.log(message) })
        websocket.on("error", () => { websocket.connect()
        });
        websocket.connect();
    }

    /**
     * Get all elements
     * @return {Array} list of elements.
     */
    getAllElements(){
        let elements = getThingAll(this.#dataset);
        return elements
    }
    

}
