const getObjectPropertyOrReturnEmptyString = (object, property) => object[property] || '';

const formatUrl = (rawUrl) => {
  const character = '/';
  const insertIndex = rawUrl.indexOf(character) + 1;
  const formattedCallbackURL = [
    rawUrl.slice(0, insertIndex),
    character, rawUrl.slice(insertIndex)
  ].join('');
  return formattedCallbackURL;
};

const buildQueryPartSequentialArguments = (data) => {
  let resultQueryPart = '';
  const dataArray = Object.keys(data);
  let iterations = dataArray.length;

  for (const [index, value] of dataArray.entries()) {
    resultQueryPart += `${value} = $${index + 1}${!--iterations ? '' : ', '}`;
  }
  return resultQueryPart;
};

module.exports = {
  getObjectPropertyOrReturnEmptyString,
  buildQueryPartSequentialArguments,
  formatUrl
};
