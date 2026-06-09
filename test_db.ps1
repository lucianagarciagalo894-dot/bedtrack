$connString = "Server=IGNACIO\SQLEXPRESS;Database=BedTrack_Segura;User Id=usr_bedtrack;Password=Bedtrack;TrustServerCertificate=True"
$conn = New-Object System.Data.SqlClient.SqlConnection($connString)
try {
    $conn.Open()
    Write-Host "=============================================="
    Write-Host "✅ EXITO: Conexion a la base de datos establecida correctamente."
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
    $tables = $cmd.ExecuteScalar()
    Write-Host "📊 Cantidad de tablas encontradas: $tables"
    Write-Host "=============================================="
    $conn.Close()
} catch {
    Write-Host "=============================================="
    Write-Host "❌ ERROR AL CONECTAR:"
    Write-Host $_.Exception.Message
    Write-Host "=============================================="
}
