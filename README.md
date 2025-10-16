# AccessRequestTM420

Start connect to AccessRequestTM420: 

🚀 Quick Guide: Working with Git and GitHub
🔹 Check if the repository is connected
git remote -v

🔹 If not connected — add the remote repository
git remote add origin https://github.com/USERNAME/REPOSITORY.git

🔹 Clone the repository (if you don’t have it yet)
git clone https://github.com/USERNAME/REPOSITORY.git
cd REPOSITORY

🌿 Working in Your Own Branch
🔸 Create a new branch
git checkout -b my-branch


Replace my-branch with your branch name (e.g., feature-login or bugfix-header).

🔸 Check your current branch
git branch

🔸 Switch to another branch (if needed)
git checkout main

💾 Saving and Pushing Changes
🔸 Check the status
git status

🔸 Add all modified files
git add .

🔸 Create a commit with a clear message
git commit -m "Describe your changes"

🔸 Push your branch to GitHub
git push origin my-branch

🔄 Pull the Latest Changes from the Main Branch
git checkout main
git pull origin main


Push your branch → git push origin my-branch

Keep your main branch updated → git pull origin main
