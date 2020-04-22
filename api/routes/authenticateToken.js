var jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {
  // Grab the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) 
    return res.status(401).send("No Token") // if there isn't any token
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log(err)
    if (err) 
        return res.status(401).send("Bad Token")
    req.user = user
    next() // pass the execution off to whatever request the client intended
  })
}

module.exports = authenticateToken