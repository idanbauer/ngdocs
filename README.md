# ngdocs


#### A way to document Angular Projects ####

To get started, create a docsConfig.json file in your project root directory with the following content :

````javascript
{ 
	"outputDir": "path/to/output",
	"contentDir": "path/to/guidesandcontents",
	"apiDir": "path/to/projectcode",
	"logoFile": "img/logo.png"
}
````

1. Make sure you have [Node.js](http://nodejs.org/) installed. 
1. Run `npm install ngdocs -g` to create the ngdocs package.
1. Run ngdocs from your project root folder.

See https://github.com/idanush/ngdocs/wiki/API-Docs-Syntax for documenting your code.
