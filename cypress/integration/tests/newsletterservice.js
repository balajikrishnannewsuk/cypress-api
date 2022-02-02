/// <reference types="cypress" />

Cypress.config("baseUrl", "http://origin-capi-uat.cloud-newsint.co.uk/newsletterservice/newsletters");

import { newsletterData } from '../testdata/newsletterData';
const dayjs = require('dayjs');
describe('Newsletter Service API', () => {
  var id='';
  var randomID='';
  var customerRandomId='';
  var emailID=''; 
  var newemailID=''; 
  it('create profile through sailthru - This is a POST request', () => {
    const todaysDate = dayjs().format('YYYY-MM-DD')
      id = () => Cypress._.random(1, 1e7);
      randomID = id()
      customerRandomId = `${randomID}`;
      emailID=`test${randomID}@yopmail.com`;
      cy.api({
        method: 'POST',
        url: '/',
        body: {
            "customerId": customerRandomId,
            "emailId"   : emailID,
            "firstName": "test",
            "lastName": "testwdwds",
            "title":"Mr.",
            "newsLetterSubscriptionDetails": [
                {
                    "bulletinId": "101",     
                     "isSubscribed": true
           },
                {
                    "bulletinId": "107",
                    "isSubscribed": true
                }
            ]
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body[0].bulletinId).to.equal("101");
        expect(response.body[0].customerId).to.equal(customerRandomId);
        expect(response.body[0].isSubscribed).to.be.true;
        expect(response.body[0].sfId).to.equal("101");
        expect(response.body[0].timeStamp).contains(todaysDate);
        expect(response.status).to.equal(200);
        expect(response.body[11].bulletinId).to.equal("107");
        expect(response.body[11].customerId).to.equal(customerRandomId);
        expect(response.body[11].isSubscribed).to.be.true;
        expect(response.body[11].sfId).to.equal("107");
        expect(response.body[11].timeStamp).contains(todaysDate);
      }).its('headers')
      .its('content-type')
      .should('include', 'application/json');
    });

    it('update email id  in sailthru - This is a PATCH request', () => {
        id = () => Cypress._.random(1, 1e7);
        randomID = id()
        newemailID=`test${randomID}@yopmail.com`;
        cy.api({
          method: 'POST',
          url: '/',
          body: {
            "customerId": customerRandomId,
            "oldemailId": emailID,
            "emailId"   : newemailID,
            "firstName" : "test",
            "lastName"  : "testwdwds",
            "title"     : "Mr.",
            "newsLetterSubscriptionDetails": [
                {
                    "bulletinId": "101",     
                     "isSubscribed": true
           },
                {
                    "bulletinId": "107",
                    "isSubscribed": true
                }
            ]
        },        
        }).then((response) => {
          expect(response.status).to.equal(200);
        }).its('headers')
        .its('content-type')
        .should('include', 'application/json');
      });

    it('Update newsletter active flag to mark if a profile active/inactive- This is a PATCH request', () => {
        cy.api({
          method: 'POST',
          url: '/status',
          body: {
            "emailId": newemailID,
            "cpn": customerRandomId,
            "isActive":true
           },
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.status).to.equal("SUCCESS");
          expect(response.body.eventCode).to.equal("NLS-011");
          expect(response.body.note).to.equal("Profile is updated");
      });
  });

  
      newsletterData.forEach((section, index) => {
        it(`Get newsletter metadata for "${section.bulletinText}"- This is a GET request`, function() {
          cy.api({ url: '/' }).then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body[index].brand).to.equal(section.brand);
            expect(res.body[index].bulletinText).to.equal(section.bulletinText);
            expect(res.body[index].category).to.equal(section.category);
            expect(res.body[index].code).to.equal(section.code);
            expect(res.body[index].detailedText).to.equal(section.detailedText);
            expect(res.body[index].frequency).to.equal(section.frequency);
            expect(res.body[index].frequencyDesc).to.equal(section.frequencyDesc);
            expect(res.body[index].includesRA).to.equal(section.includesRA);
            expect(res.body[index].sfId).to.equal(section.sfId);
            expect(res.body[index].thirdPartyId).to.equal(section.thirdPartyId);
        });
      });
  });

  
});

  