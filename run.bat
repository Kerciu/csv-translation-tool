@echo off
echo 🚀 Starting app...

echo Bulding...
cmd /c "cd src\server\translation_module && cargo build > NUL 2>&1 && maturin build > NUL 2>&1 && pip install target\wheels\translation_module-0.1.0*.whl > NUL 2>&1"
echo Starting servers...
start "Backend server" cmd /k "cd src\server && python manage.py runserver"
start "Frontend server" cmd /k "cd src\client && npm install react@18 react-dom@18 && npm run build && npm start"

echo ✅ Started
pause