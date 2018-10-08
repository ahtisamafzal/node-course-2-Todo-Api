var usersAuthentication = function(models) {

  var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    if (!token) {
      res.status(401).send();
      next();
    } else {
      models.Users.findByToken(token).then((user) => {
        if (!user) {
          // console.log('User not found');
          return Promise.reject();
        }
        // console.log('user:', user);
        // console.log('token:', token);
        req.user = user;
        req.token = token;
        next();
      }).catch((err) => {
        // console.log(err);
        res.status(401).send();
      });
    };
  }
  return authenticate;
}

module.exports = function(models) {
  return usersAuthentication(models);
}
