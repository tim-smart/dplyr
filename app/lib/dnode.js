// Generated by CoffeeScript 1.7.1
'use strict';
var crypto, helpers;

helpers = require('./mopidy.js');

crypto = require('crypto');

module.exports = function(app) {
  var clients, db, mopidy;
  clients = [];
  mopidy = app.set('mopidy');
  db = app.set('db');
  app.set('dnode clients', clients);
  return function(remote, dnode) {
    var addr, controller;
    if (!(dnode.stream && dnode.stream.remoteAddress)) {
      return dnode.end();
    }
    clients.push(remote);
    controller = app.set('mopidy controller');
    addr = crypto.createHash('sha1');
    addr.update(dnode.stream.remoteAddress);
    addr = addr.digest('hex');
    dnode.once('end', function() {
      var index;
      index = clients.indexOf(remote);
      clients.splice(index, 1);
      addr = controller = remote = dnode = null;
    });
    return {
      db: {
        search: function(query, done) {
          helpers.search(mopidy, query, done);
        }
      },
      queue: {
        add: function(track) {
          app.emit('queue:add', track, addr);
        },
        downvote: function(track) {
          app.emit('queue:downvote', track, addr);
        },
        get: function(done) {
          controller.getQueue(done);
        }
      },
      current: {
        vote: function() {
          app.emit('current:vote', addr);
        },
        downvote: function() {
          app.emit('current:downvote', addr);
        },
        get: function(done) {
          controller.getPlaying(done);
        }
      },
      clients: {
        getId: function(done) {
          done(null, addr);
        }
      }
    };
  };
};
