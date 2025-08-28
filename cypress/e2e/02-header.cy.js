import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Check header', () => {
    cy.get('.header .eea-logo')
      .should('have.attr', 'src')
      .and('include', "freshwater_logo");
  });

});
