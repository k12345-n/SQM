// cypress/e2e/07_owner_detail.cy.js
// ─────────────────────────────────────────────
// Owner Detail Page Tests
// ─────────────────────────────────────────────

describe('Owner Detail – Page Content', () => {
  beforeEach(() => {
    cy.findOwner('Davis')
    cy.get('table a, .owner-list a').first().click()
  })

  it('TC-OD-01: owner detail page loads', () => {
    cy.url().should('match', /\/owners\/\d+/)
  })

  it('TC-OD-02: owner name is displayed', () => {
    cy.contains(/davis/i).should('be.visible')
  })

  it('TC-OD-03: owner address section is displayed', () => {
    cy.contains(/address/i).should('exist')
  })

  it('TC-OD-04: owner telephone is displayed', () => {
    cy.contains(/telephone/i).should('exist')
  })

  it('TC-OD-05: pets section exists on the page', () => {
    cy.contains(/pets and visits|pets/i).should('exist')
  })
})

describe('Owner Detail – Action Buttons', () => {
  beforeEach(() => {
    cy.findOwner('Davis')
    cy.get('table a, .owner-list a').first().click()
  })

  it('TC-OD-06: "Edit Owner" button is visible and clickable', () => {
    cy.contains('a', /edit owner/i).should('be.visible').click()
    cy.url().should('include', '/edit')
  })

  it('TC-OD-07: "Add New Pet" button is visible and clickable', () => {
    cy.contains('a', /add new pet/i).should('be.visible').click()
    cy.url().should('include', '/pets/new')
  })

  it('TC-OD-08: direct URL access to owner page works', () => {
    cy.visit('/owners/1')
    cy.url().should('include', '/owners/1')
    cy.get('body').should('not.contain', /exception|500/i)
  })
})
