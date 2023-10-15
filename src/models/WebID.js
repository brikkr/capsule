var caps = require("..");

const { getDefaultSession, fetch } = require("@inrupt/solid-client-authn-browser");
const { getPodUrlAll, getSolidDataset, getContainedResourceUrlAll, getThingAll, isContainer, getContentType, isRawData, getSourceUrl, getFile } = require("@inrupt/solid-client");

var WebID = {
    podUrls: [],
    resources: [],
    loadResources: async function() {
        session = getDefaultSession();
        this.podUrls = await getPodUrlAll(session.info.webId, { fetch: fetch });
        for (const podUrl of this.podUrls) {
            const solidDataset = await getSolidDataset(
                podUrl, 
                { fetch: session.fetch } 
            );
            const containedResources =  getContainedResourceUrlAll(
                solidDataset, 
            );
            this.resources = this.resources.concat(containedResources)
        } 
        return WebID
    },
    loadContainedResources: async function(url) {
        session = getDefaultSession();

        return readResourceFromPod(url);
  
    }

    
}

async function readResourceFromPod(resourceURL) {

    try {
      // File (https://docs.inrupt.com/developer-tools/api/javascript/solid-client/modules/interfaces.html#file) is a Blob (see https://developer.mozilla.org/docs/Web/API/Blob)
      const file = await getFile(
        resourceURL,               // File in Pod to Read
        { fetch: fetch }       // fetch from authenticated session
      );
  
      console.log( `Fetched a ${getContentType(file)} file from ${getSourceUrl(file)}.`);
      console.log(`The file is ${isRawData(file) ? "not " : ""}a dataset.`);

      const contained = await getSolidDataset(resourceURL, { fetch: fetch });
     
      const items = getThingAll(contained);
      console.log(items);
      return items;
      //return getContainedResourceUrlAll(contained);
  
    } catch (err) {
      return false;
    }
}


module.exports = WebID