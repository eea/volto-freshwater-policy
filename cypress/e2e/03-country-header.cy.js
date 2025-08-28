import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Check country header data block', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');



    cy.getSlate().click();
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.ui.input [name="SearchableText"]').first().click().type("Country");
    cy.get('.ui.basic.icon.button.countryHeaderDataBlock')
      .contains('Country header data block')
      .should('be.visible')
      .click({ force: true });
    cy.get(".sidebar-container .field-wrapper-country_flag .react-select__value-container")
      .click();
    cy.get('.sidebar-container .field-wrapper-country_flag .react-select__menu .ReactVirtualized__List')
      .scrollTo(0, 500)
    cy.get('.react-select__option')
      .contains('Austria')
      .click({ force: true });
    cy.get('.country-flag img')
      .should('exist')
      .and('be.visible')
      .and(($img) => {
        expect($img).to.have.attr('src').to.include('/at');
      });

    cy.intercept('POST', '/++api++/cypress/my-page/country-discodata/@connector-data', {
      statusCode: 200,
      body: {
        "@id": "http://localhost:3000/cypress/my-page/country-discodata/@connector-data",
        data: {
          metadata: {
            readme: ""
          },
          results: 
            {
              country_code: ["AT"],
              countryCode: ["AT"],
              Vmain1: ["Austria"],
              TV1_1: [
                100.0,
              ],
            }
          
        }

      },
    }).as('save');

    cy.get('#field-provider_url').then(($input) => {
      const input = $input[0];
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(input, '/cypress/my-page/country-discodata');
      input.dispatchEvent(new InputEvent('input', { bubbles: true }));
    });
    cy.wait('@save');

    cy.get(".sidebar-container .field-wrapper-column_data .react-select__value-container")
      .click();
    
    cy.get('.react-select__option')
      .contains('TV1_1')
      .click({ force: true });
    cy.get('.uww-data .formatted-value').should('have.text', '100');
  })

});
