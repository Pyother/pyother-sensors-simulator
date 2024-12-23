@echo off
echo Installing frontend dependencies...
cd frontend
call npm install
call npm run build

cd ../backend
echo Installing backend dependencies...
call npm install
echo Uruchamianie backendu...
call npm start
