'use strict';

import $ from 'jquery';
const ACTIVECLASS = 'autosuggest__suggestion--active';


class Autocomplete {

  constructor(element) {
    this.$element = $(element).find('input');
    this.options = this.$element.data('options');
    this.shown = false;
    this.$menu = $('<ul class="autosuggest__suggestions"></ul>');
    this.item = '<li class="autosuggest__suggestion"><a href="#"></a></li>';
    this.maxItems = 8;
    this.minLength = 1;
    this.listen();
    this.optionsUrl = this.$element.data('options-url');
  }

  select() {
    var val = this.$menu.find(`.${ACTIVECLASS}`).attr('data-value');
      this.$element
        .val(val)
        .change();
    return this.hide();
  }

  show() {

    var pos = $.extend({}, this.$element.position(), {
       height: this.$element[0].offsetHeight
    });

    this.$menu
      .insertAfter(this.$element)
      .css({
        top: pos.top + pos.height
        , left: pos.left
      })
      .show();

    this.shown = true;
    return this;
  }

  hide() {
    this.$menu.hide();
    this.shown = false;
    return this;
  }

  lookup() {
    const term = this.term = this.$element.val();

    if (this.optionsUrl && this.optionsUrl.length > 0) {
      this.lookupAjax(term);
    } else {
      this.lookupLocal(term);
    }
  }

  lookupLocal(term) {

    if (!term || term.length < this.minLength) {
      return this.shown ? this.hide() : this;
    }

    let matchingItems = this.options.filter((item) => {
      return item.toLowerCase().indexOf(term.toLowerCase()) !== -1;
    }).sort((a, b) => { return a.toLowerCase().localeCompare(b.toLowerCase()); });

    if (matchingItems.length > 0) {
      this.render(matchingItems).show();
    } else {
      this.hide();
    }

    return null;
  }

  lookupAjax(term) {
    const xmlhttp = new XMLHttpRequest();
    const handleAjaxResult = this.handleAjaxResult;

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        const myArr = JSON.parse(xmlhttp.responseText);
        handleAjaxResult(myArr);
      }
    };

    xmlhttp.open('GET', `${this.optionsUrl}${term}`, true);
    xmlhttp.send();
  }

  handleAjaxResult = (result) => {
    if (result.length > 0) {
      result = result.sort((a, b) => { return a.toLowerCase().localeCompare(b.toLowerCase()); });
      this.render(result).show();
    } else {
      this.hide();
    }
  };

  highlighter = (item) => {
    const term = this.term.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    return item.replace(new RegExp('(' + term + ')', 'ig'), ($1, match) => {
      return '<strong>' + match + '</strong>';
    });
  };

  render(items) {

    let itemMarkup = this.item;
    let highlighter = this.highlighter;

    let suggestionElements = items.slice(0, this.maxItems).map((item) => {
      let suggestionElement = $(itemMarkup).attr('data-value', item);
      suggestionElement.find('a').html(highlighter(item));
      return suggestionElement[0];
    });

    suggestionElements[0].className += ' ' + ACTIVECLASS;
    this.$menu.html(suggestionElements);
    return this;
  }

  next() {
    var active = this.$menu.find(`.${ACTIVECLASS}`).removeClass(ACTIVECLASS)
      , next = active.next();

    if (!next.length) {
      next = $(this.$menu.find('li')[0]);
    }

    next.addClass(ACTIVECLASS);
  }

  prev() {
    var active = this.$menu.find(`.${ACTIVECLASS}`).removeClass(ACTIVECLASS)
      , prev = active.prev();

    if (!prev.length) {
      prev = this.$menu.find('li').last();
    }

    prev.addClass(ACTIVECLASS);
  }

  listen() {
    this.$element
      .on('focus', this.focus)
      .on('blur', this.blur)
      .on('keypress', this.keypress)
      .on('keyup', this.keyup);

    if (this.eventSupported('keydown')) {
      this.$element.on('keydown', this.keydown);
    }

    this.$menu
      .on('click', this.click)
      .on('mouseenter', 'li', this.mouseenter)
      .on('mouseleave', 'li', this.mouseleave);
  }

  eventSupported(eventName) {
    var isSupported = eventName in this.$element;
    if (!isSupported) {
      this.$element.setAttribute(eventName, 'return;');
      isSupported = typeof this.$element[eventName] === 'function';
    }
    return isSupported;
  }

  move = (event) => {
    if (!this.shown) return;

    switch (event.keyCode) {
      case 9: // tab
      case 13: // enter
      case 27: // escape
        event.preventDefault();
        break;

      case 38: // up arrow
        event.preventDefault();
        this.prev();
        break;

      case 40: // down arrow
        event.preventDefault();
        this.next();
        break;
    }

    event.stopPropagation();
  };

  keydown = (event) => {
    this.suppressKeyPressRepeat = ~$.inArray(event.keyCode, [40, 38, 9, 13, 27]);
    this.move(event);
  };

  keypress = (event) => {
    if (this.suppressKeyPressRepeat) return;
    this.move(event);
  };

  keyup = (event) => {
    switch (event.keyCode) {
      case 40: // down arrow
      case 38: // up arrow
      case 16: // shift
      case 17: // ctrl
      case 18: // alt
        break;

      case 9: // tab
      case 13: // enter
        if (!this.shown) return;
        this.select();
        break;

      case 27: // escape
        if (!this.shown) return;
        this.hide();
        break;

      default:
        this.lookup();
    }

    event.stopPropagation();
    event.preventDefault();
  };

  focus = () => {
    this.focused = true;
  };

  blur = () => {
    this.focused = false;
    if (!this.mousedover && this.shown) this.hide();
  };

  click = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.select();
    this.$element.focus();
  };

  mouseenter = (event) => {
    this.mousedover = true;
    this.$menu.find(`.${ACTIVECLASS}`).removeClass(ACTIVECLASS);
    $(event.currentTarget).addClass(ACTIVECLASS);
  };

  mouseleave = () => {
    this.mousedover = false;
    if (!this.focused && this.shown) this.hide();
  };

}

export default Autocomplete;
