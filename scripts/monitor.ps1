$host_url = "https://pizza-service.pizzasanghwa.click"

Write-Host "Logging in as admin..."
$loginBody = '{"email":"a@jwt.com","password":"admin"}'
$loginResp = Invoke-RestMethod -Uri "$host_url/api/auth" -Method PUT -Body $loginBody -ContentType "application/json"
$token = $loginResp.token
Write-Host "Logged in. Token acquired."
Write-Host "Monitoring pizza orders every 20 seconds... (Ctrl+C to stop)"
Write-Host "---------------------------------------------------------------"

while ($true) {
    $orderBody = '{"franchiseId":1,"storeId":1,"items":[{"menuId":1,"description":"Veggie","price":0.0038}]}'
    try {
        $headers = @{ Authorization = "Bearer $token" }
        $resp = Invoke-RestMethod -Uri "$host_url/api/order" -Method POST -Body $orderBody -ContentType "application/json" -Headers $headers
        Write-Host "$(Get-Date -Format 'HH:mm:ss') OK - order #$($resp.order.id)" -ForegroundColor Green
    }
    catch {
        $errMsg = $_.ErrorDetails.Message
        Write-Host "$(Get-Date -Format 'HH:mm:ss') FAIL - $errMsg" -ForegroundColor Red
        # Try to extract reportUrl/followLinkToEndChaos
        try {
            $errObj = $errMsg | ConvertFrom-Json
            if ($errObj.followLinkToEndChaos) {
                Write-Host "*** CHAOS RESOLUTION URL: $($errObj.followLinkToEndChaos) ***" -ForegroundColor Yellow -BackgroundColor DarkRed
            }
        } catch {}
    }
    Start-Sleep 20
}
