# Git Author Fixer for Vercel Blocked Deployment

Write-Host "=== Git Author Fixer for Vercel Blocked Deployment ===" -ForegroundColor Cyan
$email = Read-Host "Please enter your actual GitHub email address"
if ([string]::IsNullOrWhiteSpace($email)) {
    Write-Error "Email cannot be empty."
    exit
}

Write-Host "Configuring local git email to: $email..."
git config user.email $email

Write-Host "Amending the last commit to update the author info..."
git commit --amend --reset-author --no-edit

Write-Host "Force-pushing to GitHub..."
git push origin main --force

Write-Host "`nSuccess! Check your Vercel dashboard to verify if the deployment has started." -ForegroundColor Green
