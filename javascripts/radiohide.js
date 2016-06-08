'use strict';

import $ from 'jquery';


class RadioHideComponent {

  constructor(element) {
    this.element = $(element);
    this.radio = this.element.find('input[type=radio]');
    this.content = this.element.find('.js-radiohide-content');
    this.radio.on('change', this.updateView);

    this.updateView();
  }

  updateView = () => {
    let value = 'no';
    for (let iPos = 0; iPos < this.radio.length; iPos += 1) {
      if (this.radio[iPos].checked === true) {
        value = this.radio[iPos].value.toLowerCase();
      }
    }

    if (value === 'no') {
      this.content.hide();
    } else {
      this.content.show();
    }
  }

}

export default RadioHideComponent;
