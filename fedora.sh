sudo dnf update

# Update system packages
sudo dnf update -y

# Install Node.js, npm, Git and GitHub CLI
# Note: Correct package name is 'nodejs' (one word), 'npm' comes with it
sudo dnf install -y nodejs git gh

# Authenticate with GitHub
gh auth login

# Clone repository (fixed URL - added missing 'h' in 'https')
# Better to clone without space in destination folder name
git clone -b Linux-Fix https://github.com/caw083/Book-Management.git
cd Linux-Fix

# Install project dependencies
npm install

# Start the development server (assuming you're using a modern framework)
# Either use (depending on your project):
npm run dev
# or if you're using the 'start' script specifically:
npm start

# Start Docker containers in detached mode
docker compose up 

