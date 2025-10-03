# PowerShell Validation Script
Write-Host "🧪 Starting Comprehensive Validation Tests..." -ForegroundColor Cyan
Write-Host ""

$API_BASE = "http://localhost:5000/api"
$headers = @{
    "x-user-id" = "guest"
    "Content-Type" = "application/json"
}

$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Uri,
        [string]$Method = "GET",
        [string]$Body = $null
    )
    
    Write-Host "⏳ Running: $Name" -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-WebRequest @params
        $result = $response.Content | ConvertFrom-Json
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ PASS: $Name" -ForegroundColor Green
            if ($result.data) {
                $dataPreview = ($result.data | ConvertTo-Json -Compress).Substring(0, [Math]::Min(100, ($result.data | ConvertTo-Json -Compress).Length))
                Write-Host "   Data: $dataPreview..." -ForegroundColor Gray
            }
            return $true
        } else {
            Write-Host "❌ FAIL: $Name - Status: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ FAIL: $Name - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test 1: Health Check
if (Test-Endpoint -Name "Health Check" -Uri "$API_BASE/health") { $passed++ } else { $failed++ }
Write-Host ""

# Test 2: Get User Progress
if (Test-Endpoint -Name "Get User Progress" -Uri "$API_BASE/progress/user") { $passed++ } else { $failed++ }
Write-Host ""

# Test 3: Get User Stats
if (Test-Endpoint -Name "Get User Stats" -Uri "$API_BASE/progress/stats") { $passed++ } else { $failed++ }
Write-Host ""

# Test 4: Get Achievements
if (Test-Endpoint -Name "Get Achievements" -Uri "$API_BASE/achievements/user") { $passed++ } else { $failed++ }
Write-Host ""

# Test 5: Create New Progress
$timestamp = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
$progressBody = @{
    lessonId = "validation-test-$timestamp"
    status = "completed"
    score = 95
    timeSpent = 300
} | ConvertTo-Json

if (Test-Endpoint -Name "Create New Progress" -Uri "$API_BASE/progress/update" -Method "POST" -Body $progressBody) { $passed++ } else { $failed++ }
Write-Host ""

# Test 6: Verify New Progress Was Saved
if (Test-Endpoint -Name "Verify Progress Saved" -Uri "$API_BASE/progress/user") { $passed++ } else { $failed++ }
Write-Host ""

# Results
Write-Host "📊 Test Results:" -ForegroundColor Cyan
Write-Host "✅ Passed: $passed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor Red
$successRate = [Math]::Round(($passed / ($passed + $failed)) * 100)
Write-Host "📈 Success Rate: $successRate%" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host ""
    Write-Host "🎉 All tests passed! The progress system is fully functional." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Some tests failed. Check the backend server and database connection." -ForegroundColor Yellow
}