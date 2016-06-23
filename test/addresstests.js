'use strict';

import $ from 'jquery';
import AddressControl from '../javascripts/addresscontrol';

describe('Address', function() {

  let templateElement;
  let mainElement;

  beforeEach(() => {
    templateElement = $('#template');
    mainElement = $('#main');
    templateElement.hide();
  });

  describe('display without javascript', () => {

    it('should have fields for all address elements when there is data', () => {

      mainElement.html(templateElement.find('#populated').html());

      expect(mainElement.find('[name="operatingAddress.country"]:visible').length).to.eq(1);
      expect(mainElement.find('[name="operatingAddress.address1"]:visible').length).to.eq(1);
      expect(mainElement.find('[name="operatingAddress.address2"]:visible').length).to.eq(1);
      expect(mainElement.find('[name="operatingAddress.city"]:visible').length).to.eq(1);
      expect(mainElement.find('[name="operatingAddress.county"]:visible').length).to.eq(1);
      expect(mainElement.find('[name="operatingAddress.postcode"]:visible').length).to.eq(1);
      expect(mainElement.find('.find-address:visible').length).to.eq(0);
    });
    it('should have fields for all address elements when there is no data', () => {

      mainElement.html(templateElement.find('#not-populated').html());

      expect(mainElement.find('[name="operatingAddress.country"]:visible').length).to.eq(1);
      expect(mainElement.find('[name="operatingAddress.address1"]:visible').length).to.eq(1);
      expect(mainElement.find('[name="operatingAddress.address2"]:visible').length).to.eq(1);
      expect(mainElement.find('[name="operatingAddress.city"]:visible').length).to.eq(1);
      expect(mainElement.find('[name="operatingAddress.county"]:visible').length).to.eq(1);
      expect(mainElement.find('[name="operatingAddress.postcode"]:visible').length).to.eq(1);
      expect(mainElement.find('.find-address:visible').length).to.eq(0);
    });
  });

  describe('Address control', () => {

    beforeEach(() => {
      mainElement.html(templateElement.find('#not-populated').html());
      new AddressControl(mainElement.find('.js-address'));
      this.xhr = sinon.useFakeXMLHttpRequest();

      this.requests = [];
      this.xhr.onCreate = function(xhr) {
        this.requests.push(xhr);
      }.bind(this);
     });

    afterEach(() => {
      this.xhr.restore();
    });

    describe('section visability', () => {
      it('should only display the country field, and no others, when there is no data.', () => {

        expect(mainElement.find('#operatingAddress-country-x:visible').length).to.eq(1);

        expect(mainElement.find('.address__lookup-wrapper:visible').length).to.eq(0);

        expect(mainElement.find('[name="operatingAddress.address1"]:visible').length).to.eq(0);
        expect(mainElement.find('[name="operatingAddress.address2"]:visible').length).to.eq(0);
        expect(mainElement.find('[name="operatingAddress.city"]:visible').length).to.eq(0);
        expect(mainElement.find('[name="operatingAddress.county"]:visible').length).to.eq(0);
        expect(mainElement.find('[name="operatingAddress.postcode"]:visible').length).to.eq(0);

      });

      it('should reveal the full address if the manual entry link is selected', () => {
        mainElement.find('.reveal-manual-entry').click();
        expect(mainElement.find('[name="operatingAddress.address1"]:visible').length).to.eq(1);
        expect(mainElement.find('[name="operatingAddress.address2"]:visible').length).to.eq(1);
        expect(mainElement.find('[name="operatingAddress.city"]:visible').length).to.eq(1);
        expect(mainElement.find('[name="operatingAddress.county"]:visible').length).to.eq(1);
      });
      it('should show full address fields when none uk country selected', () => {
        mainElement.find('#operatingAddress-country').val('Spain').change();
        expect(mainElement.find('[name="operatingAddress.address1"]:visible').length).to.eq(1);
        expect(mainElement.find('[name="operatingAddress.address2"]:visible').length).to.eq(1);
        expect(mainElement.find('[name="operatingAddress.city"]:visible').length).to.eq(1);
        expect(mainElement.find('[name="operatingAddress.county"]:visible').length).to.eq(1);
      });

      it('should hide postcode finder if non uk country selected', () => {
        mainElement.find('#operatingAddress-country-x').val('Spain').change();
        expect(mainElement.find('.address__lookup-wrapper:visible').length).to.eq(0);
      });
      it('should show the postcode finder if united kingdom is selected', () => {
        mainElement.find('#operatingAddress-country').val('United Kingdom').change();
        expect(mainElement.find('.address__lookup-wrapper:visible').length).to.eq(1);
      })
    });

    describe('address selector', () => {
      it('should reveal a dropdown of addresses if there is more than one for a postcode', () => {
        let data = [{
          address1: "Annexe Blackthorn Cottage",
          address2: "Chawridge Lane",
          city: "Windsor",
          county: "Berkshire"
        },{
          address1: "Blackthorn Cottage",
          address2: "Chawridge Lane",
          city: "Windsor",
          county: "Berkshire"
        }, {
          address1: "Chawridge Manor Farm",
          address2: "Chawridge Lane",
          city: "Windsor",
          county: "Berkshire"
        }];

        mainElement.find('#operatingAddress-country').val('United Kingdom').change();
        mainElement.find('.postcode-lookup-value').val('sl4 4qr').change();
        mainElement.find('.lookup-postcode-button').click();

        this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(data));

        expect(mainElement.find('.form-group--pick-address:visible').length).to.eq(1);
        expect(mainElement.find('.form-group--pick-address select option').length).to.eq(3);

      });
      it('should not show a dropdown of addresses if there are no matches for postcode', () => {
        let data = [];

        mainElement.find('.postcode-lookup-value').val('sl4 4qr');
        mainElement.find('.lookup-postcode-button').click();

        this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(data));

        expect(mainElement.find('.form-group--pick-address:visible').length).to.eq(0);
        expect(mainElement.find('.form-group--pick-address select option').length).to.eq(0);
      });
      it('should not show a dropdown of addresses if there only one postcode match', () => {
        let data = [
          {
            address1: 'address1',
            address2: 'address2',
            city: 'city',
            county: 'county',
            postcode: 'sl4 4qr'
          }
        ];

        mainElement.find('.postcode-lookup-value').val('sl4 4qr');
        mainElement.find('.lookup-postcode-button').click();

        this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(data));

        expect(mainElement.find('.form-group--pick-address:visible').length).to.eq(0);
        expect(mainElement.find('.form-group--pick-address select option').length).to.eq(0);
      });
      it('should populate the address fields with the first match and show them', () => {
        let data = [
          {
            address1: 'Blackthorn Cottage',
            address2: 'Chawridge Lane',
            city: 'city',
            county: 'county',
            postcode: 'sl4 4qr'
          },
          {
            address1: 'The Annex',
            address2: 'Chawridge Lane',
            city: 'city',
            county: 'county',
            postcode: 'sl4 4qr'
          }
        ];

        mainElement.find('#operatingAddress-country').val('United Kingdom').change();
        mainElement.find('.postcode-lookup-value').val('sl4 4qr').change();
        mainElement.find('.lookup-postcode-button').click();

        this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(data));

        expect(mainElement.find('[name="operatingAddress.address1"]:visible').val()).to.eq('Blackthorn Cottage');
        expect(mainElement.find('[name="operatingAddress.address2"]:visible').val()).to.eq('Chawridge Lane');
        expect(mainElement.find('[name="operatingAddress.city"]:visible').val()).to.eq('city');
        expect(mainElement.find('[name="operatingAddress.county"]:visible').val()).to.eq('county');
      });
      it('should re-populate the address fields when a user selects an address from the dropdown', () => {
        let data = [
          {
            address1: 'Blackthorn Cottage',
            address2: 'Chawridge Lane',
            city: 'city',
            county: 'county',
            postcode: 'sl4 4qr'
          },
          {
            address1: 'The Annex',
            address2: 'Chawridge Lane',
            city: 'city',
            county: 'county',
            postcode: 'sl4 4qr'
          }
        ];

        mainElement.find('#operatingAddress-country').val('United Kingdom').change();
        mainElement.find('.postcode-lookup-value').val('sl4 4qr').change();
        mainElement.find('.lookup-postcode-button').click();

        this.requests[0].respond(200, {'Content-Type': 'text/json'}, JSON.stringify(data));

        let select = mainElement.find('.form-group--pick-address select');
        select.val("The Annex-Chawridge Lane").change();

        expect(mainElement.find('[name="operatingAddress.address1"]:visible').val()).to.eq('The Annex');
        expect(mainElement.find('[name="operatingAddress.address2"]:visible').val()).to.eq('Chawridge Lane');
        expect(mainElement.find('[name="operatingAddress.city"]:visible').val()).to.eq('city');
        expect(mainElement.find('[name="operatingAddress.county"]:visible').val()).to.eq('county');
      });
    });

    it('should hide the postcode finder and dropdown if the user changes the country', () => {
      mainElement.find('#operatingAddress-country').val('United Kingdom').change();
      expect(mainElement.find('.address__lookup-wrapper:visible').length).to.eq(1);
      mainElement.find('#operatingAddress-country').val('Spain').change();
      expect(mainElement.find('.address__lookup-wrapper:visible').length).to.eq(0);
    });

  });

  describe('prepopulated address', () => {
    beforeEach(() => {
      mainElement.html(templateElement.find('#populated').html());
      new AddressControl(mainElement.find('.js-address'));
      this.xhr = sinon.useFakeXMLHttpRequest();

      this.requests = [];
      this.xhr.onCreate = function(xhr) {
        this.requests.push(xhr);
      }.bind(this);
    });

    afterEach(() => {
      this.xhr.restore();
    });

    it('should show a new empty, visible, postcode finder for uk addresses', () => {
      expect(mainElement.find('.address__lookup-wrapper:visible').length).to.eq(1);
      expect(mainElement.find('.form-group--pick-address:visible').length).to.eq(0);
      expect(mainElement.find('.form-group--pick-address select option').length).to.eq(0);
    });
    it('should not show the manual button', () => {
      expect(mainElement.find('.reveal-manual-entry:visible').length).to.eq(0);
    });
    it('should show the address details', () => {
      expect(mainElement.find('[name="operatingAddress.address1"]:visible').val()).to.eq('Address1');
      expect(mainElement.find('[name="operatingAddress.address2"]:visible').val()).to.eq('Address2');
      expect(mainElement.find('[name="operatingAddress.city"]:visible').val()).to.eq('City');
      expect(mainElement.find('[name="operatingAddress.county"]:visible').val()).to.eq('Berkshire');
      expect(mainElement.find('[name="operatingAddress.postcode"]:visible').val()).to.eq('postcode');
    });

  });

  describe('Error handling', () => {

    describe('server errors', () => {

    });

    describe('validate on submit', () => {

      let addressControl;
      let form;
      let validateSpy;

      beforeEach(() => {
        mainElement.html(templateElement.find('#not-populated').html());

        validateSpy = sinon.spy(AddressControl.prototype, 'validate');
        addressControl = new AddressControl(mainElement.find('.js-address'));
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];
        this.xhr.onCreate = function(xhr) {
          this.requests.push(xhr);
        }.bind(this);

        form = mainElement.find('form');
        form.on('submit', (event) => {
          event.preventDefault();
        });
      });

      afterEach(() => {
        this.xhr.restore();
        validateSpy.restore();
      });


      it('should validate when the form is submitted', () => {
        form.submit();
        expect(addressControl.validate.callCount).to.eq(1);
      });
      it('should require address1 and city at least.', () => {
        addressControl.validate();
        let errors = addressControl.errors;
        expect(errors).to.have.property('address1');
        expect(errors).to.have.property('city');
        expect(errors).to.have.property('country');

      });
      it('should not have errors if required fields have values.', () => {
        mainElement.find('[name="operatingAddress.country"]').val('United Kingdom').change();
        mainElement.find('[name="operatingAddress.address1"]').val('address1').change();
        mainElement.find('[name="operatingAddress.city"]').val('city').change();
        addressControl.validate();
        let keys = Object.keys(addressControl.errors);
        expect(keys.length).to.eq(0);
      });
      it('should mark the whole address section as having an error with a red left border if not in a hidden section', () => {
        addressControl.validate();
        expect(mainElement.find('fieldset.incomplete').length).to.eq(1);
      });
      it('should clear the error on the section when an error is corrected.', () => {
        addressControl.validate();
        mainElement.find('[name="operatingAddress.country"]').val('United Kingdom').change();
        mainElement.find('[name="operatingAddress.address1"]').val('address1').change();
        mainElement.find('[name="operatingAddress.city"]').val('city').change();
        addressControl.validate();
        expect(mainElement.find('fieldset.error').length).to.eq(0);
      });
      it('should mark the outer section a having an error if it is within a hidden section', () => {
        mainElement.html(templateElement.find('#hidden-panel').html());
        addressControl = new AddressControl(mainElement.find('.js-address'));
        addressControl.validate();
        expect(mainElement.find('.js-radiohide-content.incomplete').length).to.eq(1);
        expect(mainElement.find('fieldset.incomplete').length).to.eq(0);
      });
      
      it('should show an error description at the top of the section if there is an error', () => {
        addressControl.validate();

        let errorMessageElement = mainElement.find('.error-message');

        expect(errorMessageElement.length).to.eq(1);
        expect(errorMessageElement.text()).to.eq('The address supplied is incomplete');

      });
      it('should only highlight fields that have issues', () => {
        addressControl.validate();
        expect(mainElement.find('.form-group--incomplete').length).to.eq(3);
      });
      it('should clear issues from fields once they have been corrected.', () => {
        addressControl.validate();
        expect(mainElement.find('.form-group--incomplete').length).to.eq(3);
        mainElement.find('[name="operatingAddress.country"]').val('United Kingdom').change();
        mainElement.find('[name="operatingAddress.address1"]').val('address1').change();
        mainElement.find('[name="operatingAddress.city"]').val('city').change();
        addressControl.validate();
        expect(mainElement.find('.form-group--incomplete').length).to.eq(0);
      });

    });



  });

  describe('Optional non-uk address handling', () => {

    describe('optional', () => {

      let addressControl;

      beforeEach(() => {
        mainElement.html(templateElement.find('#not-required').html());
        addressControl = new AddressControl(mainElement.find('.js-address'));
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];
        this.xhr.onCreate = function(xhr) {
          this.requests.push(xhr);
        }.bind(this);
      });

      afterEach(() => {
        this.xhr.restore();
      });

      it('should not show label saying "address details optional" if no country', () => {
        expect(mainElement.find('.optional-nonuk-label:visible').length).to.eq(0);
      });
      it('should not show label saying "address details optional" if UK', () => {
        mainElement.find('[name="operatingAddress.country"]').val('United Kingdom').change();
        expect(mainElement.find('.optional-nonuk-label:visible').length).to.eq(0);
      });
      it('should show a label saying "address details optional" if none uk', () => {
        mainElement.find('[name="operatingAddress.country"]').val('Spain').change();
        expect(mainElement.find('.optional-nonuk-label:visible').length).to.eq(1);
      });
      it('should not throw a validation error when country is none uk and address missing', () => {
        mainElement.find('[name="operatingAddress.country"]').val('Spain').change();
        let answer = addressControl.validate();
        expect(answer).to.eq(true);
        expect(Object.keys(addressControl.errors).length).to.eq(0);
      });
      it('should throw a validation error when country is uk and address missing', () => {
        mainElement.find('[name="operatingAddress.country"]').val('United Kingdom').change();
        let answer = addressControl.validate();
        expect(answer).to.eq(false);
        expect(Object.keys(addressControl.errors).length).to.eq(2);
      });
    });

    describe('not optional', () => {
      let addressControl;

      beforeEach(() => {
        mainElement.html(templateElement.find('#not-populated').html());
        addressControl = new AddressControl(mainElement.find('.js-address'));
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.requests = [];
        this.xhr.onCreate = function(xhr) {
          this.requests.push(xhr);
        }.bind(this);
      });

      afterEach(() => {
        this.xhr.restore();
      });

      it('should not show a label saying "address details optional" if none uk', () => {
        mainElement.find('[name="operatingAddress.country"]').val('Spain').change();
        expect(mainElement.find('.optional-nonuk-label:visible').length).to.eq(0);
      });
      it('should not show label saying "address details optional" if UK', () => {
        mainElement.find('[name="operatingAddress.country"]').val('United Kingdom').change();
        expect(mainElement.find('.optional-nonuk-label:visible').length).to.eq(0);
      });
      it('should throw a validation error when country is none uk and address missing', () => {
        mainElement.find('[name="operatingAddress.country"]').val('Spain').change();
        let answer = addressControl.validate();
        expect(answer).to.eq(false);
        expect(Object.keys(addressControl.errors).length).to.eq(2);
      });
      it('should throw a validation error when country is uk and address missing', () => {
        mainElement.find('[name="operatingAddress.country"]').val('United Kingdom').change();
        let answer = addressControl.validate();
        expect(answer).to.eq(false);
        expect(Object.keys(addressControl.errors).length).to.eq(2);
      });
    });


  });

});
