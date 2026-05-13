// cypress/e2e/03_add_edit_owner.cy.js
// ─────────────────────────────────────────────
// Add Owner & Edit Owner Tests
// ─────────────────────────────────────────────

const validOwner = {
  firstName: 'John',
  lastName:  'Cypress',
  address:   '123 Test Street',
  city:      'TestCity',
  telephone: '1234567890',
}

describe('Add Owner – Page Load', () => {
  beforeEach(() => {
    cy.visit('/owners/new')
  })

  it('TC-AO-01: Add Owner form page loads', () => {
    cy.url().should('include', '/owners/new')
  })

  it('TC-AO-02: all form fields and submit button are present', () => {
    cy.get('#firstName').should('be.visible')
    cy.get('#lastName').should('be.visible')
    cy.get('#address').should('be.visible')
    cy.get('#city').should('be.visible')
    cy.get('#telephone').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })
})

describe('Add Owner – Positive Cases', () => {
  it('TC-AO-03: adding an owner with valid data redirects to owner detail', () => {
    cy.addOwner(validOwner)
    // On success, Spring PetClinic redirects to /owners/{id}
    cy.url().should('match', /\/owners\/\d+/)
    cy.contains(/cypress/i).should('be.visible')
  })
})

describe('Add Owner – Required Field Validation', () => {
  beforeEach(() => {
    cy.visit('/owners/new')
  })

  it('TC-AO-04: submitting with empty first name shows error', () => {
    cy.get('#lastName').type(validOwner.lastName)
    cy.get('#address').type(validOwner.address)
    cy.get('#city').type(validOwner.city)
    cy.get('#telephone').type(validOwner.telephone)
    cy.get('button[type="submit"]').click()
    cy.contains(/must not be blank/i).should('be.visible')
  })

  it('TC-AO-05: submitting with empty last name shows error', () => {
    cy.get('#firstName').type(validOwner.firstName)
    cy.get('#address').type(validOwner.address)
    cy.get('#city').type(validOwner.city)
    cy.get('#telephone').type(validOwner.telephone)
    cy.get('button[type="submit"]').click()
    cy.contains(/must not be blank/i).should('be.visible')
  })

  it('TC-AO-06: submitting with empty address shows error', () => {
    cy.get('#firstName').type(validOwner.firstName)
    cy.get('#lastName').type(validOwner.lastName)
    cy.get('#city').type(validOwner.city)
    cy.get('#telephone').type(validOwner.telephone)
    cy.get('button[type="submit"]').click()
    cy.contains(/must not be blank/i).should('be.visible')
  })

  it('TC-AO-07: submitting with empty city shows error', () => {
    cy.get('#firstName').type(validOwner.firstName)
    cy.get('#lastName').type(validOwner.lastName)
    cy.get('#address').type(validOwner.address)
    cy.get('#telephone').type(validOwner.telephone)
    cy.get('button[type="submit"]').click()
    cy.contains(/must not be blank/i).should('be.visible')
  })

  it('TC-AO-08: submitting with empty telephone shows error', () => {
    cy.get('#firstName').type(validOwner.firstName)
    cy.get('#lastName').type(validOwner.lastName)
    cy.get('#address').type(validOwner.address)
    cy.get('#city').type(validOwner.city)
    cy.get('button[type="submit"]').click()
    cy.contains(/must not be blank|numeric/i).should('be.visible')
  })

  it('TC-AO-09: completely empty form shows validation errors', () => {
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/owners/new') // stays on page
    cy.contains(/must not be blank/i).should('be.visible')
  })
})

describe('Add Owner – Data Validation', () => {
  beforeEach(() => {
    cy.visit('/owners/new')
  })

  it('TC-AO-10: telephone with letters is rejected', () => {
    cy.get('#firstName').type(validOwner.firstName)
    cy.get('#lastName').type(validOwner.lastName)
    cy.get('#address').type(validOwner.address)
    cy.get('#city').type(validOwner.city)
    cy.get('#telephone').type('ABCDEFGHIJ')
    cy.get('button[type="submit"]').click()
    cy.contains(/numeric|digits only|invalid|error/i).should('be.visible')
  })

  it('TC-AO-11: telephone that is too short is rejected', () => {
    cy.get('#firstName').type(validOwner.firstName)
    cy.get('#lastName').type(validOwner.lastName)
    cy.get('#address').type(validOwner.address)
    cy.get('#city').type(validOwner.city)
    cy.get('#telephone').type('123')
    cy.get('button[type="submit"]').click()
    cy.contains(/size|length|invalid|error/i).should('be.visible')
  })

  it('TC-AO-12: XSS input in first name does not execute script', () => {
    cy.get('#firstName').type('<script>alert(1)</script>')
    cy.get('#lastName').type(validOwner.lastName)
    cy.get('#address').type(validOwner.address)
    cy.get('#city').type(validOwner.city)
    cy.get('#telephone').type(validOwner.telephone)
    cy.get('button[type="submit"]').click()
    // No JS alert should fire — Cypress would fail the test automatically
    cy.on('window:alert', () => {
      throw new Error('XSS vulnerability: alert() was executed!')
    })
    cy.get('body').should('exist')
  })
})

describe('Edit Owner', () => {
  it('TC-EO-01: owner information can be updated successfully', () => {
    // Find an owner and navigate to edit
    cy.findOwner('Davis')
    cy.get('table a, .owner-list a').first().click()
    cy.contains('a', /edit owner/i).click()
    cy.url().should('include', '/edit')

    // Update city
    cy.get('#city').clear().type('UpdatedCity')
    cy.get('button[type="submit"]').click()

    // Should redirect back to owner detail
    cy.url().should('match', /\/owners\/\d+/)
    cy.contains(/updatedcity/i).should('be.visible')
  })

  it('TC-EO-02: clearing required fields on edit shows validation errors', () => {
    cy.findOwner('Davis')
    cy.get('table a, .owner-list a').first().click()
    cy.contains('a', /edit owner/i).click()

    cy.get('#firstName').clear()
    cy.get('button[type="submit"]').click()
    cy.contains(/must not be blank/i).should('be.visible')
  })
})
