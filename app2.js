var trans = require('./index.js')
var ndn = require('ndn-lib')

  , RegisteredPrefix = function RegisteredPrefix(prefix, closure) {  this.prefix = new ndn.Name(prefix);    this.closure = closure};


function onInterest(prefix, interest, transport) {
  console.log("got interest")
  var d = new ndn.Data(interest.name, new ndn.SignedInfo(), "Success!")
  d.signedInfo.setFields()
  d.sign()
  var enc = d.wireEncode()
  transport.send(enc.buffer)

}
trans.start('app2', function(self){
  self.listen("ndn", function(err, packet, chan, callb){
    console.log(chan)
    callb(true)
    var face = new ndn.Face({host:111, port:111, getTransport: function(){return new trans.transport(chan.hashname, chan)}})
    console.log(packet.js)
    function onopen(){


      console.log("app2 transport open", callb)

      var d = new ndn.Data(new ndn.Name('thing'), new ndn.SignedInfo(), "success")
      d.signedInfo.setFields()
      d.sign()
      setTimeout(function(){

        face.transport.send(d.wireEncode().buffer)
      }, 4000)

    }

    face.transport.connect(face, onopen)
  })

})

