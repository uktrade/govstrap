'use strict';

import $ from 'jquery';
import AddAnother from '../../javascripts/addanother';
import RadioHide from '../../javascripts/radiohide';
import Edit from '../../javascripts/edit';
import SearchBar from '../../javascripts/searchbar';
import SelectionButton from '../../javascripts/selectionbutton';
import Tabs from '../../javascripts/tabs';
import Autocomplete from '../../javascripts/autocomplete';


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

$('.js-autocomplete').each((index, element) => {
  new Autocomplete(element);
});
