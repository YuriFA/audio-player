"use strict";

export default class DOMBuilder {
    constructor() {
        throw new Error('This is static class. Creating instances is forbidden.');
    }

    static createElement(tagName, { attrs, callback, parent }) {
        const element = document.createElement(`${tagName}`);

        if(attrs) {
            DOMBuilder.insertAttributes(element, attrs);
        }
        
        if(callback) {
            callback(element);
        }

        if(parent instanceof HTMLElement) {
            parent.appendChild(element);
        }

        return element;
    }

    static insertAttributes(element, attrs) {
        if(element instanceof HTMLElement){
            for (var prop in attrs) {
                if (attrs.hasOwnProperty(prop)) {
                    element.setAttribute(prop, attrs[prop]);
                }
            }
        }
    }
}
