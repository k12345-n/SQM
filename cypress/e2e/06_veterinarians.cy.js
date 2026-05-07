// cypress/e2e/06_veterinarians.cy.js
// ─────────────────────────────────────────────
// Veterinarians Page Tests
// ─────────────────────────────────────────────

describe('Veterinarians Page – Load', () => {
  beforeEach(() => {
    cy.visit('/vets.html')
  })

  it('TC-VET-01: Vets page loads successfully', () => {
    cy.url().should('include', '/vets')
  })

  it('TC-VET-02: page heading is displayed', () => {
    cy.contains('h1, h2', /veterinarian/i)
  })
})

describe('Veterinarians Page – Data', () => {
  beforeEach(() => {
    cy.visit('/vets.html')
  })

  it('TC-VET-03: vet list table is visible', () => {
    cy.get('table').should('be.visible')
  })

  it('TC-VET-04: at least one vet name is displayed', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0)
  })

  it('TC-VET-05: vet names column is displayed', () => {
    cy.get('table').contains(/name/i)
    cy.get('table tbody tr td').first().should('not.be.empty')
  })

  it('TC-VET-06: specialties column is displayed', () => {
    cy.get('table').contains(/specialties/i)
  })

  it('TC-VET-07: known vet "James Carter" appears in the list', () => {
    cy.contains(/james carter|carter/i).should('be.visible')
  })

  it('TC-VET-08: page survives a refresh', () => {
    cy.reload()
    cy.get('table').should('be.visible')
  })
})
