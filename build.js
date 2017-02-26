var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;
var rimraf = require('rimraf');
var zipFolder = require('zip-folder');
var UglifyJS = require('uglify-js');
var fs = require('fs');

var async = require('async');

async.series([
	function (callback) {
		rimraf('extension-dist.zip', [], callback);
	},
	function (callback) {
		rimraf('main.min.js', [], callback);
	},
	function (callback) {
		var result = UglifyJS.minify([ "src/main.js", "src/main/*"]);
		fs.writeFile("src/main.min.js", result.code, callback);
	},
	function (callback) {
		rimraf('dist', [], callback);
	},
	function (callback) {
		mkdirp('dist', callback);
	},
	function (callback) {
		ncp('images', 'dist/images', callback);
	},
	function (callback) {
		ncp('lib', 'dist/lib', callback);
	},
	function (callback) {
		ncp('manifest.json', 'dist/manifest.json', callback);
	},
	function (callback) {
		ncp('src', 'dist/src', callback);
	},
	function (callback) {
		zipFolder('dist', 'extension-dist.zip', callback);
	},
	function (callback) {
		rimraf('dist', [], callback);
	},
	function (callback) {
		console.log('Build completed;');
	}

]);

