"use strict";

describe("splitBillService", function () {
  var SplitBill;

  // Create the paynApp.services
  beforeEach(module('paynApp.services'));

  // Provide the service dependencies
  beforeEach(module(function($provide) {

    // Create a spy Pouch service
    let Pouch = function(){};
    Pouch.prototype.post = function(){};
    sinon.spy(Pouch);

    // Create a spy User service
    let User = {
      onChange: function(callback){
        callback({
          _id: '1234',
          firstName: 'Henry',
          lastName: 'Miskin'
        })
      }
    }
    sinon.spy(User,'onChange')

    // Register services to angular provider
    $provide.value('Pouch', Pouch);
    $provide.value('User', User);

  }));

  // Inject the SplitBill service
  beforeEach(inject(function (_SplitBill_) {
    SplitBill = _SplitBill_;
  }));

  // Test the reset method
  describe('.reset()', function() {    

    it("should reset bill", function () {

      SplitBill.bill = {
        splitEqually: false,
        owingUsers: [{
          firstName: 'Owing',
          lastName: 'User'
        }]
      };

      SplitBill.reset();

      expect(SplitBill.bill).to.have.any.keys([
        'billName',
        'billDate',
        'billCategory',
        'payingUser',
        'amountPaid',
        'owingUsers',
        'splitEqually',
        'processed',
      ])

      expect(SplitBill.bill.splitEqually).to.equal(true)
      expect(SplitBill.bill.owingUsers).to.deep.equal([])
      expect(SplitBill.getContacts()).to.deep.equal([])

    });

  })

  describe('getContacts()', function(){

    it('should initially return an empty list of contacts', function() {

      var contacts = SplitBill.getContacts();
      expect(contacts).to.deep.equal([]);

    })

    it('should return previously set list of contacts', function() {

      var contacts = [{
        firstName: 'Bill',
        lastName: 'Gates'
      }]

      SplitBill.setContacts(contacts);

      var _contacts = SplitBill.getContacts();
      expect(_contacts).to.equal(contacts);

    })

  })

  describe('setContacts()', function(){

    it('should update owing users equally when contacts are set', function() {

      var contacts = [{
        firstName: 'Bill',
        lastName: 'Gates',
        countryCode: '+1',
        phoneNumber: '123456789',
      }]

      SplitBill.bill.amountPaid = 10
      SplitBill.bill.splitEqually = true
      SplitBill.bill.owingUsers = []

      SplitBill.setContacts(contacts)

      var owingUsers = SplitBill.bill.owingUsers;
      expect(owingUsers).to.have.length(1)
      expect(owingUsers[0]).to.have.any.keys([
        'firstName',
        'lastName',
        'countryCode',
        'phoneNumber',
        'percentage',
      ])
      expect(owingUsers[0].firstName).to.equal('Bill');
      expect(owingUsers[0].lastName).to.equal('Gates');
      expect(owingUsers[0].countryCode).to.equal('+1');
      expect(owingUsers[0].phoneNumber).to.equal('123456789');
      expect(owingUsers[0].percentage).to.equal(50);

    })

    it('should not overwrite owing amounts when single contact set', function() {

      var contacts = [{
        firstName: 'Bill',
        lastName: 'Gates',
        countryCode: '+1',
        phoneNumber: '123456789'
      }]

      SplitBill.bill.amountPaid = 10
      SplitBill.bill.splitEqually = false
      SplitBill.bill.owingUsers = [{
        firstName: 'Bill',
        lastName: 'Gates',
        countryCode: '+1',
        phoneNumber: '123456789',
        percentage: 20,
      }]

      SplitBill.setContacts(contacts)

      var owingUsers = SplitBill.bill.owingUsers;
      expect(owingUsers).to.have.length(1)
      expect(owingUsers[0]).to.have.any.keys([
        'firstName',
        'lastName',
        'countryCode',
        'phoneNumber',
        'percentage',
      ])
      expect(owingUsers[0].firstName).to.equal('Bill');
      expect(owingUsers[0].lastName).to.equal('Gates');
      expect(owingUsers[0].countryCode).to.equal('+1');
      expect(owingUsers[0].phoneNumber).to.equal('123456789');
      expect(owingUsers[0].percentage).to.equal(20);

    })

    it('should remove exiting users when new contact set', function() {

      var contacts = [{
        firstName: 'James',
        lastName: 'May',
        countryCode: '+44',
        phoneNumber: '7963565956'
      }]

      SplitBill.bill.amountPaid = 10
      SplitBill.bill.splitEqually = false
      SplitBill.bill.owingUsers = [{
        firstName: 'Bill',
        lastName: 'Gates',
        countryCode: '+1',
        phoneNumber: '123456789',
        percentage: 20,
      }]

      SplitBill.setContacts(contacts)

      var owingUsers = SplitBill.bill.owingUsers;
      expect(owingUsers).to.have.length(1)
      expect(owingUsers[0]).to.have.any.keys([
        'firstName',
        'lastName',
        'countryCode',
        'phoneNumber',
        'percentage',
      ])
      expect(owingUsers[0].firstName).to.equal('James');
      expect(owingUsers[0].lastName).to.equal('May');
      expect(owingUsers[0].countryCode).to.equal('+44');
      expect(owingUsers[0].phoneNumber).to.equal('7963565956');
      expect(owingUsers[0].percentage).to.equal(50);

    })

    it('should overwrite amount when new contacts added', function() {

      var contacts = [{
        firstName: 'Bill',
        lastName: 'Gates',
        countryCode: '+1',
        phoneNumber: '123456789'
      },{
        firstName: 'James',
        lastName: 'May',
        countryCode: '+44',
        phoneNumber: '7963456956'
      },{
        firstName: 'Richard',
        lastName: 'Hammond',
        countryCode: '+44',
        phoneNumber: '7963456946'
      }]

      SplitBill.bill.amountPaid = 10
      SplitBill.bill.splitEqually = true
      SplitBill.bill.owingUsers = [{
        firstName: 'Bill',
        lastName: 'Gates',
        countryCode: '+1',
        phoneNumber: '123456789',
        percentage: 50,
      }]

      SplitBill.setContacts(contacts)

      var owingUsers = SplitBill.bill.owingUsers;
      expect(owingUsers).to.have.length(3)

      expect(owingUsers[0]).to.have.any.keys([
        'firstName',
        'lastName',
        'countryCode',
        'phoneNumber',
        'percentage',
      ])
      expect(owingUsers[0].firstName).to.equal('Bill');
      expect(owingUsers[0].lastName).to.equal('Gates');
      expect(owingUsers[0].countryCode).to.equal('+1');
      expect(owingUsers[0].phoneNumber).to.equal('123456789');
      expect(owingUsers[0].percentage).to.equal(25);

      expect(owingUsers[1]).to.have.any.keys([
        'firstName',
        'lastName',
        'countryCode',
        'phoneNumber',
        'percentage',
      ])
      expect(owingUsers[1].firstName).to.equal('James');
      expect(owingUsers[1].lastName).to.equal('May');
      expect(owingUsers[1].countryCode).to.equal('+44');
      expect(owingUsers[1].phoneNumber).to.equal('7963456956');
      expect(owingUsers[1].percentage).to.equal(25);

      expect(owingUsers[2]).to.have.any.keys([
        'firstName',
        'lastName',
        'countryCode',
        'phoneNumber',
        'percentage',
      ])
      expect(owingUsers[2].firstName).to.equal('Richard');
      expect(owingUsers[2].lastName).to.equal('Hammond');
      expect(owingUsers[2].countryCode).to.equal('+44');
      expect(owingUsers[2].phoneNumber).to.equal('7963456946');
      expect(owingUsers[2].percentage).to.equal(25);

    })

    it('should preserve previous amount when new contact added', function() {

      var contacts = [{
        firstName: 'Bill',
        lastName: 'Gates',
        countryCode: '+1',
        phoneNumber: '123456789'
      },{
        firstName: 'James',
        lastName: 'May',
        countryCode: '+44',
        phoneNumber: '7963456956'
      }]

      SplitBill.bill.amountPaid = 10
      SplitBill.bill.splitEqually = false
      SplitBill.bill.owingUsers = [{
        firstName: 'Bill',
        lastName: 'Gates',
        countryCode: '+1',
        phoneNumber: '123456789',
        percentage: 20,
      }]

      SplitBill.setContacts(contacts)

      var owingUsers = SplitBill.bill.owingUsers;
      expect(owingUsers).to.have.length(2)
      expect(owingUsers[0]).to.have.any.keys([
        'firstName',
        'lastName',
        'countryCode',
        'phoneNumber',
        'percentage',
      ])
      expect(owingUsers[0].firstName).to.equal('Bill');
      expect(owingUsers[0].lastName).to.equal('Gates');
      expect(owingUsers[0].countryCode).to.equal('+1');
      expect(owingUsers[0].phoneNumber).to.equal('123456789');
      expect(owingUsers[0].percentage).to.equal(20);

      expect(owingUsers[1]).to.have.any.keys([
        'firstName',
        'lastName',
        'countryCode',
        'phoneNumber',
        'percentage',
      ])
      expect(owingUsers[1].firstName).to.equal('James');
      expect(owingUsers[1].lastName).to.equal('May');
      expect(owingUsers[1].countryCode).to.equal('+44');
      expect(owingUsers[1].phoneNumber).to.equal('7963456956');
      expect(owingUsers[1].percentage).to.equal(40);

    })

  })

});