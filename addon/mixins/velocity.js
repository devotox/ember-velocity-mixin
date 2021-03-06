/* global Element */
import { assert } from '@ember/debug';

import RSVP from 'rsvp';
import Mixin from '@ember/object/mixin';
import jQuery from 'jquery';

// assert("Velocity.js must be installed to use this mixin.", jQuery.Velocity);

jQuery.Velocity.Promise = RSVP.Promise;

export default Mixin.create({

    /**
     * Retrieve & set css properties to element's style element.
     *
     * Retrieve value with this.css('width')
     * Set value with this.css('width', '100px')
     *
     * @returns {*}
     */
    css(...args) {
        if (!this._checkElement(args[0])) {
            // the first argument is not an element, get current view's element
            args.unshift(this.element);
        }

        if (args.length > 2) {  // setting
            this.setCSSPropertyValue(...args);
        } else { // getting
            return this.getCSSPropertyValue(...args);
        }
    },

    /**
     * Animate style chance and return a promise
     * @param element
     * @returns {Promise}
     */
    animate(element, ...args) {
        if (!this._checkElement(element)) {
            args.unshift(element);
            args.unshift(this.getDOMElement(this.element));
        } else {
            args.unshift(this.getDOMElement(element));
        }

        return jQuery.Velocity.animate(...args);
    },

    /**
     * Get CSS value for a property
     * @param {Ember.View|jQuery} element
     * @param {string} property
     * @returns {*}
     */
    getCSSPropertyValue(element, property) {
        return jQuery.Velocity.CSS.getPropertyValue(this.getDOMElement(element), property);
    },

    /**
     * Set CSS for a property
     * @param {Ember.View|jQuery} element
     * @param {string} property
     * @param {string} value
     * @returns {*}
     */
    setCSSPropertyValue(element, property, value) {
        return jQuery.Velocity.CSS.setPropertyValue(this.getDOMElement(element), property, value);
    },

    /**
     * Ensures that passes element is a jQuery element. When a view is passes, the element is returned.
     * @param {undefined|Object|JQuery} element
     * @returns {*}
     */
    getDOMElement(element) {
        assert('element must be an jQuery element or Component-like', this._checkElement(element));

        if (element.element) {
            element = element.element;
        } else if (element instanceof jQuery) {
            element = element[0];
        }
        return element;
    },

    /**
     * Check if element is an Ember View or jQuery Element
     * @param element
     * @returns {boolean}
     * @private
     */
    _checkElement(element) {
        return element.element || element instanceof Element || element instanceof jQuery;
    }
});
