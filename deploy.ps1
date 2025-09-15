# Smart Tourist Safety System - Quick Deploy Script (PowerShell)

Write-Host "Smart Tourist Safety System - Deployment Script" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "Git is installed" -ForegroundColor Green
} catch {
    Write-Host "Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Preparing for deployment..." -ForegroundColor Yellow

# Check if this is a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Blue
    git init
    git config user.name "KULJEET"
    git config user.email "kuljeet@example.com"
}

# Install dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Blue
Set-Location "frontend/web"
npm install
Set-Location "../.."

Write-Host "Installing backend dependencies..." -ForegroundColor Blue
Set-Location "backend/api-gateway"
npm install
Set-Location "../.."

# Commit and push changes
Write-Host "Committing changes to Git..." -ForegroundColor Green
git add .
git status

Write-Host ""
$commitMessage = Read-Host "Enter commit message (press Enter for default)"
if ([string]::IsNullOrEmpty($commitMessage)) {
    $commitMessage = "Deploy Smart Tourist Safety System"
}

git commit -m "$commitMessage"

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    Write-Host "Setting up GitHub repository..." -ForegroundColor Yellow
    Write-Host "You need to create a repository on GitHub first, then run:" -ForegroundColor Red
    Write-Host "git remote add origin https://github.com/your-username/smart-tourist-safety-system.git" -ForegroundColor White
    Write-Host "git branch -M main" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
} else {
    Write-Host "Pushing to GitHub..." -ForegroundColor Magenta
    git push origin main
}

Write-Host ""
Write-Host "Code preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Deploy Frontend to Vercel:" -ForegroundColor Yellow
Write-Host "   - Go to https://vercel.com" -ForegroundColor White
Write-Host "   - Import your GitHub repository" -ForegroundColor White
Write-Host "   - Set root directory to: frontend/web" -ForegroundColor White
Write-Host ""
Write-Host "2. Deploy Backend to Render:" -ForegroundColor Yellow
Write-Host "   - Go to https://render.com" -ForegroundColor White
Write-Host "   - Create new Web Service from GitHub" -ForegroundColor White
Write-Host "   - Set root directory to: backend/api-gateway" -ForegroundColor White
Write-Host "   - Set start command to: npm start" -ForegroundColor White
Write-Host ""
Write-Host "3. Create databases on Render:" -ForegroundColor Yellow
Write-Host "   - PostgreSQL database" -ForegroundColor White
Write-Host "   - Redis cache" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Deployment preparation complete!" -ForegroundColor Green
Write-Host "Your Smart Tourist Safety System is ready to go live!" -ForegroundColor Green

# Wait for user input
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
