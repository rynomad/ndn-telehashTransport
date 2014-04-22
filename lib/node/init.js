var down = require('leveldown')
  , path = process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH || "~/"
  , levelup = require('levelup')
  , th = require("telehash")
  , seeds = require("telehash-seeds")

module.exports = function init(appname, callback){
  var self
  levelup(path + "/.teleHash-" + appname, {db: down, valueEncoding: 'json'},function(err, db){
    db.get('id', function(err, value){
      if (err) {
        if (err.notFound) {
          th.init({}, function(err, selfie){
            if(err) return console.log("hashname generation/startup failed",err);
            self = selfie
            db.put('id', self.id, function(err){
              console.log('batch finished')
            })
            seeds.install(self)
            callback(self)
          });

        } else{
        // I/O or other error, pass it up the callback chain
        console.log("IO err", err)
        return callback(err)
        }
      } else {
        th.init({id:value}, function(err, selfie){
          if(err) return console.log("hashname failed to come online",err);
          self = selfie
          seeds.install(self)
          callback(self)
        });
      }
    })
  })
}
