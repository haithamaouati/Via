// ==UserScript==
// @name         HTTPS Everywhere
// @namespace    github.com/haithamaouati
// @version      1.0
// @description  Always use HTTPS; redirect all URLs from HTTP to HTTPS.
// @author       Haitham Aouati
// @run-at       document-start
// @match        http://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Logic:
     * 1. Check protocol.
     * 2. Attempt redirection using location.replace.
     * 3. Catch and log errors to prevent script termination.
     */
    try {
        if (window.location.protocol === "http:") {
            const secureUrl = window.location.href.replace(/^http:/, 'https:');
            window.location.replace(secureUrl);
        }
    } catch (error) {
        console.error(`[HTTPS Everywhere] Redirection failed: ${error.message}`);
    }
})();
