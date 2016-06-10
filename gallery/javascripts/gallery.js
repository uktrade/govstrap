'use strict';

import $ from 'jquery';
import AddAnother from '../../javascripts/govstrap/addanother';
import RadioHide from '../../javascripts/govstrap/radiohide';
import Edit from '../../javascripts/govstrap/edit';
import SearchBar from '../../javascripts/govstrap/searchbar';
import SelectionButton from '../../javascripts/govstrap/selectionbutton';
import Tabs from '../../javascripts/govstrap/tabs';

$('.js-add-another').each((index, element) => {
    new AddAnother(element);
});

$('.js-hidden-edit').each((index, element) => {
  new Edit(element);
});

$('.js-radiohide').each((index, element) => {
  new RadioHide(element);
});

new SearchBar('js-searchbar');
$('.searchbar').each((index, element) => {
  new SearchBar(element);
});

$(':radio').each((index,element) => {
  new SelectionButton(element);
});

new Tabs('.js-tabs');
