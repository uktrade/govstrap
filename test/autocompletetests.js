"use strict";

import $ from 'jquery';
import Autocomplete from '../javascripts/autocomplete';
const PAUSE = 500;

describe('Autocomplete', function() {
  let field;
  let displayField;
  let mainElement;

  beforeEach(() => {
    $('#template').hide();
  });

  afterEach(() => {
    $('#main').text('');
  });

  describe('show suggestions', () => {
    describe('local array source', () => {

      beforeEach(() => {
        let templateHtml = $('#array-template').html();
        setup(templateHtml);
      });

      it('should initially show no suggestions', () => {
        let suggestions = mainElement.find('.suggestion');
        expect(suggestions.length).to.equal(0);
      });
      it('should show suggestions when a person enters something', () => {
        pressKey('o');
        let suggestions = mainElement.find('.autosuggest__suggestion:visible');
        expect(suggestions.length).to.equal(3);
      });
      it('should clear suggestions if the user continues to type and there is no match', () => {
        pressKey('o');
        expect(mainElement.find('.autosuggest__suggestion:visible').length).to.equal(3);
        pressKey('t');
        expect(mainElement.find('.autosuggest__suggestion:visible').length).to.equal(0);
      });
      it('should show text in a suggestion', () => {
        pressKey('o');
        let suggestion = mainElement.find('.autosuggest__suggestion:first-child');
        expect(suggestion.text()).to.contain('George');
      });
      it('should highlight matched text in a suggestion', () => {
        pressKey('o');
        let highlight = mainElement.find('.autosuggest__suggestion:first-child strong');
        expect(highlight.text()).to.equal('o');
      });
      it('should set a data attribute in a suggestion to store the value to use', () => {
        pressKey('o');
        let suggestion = mainElement.find('.autosuggest__suggestion:first-child');
        expect(suggestion.data('value')).to.equal('George');
      });
    });
    describe('local object source', () => {

      beforeEach(() => {
        let templateHtml = $('#object-template').html();
        setup(templateHtml);
      });

      it('should initially show no suggestions', () => {
        let suggestions = mainElement.find('.suggestion');
        expect(suggestions.length).to.equal(0);
      });
      it('should show suggestions when a person enters something', () => {
        pressKey('o');
        let suggestions = mainElement.find('.autosuggest__suggestion:visible');
        expect(suggestions.length).to.equal(2);
      });
      it('should clear suggestions if the user continues to type and there is no match', () => {
        pressKey('o');
        expect(mainElement.find('.autosuggest__suggestion:visible').length).to.equal(2);
        pressKey('t');
        expect(mainElement.find('.autosuggest__suggestion:visible').length).to.equal(0);
      });
      it('should show text in a suggestion', () => {
        pressKey('o');
        let suggestion = mainElement.find('.autosuggest__suggestion:first-child');
        expect(suggestion.text()).to.contain('Dan Richardson');
      });
      it('should highlight matched text in a suggestion', () => {
        pressKey('o');
        let highlight = mainElement.find('.autosuggest__suggestion:first-child strong');
        expect(highlight.text()).to.equal('o');
      });
      it('should set a data attribute in a suggestion to store the value to use', () => {
        pressKey('o');
        let suggestion = mainElement.find('.autosuggest__suggestion:first-child');
        expect(suggestion.data('value')).to.equal('C51');
      });
    });
    describe('ajax array source', () => {

      beforeEach(() => {
        let templateHtml = $('#ajax-template').html();
        setup(templateHtml);
      });

      it('should initially show no suggestions', () => {
        let suggestions = mainElement.find('.suggestion');
        expect(suggestions.length).to.equal(0);
      });
      it('should show suggestions when a person enters something', () => {
        return new Promise((fulfill) => {
          pressKey('o');
          pause(PAUSE)
            .then(() => {
              let suggestions = mainElement.find('.autosuggest__suggestion:visible');
              expect(suggestions.length).to.equal(3);
              fulfill();
            });
        });
      });
      it('should clear suggestions if the user continues to type and there is no match', () => {
        return new Promise((fulfill) => {
          pressKey('o');
          pause(PAUSE)
            .then(() => {
              let suggestions = mainElement.find('.autosuggest__suggestion:visible');
              expect(suggestions.length).to.equal(3);
              pressKey('t');
              return pause(PAUSE);
            })
            .then(() => {
              let suggestions = mainElement.find('.autosuggest__suggestion:visible');
              expect(suggestions.length).to.equal(0);
              fulfill();
            });
        });
      });
      it('should show text in a suggestion', () => {
        return new Promise((fulfill) => {
          pressKey('o');
          pause(PAUSE)
            .then(() => {
              let suggestion = mainElement.find('.autosuggest__suggestion:first-child');
              expect(suggestion.text()).to.contain('George');
              fulfill();
            });
        });
      });
      it('should highlight matched text in a suggestion', () => {
        return new Promise((fulfill) => {
          pressKey('o');
          pause(PAUSE)
            .then(() => {
              let highlight = mainElement.find('.autosuggest__suggestion:first-child strong');
              expect(highlight.text()).to.equal('o');
              fulfill();
            });
        });
      });
      it('should set a data attribute in a suggestion to store the value to use', () => {
        return new Promise((fulfill) => {
          pressKey('o');
          pause(PAUSE)
            .then(() => {
              let suggestion = mainElement.find('.autosuggest__suggestion:first-child');
              expect(suggestion.data('value')).to.equal('George');
              fulfill();
            });
        });
      });
    });
  });
  describe('Hide suggestions', () => {

    beforeEach(() => {
      let templateHtml = $('#array-template').html();
      setup(templateHtml);
      pressKey('o');
    });

    it('should hide suggestions when you press tab', () => {
      let event = $.Event('keyup');
      event.keyCode = 9;
      displayField.trigger(event);
      let suggestions = mainElement.find('.autosuggest__suggestion:visible');
      expect(suggestions.length).to.equal(0);
    });
    it('should hide suggestions when you press escape', () => {
      let event = $.Event('keyup');
      event.keyCode = 27;
      displayField.trigger(event);
      let suggestions = mainElement.find('.autosuggest__suggestion:visible');
      expect(suggestions.length).to.equal(0);
    });
    it('should hide suggestions when you press enter', () => {
      let event = $.Event('keyup');
      event.keyCode = 13;
      displayField.trigger(event);
      let suggestions = mainElement.find('.autosuggest__suggestion:visible');
      expect(suggestions.length).to.equal(0);
    });
    it('should hide suggestions when you click elsewhere', () => {
      var version = detectIE();


      if (version === false || version > 11) {
        displayField.blur();
        let suggestions = mainElement.find('.autosuggest__suggestion:visible');
        expect(suggestions.length).to.equal(0);
      }
    });
  });
  describe('navigate suggestions', () => {

    let firstSuggestion;
    let secondSuggestion;
    let thirdSuggestion;

    beforeEach(() => {
      let templateHtml = $('#array-template').html();
      setup(templateHtml);
      pressKey('o');
      let suggestions = mainElement.find('.autosuggest__suggestion:visible');
      firstSuggestion = suggestions[0];
      secondSuggestion = suggestions[1];
      thirdSuggestion = suggestions[2];

    });

    it('should highlight the first option by default', () => {
      expect(firstSuggestion.className).to.contain('autosuggest__suggestion--active');
      expect(secondSuggestion.className).to.not.contain('autosuggest__suggestion--active');
      expect(thirdSuggestion.className).to.not.contain('autosuggest__suggestion--active');
    });
    it('should highlight the second option when you arrow down', () => {
      arrowDown();
      expect(firstSuggestion.className).to.not.contain('autosuggest__suggestion--active');
      expect(secondSuggestion.className).to.contain('autosuggest__suggestion--active');
      expect(thirdSuggestion.className).to.not.contain('autosuggest__suggestion--active');
    });
    it('should highlight the third option when you arrow down twice', () => {
      arrowDown();
      arrowDown();
      expect(firstSuggestion.className).to.not.contain('autosuggest__suggestion--active');
      expect(secondSuggestion.className).to.not.contain('autosuggest__suggestion--active');
      expect(thirdSuggestion.className).to.contain('autosuggest__suggestion--active');
    });
    it('should highlight the 2nd option when you arrow down twice then arrow up once', () => {
      arrowDown();
      arrowDown();
      arrowUp();
      expect(firstSuggestion.className).to.not.contain('autosuggest__suggestion--active');
      expect(secondSuggestion.className).to.contain('autosuggest__suggestion--active');
      expect(thirdSuggestion.className).to.not.contain('autosuggest__suggestion--active');
    });
    it('should highlight the first option when you arrow down twice then arrow up twice', () => {
      arrowDown();
      arrowDown();
      arrowUp();
      arrowUp();
      expect(firstSuggestion.className).to.contain('autosuggest__suggestion--active');
      expect(secondSuggestion.className).to.not.contain('autosuggest__suggestion--active');
      expect(thirdSuggestion.className).to.not.contain('autosuggest__suggestion--active');
    });
    it('should highlight the first option when you arrow down on the last option', () => {
      arrowDown();
      arrowDown();
      arrowDown();
      expect(firstSuggestion.className).to.contain('autosuggest__suggestion--active');
      expect(secondSuggestion.className).to.not.contain('autosuggest__suggestion--active');
      expect(thirdSuggestion.className).to.not.contain('autosuggest__suggestion--active');
    });
    it('should highlight the last option when you arrow up from the first option', () => {
      arrowUp();
      expect(firstSuggestion.className).to.not.contain('autosuggest__suggestion--active');
      expect(secondSuggestion.className).to.not.contain('autosuggest__suggestion--active');
      expect(thirdSuggestion.className).to.contain('autosuggest__suggestion--active');
    });

  });
  describe('select suggestion', () => {
    describe('array data source', () => {
      beforeEach(() => {
        let templateHtml = $('#array-template').html();
        setup(templateHtml);
        pressKey('o');
      });
      it('should display the highlighted value when you press tab', () => {
        let event = $.Event('keyup');
        event.keyCode = 9;
        displayField.trigger(event);
        expect(displayField.val()).to.equal('George');
      });
      it('should display the highlighted value when you press enter', () => {
        let event = $.Event('keyup');
        event.keyCode = 13;
        displayField.trigger(event);
        expect(displayField.val()).to.equal('George');
      });
      it('should display the highlighted value when click a value', () => {
        let event = $.Event('keyup');
        event.keyCode = 13;
        displayField.trigger(event);
        expect(displayField.val()).to.equal('George');
      });
      it('should set the value of the original field when you select a value', () => {
        $('.autosuggest__suggestion:first-child a').click();
        expect(field.val()).to.equal('George');
      });
    });
    describe('object data source', () => {
      beforeEach(() => {
        let templateHtml = $('#object-template').html();
        setup(templateHtml);
        pressKey('o');
      });
      it('should display the highlighted value when you press tab', () => {
        let event = $.Event('keyup');
        event.keyCode = 9;
        displayField.trigger(event);
        expect(displayField.val()).to.equal('Dan Richardson');
      });
      it('should display the highlighted value when you press enter', () => {
        let event = $.Event('keyup');
        event.keyCode = 13;
        displayField.trigger(event);
        expect(displayField.val()).to.equal('Dan Richardson');
      });
      it('should display the highlighted value when click a value', () => {
        let event = $.Event('keyup');
        event.keyCode = 13;
        displayField.trigger(event);
        expect(displayField.val()).to.equal('Dan Richardson');
      });
      it('should set the value of the original field when you select a value', () => {
        $('.autosuggest__suggestion:first-child a').click();
        expect(field.val()).to.equal('C51');
      });
    });
  });
  describe('initial population', () => {
    it('should show the initial value for an array source', () => {
      let templateHtml = $('#array-template').html();
      mainElement = $('#main');
      mainElement.html(templateHtml);

      field = mainElement.find('input');
      field.val('George');

      new Autocomplete(field);
      displayField = mainElement.find('input.autocomplete:visible');
      expect(displayField.val()).to.equal('George');
    });
    it('should show the initial value for an object source', () => {
      let templateHtml = $('#object-template').html();
      mainElement = $('#main');
      mainElement.html(templateHtml);

      field = mainElement.find('input');
      field.val('A13');

      new Autocomplete(field);
      displayField = mainElement.find('input.autocomplete:visible');
      expect(displayField.val()).to.equal('Fred Smith');
    });
  });

  function setup(templateHtml) {

    mainElement = $('#main');
    mainElement.html(templateHtml);

    field = mainElement.find('input');
    field.val('');

    new Autocomplete(field);
    displayField = mainElement.find('input.autocomplete:visible');
  }
  function pressKey(letter) {

    let charCode = letter.charCodeAt(0);

    if (!displayField.is(':focus')) {
      displayField.focus();
    }

    let event = $.Event('keyup');
    event.keyCode = charCode - 32;


    displayField.val(displayField.val() + letter);
    displayField.trigger(event);
    displayField.change();

  }
  function arrowDown() {
    let event = $.Event('keydown');
    event.keyCode = 40;
    displayField.trigger(event);
  }
  function arrowUp() {
    let event = $.Event('keydown');
    event.keyCode = 38;
    displayField.trigger(event);
  }
  function pause(time) {
    return new Promise((fulfill, reject) => {
      window.setTimeout(() => {
        fulfill();
      }, time);
    });
  }

  function detectIE() {
    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
  }
});
