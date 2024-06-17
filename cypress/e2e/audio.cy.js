describe('Audio Player', () => {
  it('Plays audio', () => {
    cy.visit('/')
    cy.get('.composition_name:first').click()
    cy.get('#play-btn').click()
    //eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000) //milliseconds
    cy.get('#player-play-btn').click()
  })
})
