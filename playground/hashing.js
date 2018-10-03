const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
// var msg = "I am user number 3"
// var hash = SHA256(msg).toString();
//
// console.log(msg);
// console.log(hash);
//
var data = {
  id: 4
};
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret1').toString()
// };
//
//
// var resultHash = SHA256(JSON.stringify(data) + 'somesecret').toString();
//
// if(resultHash !== token.hash){
//   console.log('Invalid token');
// } else
// {
//   console.log('Token Is VALID');
// }



var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log(decoded);
