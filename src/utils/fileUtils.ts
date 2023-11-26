export function addToJsonPrototype(fileObject?: File) {
  if (!fileObject) return fileObject
  Object.defineProperty(fileObject, 'toJSON', {
    value: function () {
      return {
        lastModified: fileObject.lastModified,
        lastModifiedDate: fileObject.lastModified,
        name: fileObject.name,
        size: fileObject.size,
        type: fileObject.type,
      }
    },
  })
  return fileObject
}

/**
 * Given a IPFS Hash or Url it returns just the hash to be used on our backend
 * to fetch data
 * @param hash
 */
export function cleanHash(hash: string) {
  // First replace the "ipfs://" and then the "ipfs/" that is needed for kleros
  // Expected hash as example: ipfs://ipfs/QmSaqcFHpTBP4Ks1DoLuE4yjDSWcr4xBxsnRvW3k8EFc6F
  return hash.replace(/^ipfs?:\/\//, '').replace(/^ipfs\//, '')
}

/**
 * As it is a hash that is going to be read by Kleros, it needs to have an extra path
 * @param hash
 */
export function convertHashToValidIPFSKlerosHash(hash?: string) {
  // Expected hash as example: ipfs://ipfs/QmSaqcFHpTBP4Ks1DoLuE4yjDSWcr4xBxsnRvW3k8EFc6F
  return `ipfs/${hash}`
}

export function isIPFSUrl(value?: string) {
  return value && value?.startsWith('ipfs://')
}
