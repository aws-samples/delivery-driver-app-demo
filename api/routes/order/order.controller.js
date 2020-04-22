const express = require('express')
const orderController = express.Router()
const userModel = require('../../models').userModel
const authenticateToken = require('../authenticateToken.js')

orderController
  .post('/', authenticateToken, async (req, res, next) => {

    if (!req.body || !req.body.orders )
    {
      // should check for all params
      res.status(500).send("no params")
      return
    }
    
    userModel.updateOrders(req.user.email,req.body.orders,function (err, acc) {
      
        if(acc)
        {
            console.log("order Post");
            res.status(200).send(acc)
        }
        else
        {
            res.status(500).send(err)
        }
    });
   
  })


orderController
  .get('/',authenticateToken, async (req, res, next) => {
    userModel
  .get(req.user.email,function(err,acc){
        if (err)
        {
        res.status(400).send(err)
        }
        else
        {
            if (acc.Item.orders)
              res.status(200).send(acc.Item.orders) 
            else
              res.status(200).send([]) 

        }
    });
   
  })


module.exports = orderController