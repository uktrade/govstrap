'use strict';

import $ from 'jquery';

class SelectionButtons {

  constructor(element) {
    this.selectedClass = 'selected';
    this.focusedClass = 'focused';
    this.element = $(element);
    this.setInitialState(this.element);
    this.addEvents();
  }

  addEvents() {
    if (typeof this.$elms !== 'undefined') {
      this.addElementLevelEvents();
    } else {
      this.addDocumentLevelEvents();
    }
  }

  setInitialState() {
    if (this.element.is(':checked')) {
        this.markSelected($elm);
    }
  }

  markFocused(element, state) {
    if (state === 'focused') {
      element.parent('label').addClass(this.focusedClass);
    } else {
      element.parent('label').removeClass(this.focusedClass);
    }
  }

  markSelected(element) {
    var radioName;

    if (element.attr('type') === 'radio') {
      radioName = element.attr('name');
      element.closest('form').find('input[name="' + radioName + '"]')
        .parent('label')
        .removeClass(this.selectedClass);
      element.parent('label').addClass(this.selectedClass);
    } else if ($elm.is(':checked')) {
        element.parent('label').addClass(this.selectedClass);
      } else {
        element.parent('label').removeClass(this.selectedClass);
      }
  }

  addElementLevelEvents() {


    this.element
      .on('click', this.clickHandler)
      .on('focus blur', this.focusHandler);
  }

  clickHandler = (event) => {
    this.markSelected($(event.target));
  }

  focusHandler(event) {
    var state = (event.type === focusEvent) ? 'focused' : 'blurred';
    this.markFocused($(event.target), state);
  }
}

export default SelectionButtons;
