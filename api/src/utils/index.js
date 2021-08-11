const update = require('immutability-helper');

const validationPattern = {
  contact: /^([0-9]{10})+$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  number: /^[0-9]+$/
};

const messages = {
  required: 'Required.',
  invalidEmail: 'Invalid Email Id.',
  invalidContact: 'Invalid Contact.'
};

const parsePatchRequestBody = (requestPayload = {}, prependKey = '') => {
  return Object.keys(requestPayload).reduce((acc, next) => {
    const key = prependKey ? `${prependKey}.${next}` : next
    if(typeof requestPayload[next] === 'object') {
      acc = update(acc, {
        $merge: parsePatchRequestBody(requestPayload[next], key)
      })
    } else {
      acc[key] = requestPayload[next]
    }
    return acc
  }, {})
}

module.exports = {
  validationPattern,
  messages,
  parsePatchRequestBody
};
