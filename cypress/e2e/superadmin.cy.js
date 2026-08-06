describe('SuperAdmin - BedTrack (Endpoint & UI Logic Validation)', () => {
  const mockNosocomio = {
    id: 1,
    nombre: "Hospital Central BedTrack",
    codigo: "HC-01",
    direccion: "Av. Colón 1234",
    activo: true,
    sucursales: [
      { id: 1, nombre: "Establecimiento Central", direccion: "Av. Colón 1234", nosocomioId: 1, activo: true }
    ]
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/superadmin/nosocomios*', {
      statusCode: 200,
      body: [mockNosocomio]
    }).as('getNosocomios');

    cy.intercept('GET', '**/api/superadmin/users*', { statusCode: 200, body: [] }).as('getUsers');
    cy.intercept('GET', '**/api/superadmin/audit-logs*', { statusCode: 200, body: [] }).as('getAuditLogs');
    cy.intercept('GET', '**/api/rooms*', { statusCode: 200, body: [] }).as('getRooms');
    cy.intercept('GET', '**/api/floors*', { statusCode: 200, body: [] }).as('getFloors');

    cy.intercept('POST', '**/api/superadmin/nosocomios*', {
      statusCode: 200,
      body: { ...mockNosocomio, id: 99, nombre: "Hospital Validacion Endpoint" }
    }).as('createNosocomio');

    cy.intercept('POST', '**/api/superadmin/sucursales*', {
      statusCode: 200,
      body: { id: 99, nombre: "Establecimiento Validacion", nosocomioId: 1 }
    }).as('createSucursal');

    cy.intercept('POST', '**/api/superadmin/users*', {
      statusCode: 200,
      body: { id: 99, nombre: "Usuario Test", email: "test@hospital.com", rol: "enfermeria", activo: true }
    }).as('createUser');
  });

  it('debe acceder al panel de superadmin y cargar la interfaz de usuario sin modificar la DB real', () => {
    cy.visit('/dev-login');
    cy.get('#dev-email').clear().type('dev@gmail.com');
    cy.get('#dev-key').clear().type('proyectofinal');
    cy.contains('button', 'Ingresar como Desarrollador').click();

    cy.contains('BedTrack SuperAdmin Panel', { timeout: 20000 }).should('be.visible');
    cy.contains('Nosocomio y Establecimiento Activo').should('be.visible');
    cy.contains('Gestión de Perfiles de Enfermería y Personal').should('be.visible');
    cy.contains('Historial de Auditoría').should('be.visible');
  });
});
