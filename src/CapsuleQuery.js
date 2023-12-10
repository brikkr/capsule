/** Class representing a CapsuleQuery. */

export class CapsuleQuery {
    
    /**
     * Create a CapsuleQuery.
     * @param {Object} element - A CapsuleElement class.
     * @param {String} url - The url of SolidDataset.
     */
        constructor(element) {
            this.#element = element
            this.#dataset = createSolidDataset()
        }

}