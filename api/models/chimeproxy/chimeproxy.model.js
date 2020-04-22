var dynamo = require('serverless-dynamodb-client').doc; 
var env  = require('../../../secrets.json')
const Joi = require('joi');
const CHIMEPROXY_TABLE_NAME = env.SERVICE+'-'+env.NODE_ENV+'-ChimeProxy'

var chimeProxyModel={}
chimeProxyModel.get= function(email)
{
    var params = {
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
          ':email':  email
      },
      TableName: CHIMEPROXY_TABLE_NAME
    };
    return new Promise(function (resolve, reject) {
      dynamo.query(params, (err,body)=>{
        if(err)
          reject(err)
        else
          resolve(body.Items)
      })
    })

}

chimeProxyModel.delete = function(id,email)
{
   
    var params = {
        TableName: CHIMEPROXY_TABLE_NAME,
        Key: {'proxyId': id,
               'email':email}
    };
    return new Promise(function (resolve, reject) {
      dynamo.delete(params, (err,body)=>{
        if(err)
          reject(err)
        else
          resolve(body.Items)
      })
    })

}
chimeProxyModel.post = function (proxynumber)
{
    var params = {
        TableName:CHIMEPROXY_TABLE_NAME,
        Item:proxynumber
    };
    
    return new Promise(function (resolve, reject) {
      dynamo.put(params, (err,body)=>{
        if(err)
          reject(err)
        else
          resolve(body)
      })
    })
}

chimeProxyModel.put = function (proxynumber,callback)
{
    var params = {
        TableName:CHIMEPROXY_TABLE_NAME,
        Item:proxynumber
    };
    

    dynamo.put(params, callback)
       
}

  module.exports = chimeProxyModel