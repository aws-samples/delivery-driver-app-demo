const express = require('express')
const chimeproxyController = express.Router()
const chimeproxyModel = require('../../models').chimeproxyModel
const chimeAPIController = require('./chimeAPIController.js')
const ChimeAPIController = new chimeAPIController()
const authenticateToken = require('../authenticateToken.js')
const libphonenumber=require('libphonenumber-js')
 
 
chimeproxyController
  .post('/phoneproxy', authenticateToken, async (req, res, next) => {
    let params = req.body
    if (!params || !params.customerNumber || !params.customerName)
    {
      return res.status(400).send('Invalid parameters')
    }
    if (!params.orderNumber)
    {
      params.orderNumber = "23456654"
    }
    let p={}
    try {
      let customerNumber= libphonenumber.parsePhoneNumberFromString(params.customerNumber)
      let customerNumberInter = customerNumber.formatInternational()
      let country = customerNumber.country
      let areacode  = customerNumberInter.split(' ')[1]
       p={
        VoiceConnectorId: process.env.VOICE_CONNECTOR_ID,
        Capabilities: [ "Voice","SMS" ], 
        GeoMatchParams: {
            AreaCode:areacode,
            Country:country
        },
        Name:"proxydemo",
        NumberSelectionBehavior: "PreferSticky",
        ParticipantPhoneNumbers: [ req.user.phonenumber,params.customerNumber ]
     }
    }
    catch(e)
    {
      //Counldn't figure out the Area Code or Country
      console.log("Error trying to figure out Area code or Country, using generic selection")
      p={
        VoiceConnectorId: process.env.VOICE_CONNECTOR_ID,
        Capabilities: [ "Voice","SMS" ], 
        GeoMatchLevel: "Country",
        Name:"proxydemo",
        NumberSelectionBehavior: "PreferSticky",
        ParticipantPhoneNumbers: [ req.user.phonenumber,params.customerNumber ]
     }
    }
    
   try {
    let r = await ChimeAPIController.CreateProxySession(p)

    // There was an error that didn't throw an exception.
    if (!r.ProxySession)
    {
      if(r.Code == "ServiceFailure" && r.Message.search("unable to allocate"))
      {
        console.log("Unable to allocate a local number.")
        p={
          VoiceConnectorId: process.env.VOICE_CONNECTOR_ID,
          Capabilities: [ "Voice","SMS" ], 
          GeoMatchLevel: "Country",
          Name:"proxydemo",
          NumberSelectionBehavior: "PreferSticky",
          ParticipantPhoneNumbers: [ req.user.phonenumber,params.customerNumber ]
       }
       r = await ChimeAPIController.CreateProxySession(p)
       if (!r.ProxySession) {
        console.dir(r)
        res.status(500).send(r)
        return
       }
      }
      else {
        console.dir(r)
        res.status(500).send(r)
        return
      }
    }
    
    r.email = req.user.email
    r.proxyId = r.ProxySession.ProxySessionId
    r.customerName = params.customerName
    r.proxyPhoneNumber = r.ProxySession.Participants[0].ProxyPhoneNumber
    r.createdTimestamp = r.ProxySession.CreatedTimestamp
    r.expiryMinutes = r.ProxySession.ExpiryMinutes
    r.orderNumber = params.orderNumber
    r.proxyPhoneNumber = libphonenumber.parsePhoneNumberFromString(r.proxyPhoneNumber).formatInternational().replace(/\s+/g, '.')
  
    await chimeproxyModel.post(r)
    
    res.status(200).send(r)
   }
   catch(e)
   {
     res.status(500).send(e)
   }
  })

chimeproxyController
  .get('/phoneproxy',authenticateToken, async (req, res, next) => {
    
    try {
      let r = await chimeproxyModel.get(req.user.email)
      res.status(200).send(r)
     }
     catch(e)
     {
       res.status(500).send(e)
     }
    
  })

  chimeproxyController
  .delete('/phoneproxy/:id',authenticateToken, async (req, res, next) => {
    let p={
      VoiceConnectorId: process.env.VOICE_CONNECTOR_ID,
      ProxySessionId:req.params.id
    }
    
    try {
        try {
          await ChimeAPIController.DeleteProxySession(p)
        }
        catch(e)
        {
          console.log("ProxySession not found on AWS")
        }
        await chimeproxyModel.delete(req.params.id,req.user.email)
        let r = await ChimeAPIController.DeleteProxySession(p)
      
        console.log(JSON.stringify(r,null,2))
        res.status(200).send(r)
     }
     catch(e)
     {
        res.status(500).send(e)
     }
    
  })



module.exports = chimeproxyController