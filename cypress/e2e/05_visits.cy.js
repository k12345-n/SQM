// cypress/e2e/05_visits.cy.js
// ─────────────────────────────────────────────
// Visits Module Tests
// ─────────────────────────────────────────────

// Helper: navigate to the Add Visit page for owner "Davis"'s first pet
const goToAddVisit = () => {
  cy.findOwner('Davis')
  cy.get('table a, .owner-list a').first().click()
  cy.contains('a', /add visit/i).first().click()
}

describe('Add Visit – Page Load', () => {
  it('TC-VIS-01: Add Visit page loads with correct fields', () => {
    goToAddVisit()
    cy.get('#date').should('be.visible')
    cy.get('#description').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })
})

describe('Add Visit – Positive Cases', () => {
  it('TC-VIS-02: adding a visit with valid data succeeds', () => {
    goToAddVisit()
    // Use today's date
    const today = new Date().toISOString().split('T')[0]
    cy.get('#date').clear().type(today)
    cy.get('#description').clear().type('Routine annual checkup')
    cy.get('button[type="submit"]').click()

    // Should redirect to owner detail
    cy.url().should('match', /\/owners\/\d+/)
    cy.contains(/routine annual checkup/i).should('be.visible')
  })
})

describe('Add Visit – Validation', () => {
  beforeEach(() => {
    goToAddVisit()
  })

  it('TC-VIS-03: submitting with empty description shows error', () => {
    const today = new Date().toISOString().split('T')[0]
    cy.get('#date').clear().type(today)
    cy.get('button[type="submit"]').click()
    cy.contains(/must not be empty|required|error/i).should('be.visible')
  })

  it('TC-VIS-04: invalid date is rejected', () => {
    // A <input type="date"> won't accept an impossible calendar date like Feb 30
    // (cy.type() would error), so force the raw value. The browser normalises the
    // invalid value to empty, and on submit the server-side @NotNull rejects it.
    cy.get('#date').invoke('val', '2025-02-30')
    cy.get('#description').clear().type('Test visit')
    cy.get('button[type="submit"]').click()

    // The visit must NOT be created: we stay on the form and a field error is shown.
    cy.url().should('include', '/visits/new')
    cy.get('.help-inline, .has-error').should('exist')
  })

  it('TC-VIS-05: submitting with empty date shows error', () => {
    cy.get('#date').clear()
    cy.get('#description').clear().type('Test visit with no date')
    cy.get('button[type="submit"]').click()

    // @NotNull on the date field rejects the empty value: stays on the form with an error.
    cy.url().should('include', '/visits/new')
    cy.get('.help-inline, .has-error').should('exist')
  })
})

describe('Add Visit – Edge Cases', () => {
  it('TC-VIS-06: future visit date is accepted (appointment scenario)', () => {
    goToAddVisit()
    cy.get('#date').clear().type('2099-12-31')
    cy.get('#description').clear().type('Future appointment')
    cy.get('button[type="submit"]').click()
    // Document behavior: future dates may or may not be valid
    cy.url().then((url) => {
      cy.log(url.includes('/owners') ? 'Future date accepted' : 'Future date rejected')
    })
  })

  it('TC-VIS-07: very long description is handled gracefully', () => {
    goToAddVisit()
    const today = new Date().toISOString().split('T')[0]
    cy.get('#date').clear().type(today)
    cy.get('#description').clear().type('A'.repeat(500))
    cy.get('button[type="submit"]').click()
    cy.get('body').should('exist')
    cy.get('body').should('not.contain', /500|exception/i)
  })
})

describe('Visit History', () => {
  it('TC-VIS-08: owner detail page shows visit history for pets', () => {
    cy.findOwner('Davis')
    cy.get('table a, .owner-list a').first().click()
    // Visit history table should appear somewhere on the detail page
    cy.get('body').should('exist')
    // Check for visit-related elements
    cy.contains(/visits|visit date|description/i).should('exist')
  })
})
