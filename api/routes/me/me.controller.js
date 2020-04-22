const express = require('express')
const meController = express.Router()
const jwt = require('jsonwebtoken');

meController
  .get('/', async (req, res, next) => {
    let jwttoken=''
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { // Authorization: Bearer g1jipjgi1ifjioj
      // Handle token presented as a Bearer token in the Authorization header
       jwttoken = req.headers.authorization.split(' ')[1]
  
    } else if (req.cookies ) {
      // Handle token presented as a cookie parameter
        jwttoken = req.cookies.auth._token.local;
    }
    if(!jwttoken)
    {
      res.status(401).send({status:"Error",message:'Unautorized!'})
      return
    }
       
      try {
        var decoded = jwt.verify(jwttoken, process.env.JWT_SECRET);
        res.status(200).send({status:'success',data:decoded})
  
      } catch(err) {
        res.status(401).send({status:"Error",message:'Unautorized!'})
        return
      }
    
   })

  module.exports = meController