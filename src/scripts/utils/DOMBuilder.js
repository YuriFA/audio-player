export default class DOMBuilder {
  constructor() {
    throw new Error('This is static class. Creating instances is forbidden.');
  }

  static createElement(tagName, { attrs, text, callback, parent }) {
    const element = document.createElement(`${tagName}`);

    if (attrs) {
      DOMBuilder.insertAttributes(element, attrs);
    }

    if (callback) {
      callback(element);
    }

    if (text) {
      element.innerHTML = text;
    }

    if (parent instanceof HTMLElement) {
      parent.appendChild(element);
    }

    return element;
  }

  static insertAttributes(element, attrs) {
    if (element instanceof HTMLElement) {
      Object.keys(attrs).forEach((prop) => {
        element.setAttribute(prop, attrs[prop]);
      });
    }
  }
}
