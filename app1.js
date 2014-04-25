var trans = require('./index.js')
var ndn = require('ndn-lib')

trans.start('app1', function(self) {

  var hn = '0a64da4ef9f6d62121bb24bbcd1391ae0274106ff27cae8a918ffa75d3864209'
  var face = new ndn.Face({host: 111, port: 222, getTransport: function(){return new trans.transport(hn)}})

  face.transport.connect(face, function(){
    console.log("app1 connect callback")
    face.expressInterest(new ndn.Name("thing"), function(interest, data){console.log("got data", data.content.toString())}, function(interest){console.log("timeout")})
    setTimeout(function(){

      face.expressInterest(new ndn.Name("thing"), function(interest, data){console.log("got data", data.content.toString())}, function(interest){console.log("timeout")})
    },300)
  })

})
