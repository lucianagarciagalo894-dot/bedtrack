describe('Prueba Automatizada 3', () => {

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
    
it('Renderización de Dashboard la cantidad de camas', () => {

cy.get('.stats-grid > :nth-child(1)').should("be.visible")
cy.get(':nth-child(1) > .stat-info > .stat-value').contains("60")
cy.get(':nth-child(1) > .stat-info > .stat-label').contains("Total de camas")
cy.get(':nth-child(1) > .stat-icon').should("be.visible")

cy.get('.stats-grid > :nth-child(2)').should("be.visible")
cy.get(':nth-child(2) > .stat-info > .stat-value').contains("58")
cy.get(':nth-child(2) > .stat-info > .stat-label').contains("Disponibles")
cy.get(':nth-child(2) > .stat-icon').should("be.visible")

cy.get('.stats-grid > :nth-child(3)').should("be.visible")
cy.get(':nth-child(3) > .stat-info > .stat-value').contains("1")
cy.get(':nth-child(3) > .stat-info > .stat-label').contains("Ocupadas")
cy.get(':nth-child(3) > .stat-icon').should("be.visible")

cy.get('.stats-grid > :nth-child(4)').should("be.visible")
cy.get(':nth-child(4) > .stat-info > .stat-value').contains("0")
cy.get(':nth-child(4) > .stat-info > .stat-label').contains("En limpieza")
cy.get(':nth-child(4) > .stat-icon').should("be.visible")




cy.get('.dashboard-section-header').should("be.visible")
cy.get('.beds-section-title').contains("Estado por piso")
cy.get('.floor-legend > :nth-child(1)').should("be.visible")
cy.get('.floor-legend > :nth-child(2)').should("be.visible")
cy.get('.floor-legend > :nth-child(3)').should("be.visible")



it('Probar Dashboard piso 1', () => {

cy.get('.dashboard-section').should("be.visible")


cy.get('.floor-breakdown > :nth-child(1)').should("be.visible")
cy.get(':nth-child(1) > .floor-row-name').contains("Piso 1")
cy.get(':nth-child(1) > .floor-row-bars > .floor-bar-available').should("be.visible")
cy.get('.floor-bar-occupied').should("be.visible")
cy.get(':nth-child(1) > .floor-row-bars').should("be.visible")
cy.get('.floor-bar-occupied').should("be.visible")


cy.get(':nth-child(1) > .floor-row-chips > .floor-chip-available').contains("10")
cy.get(':nth-child(1) > .floor-row-chips > .floor-chip-occupied').contains("1")
cy.get(':nth-child(1) > .floor-row-chips > .floor-chip-cleaning').contains("0")

cy.get(':nth-child(1) > .floor-row-link').contains("Ver")



it('Probar Dashboard piso 2', () => {

cy.get('.dashboard-section').should("be.visible")


cy.get('.floor-breakdown > :nth-child(2)').should("be.visible")
cy.get(':nth-child(2) > .floor-row-name').contains("Piso 2")
cy.get(':nth-child(2) > .floor-row-bars > .floor-bar-available').should("be.visible")

cy.get('.floor-bar-occupied').should("be.visible")
cy.get(':nth-child(2) > .floor-row-bars').should("be.visible")
cy.get('.floor-bar-occupied').should("be.visible")


cy.get(':nth-child(2) > .floor-row-chips > .floor-chip-available').contains("12")
cy.get(':nth-child(2) > .floor-row-chips > .floor-chip-occupied').contains("0")
cy.get(':nth-child(2) > .floor-row-chips > .floor-chip-cleaning').contains("0")

cy.get(':nth-child(2) > .floor-row-link').contains("Ver")


it('Probar Dashboard piso 3', () => {

cy.get('.dashboard-section').should("be.visible")


cy.get('.floor-breakdown > :nth-child(3)').should("be.visible")
cy.get(':nth-child(3) > .floor-row-name').contains("Piso 3")
cy.get(':nth-child(3) > .floor-row-bars > .floor-bar-available').should("be.visible")

cy.get('.floor-bar-occupied').should("be.visible")
cy.get(':nth-child(3) > .floor-row-bars').should("be.visible")
cy.get('.floor-bar-occupied').should("be.visible")


cy.get(':nth-child(3) > .floor-row-chips > .floor-chip-available').contains("12")
cy.get(':nth-child(3) > .floor-row-chips > .floor-chip-occupied').contains("0")
cy.get(':nth-child(3) > .floor-row-chips > .floor-chip-cleaning').contains("0")

cy.get(':nth-child(3) > .floor-row-link').contains("Ver")




it('Probar Dashboard piso 4', () => {

cy.get('.dashboard-section').should("be.visible")


cy.get('.floor-breakdown > :nth-child(4)').should("be.visible")
cy.get(':nth-child(4) > .floor-row-name').contains("Piso 4")
cy.get(':nth-child(4) > .floor-row-bars > .floor-bar-available').should("be.visible")

cy.get('.floor-bar-occupied').should("be.visible")
cy.get(':nth-child(4) > .floor-row-bars').should("be.visible")
cy.get('.floor-bar-occupied').should("be.visible")


cy.get(':nth-child(4) > .floor-row-chips > .floor-chip-available').contains("12")
cy.get(':nth-child(4) > .floor-row-chips > .floor-chip-occupied').contains("0")
cy.get(':nth-child(4) > .floor-row-chips > .floor-chip-cleaning').contains("0")

cy.get(':nth-child(4) > .floor-row-link').contains("Ver")


it('Probar Dashboard piso 5', () => {

cy.get('.dashboard-section').should("be.visible")


cy.get('.floor-breakdown > :nth-child(5)').should("be.visible")
cy.get(':nth-child(5) > .floor-row-name').contains("Piso 5")
cy.get(':nth-child(5) > .floor-row-bars > .floor-bar-available').should("be.visible")

cy.get('.floor-bar-occupied').should("be.visible")
cy.get(':nth-child(5) > .floor-row-bars').should("be.visible")
cy.get('.floor-bar-occupied').should("be.visible")


cy.get(':nth-child(5) > .floor-row-chips > .floor-chip-available').contains("12")
cy.get(':nth-child(5) > .floor-row-chips > .floor-chip-occupied').contains("0")
cy.get(':nth-child(5) > .floor-row-chips > .floor-chip-cleaning').contains("0")

cy.get(':nth-child(5) > .floor-row-link').contains("Ver")


})
})
})
})
})
})
})
})