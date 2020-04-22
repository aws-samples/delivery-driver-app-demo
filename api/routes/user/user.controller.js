const express = require('express')
const userController = express.Router()
const userModel = require('../../models').userModel
const env = require('../../../secrets.json')
const bcrypt = require('bcryptjs')

userController
  .post('/', async (req, res, next) => {
    // const item = await MagentoAPI.create(req.body)
    if (!req.body)
    {
      // should check for all params
      res.status(500).send("no params")
      return
    }
    let hash  = await bcrypt.hash(req.body.password, 10)
    userModel.post({email: req.body.email, password: hash, phonenumber: req.body.phonenumber,username:req.body.username,}, function (err, acc) {
      
        if(acc)
        {
            console.log('created account in DynamoDB');
            res.status(200).send(
            {
              status: 'success',
              data: acc
            })
        }
        else
        {
            res.status(500).send({
              status: 'Error',
              message: "User Already Exists!"
            })
        }
    });
   
  })

userController
  .put('/:id', async (req, res, next) => {
    if (!req.body)
    {
      // should check for all params
      res.status(500).send("no params")
      return
    }
    userModel.put({email: req.body.email, password: req.body.password, phonenumber: req.body.phonenumber}, function (err, acc) {
        if(acc)
        {
            console.log('created account in DynamoDB');
            if (acc.Item)
                acc= Item
            res.status(200).send(acc)
        }
        else
        {
           
            res.status(500).send(err)
        }
    });
  })

userController
  .get('/', async (req, res, next) => {
    // const items = await MagentoAPI.find()
    userModel
  .get(null,function(err,acc){
        if (err)
        {
        res.status(400).send(err)
        }
        else
        {
            
            res.status(200).send(acc.Items) 
        }
    });
   
  })

userController
  .get('/:id', async (req, res, next) => {
    // const item = await MagentoAPI.findById(req.params.id)
    let email = req.params.id
    userModel.get(email,function(err,acc){
      if (err)
      {
        res.status(500).send(err)
      }
      else
      {
        res.status(200).send(acc)
      }
  });
   
  })

userController
  .delete('/:id', async (req, res, next) => {
    // const item = await MagentoAPI.deleteOne({ _id: req.params.id })
    res.status(200).send('Delete an User')
  })

module.exports = userController