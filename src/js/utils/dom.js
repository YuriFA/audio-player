"use strict";

export default class DOMBuilder {
    constructor() {
        throw new Error('This is static class. Creating instances is forbidden.');
    }

    static createElement(tagName, attrs=null, callback=null) {
        const element = document.createElement(`${tagName}`);

        if (attrs) {
            DOMBuilder._insertAttributes(element, attrs);
        }
        
        if (callback) {
            callback(element);
        }

        return element;
    }

    static _insertAttributes(element, attrs) {
        for (var prop in attrs) {
            if (attrs.hasOwnProperty(prop)) {
                element.setAttribute(prop, attrs[prop]);
            }
        }
    }
}
