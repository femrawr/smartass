// ==UserScript==
// @name         smartass
// @version      20/7/2025
// @description  ai text scanner to help with homework on wtv
// @author       femrawr
// @match        *://*
// ==/UserScript==

(() => {
	'use strict';

	fetch('https://raw.githubusercontent.com/femrawr/smartass/refs/heads/main/userscript/build/main.min.js')
		.then(res => {
			if (!res.ok) throw new Error(`http error, status: ${res.status}`);
			return res.text();
		})
		.then(src => new Function(src)())
		.catch(_ => console.error('an error occurred while executing'));
})();