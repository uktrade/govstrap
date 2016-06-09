'use strict';

import $ from 'jquery';

class RadioHideComponent {

  constructor(element) {
    this.element = $(element);
    this.radioButtons = this.element.find('input[type=radio]');
    this.content = this.element.find('.js-radiohide-content');
    this.radioButtons.on('change', this.updateView);
    this.content.hide();
    this.updateView();
  }

  updateView = () => {
    this.radioButtons.each((index, element) => {
      if (element.checked === true) {
        if (element.value == 'Yes') {
          this.content.show();
        } else {
          this.content.hide();
        }
      }
    });
  }

}

export default RadioHideComponent;
