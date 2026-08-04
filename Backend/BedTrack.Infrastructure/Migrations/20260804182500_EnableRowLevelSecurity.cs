using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BedTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EnableRowLevelSecurity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE IF EXISTS ""Nosocomios"" ENABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""Sucursales"" ENABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""Pisos"" ENABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""Habitaciones"" ENABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""Camas"" ENABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""Pacientes"" ENABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""UsuariosStaff"" ENABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""HistorialCamas"" ENABLE ROW LEVEL SECURITY;

                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Nosocomios' AND policyname = 'ServiceRoleFullAccess_Nosocomios') THEN
                        CREATE POLICY ""ServiceRoleFullAccess_Nosocomios"" ON ""Nosocomios"" FOR ALL TO service_role USING (true) WITH CHECK (true);
                    END IF;

                    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Sucursales' AND policyname = 'ServiceRoleFullAccess_Sucursales') THEN
                        CREATE POLICY ""ServiceRoleFullAccess_Sucursales"" ON ""Sucursales"" FOR ALL TO service_role USING (true) WITH CHECK (true);
                    END IF;

                    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Pisos' AND policyname = 'ServiceRoleFullAccess_Pisos') THEN
                        CREATE POLICY ""ServiceRoleFullAccess_Pisos"" ON ""Pisos"" FOR ALL TO service_role USING (true) WITH CHECK (true);
                    END IF;

                    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Habitaciones' AND policyname = 'ServiceRoleFullAccess_Habitaciones') THEN
                        CREATE POLICY ""ServiceRoleFullAccess_Habitaciones"" ON ""Habitaciones"" FOR ALL TO service_role USING (true) WITH CHECK (true);
                    END IF;

                    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Camas' AND policyname = 'ServiceRoleFullAccess_Camas') THEN
                        CREATE POLICY ""ServiceRoleFullAccess_Camas"" ON ""Camas"" FOR ALL TO service_role USING (true) WITH CHECK (true);
                    END IF;

                    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'Pacientes' AND policyname = 'ServiceRoleFullAccess_Pacientes') THEN
                        CREATE POLICY ""ServiceRoleFullAccess_Pacientes"" ON ""Pacientes"" FOR ALL TO service_role USING (true) WITH CHECK (true);
                    END IF;

                    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'UsuariosStaff' AND policyname = 'ServiceRoleFullAccess_UsuariosStaff') THEN
                        CREATE POLICY ""ServiceRoleFullAccess_UsuariosStaff"" ON ""UsuariosStaff"" FOR ALL TO service_role USING (true) WITH CHECK (true);
                    END IF;

                    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'HistorialCamas' AND policyname = 'ServiceRoleFullAccess_HistorialCamas') THEN
                        CREATE POLICY ""ServiceRoleFullAccess_HistorialCamas"" ON ""HistorialCamas"" FOR ALL TO service_role USING (true) WITH CHECK (true);
                    END IF;
                END $$;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE IF EXISTS ""Nosocomios"" DISABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""Sucursales"" DISABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""Pisos"" DISABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""Habitaciones"" DISABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""Camas"" DISABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""Pacientes"" DISABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""UsuariosStaff"" DISABLE ROW LEVEL SECURITY;
                ALTER TABLE IF EXISTS ""HistorialCamas"" DISABLE ROW LEVEL SECURITY;
            ");
        }
    }
}
