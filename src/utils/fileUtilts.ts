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
