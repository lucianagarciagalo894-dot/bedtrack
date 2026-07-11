describe('Prueba Automatizada 1', () => {
 
it ("validar pagina de inicio" , () => {

    cy.visit("https://bedtrack-frontend-final-435l.vercel.app/")
    cy.get(".login-logo").should("be.visible")
    cy.get('.login-header').should("be.visible")
    cy.get('.login-title').should("be.visible")
    cy.get('.login-title').contains("Bienvenido")
    cy.get('.login-subtitle').should("be.visible")
    cy.get('.login-subtitle').contains("Ingresá con tu cuenta institucional")
    cy.get(':nth-child(2) > .form-label').should("be.visible")
    cy.get(':nth-child(2) > .form-label').contains("Tipo de Usuario")
    cy.get(':nth-child(3) > .form-label').should("be.visible")
    cy.get(':nth-child(3) > .form-label').contains("Correo Electrónico")
    cy.get(':nth-child(4) > .form-label').should("be.visible")
    cy.get(':nth-child(4) > .form-label').contains("Contraseña")
})
})
