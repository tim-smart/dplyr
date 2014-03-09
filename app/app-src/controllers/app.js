'use strict';
var AppController;

AppController = (function() {
  function AppController(app, name) {
    this.app = app;
    this.name = name || 'app';
    this.defaults = {
      jsext: app.set('javascript extension')
    };
  }

  AppController.prototype.setup = function(req, res) {
    res.locals(this.defaults);
    return res.locals.request = req;
  };

  AppController.prototype.model = function(model) {};

  AppController.prototype.route = function(method) {
    var cacheFn, fn, self;
    self = this;
    fn = this[method];
    if (fn.__cache) {
      return fn.__cache;
    }
    if (4 === fn.length) {
      cacheFn = function(err, req, res, next) {
        if (self.setup) {
          self.setup(req, res);
        }
        return self[method](err, req, res, next);
      };
    } else {
      cacheFn = function(req, res, next) {
        if (self.setup) {
          self.setup(req, res);
        }
        return self[method](req, res, next);
      };
    }
    return fn.__cache = cacheFn;
  };

  return AppController;

})();

module.exports = AppController;
