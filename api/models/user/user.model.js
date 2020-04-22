var dynamo = require('serverless-dynamodb-client').doc; 
var env  = require('../../../secrets.json')
const Joi = require('joi');
const USER_TABLE_NAME = env.SERVICE+'-'+env.NODE_ENV+'-User'

var userModel={}
userModel.get= function(email,callback)
{
    if(email)
    {
        var params = {
            TableName: USER_TABLE_NAME,
            Key: {'email': email}
        };
        dynamo.get(params, callback) 
    }
    else
    {
        var params = {
            TableName : USER_TABLE_NAME,
        };
        dynamo.scan(params, callback) 
    }
}

userModel.getCustomers= function(email,callback)
{
    if(email)
    {
        var params = {
            TableName: USER_TABLE_NAME,
            Key: {'email': email}
        };
        dynamo.get(params, function(err,acc){
            if(!err)
            {
                if (acc.Item.customers)
                {
                    callback(null,acc.Item.customers)
                }
                else
                    callback(null,[])
            }
        }) 
    }
    else
        callback("Invalid Params","")
    
}

userModel.post = function (user,callback)
{
    var params = {
        TableName:USER_TABLE_NAME,
        Item:user,
        ConditionExpression: "attribute_not_exists(email)"
    };
    

    dynamo.put(params, callback)
       
}


userModel.updateOrders = function (email,orders,callback)
{
    if (email && orders)
    {
        var params = {
            TableName:USER_TABLE_NAME,
            Key: {
                email:email
            },
            UpdateExpression: "set orders = :x",
            ExpressionAttributeValues: {
                ":x": orders,
            }
        };
        

        dynamo.update(params, callback)
    }
       
}
module.exports = userModel