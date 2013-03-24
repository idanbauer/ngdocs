'use strict';
var reader = require('./reader.js'),
    ngdoc = require('./ngdoc.js'),
    writer = require('./writer.js'),
    SiteMap = require('./SiteMap.js').SiteMap,
    appCache = require('./appCache.js').appCache,
    nconf = require('nconf'),
    Q = require('qq');

var docs,
    start = now(),
    outputDir;

exports.generate = function () {

    outputDir = nconf.get('outputDir');
    writer.makeDir(outputDir, true).then(function () {
        return writer.makeDir(outputDir + '/partials/');
    }).then(function () {
            console.log('Generating Documentation...');
            return reader.collect();
        }).then(function generateHtmlDocPartials(docs_) {
            docs = docs_;
            ngdoc.merge(docs);
            var fileFutures = [];
            docs.forEach(function (doc) {
                fileFutures.push(writer.output('partials/' + doc.section + '/' + doc.id + '.html', doc.html()));
            });

            writeTheRest(fileFutures);

            return Q.deep(fileFutures);
        }).then(function generateManifestFile() {
            return appCache(outputDir).then(function (list) {
                writer.output('appcache-offline.manifest', list);
            });
        }).then(function printStats() {
            console.log('DONE. Generated ' + docs.length + ' pages in ' + (now() - start) + 'ms.');
        }).done();
};

function writeTheRest(writesFuture) {
    var metadata = ngdoc.metadata(docs);
    var templatesFolder =      __dirname + '/templates';

    writesFuture.push(writer.copyDir(templatesFolder + '/css', 'css'));
    writesFuture.push(writer.copyDir(templatesFolder + '/font', 'font'));
    writesFuture.push(writer.copyDir(__dirname +'/../img', 'img'));
    writesFuture.push(writer.copyDir(templatesFolder + '/js', 'js'));

    var manifest = 'manifest="/' + 'appcache.manifest"';

    writesFuture.push(writer.copy(templatesFolder + '/index.html', 'index.html',
        writer.replace, {'doc:manifest': ''})); //manifest //TODO(i): enable

    writesFuture.push(writer.copy(templatesFolder + '/index.html', 'index-nocache.html',
        writer.replace, {'doc:manifest': ''}));


    writesFuture.push(writer.copy(templatesFolder + '/index.html', 'index-jq.html',
        writer.replace, {'doc:manifest': ''}));

    writesFuture.push(writer.copy(templatesFolder + '/index.html', 'index-jq-nocache.html',
        writer.replace, {'doc:manifest': ''}));


    writesFuture.push(writer.copy(templatesFolder + '/index.html', 'index-debug.html',
        writer.replace, {'doc:manifest': ''}));

    writesFuture.push(writer.copy(templatesFolder + '/index.html', 'index-jq-debug.html',
        writer.replace, {'doc:manifest': ''}));

    writesFuture.push(writer.copy(templatesFolder + '/offline.html', 'offline.html'));

    writesFuture.push(writer.copy(templatesFolder + '/docs-scenario.html', 'docs-scenario.html' )); // will be rewritten, don't symlink
    writesFuture.push(writer.output('docs-scenario.js', ngdoc.scenarios(docs)));

    writesFuture.push(writer.output('docs-keywords.js',
        ['NG_PAGES=', JSON.stringify(metadata).replace(/{/g, '\n{'), ';']));
    writesFuture.push(writer.output('sitemap.xml', new SiteMap(docs).render()));

    writesFuture.push(writer.output('robots.txt', 'Sitemap: http://docs.angularjs.org/sitemap.xml\n'));
    writesFuture.push(writer.output('appcache.manifest', appCache()));
    writesFuture.push(writer.copy(templatesFolder + '/.htaccess', '.htaccess')); // will be rewritten, don't symlink

    var logo =nconf.get('logoFile');
    writesFuture.push(writer.copy(logo, 'img/logo.png'));
    var favicon=nconf.get('faviconFile');
    writesFuture.push(writer.copy(favicon, 'favicon.ico'));

}


function now() {
    return new Date().getTime();
}

function noop() {}

