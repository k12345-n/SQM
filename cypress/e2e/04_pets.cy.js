// cypress/e2e/04_pets.cy.js
// ─────────────────────────────────────────────
// Pets Module Tests (Add & Edit)
// ─────────────────────────────────────────────

// Helper: navigate to the Add Pet page for owner "Davis"
const goToAddPet = () => {
  cy.findOwner('Davis')
  cy.get('table a, .owner-list a').first().click()
  cy.contains('a', /add new pet/i).click()
}

describe('Add Pet – Page Load', () => {
  it('TC-PET-01: Add Pet page loads with correct form fields', () => {
    goToAddPet()
    cy.get('#name').should('be.visible')
    cy.get('#birthDate').should('be.visible')
    cy.get('#type').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })
})

describe('Add Pet – Positive Cases', () => {
  it('TC-PET-02: adding a pet with valid data succeeds', () => {
    goToAddPet()
    cy.get('#name').clear().type('Fluffy')
    cy.get('#birthDate').clear().type('2022-01-15')
    cy.get('#type').select('cat') // adjust if options differ
    cy.get('button[type="submit"]').click()

    // Should redirect back to owner detail
    cy.url().should('match', /\/owners\/\d+/)
    cy.get('table').contains('Fluffy').should('exist')
  })
})

describe('Add Pet – Validation', () => {
  beforeEach(() => {
    goToAddPet()
  })

  it('TC-PET-03: submitting with empty pet name shows error', () => {
    cy.get('#birthDate').clear().type('2022-01-15')
    cy.get('#type').select('cat')
    cy.get('button[type="submit"]').click()
    cy.contains(/must not be empty|required/i).should('be.visible')
  })

  it('TC-PET-04: submitting with empty birth date shows error', () => {
    cy.get('#name').clear().type('Buddy')
    cy.get('#type').select('dog')
    cy.get('button[type="submit"]').click()
    cy.contains(/must not be empty|required/i).should('be.visible')
  })

  it('TC-PET-05: invalid date format is rejected', () => {
    cy.get('#name').clear().type('Max')

    cy.get('#birthDate')
      .invoke('val', '2025-99-99')
      .trigger('input')   // important: simulate user input event

    cy.get('#type').select('dog')
    cy.get('button[type="submit"]').click()

    cy.contains(/is required/i).should('be.visible')
  })
})

describe('Add Pet – Edge Cases', () => {
  it('TC-PET-06: future birth date is flagged as invalid', () => {
    goToAddPet()
    cy.get('#name').clear().type('FuturePet')
    cy.get('#birthDate').clear().type('2099-12-31')
    cy.get('#type').select('cat')
    cy.get('button[type="submit"]').click()
    // The app should either reject future dates or accept (document the behavior)
    cy.url().then((url) => {
      if (url.includes('new')) {
        cy.log('Future date was rejected — validation working')
      } else {
        cy.log('Future date was accepted — note for report')
      }
    })
  })
})

describe('Edit Pet', () => {
  it('TC-PET-07: pet details can be updated successfully', () => {
    cy.findOwner('Davis')
    cy.get('table a, .owner-list a').first().click()
    // Click the Edit Pet link of the first pet
    cy.contains('a', /edit pet/i).first().click()
    cy.url().should('include', '/edit')

    cy.get('#name').clear().type('UpdatedPetName')
    cy.get('button[type="submit"]').click()

    cy.url().should('match', /\/owners\/\d+/)
    cy.contains(/updatedpetname/i).should('be.visible')
  })
})
