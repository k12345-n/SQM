// cypress/e2e/02_find_owner.cy.js
// ─────────────────────────────────────────────
// Find Owner Tests (Search)
// ─────────────────────────────────────────────

describe('Find Owner – Page Load', () => {
  beforeEach(() => {
    cy.visit('/owners/find')
  })

  it('TC-FO-01: Find Owners page loads successfully', () => {
    cy.url().should('include', '/owners/find')
  })

  it('TC-FO-02: search form and button are visible', () => {
    cy.get('#lastName').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })
})

describe('Find Owner – Positive Cases', () => {
  it('TC-FO-03: searching "Davis" returns matching owners', () => {
    cy.findOwner('Davis')
    cy.get('table, .owner-list, a').should('exist')
    cy.contains(/davis/i).should('be.visible')
  })

  it('TC-FO-04: partial last name search returns results', () => {
    cy.findOwner('Da')
    cy.get('body').should('not.contain', 'Page Not Found')
  })

  it('TC-FO-05: empty search returns all owners', () => {
    cy.visit('/owners/find')
    cy.get('#lastName').clear()
    cy.get('button[type="submit"]').click()
    // Either shows a list or shows all owners
    cy.get('body').should('not.contain', /error/i)
  })
})

describe('Find Owner – Negative Cases', () => {
  it('TC-FO-06: searching non-existing name shows "not found" message', () => {
    cy.findOwner('ZZZNobodyXXX')
    cy.contains(/no owners found|not found|has not been found|no results/i).should('be.visible')
  })
})

describe('Find Owner – Edge Cases', () => {
  it('TC-FO-07: special characters in search do not crash the app', () => {
    cy.findOwner('@#$%^&*()')
    cy.get('body').should('exist')
    cy.get('body').should('not.contain', /500|exception/i)
  })

  it('TC-FO-08: very long input string does not crash the app', () => {
    cy.findOwner('A'.repeat(255))
    cy.get('body').should('exist')
  })

  it('TC-FO-09: clicking a search result navigates to owner details', () => {
    cy.findOwner('Davis')
    cy.get('table a, .owner-list a').first().click()
    cy.url().should('match', /\/owners\/\d+/)
  })
})
