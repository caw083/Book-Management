mkdir Book_Management
cd Book_Management

echo "node_modules/
.env
logs/
*.log
npm-debug.log*
coverage/
.DS_Store
Thumbs.db" > .gitignore
git init


npm init -y
npm install express mongoose jsonwebtoken bcryptjs dotenv
npm install --save-dev jest supertest nodemon

git add .
git commit -m "Initial setup: install dependencies and add .gitignore"


