describe('Prueba Automatizada 2', () => {
 
  
  it('Probar login como Administrador', () => {
    cy.visit('https://bedtrack-frontend-final-435l.vercel.app/')
    cy.get('.login-card').should("be.visible")
    cy.get('#role').select('admin')
    cy.get('input[name="email"]').type('admin@gmail.com')
    cy.get('input[name="password"]').type('Admin123')
    cy.get('.btn-primary').click()
  })

  it('Probar login como enfermero o enfermera', () => {
    cy.visit('https://bedtrack-frontend-final-435l.vercel.app/')
    cy.get('.login-card').should("be.visible")
    cy.get('#role').should("be.visible")
    cy.get('#role').select('enfermeria')
    cy.get('input[name="email"]').should("be.visible")
    cy.get('input[name="email"]').type('enfermeria@gmail.com')
    cy.get('input[name="password"]').should("be.visible")
    cy.get('input[name="password"]').type('1234')
    cy.get('.btn-primary').should("be.visible")
    cy.get('.btn-primary').click()
  })
  
  it("Probar contraseña con 3 digitos y  como login de enfermeria", () => { 
  
   cy.visit('https://bedtrack-frontend-final-435l.vercel.app/')
    cy.get('#role').select('enfermeria')
    cy.get('input[name="email"]').type('enfermeria@gmail.com')
    cy.get('input[name="password"]').type('123')

})

it("Probar contraseña con 3 digitos y  como login de administrador" , () => { 
  
   cy.visit('https://bedtrack-frontend-final-435l.vercel.app/')
    cy.get('#role').select('admin')
    cy.get('input[name="email"]').type('administrador@gmail.com')
    cy.get('input[name="password"]').type('123')
  
  })

  it("Probar usuario barra hotmail como login de enfermeria" , () => { 
  
   cy.visit('https://bedtrack-frontend-final-435l.vercel.app/')
    cy.get('#role').select('enfermeria')
    cy.get('input[name="email"]').type('enfermeria@hotmail.com')
    cy.get('input[name="password"]').type('1234')
})

 it("Probar usuario barra hotmail como login de administador" , () => { 
  
   cy.visit('https://bedtrack-frontend-final-435l.vercel.app/')
    cy.get('#role').select('admin')
    cy.get('input[name="email"]').type('administrador@hotmail.com')
    cy.get('input[name="password"]').type('1234')

    
})
})
