'use strict';

import $ from 'jquery';
import AddAnother from '../../javascripts/addanother';
import Edit from '../../javascripts/edit';
import RadioHideComponent from '../../javascripts/radiohide';
import SearchBar from '../../javascripts/searchbar';


$('.js-add-another').each((index, element) => {
    new AddAnother(element);
});

$('.js-hidden-edit').each((index, element) => {
  new Edit(element);
});

$('.js-radiohide').each((index, element) => {
  new RadioHideComponent(element);
});

new SearchBar('js-searchbar');

//el: '.form-group__checkbox-group :radio',
//  el: '.js-tabs',
