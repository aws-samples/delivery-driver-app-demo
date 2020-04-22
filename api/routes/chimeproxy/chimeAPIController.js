const http  = require('http')
const https = require('https')
const aws4  = require('aws4')
const request = require('request')
const _ = require("lodash")

var ChimeController = function (options) {
  if (options && options.host)
    this.host = options.host
  else {
    this.host = process.env.AWS_SERVICE_ENDPOINT || "service.chime.aws.amazon.com" 
  }
  if (options && options.credentials)
  {
    this.credentials = options.credentials
  }
};

ChimeController.prototype.sendPostRequest = function (path,body) {
  var self =  this
  return new Promise(function (resolve, reject) {
        var o = aws4.sign({
          service: 'chime',
          host: self.host,
          method: 'POST',
          path: path,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        })
        request.post({url:"https://"+self.host+path,headers:o.headers,body:o.body},function(err,res,body){
          if (!err)
          {
            body = JSON.parse(body);
            resolve(body)
          }
          else {
            console.log("Error Posting:")
            console.dir(err)
            reject(err)
          }
        })
  })
}

ChimeController.prototype.sendPutRequest = function (path,body) {
  var self =  this
  return new Promise(function (resolve, reject) {
        var o = aws4.sign({
          service: 'chime',
          host: self.host,
          method: 'PUT',
          path: path,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        })
        request.put({url:"https://"+self.host+path,headers:o.headers,body:o.body},function(err,res,body){
          if (!err)
          {
            body = JSON.parse(body);
            resolve(body)
          }
          else {
            console.log("put-error-"+err)
            reject(err)
          }
        })
  })
}

ChimeController.prototype.sendGetRequest = function (path) {
  var self =  this
  
  return new Promise(function (resolve, reject) {
        var o = aws4.sign({
          service: 'chime',
          host: self.host,
          method: 'GET',
          path: path
        })
        
        request.get({url:"https://"+self.host+path,headers:o.headers},function(err,res,body){
          if (!err)
          {
            body = JSON.parse(body);
            resolve(body)
          }
          else {
            //console.log(err)
            reject(err)
          }
        })
  })
}
ChimeController.prototype.sendDeleteRequest = function (path) {
  var self =  this
  
  return new Promise(function (resolve, reject) {
        var o = aws4.sign({
          service: 'chime',
          host: self.host,
          method: 'DELETE',
          path: path
        })
        
        request.delete({url:"https://"+self.host+path,headers:o.headers},function(err,res,body){
          if (!err)
          {
            resolve({})
          }
          else {
            //console.log(err)
            reject(err)
          }
        })
  })
}

ChimeController.prototype.CreateVoiceConnector = async function (CreateVoiceConnectorRequest) {
  let self = this;
  let path  = "/voice-connectors";
  let body =CreateVoiceConnectorRequest;
  return self.sendPostRequest(path,body)
}

ChimeController.prototype.CreateProxySession = async function (CreateProxySessionRequest) {
  let self = this;
  let VoiceConnectorId = CreateProxySessionRequest.VoiceConnectorId
  delete CreateProxySessionRequest.VoiceConnectorId
  let path ="/voice-connectors/"+VoiceConnectorId+"/proxy-sessions";
  let body =CreateProxySessionRequest;
  return self.sendPostRequest(path,body)
}

ChimeController.prototype.DeleteProxySession = async function (DeleteProxySessionRequest) {
  let self = this;
  let VoiceConnectorId = DeleteProxySessionRequest.VoiceConnectorId
  let ProxySessionId = DeleteProxySessionRequest.ProxySessionId
  let path ="/voice-connectors/"+VoiceConnectorId+"/proxy-sessions/"+ProxySessionId;
  return self.sendDeleteRequest(path)
}
ChimeController.prototype.ListProxySessions = async function (ListProxySessionsRequest) {
  let self = this;
  let VoiceConnectorId = ListProxySessionsRequest.VoiceConnectorId
  delete ListProxySessionsRequest.VoiceConnectorId
  let path ="/voice-connectors/"+VoiceConnectorId+"/proxy-sessions";
  let body =ListProxySessionsRequest;
  return self.sendGetRequest(path,body)
}

ChimeController.prototype.PutVoiceConnectorProxy = async function (PutVoiceConnectorProxyRequest) {
  let self = this;
  let VoiceConnectorId = PutVoiceConnectorProxyRequest.VoiceConnectorId
  delete PutVoiceConnectorProxyRequest.VoiceConnectorId
  let path ="/voice-connectors/"+VoiceConnectorId+"/programmable-numbers/proxy"
  let body =PutVoiceConnectorProxyRequest;
  return self.sendPutRequest(path,body)
}


module.exports = ChimeController;
