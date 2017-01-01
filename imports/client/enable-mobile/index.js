// File taken from https://github.com/dfcreative/enable-mobile

require('./arr-fill');
require('typedarray-methods');
require('get-float-time-domain-data');
const css = require('insert-styles');
const fs = require('fs');

css(`
	html {
		touch-action: manipulation;
	}
`)

addMeta({
	name: 'viewport',
	content: 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0'
});
addMeta({
	'http-equiv': 'x-ua-compatible',
	content: 'ie=edge'
});
addMeta({
	charset: 'utf-8'
});


function addMeta (obj) {
	let meta = document.createElement('meta');
	let qs = 'meta';
	for (let name in obj) {
		qs += `[${name}]`
		meta.setAttribute(name, obj[name]);
	}
	if (!document.querySelector(qs)) {
		document.head.insertBefore(meta, document.head.firstChild);
	}
}