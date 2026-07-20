describe('Prueba Automatizada 5', () => {

it('Renderizar pagina de habitaciones', () => {
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
    cy.get('.hamburger').click()


    cy.get('[href="/habitaciones"]').click()
    cy.get('.page-wrapper').should("be.visible")
    cy.get('.page-title').should("be.visible")
    cy.get('.page-title').contains("Habitaciones por Piso")

    cy.get('.page-subtitle').should("be.visible")
    cy.get('.page-subtitle').contains("Seleccioná una habitación para gestionar sus camas · Piso 1")

    cy.get('.floor-tabs-wrap > .active').should("be.visible")
    cy.get('.active > .floor-tab-name').should("be.visible")
    cy.get('.active > .floor-tab-name').contains("Piso 1")
    cy.get('.active > .floor-tab-type').should("be.visible")
    cy.get('.active > .floor-tab-type').contains("Privada")

    cy.get('.floor-tabs-wrap > :nth-child(2)').should("be.visible")
    cy.get(':nth-child(2) > .floor-tab-name').should("be.visible")
    cy.get(':nth-child(2) > .floor-tab-name').contains("Piso 2")
    cy.get(':nth-child(2) > .floor-tab-type').should("be.visible")
   

    cy.get('.floor-tabs-wrap > :nth-child(3)').should("be.visible")
    cy.get(':nth-child(3) > .floor-tab-name').should("be.visible")
    
    cy.get('.floor-info-banner').should("be.visible")
    cy.get('.floor-info-icon').should("be.visible")
    cy.get('.floor-info-title').should("be.visible")
    cy.get('.floor-info-title').contains("Piso 1 · Privada")
    cy.get('.floor-info-desc').should("be.visible")
    cy.get('.floor-info-desc').contains("12 habitaciones · 1 cama por habitación · 12 camas en total")

    cy.get('.floor-info-chips').should("be.visible")
    cy.get('.floor-info-chips > :nth-child(1)').should("be.visible")
    cy.get('.floor-info-chips > :nth-child(2)').should("be.visible")
    cy.get('.floor-info-chips > :nth-child(1) > span').contains("12 hab.")
    cy.get('.floor-info-chips > :nth-child(2) > span').contains("12 camas")


    cy.get('.stats-grid > :nth-child(1)').should("be.visible")
    cy.get(':nth-child(1) > .stat-icon').should("be.visible")
    cy.get(':nth-child(1) > .stat-info > .stat-label').should("be.visible")
    cy.get(':nth-child(1) > .stat-info > .stat-value').should("be.visible")
    cy.get(':nth-child(1) > .stat-info > .stat-value').contains("11")


    cy.get('.stats-grid > :nth-child(2)').should("be.visible")
    cy.get(':nth-child(2) > .stat-icon').should("be.visible")
    cy.get(':nth-child(2) > .stat-info > .stat-label').should("be.visible")
    cy.get(':nth-child(2) > .stat-info > .stat-value').should("be.visible")
    cy.get(':nth-child(2) > .stat-info > .stat-value').contains("0")
    

    cy.get('.stats-grid > :nth-child(3)').should("be.visible")
    cy.get(':nth-child(3) > .stat-icon').should("be.visible")
    cy.get(':nth-child(3) > .stat-info > .stat-label').should("be.visible")
    cy.get(':nth-child(3) > .stat-info > .stat-value').should("be.visible")
    cy.get(':nth-child(3) > .stat-info > .stat-value').contains("0")


    cy.get('.beds-header').should("be.visible")
    cy.get('.beds-section-title').should("be.visible")
    cy.get('.beds-section-title').contains("Habitaciones del Piso 1")


    cy.get('.beds-count-badge').should("be.visible")
    cy.get('.beds-count-badge').contains("12 habitaciones")

})
it('Renderizar y verificar habitacion del 101 al 112 del piso 1', () => {

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
    cy.get('.hamburger').click()


    cy.get('[href="/habitaciones"]').click()
    cy.get('.page-wrapper').should("be.visible")
    cy.get('.page-title').should("be.visible")
    cy.get('.page-title').contains("Habitaciones por Piso")

    cy.get('.page-subtitle').should("be.visible")
    cy.get('.page-subtitle').contains("Seleccioná una habitación para gestionar sus camas · Piso 1")

    cy.get('.floor-tabs-wrap > .active').should("be.visible")
    cy.get('.active > .floor-tab-name').should("be.visible")
    cy.get('.active > .floor-tab-name').contains("Piso 1")
    cy.get('.active > .floor-tab-type').should("be.visible")
    cy.get('.active > .floor-tab-type').contains("Privada")

    cy.get('.floor-tabs-wrap > :nth-child(2)').should("be.visible")
    cy.get(':nth-child(2) > .floor-tab-name').should("be.visible")
    cy.get(':nth-child(2) > .floor-tab-name').contains("Piso 2")
    cy.get(':nth-child(2) > .floor-tab-type').should("be.visible")
   

    cy.get('.floor-tabs-wrap > :nth-child(3)').should("be.visible")
    cy.get(':nth-child(3) > .floor-tab-name').should("be.visible")
    
    cy.get('.floor-info-banner').should("be.visible")
    cy.get('.floor-info-icon').should("be.visible")
    cy.get('.floor-info-title').should("be.visible")
    cy.get('.floor-info-title').contains("Piso 1 · Privada")
    cy.get('.floor-info-desc').should("be.visible")
    cy.get('.floor-info-desc').contains("12 habitaciones · 1 cama por habitación · 12 camas en total")

    cy.get('.floor-info-chips').should("be.visible")
    cy.get('.floor-info-chips > :nth-child(1)').should("be.visible")
    cy.get('.floor-info-chips > :nth-child(2)').should("be.visible")
    cy.get('.floor-info-chips > :nth-child(1) > span').contains("12 hab.")
    cy.get('.floor-info-chips > :nth-child(2) > span').contains("12 camas")


    cy.get('.stats-grid > :nth-child(1)').should("be.visible")
    cy.get(':nth-child(1) > .stat-icon').should("be.visible")
    cy.get(':nth-child(1) > .stat-info > .stat-label').should("be.visible")
    cy.get(':nth-child(1) > .stat-info > .stat-value').should("be.visible")
    cy.get(':nth-child(1) > .stat-info > .stat-value').contains("11")


    cy.get('.stats-grid > :nth-child(2)').should("be.visible")
    cy.get(':nth-child(2) > .stat-icon').should("be.visible")
    cy.get(':nth-child(2) > .stat-info > .stat-label').should("be.visible")
    cy.get(':nth-child(2) > .stat-info > .stat-value').should("be.visible")
    cy.get(':nth-child(2) > .stat-info > .stat-value').contains("0")
    

    cy.get('.stats-grid > :nth-child(3)').should("be.visible")
    cy.get(':nth-child(3) > .stat-icon').should("be.visible")
    cy.get(':nth-child(3) > .stat-info > .stat-label').should("be.visible")
    cy.get(':nth-child(3) > .stat-info > .stat-value').should("be.visible")
    cy.get(':nth-child(3) > .stat-info > .stat-value').contains("0")


    cy.get('.beds-header').should("be.visible")
    cy.get('.beds-section-title').should("be.visible")
    cy.get('.beds-section-title').contains("Habitaciones del Piso 1")


    cy.get('.beds-count-badge').should("be.visible")
    cy.get('.beds-count-badge').contains("12 habitaciones")


    cy.get('.rooms-grid').should("be.visible")

    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 102")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 102")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.btn-back').click()


    //
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 102")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 102")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.rba-occup').should("be.visible")
    cy.get('.rba-clean').should("be.visible")
    cy.get('.btn-back').click()


    //

    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 103")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 103, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 103")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.rba-occup').should("be.visible")
    cy.get('.rba-clean').should("be.visible")
    cy.get('.btn-back').click()

    //


    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 104")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 104, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 104")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.rba-occup').should("be.visible")
    cy.get('.rba-clean').should("be.visible")
    cy.get('.btn-back').click()

    //


    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 105")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 105, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 105")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.rba-occup').should("be.visible")
    cy.get('.rba-clean').should("be.visible")
    cy.get('.btn-back').click()


    //

    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 106")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 106, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 106")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.rba-occup').should("be.visible")
    cy.get('.rba-clean').should("be.visible")
    cy.get('.btn-back').click()

    //


    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 107")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 107, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 107")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.rba-occup').should("be.visible")
    cy.get('.rba-clean').should("be.visible")
    cy.get('.btn-back').click()


    //

    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 108")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 108, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 108")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.rba-occup').should("be.visible")
    cy.get('.rba-clean').should("be.visible")
    cy.get('.btn-back').click()


    //

    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 109")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 109, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 109")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.rba-occup').should("be.visible")
    cy.get('.rba-clean').should("be.visible")
    cy.get('.btn-back').click()


    //

    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 110")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 110, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 110")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.rba-occup').should("be.visible")
    cy.get('.rba-clean').should("be.visible")
    cy.get('.btn-back').click()

    //

    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 111")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 111, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 111")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.rba-occup').should("be.visible")
    cy.get('.rba-clean').should("be.visible")
    cy.get('.btn-back').click()


    //

    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"]').should("be.visible")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-header').should("be.visible")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-header > .room-card-number').should("be.visible")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-header > .room-card-number').contains("Hab. 112")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-floor').should("be.visible")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-floor').contains("Piso 1")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-header > .room-type-badge').should("be.visible")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-status').should("be.visible")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-beds > .room-bed-item').should("be.visible")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').should("be.visible")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-beds > .room-bed-item > .room-bed-row > .room-bed-label').contains("Cama 1")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-footer').should("be.visible")
    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-footer > span').should("be.visible")

    cy.get('[aria-label="Ver habitación 112, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.room-detail-body').should("be.visible")
    cy.get('.room-detail-top').should("be.visible")
    cy.get('.room-detail-title').should("be.visible")
    cy.get('.room-detail-title').contains("Habitación 112")
    cy.get('.room-detail-subtitle').should("be.visible")
    cy.get('.room-detail-subtitle').contains("Piso 1 · Privada")
    cy.get('.room-detail-meta > :nth-child(1)').contains("1 cama")
    cy.get('.meta-available').contains("1 disponible")
    cy.get('.room-type-badge').contains("Privada")
    cy.get('.room-detail-badges > .room-card-status').should("be.visible")

    cy.get('.beds-section-title').contains("Camas de la habitación")

    cy.get('.rd-bed-card').should("be.visible")
    cy.get('.rd-bed-title > span').contains("Cama 1")
    cy.get('.rd-bed-header > .room-card-status').should("be.visible")
    cy.get('.rba-occup').should("be.visible")
    cy.get('.rba-clean').should("be.visible")
    cy.get('.btn-back').click()

})
    it('Verificar habitacion 102 de disponible a Ocupada', () => {
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
    cy.get('.hamburger').click()


    cy.get('[href="/habitaciones"]').click()
    cy.get('.page-wrapper').should("be.visible")
    cy.get('.page-title').should("be.visible")
    cy.get('.page-title').contains("Habitaciones por Piso")

    cy.get('.page-subtitle').should("be.visible")
    cy.get('.page-subtitle').contains("Seleccioná una habitación para gestionar sus camas · Piso 1")

    cy.get('.floor-tabs-wrap > .active').should("be.visible")
    cy.get('.active > .floor-tab-name').should("be.visible")
    cy.get('.active > .floor-tab-name').contains("Piso 1")
    cy.get('.active > .floor-tab-type').should("be.visible")
    cy.get('.active > .floor-tab-type').contains("Privada")

    cy.get('.floor-tabs-wrap > :nth-child(2)').should("be.visible")
    cy.get(':nth-child(2) > .floor-tab-name').should("be.visible")
    cy.get(':nth-child(2) > .floor-tab-name').contains("Piso 2")
    cy.get(':nth-child(2) > .floor-tab-type').should("be.visible")
   

    cy.get('.floor-tabs-wrap > :nth-child(3)').should("be.visible")
    cy.get(':nth-child(3) > .floor-tab-name').should("be.visible")
    
    cy.get('.floor-info-banner').should("be.visible")
    cy.get('.floor-info-icon').should("be.visible")
    cy.get('.floor-info-title').should("be.visible")
    cy.get('.floor-info-title').contains("Piso 1 · Privada")
    cy.get('.floor-info-desc').should("be.visible")
    cy.get('.floor-info-desc').contains("12 habitaciones · 1 cama por habitación · 12 camas en total")

    cy.get('.floor-info-chips').should("be.visible")
    cy.get('.floor-info-chips > :nth-child(1)').should("be.visible")
    cy.get('.floor-info-chips > :nth-child(2)').should("be.visible")
    cy.get('.floor-info-chips > :nth-child(1) > span').contains("12 hab.")
    cy.get('.floor-info-chips > :nth-child(2) > span').contains("12 camas")


    cy.get('.stats-grid > :nth-child(1)').should("be.visible")
    cy.get(':nth-child(1) > .stat-icon').should("be.visible")
    cy.get(':nth-child(1) > .stat-info > .stat-label').should("be.visible")
    cy.get(':nth-child(1) > .stat-info > .stat-value').should("be.visible")
    cy.get(':nth-child(1) > .stat-info > .stat-value').contains("11")


    cy.get('.stats-grid > :nth-child(2)').should("be.visible")
    cy.get(':nth-child(2) > .stat-icon').should("be.visible")
    cy.get(':nth-child(2) > .stat-info > .stat-label').should("be.visible")
    cy.get(':nth-child(2) > .stat-info > .stat-value').should("be.visible")
    cy.get(':nth-child(2) > .stat-info > .stat-value').contains("0")
    

    cy.get('.stats-grid > :nth-child(3)').should("be.visible")
    cy.get(':nth-child(3) > .stat-icon').should("be.visible")
    cy.get(':nth-child(3) > .stat-info > .stat-label').should("be.visible")
    cy.get(':nth-child(3) > .stat-info > .stat-value').should("be.visible")
    cy.get(':nth-child(3) > .stat-info > .stat-value').contains("0")


    cy.get('.beds-header').should("be.visible")
    cy.get('.beds-section-title').should("be.visible")
    cy.get('.beds-section-title').contains("Habitaciones del Piso 1")


    cy.get('.beds-count-badge').should("be.visible")
    cy.get('.beds-count-badge').contains("12 habitaciones")

    cy.get('[aria-label="Ver habitación 102, Piso 1, Privada"] > .room-card-footer > span').click()
    cy.get('.rba-occup').click()

    cy.get('[name="nombre"]').type("Cristian")
    cy.get('[name="apellido"]').type("Barrios")
    cy.get('[name="edad"]').type("24")
    cy.get('[name="diasInternacion"]').type("7")
    cy.get('[name="diagnostico"]').type("Dolor de cabeza")
    cy.get('.btn-modal-confirm').click()


    cy.get('.rd-patient-card').should("be.visible")
    cy.get('.rd-patient-name').should("be.visible")
    cy.get('.rd-patient-name').contains("Cristian Barrios · 24 años")
    cy.get('.rd-patient-header').should("be.visible")
    cy.get('.btn-patient-edit').should("be.visible")
    cy.get('.btn-patient-discharge').should("be.visible")


    cy.get(':nth-child(1) > .rd-detail-label').should("be.visible")
    cy.get(':nth-child(1) > .rd-detail-label').contains("Diagnóstico")

    cy.get(':nth-child(2) > .rd-detail-label').should("be.visible")
    cy.get(':nth-child(2) > .rd-detail-label').contains("Días estimados")

    cy.get(':nth-child(3) > .rd-detail-label').should("be.visible")
    cy.get(':nth-child(3) > .rd-detail-label').contains("Fecha de ingreso")

    cy.get(':nth-child(1) > .rd-detail-value').should("be.visible")
    cy.get(':nth-child(1) > .rd-detail-value').contains("Dolor de cabeza")

    cy.get(':nth-child(2) > .rd-detail-value').should("be.visible")
    cy.get(':nth-child(2) > .rd-detail-value').contains("7 días")

    cy.get(':nth-child(3) > .rd-detail-value').should("be.visible")
    cy.get(':nth-child(3) > .rd-detail-value').contains("2026-07-20")

    cy.get('.room-bed-action-btn').should("be.visible")
    cy.get('.room-bed-action-btn').click()
    
    cy.get('.rba-avail').click()
})
})