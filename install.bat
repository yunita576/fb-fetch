@echo off
echo 🚀 Installing Facebook Content Downloader...
echo.

echo 📦 Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo 📦 Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo 📦 Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)

echo.
echo 📝 Creating .env file...
cd ..\server
if not exist .env (
    copy env.example .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

echo.
echo ✅ Installation completed successfully!
echo.
echo 🎯 To start the application, run:
echo    npm run dev
echo.
echo 🌐 Then open http://localhost:3000 in your browser
echo.
pause
