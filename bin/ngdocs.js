#!/usr/bin/env node

var gendocs = require('../src/gen-docs.js');
var argv = require('optimist')
	.usage('Usage: $0 --OutputFolder [string]')
	.describe('outputDirectory', 'directory to create the docs.  Default is build/docs')
	.argv;
var optimist = require('optimist');
var nconf = require('nconf');

nconf.argv()
	.file('docsConfig.json');

nconf.defaults({
   logoFile: __dirname + '/../img/logo.png',
   faviconFile: __dirname +'/../src/templates/favicon.ico'
});


if (argv.help)
{
	optimist.showHelp();
	process.exit();
}


gendocs.generate();

