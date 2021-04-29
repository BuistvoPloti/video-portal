const bytesToSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const isObjectEmpty = (object) => {
  return Object.entries(object).length === 0
}

const copyObjectWithoutUndefined = (initialObject) => {
  const newObject = {};
  Object.keys(initialObject)
    .forEach(key => initialObject[key] !== undefined
      && (newObject[key] = initialObject[key])
    );
  return newObject;
}

module.exports = {
  bytesToSize,
  isObjectEmpty,
  copyObjectWithoutUndefined,
}
