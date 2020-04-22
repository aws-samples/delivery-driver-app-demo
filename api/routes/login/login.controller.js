const express = require('express')
const loginController = express.Router()
const userModel = require('../../models').userModel
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');

loginController
  .post('/', async (req, res, next) => {
    // const item = await MagentoAPI.create(req.body)
    let email = req.body.email
    userModel.get(email,function(err,acc){
      if (err)
      {
        res.status(401).send(err)
      }
      else
      {
        if(acc.Item)
          acc = acc.Item

        if (!acc.password)
        {
          res.status(401).send({
            status: 'Error',
            message: "User Not Found!"
          })
          return 
        }
        bcrypt.compare(req.body.password, acc.password, function(err, result) {
          if (result == true)
          {
            var token = jwt.sign({ email: acc.email,phonenumber:acc.phonenumber,username:acc.username }, process.env.JWT_SECRET);
            res.status(200).send({
              status: 'success',
              data: {token:token}
            })
          }
          else
          {
            res.status(401).send({
              status: 'Error',
              message: "Invalid Password!"
            })
          }
        });
        
      }
  });
 
  })


module.exports = loginController