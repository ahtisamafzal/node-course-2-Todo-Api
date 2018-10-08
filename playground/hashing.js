const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  ObjectID
} = require('mongodb');

const userOneId = new ObjectID('5bb658baa530a3fb4757c679');
const userTwoId = new ObjectID('5bb658baa530a3fb4757c67a');

var password = 'UserOnePass';

bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });
});

 var hashpassword = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmI2NThiYWE1MzBhM2ZiNDc1N2M2NzkiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTM4Njc2OTIyfQ.qJsxI8rXeD1ZhyNwZxs-tH8sQFdE0YnugM3uV28xDJw';
 bcrypt.compare(password, hashpassword, function(err, res) {
   console.log(res);
 })

// bcrypt.getSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   })
// });
// var msg =  "I am user number 3"
// var hash = SHA256(msg).toString();
//
// console.log(msg);
// console.log(hash);
//
// var data = {
//   id: 4
// };
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

//
//
var token = jwt.sign({
  _id: userOneId,
  access: 'auth'
}, 'abc123').toString()
console.log('token:-', token);

var decoded = jwt.verify(token, 'abc123');
console.log('decoded:-', decoded);
