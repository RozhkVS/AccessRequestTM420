# AccessRequestTM420

Start connect to AccessRequestTM420: 
💡 Итоговый простой workflow для коллаборации:

Инструкция для подключения и работы с приватным репозиторием GitHub
1️⃣ Принятие приглашения

Получи приглашение на GitHub в качестве collaborator (отправлено владельцем репозитория).

Перейди на GitHub и прими приглашение.

2️⃣ Создание Personal Access Token (PAT)

GitHub требует токен вместо пароля для приватных репозиториев.

Зайди в GitHub → Settings → Developer settings → Personal Access Tokens → Tokens (classic) → Generate new token

Выбери scope: repo

Скопируй токен — он будет использоваться вместо пароля.

3️⃣ Клонирование репозитория
git clone https://github.com/RozhkVS/AccessRequestTM420.git
cd AccessRequestTM42


При запросе логина введи свой GitHub логин

При запросе пароля введи Personal Access Token

4️⃣ Создание новой ветки
git checkout -b имя_ветки


Пример:

git checkout -b feature/new-function


Все изменения будут сохраняться в этой ветке, а main останется нетронутым.

5️⃣ Внесение изменений и коммиты

После редактирования файлов:

git add .
git commit -m "Описание сделанных изменений"


git add . — добавляет все изменённые файлы

git commit -m "..." — сохраняет изменения с описанием

6️⃣ Пуш ветки на GitHub
git push -u origin имя_ветки


Пример:

git push -u origin feature/new-function


Флаг -u связывает локальную ветку с удалённой, чтобы в будущем достаточно было просто git push.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
