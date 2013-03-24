# angular-docs


a way to document Angular Projects.

to get started create a docsConfig.json file in your project root directory with the following content :

````javascript
{ 
	"outputDir": "path/to/output",
	"contentDir": "path/to/guidesandcontents",
	"apiDir": "path/to/projectcode",
	"logoFile": "img/logo.png"
}
````

1. Make sure you have node js installed. 
1. Run `npm install ngdocs -g` to create the ngdocs package.
1. run ngdocs from your project root folder.

see https://github.com/idanush/angular-docs/wiki/API-Docs-Syntax for documenting your code.