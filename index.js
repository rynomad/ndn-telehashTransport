
var self

var ndn = require("ndn-lib");
var ElementReader = ndn.ElementReader;
var ndnbuf = ndn.customBuffer;
var Name = ndn.Name
var Data = ndn.Data

var local = {}

local.transport = function (hashname, channel) {
  this.hashname = hashname
  var faceSelf = this
  if (channel) {
    this.channel = channel
  }
};

local.start = function(appname, listenCallback) {
  function assigner (selfie){
    self = selfie
    self.listen("_ndn", listenCallback)
  }
  require("./lib/node/init.js")(appname, assigner)
}

/**
 * Connect to the host and port in face.  This replaces a previous connection and sets connectedHost
 *   and connectedPort.  Once connected, call onopenCallback().
 * Listen on the port to read an entire binary XML encoded element and call
 *    face.onReceivedElement(element).
 */
local.transport.prototype.connect = function(face, onopenCallback)
{
  this.elementReader = new ElementReader(face);
  var faceSelf= this;

  function listener (end, packet, chan, cb) {
    console.log("got packet!", packet)
    if (packet.js == "ndn"){

      var ev = packet.body
      console.log('RecvHandle called on local face', ev, typeof ev);
      var bytearray = new ndnbuf(ev);
      console.log(ev.data)
      console.log(bytearray)
      try {
        // Find the end of the binary XML element and call face.onReceivedElement.
        faceSelf.elementReader.onReceivedData(bytearray);
      } catch (ex) {
        console.log("NDN.ws.onmessage exception: " + ex);
        return;
      }
      // garbage collect arraybuffer
      //var ms = new MessageChannel()

    }
  }
  if (!faceSelf.channel || faceSelf.channel.ended){
    self.start(faceSelf.hashname, "_ndn", {js: "incoming"}, function(err, packet, channel){
      if (packet.js == "ack"){
        console.log('got ack')
        channel.callback = listener

        faceSelf.channel = channel
        channel.ack()
        channel.send({js:"ack"})
        onopenCallback();
      }
    });
  } else {
    console.log("channel is DEFINED", faceSelf.channel)
    faceSelf.channel.callback = listener
    faceSelf.channel.ack()
    faceSelf.channel.send({js:"ack"})

    onopenCallback()
  }



};

/**
 * Send the Uint8Array data.
 */
local.transport.prototype.send = function(data)
{
  if (true) {
        // If we directly use data.buffer to feed ws.send(),
        // WebSocket may end up sending a packet with 10000 bytes of data.
        // That is, WebSocket will flush the entire buffer
        // regardless of the offset of the Uint8Array. So we have to create
        // a new Uint8Array buffer with just the right size and copy the
        // content from binaryInterest to the new buffer.
        //    ---Wentao
        var bytearray = new Uint8Array(data.length);
        bytearray.set(data);
        console.log("sending over telehash!", this.channel)
        this.channel.send({js:"ndnLDKHFLDHGLKHD"})

        //garbage collect
        //var ms = new MessageChannel();
        //ms.port1.postMessage(bytearray.buffer, [bytearray.buffer])
        //ms.port1.postMessage(data.buffer, [data.buffer])
    console.log('local.send() returned.');
  }
  else
    console.log('local connection is not established.');
};

module.exports = local;
