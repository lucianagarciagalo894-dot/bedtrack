describe('SuperAdmin - BedTrack', () => {
  const uniqueSuffix = Date.now();

  const hospitalName = `Hospital Cypress ${uniqueSuffix}`;
  const sucursalName = `Establecimiento Cypress ${uniqueSuffix}`;
  const staffName = `Usuario Cypress ${uniqueSuffix}`;
  const staffEmail = `cypress.${uniqueSuffix}@hospital.test`;

  const loginAsSuperAdmin = () => {
    cy.visit('https://bedtrack-frontend-final-435l.vercel.app/dev-login');
    cy.get('#dev-email').clear().type('dev@bedtrack.dev');
    cy.get('#dev-key').clear().type('superadmin123');
    cy.contains('button', 'Ingresar como Desarrollador').click();
    cy.contains('BedTrack SuperAdmin Panel', { timeout: 20000 }).should('be.visible');
  };

  it('debe acceder al panel de superadmin y cargar la infraestructura base', () => {
    loginAsSuperAdmin();

    cy.contains('BedTrack SuperAdmin Panel').should('be.visible');
    cy.contains('Nosocomio y Establecimiento Activo').should('be.visible');
    cy.contains('Gestión de Perfiles de Enfermería y Personal').should('be.visible');
    cy.contains('Historial de Auditoría').should('be.visible');
    cy.contains('Gestión de Pisos, Habitaciones y Camas').should('be.visible');

    cy.get('select').first().should('be.visible');
    cy.get('select').eq(1).should('be.visible');
  });

  it('debe crear un nosocomio y un establecimiento desde el panel', () => {
    loginAsSuperAdmin();

    cy.contains('label', 'Nosocomio:').parent().find('button').contains('Nuevo').click();
    cy.contains('h3', 'Registrar Nuevo Nosocomio').should('be.visible');
    cy.get('.modal-content input[type="text"]').first().clear().type(hospitalName);
    cy.get('.modal-content input[type="text"]').eq(1).clear().type('Calle Falsa 123');
    cy.contains('button', 'Guardar Nosocomio').click();

    cy.contains('BedTrack SuperAdmin Panel').should('be.visible');
    cy.contains(hospitalName).should('be.visible');

    cy.contains('label', 'Establecimiento:').parent().find('button').contains('Nuevo').click();
    cy.contains('h3', 'Registrar Nuevo Establecimiento').should('be.visible');
    cy.get('.modal-content input[type="text"]').first().clear().type(sucursalName);
    cy.get('.modal-content input[type="text"]').eq(1).clear().type('Av. Córdoba 456');
    cy.contains('button', 'Guardar Establecimiento').click();

    cy.contains('BedTrack SuperAdmin Panel').should('be.visible');
    cy.contains(sucursalName).should('be.visible');
  });

  it('debe registrar un usuario de enfermería y verificarlo en la tabla', () => {
    loginAsSuperAdmin();

    cy.contains('button', 'Crear Usuario de Enfermería').scrollIntoView().click({ force: true });

    cy.get('.modal-backdrop').should('exist').and(($modal) => {
      expect($modal.text()).to.include('Registrar Usuario de Enfermería');
      expect($modal.text()).to.include('Nombre Completo');
    });

    cy.get('.modal-backdrop input[type="text"]').first().clear().type(staffName);
    cy.get('.modal-backdrop input[type="email"]').clear().type(staffEmail);
    cy.get('.modal-backdrop input[type="password"]').clear().type('123456');

    cy.get('.modal-backdrop select').eq(0).select(0);
    cy.get('.modal-backdrop select').eq(1).select(0);
    cy.get('.modal-backdrop select').eq(2).select('enfermeria');
    cy.get('.modal-backdrop').contains('button', 'Guardar Perfil').click({ force: true });

    cy.contains('BedTrack SuperAdmin Panel').should('be.visible');
    cy.contains(staffName).should('be.visible');
    cy.contains(staffEmail).should('be.visible');
  });
});
