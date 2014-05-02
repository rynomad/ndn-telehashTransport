var trans = require('./index.js')
var ndn = require('ndn-lib')

trans.start('app1', function(self) {

  var hn = '731871204fd52f8e17066d48dff419cca9439c97d899c2e4b00b24857fb7a218'

  var face = new ndn.Face({host: 111, port: 222, getTransport: function(){return new trans.transport(hn)}})

  face.transport.connect(face, function(){
    console.log("app1 connect callback")
    face.expressInterest(new ndn.Name("thing"), function(interest, data){console.log("got data", data.content.toString())}, function(interest){console.log("timeout")})
    setTimeout(function(){

      face.expressInterest(new ndn.Name("thing"), function(interest, data){console.log("got data", data.content.toString())}, function(interest){console.log("timeout")})
    },300)
  })

})
