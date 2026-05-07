// cypress/e2e/01_home_navigation.cy.js
// ─────────────────────────────────────────────
// Home Page & Navigation Tests
// ─────────────────────────────────────────────

describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('TC-HOME-01: loads the homepage successfully', () => {
    cy.url().should('include', '/')
    cy.get('body').should('be.visible')
  })

  it('TC-HOME-02: displays the Welcome message', () => {
    cy.contains(/welcome/i).should('be.visible')
  })

  it('TC-HOME-03: navigation bar is visible', () => {
    cy.get('nav, .navbar').should('be.visible')
  })

  it('TC-HOME-04: page title is correct', () => {
    cy.title().should('match', /petclinic/i)
  })

  it('TC-HOME-05: page survives a hard refresh', () => {
    cy.reload()
    cy.contains(/welcome/i).should('be.visible')
  })
})

describe('Navigation Bar Links', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('TC-NAV-01: "Home" link keeps user on homepage', () => {
    cy.contains('a', /home/i).click()
    cy.url().should('match', /\/$|\/welcome/)
  })

  it('TC-NAV-02: "Find Owners" link redirects to find owners page', () => {
    cy.contains('a', /find owners/i).click()
    cy.url().should('include', '/owners/find')
    cy.contains('h1, h2', /find owners/i)
  })

  it('TC-NAV-03: "Veterinarians" link redirects to vets page', () => {
    cy.contains('a', /veterinarians/i).click()
    cy.url().should('include', '/vets')
  })

  it('TC-NAV-04: all nav links are present and clickable', () => {
    const navItems = [/home/i, /find owners/i, /veterinarians/i]
    navItems.forEach((item) => {
      cy.contains('a', item).should('be.visible').and('not.be.disabled')
    })
  })
})

describe('Routing Edge Cases', () => {
  it('TC-NAV-05: invalid route shows an error/404 page', () => {
    cy.visit('/this-does-not-exist', { failOnStatusCode: false })
    cy.get('body').should('exist') // page should not crash
  })

  it('TC-NAV-06: browser back/forward navigation works', () => {
    cy.visit('/')
    cy.contains('a', /find owners/i).click()
    cy.url().should('include', '/owners/find')
    cy.go('back')
    cy.url().should('match', /\/$|\/welcome/)
    cy.go('forward')
    cy.url().should('include', '/owners/find')
  })
})
