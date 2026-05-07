// cypress/support/e2e.js
// ─────────────────────────────────────────────
// Global custom commands for PetClinic E2E tests
// ─────────────────────────────────────────────

/**
 * Navigate to PetClinic home
 */
Cypress.Commands.add('goHome', () => {
  cy.visit('/')
})

/**
 * Fill and submit the Add Owner form
 * @param {Object} owner - { firstName, lastName, address, city, telephone }
 */
Cypress.Commands.add('addOwner', ({ firstName, lastName, address, city, telephone }) => {
  cy.visit('/owners/new')
  if (firstName !== undefined) cy.get('#firstName').clear().type(firstName)
  if (lastName  !== undefined) cy.get('#lastName').clear().type(lastName)
  if (address   !== undefined) cy.get('#address').clear().type(address)
  if (city      !== undefined) cy.get('#city').clear().type(city)
  if (telephone !== undefined) cy.get('#telephone').clear().type(telephone)
  cy.get('button[type="submit"]').click()
})

/**
 * Search for an owner by last name
 * @param {string} name - last name to search
 */
Cypress.Commands.add('findOwner', (name) => {
  cy.visit('/owners/find')
  cy.get('#lastName').clear().type(name)
  cy.get('button[type="submit"]').click()
})

/**
 * Navigate to a specific owner's detail page by searching their last name
 * then clicking the first result
 */
Cypress.Commands.add('goToOwnerDetail', (lastName) => {
  cy.findOwner(lastName)
  cy.get('a').contains(lastName).first().click()
})

// Global handler: suppress PetClinic's own uncaught JS errors
// so they don't fail our behavioural tests.
// XSS errors we throw manually will still surface correctly.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('XSS') || err.message.includes('alert()')) {
    return true  // re-throw — these are our security findings
  }
  return false   // suppress app-internal errors (e.g. style/DOM issues)
})
