describe('Prueba Automatizada 4', () => {

it('Verificar pagina de Dashboard', () => {
   
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


    cy.get('.hamburger').should("be.visible")
    cy.get('.topbar-title').contains("BedTrack")
    cy.get('.topbar-title').should("be.visible")
    cy.get('.page-title').should("be.visible")
    cy.get('.page-title').contains("Bienvenido/a, Enfermería")
    cy.get('.page-subtitle').should("be.visible")
    cy.get('.page-subtitle').contains("Resumen general del sistema · Todos los pisos")
    cy.get('.btn-go-beds').should("be.visible")
    cy.get('.btn-go-beds').contains("Gestionar camas")
    cy.get('.dashboard-welcome').should("be.visible")
    })

it('Validar Camas del Piso 1', () => {


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


    cy.get('.hamburger').should("be.visible")
    cy.get('.topbar-title').contains("BedTrack")
    cy.get('.topbar-title').should("be.visible")
    cy.get('.page-title').should("be.visible")
    cy.get('.page-title').contains("Bienvenido/a, Enfermería")
    cy.get('.page-subtitle').should("be.visible")
    cy.get('.page-subtitle').contains("Resumen general del sistema · Todos los pisos")
    cy.get('.btn-go-beds').should("be.visible")
    cy.get('.btn-go-beds').contains("Gestionar camas")
    cy.get('.dashboard-welcome').should("be.visible")
    



   cy.get('.btn-go-beds').click()
   cy.get('.page-wrapper').should("be.visible")
   cy.get('.page-title').should("be.visible")
   cy.get('.page-title').contains("Estado de Camas")
   cy.get('.page-subtitle').should("be.visible")
   cy.get('.page-subtitle').contains("Monitoreo en tiempo real · Piso 1")
   cy.get('.floor-selector > .active').should("be.visible")
   cy.get('.floor-selector > .active').contains("Piso 1")
   cy.get('.floor-selector > :nth-child(2)').should("be.visible")
   cy.get('.floor-selector > :nth-child(2)').contains("Piso 2")
   cy.get('.floor-selector > :nth-child(3)').should("be.visible")
   cy.get('.floor-selector > :nth-child(3)').contains("Piso 3")
   cy.get('.floor-selector > :nth-child(4)').should("be.visible")
   cy.get('.floor-selector > :nth-child(4)').contains("Piso 4")
   cy.get('.floor-selector > :nth-child(5)').should("be.visible")
   cy.get('.floor-selector > :nth-child(5)').contains("Piso 5")
   cy.get('.floor-selector').should("be.visible")

   cy.get('.stats-grid > :nth-child(1)').should("be.visible")
   cy.get(':nth-child(1) > .stat-icon').should("be.visible")
   cy.get(':nth-child(1) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(1) > .stat-info > .stat-value').contains("11")
   cy.get(':nth-child(1) > .stat-info > .stat-label').contains("Disponibles")


   cy.get('.stats-grid > :nth-child(2)').should("be.visible")
   cy.get(':nth-child(2) > .stat-icon').should("be.visible")
   cy.get(':nth-child(2) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(2) > .stat-info > .stat-value').contains("0")
   cy.get(':nth-child(2) > .stat-info > .stat-label').contains("Ocupadas")


   cy.get('.stats-grid > :nth-child(3)').should("be.visible")
   cy.get(':nth-child(3) > .stat-icon').should("be.visible")
   cy.get(':nth-child(3) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(3) > .stat-info > .stat-value').contains("0")
   cy.get(':nth-child(3) > .stat-info > .stat-label').contains("En limpieza")
    

   cy.get('.beds-header').should("be.visible")
   cy.get('.beds-section-title').should("be.visible")
   cy.get('.beds-section-title').contains("Camas del Piso 1")

   cy.get('.beds-count-badge').should("be.visible")
   cy.get('.beds-count-badge').contains("12 camas")



   cy.get('.status-cleaning').should("be.visible")

   cy.get('.status-cleaning > .bed-card-header').should("be.visible")
  
   cy.get('.status-cleaning > .bed-card-header > .bed-status-badge').contains("En limpieza")

   cy.get('.status-cleaning > .bed-name').should("be.visible")

   cy.get('.status-cleaning > .bed-name').contains("Cama 1")

   cy.get('.status-cleaning > .bed-floor-label').contains("Piso 1")

   cy.get('.status-cleaning > .bed-floor-label').should("be.visible")
   cy.get('.status-cleaning > .bed-floor-label').contains("Piso 1")

   cy.get('.btn-avail').should("be.visible")
   cy.get('.btn-avail').contains("Disponible")


   cy.get('.status-cleaning > .bed-actions > .btn-occup').should("be.visible")
   cy.get('.status-cleaning > .bed-actions > .btn-occup').contains("Ocupada")



   cy.get('[aria-label="Cama 2, Piso 1, estado: Disponible"]').should("be.visible")
   cy.get('[aria-label="Cama 2, Piso 1, estado: Disponible"] > .bed-card-header').should("be.visible")
   cy.get('[aria-label="Cama 2, Piso 1, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
   cy.get('[aria-label="Cama 2, Piso 1, estado: Disponible"] > .bed-name').should("be.visible")
   cy.get('[aria-label="Cama 2, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")
   cy.get('[aria-label="Cama 2, Piso 1, estado: Disponible"] > .bed-floor-label').should("be.visible")
   

  cy.get('[aria-label="Cama 3, Piso 1, estado: Disponible"]').should("be.visible")
   cy.get('[aria-label="Cama 3, Piso 1, estado: Disponible"] > .bed-card-header').should("be.visible")
   cy.get('[aria-label="Cama 3, Piso 1, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
   cy.get('[aria-label="Cama 3, Piso 1, estado: Disponible"] > .bed-name').should("be.visible")
   cy.get('[aria-label="Cama 3, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")
   cy.get('[aria-label="Cama 3, Piso 1, estado: Disponible"] > .bed-floor-label').should("be.visible")
   



   cy.get('[aria-label="Cama 4, Piso 1, estado: Disponible"]').should("be.visible")
    cy.get('[aria-label="Cama 4, Piso 1, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 4, Piso 1, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 4, Piso 1, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 4, Piso 1, estado: Disponible"] > .bed-name').contains("Cama 4")
    cy.get('[aria-label="Cama 4, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")
    cy.get('[aria-label="Cama 4, Piso 1, estado: Disponible"] > .bed-floor-label').should("be.visible")
    cy.get('[aria-label="Cama 4, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")


    cy.get('[aria-label="Cama 5, Piso 1, estado: Disponible"]').should("be.visible")
    cy.get('[aria-label="Cama 5, Piso 1, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 5, Piso 1, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 5, Piso 1, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 5, Piso 1, estado: Disponible"] > .bed-name').contains("Cama 5")
    cy.get('[aria-label="Cama 5, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")
    cy.get('[aria-label="Cama 5, Piso 1, estado: Disponible"] > .bed-floor-label').should("be.visible")
    




    cy.get('[aria-label="Cama 6, Piso 1, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 6, Piso 1, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 6, Piso 1, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 6, Piso 1, estado: Disponible"] > .bed-name').contains("Cama 6")
    cy.get('[aria-label="Cama 6, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")
    cy.get('[aria-label="Cama 6, Piso 1, estado: Disponible"] > .bed-floor-label').should("be.visible")


    cy.get('[aria-label="Cama 7, Piso 1, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 7, Piso 1, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 7, Piso 1, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 7, Piso 1, estado: Disponible"] > .bed-name').contains("Cama 7")
    cy.get('[aria-label="Cama 7, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")
    cy.get('[aria-label="Cama 7, Piso 1, estado: Disponible"] > .bed-floor-label').should("be.visible")

    
    cy.get('[aria-label="Cama 8, Piso 1, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 8, Piso 1, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 8, Piso 1, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 8, Piso 1, estado: Disponible"] > .bed-name').contains("Cama 8")
    cy.get('[aria-label="Cama 8, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")
    cy.get('[aria-label="Cama 8, Piso 1, estado: Disponible"] > .bed-floor-label').should("be.visible")
     
    
    cy.get('[aria-label="Cama 9, Piso 1, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 9, Piso 1, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 9, Piso 1, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 9, Piso 1, estado: Disponible"] > .bed-name').contains("Cama 9")
    cy.get('[aria-label="Cama 9, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")
    cy.get('[aria-label="Cama 9, Piso 1, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 10, Piso 1, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 10, Piso 1, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 10, Piso 1, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 10, Piso 1, estado: Disponible"] > .bed-name').contains("Cama 10")
    cy.get('[aria-label="Cama 10, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")
    cy.get('[aria-label="Cama 10, Piso 1, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 11, Piso 1, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 11, Piso 1, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 11, Piso 1, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 11, Piso 1, estado: Disponible"] > .bed-name').contains("Cama 11")
    cy.get('[aria-label="Cama 11, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")
    cy.get('[aria-label="Cama 11, Piso 1, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 12, Piso 1, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 12, Piso 1, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 12, Piso 1, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 12, Piso 1, estado: Disponible"] > .bed-name').contains("Cama 12")
    cy.get('[aria-label="Cama 12, Piso 1, estado: Disponible"] > .bed-floor-label').contains("Piso 1")
    cy.get('[aria-label="Cama 12, Piso 1, estado: Disponible"] > .bed-floor-label').should("be.visible")
})

it('Validar Camas del Piso 2', () => {

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


    cy.get('.hamburger').should("be.visible")
    cy.get('.topbar-title').contains("BedTrack")
    cy.get('.topbar-title').should("be.visible")
    cy.get('.page-title').should("be.visible")
    cy.get('.page-title').contains("Bienvenido/a, Enfermería")
    cy.get('.page-subtitle').should("be.visible")
    cy.get('.page-subtitle').contains("Resumen general del sistema · Todos los pisos")
    cy.get('.btn-go-beds').should("be.visible")
    cy.get('.btn-go-beds').contains("Gestionar camas")
    cy.get('.dashboard-welcome').should("be.visible")
    
    


   cy.get('.btn-go-beds').click()
   cy.get('.floor-selector > :nth-child(2)').click()
   cy.get('.page-wrapper').should("be.visible")
   cy.get('.page-title').should("be.visible")
   cy.get('.page-title').contains("Estado de Camas")
   cy.get('.page-subtitle').should("be.visible")
   cy.get('.page-subtitle').contains("Monitoreo en tiempo real · Piso 2")
   cy.get('.floor-selector > .active').should("be.visible")
   cy.get('.floor-selector > :nth-child(2)').should("be.visible")
   cy.get('.floor-selector > :nth-child(2)').contains("Piso 2")
   cy.get('.floor-selector > :nth-child(3)').should("be.visible")
   cy.get('.floor-selector > :nth-child(3)').contains("Piso 3")
   cy.get('.floor-selector > :nth-child(4)').should("be.visible")
   cy.get('.floor-selector > :nth-child(4)').contains("Piso 4")
   cy.get('.floor-selector > :nth-child(5)').should("be.visible")
   cy.get('.floor-selector > :nth-child(5)').contains("Piso 5")
   cy.get('.floor-selector').should("be.visible")

   cy.get('.stats-grid > :nth-child(1)').should("be.visible")
   cy.get(':nth-child(1) > .stat-icon').should("be.visible")
   cy.get(':nth-child(1) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(1) > .stat-info > .stat-value').contains("12")
   cy.get(':nth-child(1) > .stat-info > .stat-label').contains("Disponibles")


   cy.get('.stats-grid > :nth-child(2)').should("be.visible")
   cy.get(':nth-child(2) > .stat-icon').should("be.visible")
   cy.get(':nth-child(2) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(2) > .stat-info > .stat-value').contains("0")
   cy.get(':nth-child(2) > .stat-info > .stat-label').contains("Ocupadas")


   cy.get('.stats-grid > :nth-child(3)').should("be.visible")
   cy.get(':nth-child(3) > .stat-icon').should("be.visible")
   cy.get(':nth-child(3) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(3) > .stat-info > .stat-value').contains("0")
   cy.get(':nth-child(3) > .stat-info > .stat-label').contains("En limpieza")
    

   cy.get('.beds-header').should("be.visible")
   cy.get('.beds-section-title').should("be.visible")
   cy.get('.beds-section-title').contains("Camas del Piso 2")

   cy.get('.beds-count-badge').should("be.visible")
   cy.get('.beds-count-badge').contains("12 camas")

   cy.get('[aria-label="Cama 13, Piso 2, estado: Disponible"]').should("be.visible")
   cy.get('[aria-label="Cama 13, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
   cy.get('[aria-label="Cama 13, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
   cy.get('[aria-label="Cama 13, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
   cy.get('[aria-label="Cama 13, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
   cy.get('[aria-label="Cama 13, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")
   

  cy.get('[aria-label="Cama 14, Piso 2, estado: Disponible"]').should("be.visible")
   cy.get('[aria-label="Cama 14, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
   cy.get('[aria-label="Cama 14, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
   cy.get('[aria-label="Cama 14, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
   cy.get('[aria-label="Cama 14, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
   cy.get('[aria-label="Cama 14, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")
   



    cy.get('[aria-label="Cama 15, Piso 2, estado: Disponible"]').should("be.visible")
    cy.get('[aria-label="Cama 15, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 15, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 15, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 15, Piso 2, estado: Disponible"] > .bed-name').contains("Cama 15")
    cy.get('[aria-label="Cama 15, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
    cy.get('[aria-label="Cama 15, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 16, Piso 2, estado: Disponible"]').should("be.visible")
    cy.get('[aria-label="Cama 16, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 16, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 16, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 16, Piso 2, estado: Disponible"] > .bed-name').contains("Cama 16")
    cy.get('[aria-label="Cama 16, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
    cy.get('[aria-label="Cama 16, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")
    
    




    cy.get('[aria-label="Cama 17, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 17, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 17, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 17, Piso 2, estado: Disponible"] > .bed-name').contains("Cama 17")
    cy.get('[aria-label="Cama 17, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
    cy.get('[aria-label="Cama 17, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")


    cy.get('[aria-label="Cama 18, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 18, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 18, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 18, Piso 2, estado: Disponible"] > .bed-name').contains("Cama 18")
    cy.get('[aria-label="Cama 18, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
    cy.get('[aria-label="Cama 18, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")

    
    cy.get('[aria-label="Cama 19, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 19, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 19, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 19, Piso 2, estado: Disponible"] > .bed-name').contains("Cama 19")
    cy.get('[aria-label="Cama 19, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
    cy.get('[aria-label="Cama 19, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")
     
    
    cy.get('[aria-label="Cama 20, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 20, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 20, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 20, Piso 2, estado: Disponible"] > .bed-name').contains("Cama 20")
    cy.get('[aria-label="Cama 20, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
    cy.get('[aria-label="Cama 20, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 21, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 21, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 21, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 21, Piso 2, estado: Disponible"] > .bed-name').contains("Cama 21")
    cy.get('[aria-label="Cama 21, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
    cy.get('[aria-label="Cama 21, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 22, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 22, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 22, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 22, Piso 2, estado: Disponible"] > .bed-name').contains("Cama 22")
    cy.get('[aria-label="Cama 22, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
    cy.get('[aria-label="Cama 22, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 23, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 23, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 23, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 23, Piso 2, estado: Disponible"] > .bed-name').contains("Cama 23")
    cy.get('[aria-label="Cama 23, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
    cy.get('[aria-label="Cama 23, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")

    cy.get('[aria-label="Cama 24, Piso 2, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 24, Piso 2, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 24, Piso 2, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 24, Piso 2, estado: Disponible"] > .bed-name').contains("Cama 24")
    cy.get('[aria-label="Cama 24, Piso 2, estado: Disponible"] > .bed-floor-label').contains("Piso 2")
    cy.get('[aria-label="Cama 24, Piso 2, estado: Disponible"] > .bed-floor-label').should("be.visible")

  })
it('Validar Camas del Piso 3', () => {

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


    cy.get('.hamburger').should("be.visible")
    cy.get('.topbar-title').contains("BedTrack")
    cy.get('.topbar-title').should("be.visible")
    cy.get('.page-title').should("be.visible")
    cy.get('.page-title').contains("Bienvenido/a, Enfermería")
    cy.get('.page-subtitle').should("be.visible")
    cy.get('.page-subtitle').contains("Resumen general del sistema · Todos los pisos")
    cy.get('.btn-go-beds').should("be.visible")
    cy.get('.btn-go-beds').contains("Gestionar camas")
    cy.get('.dashboard-welcome').should("be.visible")
    
    


   cy.get('.btn-go-beds').click()
   cy.get('.floor-selector > :nth-child(3)').click()
   cy.get('.page-wrapper').should("be.visible")
   cy.get('.page-title').should("be.visible")
   cy.get('.page-title').contains("Estado de Camas")
   cy.get('.page-subtitle').should("be.visible")
   cy.get('.page-subtitle').contains("Monitoreo en tiempo real · Piso 3")
   cy.get('.floor-selector > .active').should("be.visible")
   cy.get('.floor-selector > :nth-child(2)').should("be.visible")
   cy.get('.floor-selector > :nth-child(2)').contains("Piso 2")
   cy.get('.floor-selector > :nth-child(3)').should("be.visible")
   cy.get('.floor-selector > :nth-child(3)').contains("Piso 3")
   cy.get('.floor-selector > :nth-child(4)').should("be.visible")
   cy.get('.floor-selector > :nth-child(4)').contains("Piso 4")
   cy.get('.floor-selector > :nth-child(5)').should("be.visible")
   cy.get('.floor-selector > :nth-child(5)').contains("Piso 5")
   cy.get('.floor-selector').should("be.visible")

   cy.get('.stats-grid > :nth-child(1)').should("be.visible")
   cy.get(':nth-child(1) > .stat-icon').should("be.visible")
   cy.get(':nth-child(1) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(1) > .stat-info > .stat-value').contains("12")
   cy.get(':nth-child(1) > .stat-info > .stat-label').contains("Disponibles")


   cy.get('.stats-grid > :nth-child(2)').should("be.visible")
   cy.get(':nth-child(2) > .stat-icon').should("be.visible")
   cy.get(':nth-child(2) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(2) > .stat-info > .stat-value').contains("0")
   cy.get(':nth-child(2) > .stat-info > .stat-label').contains("Ocupadas")


   cy.get('.stats-grid > :nth-child(3)').should("be.visible")
   cy.get(':nth-child(3) > .stat-icon').should("be.visible")
   cy.get(':nth-child(3) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(3) > .stat-info > .stat-value').contains("0")
   cy.get(':nth-child(3) > .stat-info > .stat-label').contains("En limpieza")
    

   cy.get('.beds-header').should("be.visible")
   cy.get('.beds-section-title').should("be.visible")
   cy.get('.beds-section-title').contains("Camas del Piso 3")

   cy.get('.beds-count-badge').should("be.visible")
   cy.get('.beds-count-badge').contains("12 camas")

   cy.get('[aria-label="Cama 25, Piso 3, estado: Disponible"]').should("be.visible")
   cy.get('[aria-label="Cama 25, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
   cy.get('[aria-label="Cama 25, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
   cy.get('[aria-label="Cama 25, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
   cy.get('[aria-label="Cama 25, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
   cy.get('[aria-label="Cama 25, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")
   

   cy.get('[aria-label="Cama 26, Piso 3, estado: Disponible"]').should("be.visible")
   cy.get('[aria-label="Cama 26, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
   cy.get('[aria-label="Cama 26, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
   cy.get('[aria-label="Cama 26, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
   cy.get('[aria-label="Cama 26, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
   cy.get('[aria-label="Cama 26, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")
   



    cy.get('[aria-label="Cama 27, Piso 3, estado: Disponible"]').should("be.visible")
    cy.get('[aria-label="Cama 27, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 27, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 27, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 27, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
    cy.get('[aria-label="Cama 27, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")
    

    cy.get('[aria-label="Cama 28, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 28, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 28, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 28, Piso 3, estado: Disponible"] > .bed-name').contains("Cama 28")
    cy.get('[aria-label="Cama 28, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
    cy.get('[aria-label="Cama 28, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 29, Piso 3, estado: Disponible"]').should("be.visible")
    cy.get('[aria-label="Cama 29, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 29, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 29, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 29, Piso 3, estado: Disponible"] > .bed-name').contains("Cama 29")
    cy.get('[aria-label="Cama 29, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
    cy.get('[aria-label="Cama 29, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")
    
    
    




    cy.get('[aria-label="Cama 30, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 30, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 30, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 30, Piso 3, estado: Disponible"] > .bed-name').contains("Cama 30")
    cy.get('[aria-label="Cama 30, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
    cy.get('[aria-label="Cama 30, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")


    cy.get('[aria-label="Cama 31, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 31, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 31, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 31, Piso 3, estado: Disponible"] > .bed-name').contains("Cama 31")
    cy.get('[aria-label="Cama 31, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
    cy.get('[aria-label="Cama 31, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")

    
    cy.get('[aria-label="Cama 32, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 32, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 32, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 32, Piso 3, estado: Disponible"] > .bed-name').contains("Cama 32")
    cy.get('[aria-label="Cama 32, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
    cy.get('[aria-label="Cama 32, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")
     
    
    cy.get('[aria-label="Cama 33, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 33, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 33, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 33, Piso 3, estado: Disponible"] > .bed-name').contains("Cama 33")
    cy.get('[aria-label="Cama 33, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
    cy.get('[aria-label="Cama 33, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 34, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 34, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 34, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 34, Piso 3, estado: Disponible"] > .bed-name').contains("Cama 34")
    cy.get('[aria-label="Cama 34, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
    cy.get('[aria-label="Cama 34, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 35, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 35, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 35, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 35, Piso 3, estado: Disponible"] > .bed-name').contains("Cama 35")
    cy.get('[aria-label="Cama 35, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
    cy.get('[aria-label="Cama 35, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 36, Piso 3, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 36, Piso 3, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 36, Piso 3, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 36, Piso 3, estado: Disponible"] > .bed-name').contains("Cama 36")
    cy.get('[aria-label="Cama 36, Piso 3, estado: Disponible"] > .bed-floor-label').contains("Piso 3")
    cy.get('[aria-label="Cama 36, Piso 3, estado: Disponible"] > .bed-floor-label').should("be.visible")
})


it('Validar Camas del Piso 4', () => {

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


    cy.get('.hamburger').should("be.visible")
    cy.get('.topbar-title').contains("BedTrack")
    cy.get('.topbar-title').should("be.visible")
    cy.get('.page-title').should("be.visible")
    cy.get('.page-title').contains("Bienvenido/a, Enfermería")
    cy.get('.page-subtitle').should("be.visible")
    cy.get('.page-subtitle').contains("Resumen general del sistema · Todos los pisos")
    cy.get('.btn-go-beds').should("be.visible")
    cy.get('.btn-go-beds').contains("Gestionar camas")
    cy.get('.dashboard-welcome').should("be.visible")
    
    


   cy.get('.btn-go-beds').click()
   cy.get('.floor-selector > :nth-child(4)').click()
   cy.get('.page-wrapper').should("be.visible")
   cy.get('.page-title').should("be.visible")
   cy.get('.page-title').contains("Estado de Camas")
   cy.get('.page-subtitle').should("be.visible")
   cy.get('.page-subtitle').contains("Monitoreo en tiempo real · Piso 4")
   cy.get('.floor-selector > .active').should("be.visible")
   cy.get('.floor-selector > :nth-child(2)').should("be.visible")
   cy.get('.floor-selector > :nth-child(2)').contains("Piso 2")
   cy.get('.floor-selector > :nth-child(3)').should("be.visible")
   cy.get('.floor-selector > :nth-child(3)').contains("Piso 3")
   cy.get('.floor-selector > :nth-child(4)').should("be.visible")
   cy.get('.floor-selector > :nth-child(4)').contains("Piso 4")
   cy.get('.floor-selector > :nth-child(5)').should("be.visible")
   cy.get('.floor-selector > :nth-child(5)').contains("Piso 5")
   cy.get('.floor-selector').should("be.visible")

   cy.get('.stats-grid > :nth-child(1)').should("be.visible")
   cy.get(':nth-child(1) > .stat-icon').should("be.visible")
   cy.get(':nth-child(1) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(1) > .stat-info > .stat-value').contains("12")
   cy.get(':nth-child(1) > .stat-info > .stat-label').contains("Disponibles")


   cy.get('.stats-grid > :nth-child(2)').should("be.visible")
   cy.get(':nth-child(2) > .stat-icon').should("be.visible")
   cy.get(':nth-child(2) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(2) > .stat-info > .stat-value').contains("0")
   cy.get(':nth-child(2) > .stat-info > .stat-label').contains("Ocupadas")


   cy.get('.stats-grid > :nth-child(3)').should("be.visible")
   cy.get(':nth-child(3) > .stat-icon').should("be.visible")
   cy.get(':nth-child(3) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(3) > .stat-info > .stat-value').contains("0")
   cy.get(':nth-child(3) > .stat-info > .stat-label').contains("En limpieza")
    

   cy.get('.beds-header').should("be.visible")
   cy.get('.beds-section-title').should("be.visible")
   cy.get('.beds-section-title').contains("Camas del Piso 4")

   cy.get('.beds-count-badge').should("be.visible")
   cy.get('.beds-count-badge').contains("12 camas")

   cy.get('[aria-label="Cama 37, Piso 4, estado: Disponible"]').should("be.visible")
   cy.get('[aria-label="Cama 37, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
   cy.get('[aria-label="Cama 37, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
   cy.get('[aria-label="Cama 37, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
   cy.get('[aria-label="Cama 37, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
   cy.get('[aria-label="Cama 37, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")
   

   cy.get('[aria-label="Cama 38, Piso 4, estado: Disponible"]').should("be.visible")
   cy.get('[aria-label="Cama 38, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
   cy.get('[aria-label="Cama 38, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
   cy.get('[aria-label="Cama 38, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
   cy.get('[aria-label="Cama 38, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
   cy.get('[aria-label="Cama 38, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")
   



    cy.get('[aria-label="Cama 39, Piso 4, estado: Disponible"]').should("be.visible")
    cy.get('[aria-label="Cama 39, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 39, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 39, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 39, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
    cy.get('[aria-label="Cama 39, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")
    

    cy.get('[aria-label="Cama 40, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 40, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 40, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 40, Piso 4, estado: Disponible"] > .bed-name').contains("Cama 40")
    cy.get('[aria-label="Cama 40, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
    cy.get('[aria-label="Cama 40, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 41, Piso 4, estado: Disponible"]').should("be.visible")
    cy.get('[aria-label="Cama 41, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 41, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 41, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 41, Piso 4, estado: Disponible"] > .bed-name').contains("Cama 41")
    cy.get('[aria-label="Cama 41, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
    cy.get('[aria-label="Cama 41, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")
    
    
    

    cy.get('[aria-label="Cama 42, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 42, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 42, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 42, Piso 4, estado: Disponible"] > .bed-name').contains("Cama 42")
    cy.get('[aria-label="Cama 42, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
    cy.get('[aria-label="Cama 42, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")


    cy.get('[aria-label="Cama 43, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 43, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 43, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 43, Piso 4, estado: Disponible"] > .bed-name').contains("Cama 43")
    cy.get('[aria-label="Cama 43, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
    cy.get('[aria-label="Cama 43, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")

    
    cy.get('[aria-label="Cama 44, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 44, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 44, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 44, Piso 4, estado: Disponible"] > .bed-name').contains("Cama 44")
    cy.get('[aria-label="Cama 44, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
    cy.get('[aria-label="Cama 44, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")
     
    
    cy.get('[aria-label="Cama 45, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 45, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 45, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 45, Piso 4, estado: Disponible"] > .bed-name').contains("Cama 45")
    cy.get('[aria-label="Cama 45, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
    cy.get('[aria-label="Cama 45, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 46, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 46, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 46, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 46, Piso 4, estado: Disponible"] > .bed-name').contains("Cama 46")
    cy.get('[aria-label="Cama 46, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
    cy.get('[aria-label="Cama 46, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 47, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 47, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 47, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 47, Piso 4, estado: Disponible"] > .bed-name').contains("Cama 47")
    cy.get('[aria-label="Cama 47, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
    cy.get('[aria-label="Cama 47, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 48, Piso 4, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 48, Piso 4, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 48, Piso 4, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 48, Piso 4, estado: Disponible"] > .bed-name').contains("Cama 48")
    cy.get('[aria-label="Cama 48, Piso 4, estado: Disponible"] > .bed-floor-label').contains("Piso 4")
    cy.get('[aria-label="Cama 48, Piso 4, estado: Disponible"] > .bed-floor-label').should("be.visible")

     })

  it('Validar Camas del Piso 5', () => {

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


    cy.get('.hamburger').should("be.visible")
    cy.get('.topbar-title').contains("BedTrack")
    cy.get('.topbar-title').should("be.visible")
    cy.get('.page-title').should("be.visible")
    cy.get('.page-title').contains("Bienvenido/a, Enfermería")
    cy.get('.page-subtitle').should("be.visible")
    cy.get('.page-subtitle').contains("Resumen general del sistema · Todos los pisos")
    cy.get('.btn-go-beds').should("be.visible")
    cy.get('.btn-go-beds').contains("Gestionar camas")
    cy.get('.dashboard-welcome').should("be.visible")
    
    


   cy.get('.btn-go-beds').click()
   cy.get('.floor-selector > :nth-child(5)').click()
   cy.get('.page-wrapper').should("be.visible")
   cy.get('.page-title').should("be.visible")
   cy.get('.page-title').contains("Estado de Camas")
   cy.get('.page-subtitle').should("be.visible")
   cy.get('.page-subtitle').contains("Monitoreo en tiempo real · Piso 5")
   cy.get('.floor-selector > .active').should("be.visible")
   cy.get('.floor-selector > :nth-child(2)').should("be.visible")
   cy.get('.floor-selector > :nth-child(2)').contains("Piso 2")
   cy.get('.floor-selector > :nth-child(3)').should("be.visible")
   cy.get('.floor-selector > :nth-child(3)').contains("Piso 3")
   cy.get('.floor-selector > :nth-child(4)').should("be.visible")
   cy.get('.floor-selector > :nth-child(4)').contains("Piso 4")
   cy.get('.floor-selector > :nth-child(5)').should("be.visible")
   cy.get('.floor-selector > :nth-child(5)').contains("Piso 5")
   cy.get('.floor-selector').should("be.visible")

   cy.get('.stats-grid > :nth-child(1)').should("be.visible")
   cy.get(':nth-child(1) > .stat-icon').should("be.visible")
   cy.get(':nth-child(1) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(1) > .stat-info > .stat-value').contains("12")
   cy.get(':nth-child(1) > .stat-info > .stat-label').contains("Disponibles")


   cy.get('.stats-grid > :nth-child(2)').should("be.visible")
   cy.get(':nth-child(2) > .stat-icon').should("be.visible")
   cy.get(':nth-child(2) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(2) > .stat-info > .stat-value').contains("0")
   cy.get(':nth-child(2) > .stat-info > .stat-label').contains("Ocupadas")


   cy.get('.stats-grid > :nth-child(3)').should("be.visible")
   cy.get(':nth-child(3) > .stat-icon').should("be.visible")
   cy.get(':nth-child(3) > .stat-info > .stat-value').should("be.visible")
   cy.get(':nth-child(3) > .stat-info > .stat-value').contains("0")
   cy.get(':nth-child(3) > .stat-info > .stat-label').contains("En limpieza")
    

   cy.get('.beds-header').should("be.visible")
   cy.get('.beds-section-title').should("be.visible")
   cy.get('.beds-section-title').contains("Camas del Piso 5")

   cy.get('.beds-count-badge').should("be.visible")
   cy.get('.beds-count-badge').contains("12 camas")

   cy.get('[aria-label="Cama 49, Piso 5, estado: Disponible"]').should("be.visible")
   cy.get('[aria-label="Cama 49, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
   cy.get('[aria-label="Cama 49, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
   cy.get('[aria-label="Cama 49, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
   cy.get('[aria-label="Cama 49, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
   cy.get('[aria-label="Cama 49, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")
   

   cy.get('[aria-label="Cama 50, Piso 5, estado: Disponible"]').should("be.visible")
   cy.get('[aria-label="Cama 50, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
   cy.get('[aria-label="Cama 50, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
   cy.get('[aria-label="Cama 50, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
   cy.get('[aria-label="Cama 50, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
   cy.get('[aria-label="Cama 50, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")
   



    cy.get('[aria-label="Cama 51, Piso 5, estado: Disponible"]').should("be.visible")
    cy.get('[aria-label="Cama 51, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 51, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 51, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 51, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
    cy.get('[aria-label="Cama 51, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")
    

    cy.get('[aria-label="Cama 52, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 52, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 52, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 52, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
    cy.get('[aria-label="Cama 52, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 53, Piso 5, estado: Disponible"]').should("be.visible")
    cy.get('[aria-label="Cama 53, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 53, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 53, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 53, Piso 5, estado: Disponible"] > .bed-name').contains("Cama 53")
    cy.get('[aria-label="Cama 53, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
    cy.get('[aria-label="Cama 53, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")
    
    
    

    cy.get('[aria-label="Cama 54, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 54, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 54, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 54, Piso 5, estado: Disponible"] > .bed-name').contains("Cama 54")
    cy.get('[aria-label="Cama 54, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
    cy.get('[aria-label="Cama 54, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")


    cy.get('[aria-label="Cama 55, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 55, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 55, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 55, Piso 5, estado: Disponible"] > .bed-name').contains("Cama 55")
    cy.get('[aria-label="Cama 55, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
    cy.get('[aria-label="Cama 55, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")

    
    cy.get('[aria-label="Cama 56, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 56, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 56, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 56, Piso 5, estado: Disponible"] > .bed-name').contains("Cama 56")
    cy.get('[aria-label="Cama 56, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
    cy.get('[aria-label="Cama 56, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")
     
    
    cy.get('[aria-label="Cama 57, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 57, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 57, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 57, Piso 5, estado: Disponible"] > .bed-name').contains("Cama 57")
    cy.get('[aria-label="Cama 57, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
    cy.get('[aria-label="Cama 57, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 58, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 58, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 58, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 58, Piso 5, estado: Disponible"] > .bed-name').contains("Cama 58")
    cy.get('[aria-label="Cama 58, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
    cy.get('[aria-label="Cama 58, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 59, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 59, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 59, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 59, Piso 5, estado: Disponible"] > .bed-name').contains("Cama 59")
    cy.get('[aria-label="Cama 59, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
    cy.get('[aria-label="Cama 59, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")



    cy.get('[aria-label="Cama 60, Piso 5, estado: Disponible"] > .bed-card-header').should("be.visible")
    cy.get('[aria-label="Cama 60, Piso 5, estado: Disponible"] > .bed-card-header > .bed-status-badge').contains("Disponible")
    cy.get('[aria-label="Cama 60, Piso 5, estado: Disponible"] > .bed-name').should("be.visible")
    cy.get('[aria-label="Cama 60, Piso 5, estado: Disponible"] > .bed-name').contains("Cama 60")
    cy.get('[aria-label="Cama 60, Piso 5, estado: Disponible"] > .bed-floor-label').contains("Piso 5")
    cy.get('[aria-label="Cama 60, Piso 5, estado: Disponible"] > .bed-floor-label').should("be.visible")

  


})
it('Pasar de Cama 1 en Limpieza a Disponible del Piso 1', () => {

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


    cy.get('.hamburger').should("be.visible")
    cy.get('.topbar-title').contains("BedTrack")
    cy.get('.topbar-title').should("be.visible")
    cy.get('.page-title').should("be.visible")
    cy.get('.page-title').contains("Bienvenido/a, Enfermería")
    cy.get('.page-subtitle').should("be.visible")
    cy.get('.page-subtitle').contains("Resumen general del sistema · Todos los pisos")
    cy.get('.btn-go-beds').should("be.visible")
    cy.get('.btn-go-beds').contains("Gestionar camas")
    cy.get('.dashboard-welcome').should("be.visible")
    

    cy.get('.btn-go-beds').click()


    cy.get('.btn-avail').click()
    cy.get('.status-cleaning > .bed-card-header > .bed-status-badge').contains("Disponible")
 


})

it('Registrar paciente de cama 2 de Disponible a Ocupada del Piso 1', () => {

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


    cy.get('.hamburger').should("be.visible")
    cy.get('.topbar-title').contains("BedTrack")
    cy.get('.topbar-title').should("be.visible")
    cy.get('.page-title').should("be.visible")
    cy.get('.page-title').contains("Bienvenido/a, Enfermería")
    cy.get('.page-subtitle').should("be.visible")
    cy.get('.page-subtitle').contains("Resumen general del sistema · Todos los pisos")
    cy.get('.btn-go-beds').should("be.visible")
    cy.get('.btn-go-beds').contains("Gestionar camas")
    cy.get('.dashboard-welcome').should("be.visible")
    

    cy.get('.btn-go-beds').click()


    cy.get('[aria-label="Cama 2, Piso 1, estado: Disponible"] > .bed-actions > .btn-occup').click()
    
    cy.get('.modal-title-icon').should("be.visible")
    cy.get('#modal-title').should("be.visible")
    cy.get('#modal-title').contains("Registrar Paciente")
    cy.get('.modal-subtitle').should("be.visible")
    cy.get('.modal-subtitle').contains("Cama 1 · Hab. 102 · Piso 1")

    cy.get(':nth-child(1) > .form-label').should("be.visible")
    cy.get(':nth-child(1) > .form-label').contains("Nombre *")
    cy.get('[name="nombre"]').should("be.visible")


    cy.get('[name="nombre"]').should("be.visible")
    cy.get(':nth-child(2) > .form-label').should("be.visible")
    cy.get(':nth-child(2) > .form-label').contains("Apellido *")
    cy.get('[name="apellido"]').should("be.visible")


    cy.get(':nth-child(3) > .form-label').should("be.visible")
    cy.get(':nth-child(3) > .form-label').contains("Edad *")
    cy.get('[name="edad"]').should("be.visible")


    cy.get(':nth-child(4) > .form-label').should("be.visible")
    cy.get(':nth-child(4) > .form-label').contains("Días aprox. de internación *")
    cy.get('[name="diasInternacion"]').should("be.visible")

    cy.get('.form-group-full > .form-label').should("be.visible")
    cy.get('.form-group-full > .form-label').contains("Diagnóstico *")
    cy.get('[name="diagnostico"]').should("be.visible")


    cy.get('.btn-modal-cancel').should("be.visible")
    cy.get('.btn-modal-cancel').contains("Cancelar")

    cy.get('.btn-modal-confirm').should("be.visible")
    


   cy.get('[name="nombre"]').type("Cristian")

    cy.get('[name="apellido"]').type("Barrios")

    cy.get('[name="edad"]').type("24")

    cy.get('[name="diasInternacion"]').type("20")

    cy.get('[name="diagnostico"]').type("Dolor de Rodilla")



    cy.get('.btn-modal-confirm').click()




})
})