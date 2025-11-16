# Работа с submodule (подмодулями) в GIT добавление/удаление

# Как добавить submodule в репозитории git
Предположим, нам необходимо добавить репозиторий frontend-live-coding в свою разработку. Тогда нам нужно в cmd перейти в папку с нашим проектом и ввести команду:

```bash
git submodule add https://github.com/NaNFull/frontend-live-coding
```

# Как удалить submodule из репозитория git
Так же возможна и обратная ситуация: так получилось, что мы добавили подмодуль, но поработав поняли, он нам не нужен и хотим его удалить. Простое удаление папки с субмодулем при этом не поможет.
Для удаления подмодуля git необходимо выполнит команды:

```bash
git submodule deinit frontend-live-coding
git rm frontend-live-coding
git commit -m "Удаление submodule frontend-live-coding"
rm -rf .git/modules/frontend-live-coding
```

или можно удалить с помощью команды:
```bash
npm run submodule:remove --module=frontend-live-coding
```

Если команда rm не работает, то можно просто удалить папку .git/modules/frontend-live-coding из проводника.
Так же обратите внимание, что команды выше удаляют субмодуль frontend-live-coding, который находится в корне нашего репозитория. Если это не так, необходимо указывать полный путь к submodule.
