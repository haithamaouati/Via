// ==UserScript==
// @name         P2R
// @namespace    github.com/haithamaouati/P2R
// @version      1.0
// @description  Pull-to-refresh
// @author       Haitham Aouati
// @match        *://*/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const PullToRefreshUI = {
        startY: 0,
        currentY: 0,
        threshold: 150,
        isTop: false,
        container: null,
        icon: null,

        // SVG Refresh Icon - Stroke changed to Black (#000000)
        svgIcon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,

        init: function() {
            this.injectStyles();
            this.createUI();
            this.bindEvents();
        },

        injectStyles: function() {
            const style = document.createElement('style');
            style.textContent = `
                #ptr-ui-container {
                    position: fixed;
                    top: -60px;
                    left: 0;
                    width: 100%;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                    transition: transform 0.1s ease-out;
                    pointer-events: none;
                }
                #ptr-ui-icon {
                    background: white;
                    border-radius: 50%;
                    padding: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.1s linear;
                }
                @keyframes ptr-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .ptr-refreshing #ptr-ui-icon {
                    animation: ptr-spin 0.8s linear infinite;
                }
            `;
            document.head.appendChild(style);
        },

        createUI: function() {
            this.container = document.createElement('div');
            this.container.id = 'ptr-ui-container';
            this.icon = document.createElement('div');
            this.icon.id = 'ptr-ui-icon';
            this.icon.innerHTML = this.svgIcon;
            this.container.appendChild(this.icon);
            document.body.appendChild(this.container);
        },

        bindEvents: function() {
            document.addEventListener('touchstart', (e) => {
                this.isTop = (window.pageYOffset || document.documentElement.scrollTop) === 0;
                this.startY = e.touches[0].pageY;
            }, { passive: true });

            document.addEventListener('touchmove', (e) => {
                if (!this.isTop) return;
                
                this.currentY = e.touches[0].pageY;
                const diff = this.currentY - this.startY;

                if (diff > 0) {
                    // Prevent default pull-to-refresh if browser has native one
                    if (e.cancelable) e.preventDefault();
                    
                    const translate = Math.min(diff * 0.5, this.threshold + 20);
                    this.container.style.transform = `translateY(${translate}px)`;
                    
                    const rotation = (diff / this.threshold) * 360;
                    this.icon.style.transform = `rotate(${rotation}deg)`;
                }
            }, { passive: false });

            document.addEventListener('touchend', () => {
                const diff = this.currentY - this.startY;

                if (this.isTop && diff > this.threshold) {
                    this.triggerRefresh();
                } else {
                    this.resetUI();
                }
            }, { passive: true });
        },

        triggerRefresh: function() {
            this.container.classList.add('ptr-refreshing');
            this.container.style.transform = `translateY(80px)`;
            
            setTimeout(() => {
                window.location.reload();
            }, 300);
        },

        resetUI: function() {
            this.container.style.transform = 'translateY(0)';
            this.startY = 0;
            this.currentY = 0;
        }
    };

    try {
        PullToRefreshUI.init();
    } catch (e) {
        // Fail-safe check
    }
})();
