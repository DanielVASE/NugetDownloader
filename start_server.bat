sc query "nugetdownloader.exe"| find "RUNNING" >nul 2>&1 && net stop "nugetdownloader.exe"

call npm i
call npm run init --prefix ./NugetDownloaderServer
call npm run init --prefix ./NugetDownloaderClient
call npm run build --prefix ./NugetDownloaderClient

sc query "nugetdownloader.exe"| find "STOPPED" >nul 2>&1 && net start "nugetdownloader.exe"

sc query "nugetdownloader.exe" >nul 2>&1 || node ./serviceInstaller