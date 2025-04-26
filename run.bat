@echo off
echo 🚀 Starting server...

NET FILE >nul 2>&1 || (
    echo Requesting administrative privileges...
    runas /user:Administrator "%~f0"
    pause
    exit /b
)

cmd /c "cd src\server\translation_module && cargo build && maturin build && pip install target\wheels\translation_module-0.1.0*.whl"
cmd /c "cd src\server\core && python admin.py"
cmd /c "cd src\client && npm install react@18 react-dom@18 && npm run build && npm start"

echo ✅ Started
pause