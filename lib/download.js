(function() {
  var SmartlingDownload, async, baseUrl, fs, path, querystring, request,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  baseUrl = "https://api.smartling.com/v1/file/get?";

  fs = require('fs');

  request = require('request');

  querystring = require("querystring");

  async = require('async');

  path = require('path');

  SmartlingDownload = (function() {
    function SmartlingDownload(grunt, options, callback) {
      this.grunt = grunt;
      this.options = options;
      this.callback = callback;
      this.getLocaleRequest = __bind(this.getLocaleRequest, this);
      this.run();
    }

    SmartlingDownload.prototype.run = function() {
      var _this = this;
      return async.each(this.options.locales, this.getLocaleRequest, function(err) {
        return _this.callback();
      });
    };

    SmartlingDownload.prototype.generateQueryString = function(locale) {
      return querystring.stringify({
        locale: locale,
        apiKey: this.options.apiKey,
        projectId: this.options.projectId,
        fileUri: this.options.resourceId
      });
    };

    SmartlingDownload.prototype.getLocaleRequest = function(locale, callback) {
      var dest, file, handleResult, res, url, ws;
      this.grunt.log.write("downloading " + locale + " from smartling \n ");
      file = "" + this.options.resourceId + "." + locale + ".json";
      dest = path.resolve(this.options.dest, file);
      ws = fs.createWriteStream(dest);
      url = baseUrl + this.generateQueryString(locale);
      res = request(url);
      handleResult = function() {
        return setTimeout(callback, 1000);
      };
      res.pipe(ws);
      return res.on('end', handleResult);
    };

    return SmartlingDownload;

  })();

  module.exports = function(grunt, options, callback) {
    return new SmartlingDownload(grunt, options, callback);
  };

}).call(this);
