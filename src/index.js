// Promise polyfill for IE and older browsers
require('es6-promise').polyfill();
const axios = require('axios');

const instance = axios.create({
 baseURL: 'http://localhost:8000'
});

console.log("Lol3");
// // Set config defaults when creating the instance


// Make a request for a user with a given ID
instance({
  method: 'post',
  url: '/members',
}).then((response) => {
  console.log(response);
}).catch((error) => {
  console.log("Error: ", error);
});
