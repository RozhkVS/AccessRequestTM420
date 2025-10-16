# AccessRequestTM420

Start connect to AccessRequestTM420: 
💡 Итоговый простой workflow для коллаборации:
| Шаг | Действие                            | Команда / Адрес / Куда вводить                                                                                                                                                                                                                        |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1️⃣ | Принять приглашение в репозиторий   | Войти на GitHub → **Settings → Invitations** → нажать **Accept**                                                                                                                                                                                      |
| 2️⃣ | Создать Personal Access Token (PAT) | GitHub → **Settings → Developer settings → Personal Access Tokens → Generate new token → Tokens (classic)** → выбрать **repo** → нажать **Generate token** → **скопировать токен** (будет использоваться вместо пароля при подключении к репозиторию) |
| 3️⃣ | Клонировать репозиторий             | Открыть терминал/Git Bash → ввести:<br>`git clone https://github.com/RozhkVS/AccessRequestTM42.git`<br>**Логин:** GitHub логин человека<br>**Пароль:** вставить свой PAT                                                                              |
| 4️⃣ | Создать новую ветку                 | Перейти в папку репозитория:<br>`cd AccessRequestTM42`<br>Создать ветку:<br>`git checkout -b имя_ветки`<br>Пример: `git checkout -b feature/new-function`                                                                                             |
| 5️⃣ | Сделать изменения и закоммитить     | Отредактировать файлы, затем:<br>`git add .`<br>`git commit -m "Описание изменений"`                                                                                                                                                                  |
| 6️⃣ | Отправить ветку на GitHub           | `git push -u origin имя_ветки`<br>Пример: `git push -u origin feature/new-function`<br>**Пароль:** снова вставить свой PAT, если Git спросит                                                                                                          |
| 7️⃣ | Создать Pull Request (по желанию)   | На GitHub → открыть репозиторий → вкладка **Pull requests → New pull request** → выбрать свою ветку → выбрать `main` как целевую ветку → нажать **Create Pull Request**                                                                               |


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
