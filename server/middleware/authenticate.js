var usersAuthentication = function(models) {
  var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    models.Users.findByToken(token).then((user) => {
      if (!user) {
        return Promise.reject();
      }

      req.user = user;
      req.token = token;
      next();
    }).catch((err) => {
      res.status(401).send();
    });
  };
  return authenticate;
}

module.exports = function(models) {
  return usersAuthentication(models);
}
