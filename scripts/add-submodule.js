#!/usr/bin/env node

import inquirer from 'inquirer';
import { execSync } from 'child_process';

inquirer
    .prompt([
        {
            type: 'input',
            name: 'url',
            message: 'Введите URL репозитория сабмодуля:',
            validate: (url) => {
                try {
                    const parsedUrl = new URL(url);

                    // Проверяем, что домен github.com
                    if (parsedUrl.hostname !== 'github.com') return 'Путь должен начинаться на https://github.com';

                    // Проверяем, что есть хотя бы один путь (например, имя пользователя)
                    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);

                    if (pathSegments.length === 0) return 'Введите имя пользователя';
                    if (pathSegments.length === 1) return 'Введите название репозитория';

                    return pathSegments.length >= 2;
                } catch (e) {
                    return '❌ URL не корректно задан';
                }
            },
        },
        {
            type: 'input',
            name: 'path',
            message: 'Введите путь, куда добавить сабмодуль (нажмите Enter чтобы уст-ть в корень):',
            validate: (input) => {
                if (!input) return true;
                if (input.startsWith('/')) return '❌ Абсолютные пути не поддерживаются';

                const regex = /^[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*$/;

                if (!regex.test(input)) {
                    return '❌ Недопустимый путь';
                }

                return true;
            },
        },
    ])
    .then((answers) => {
        const { url, path } = answers;
        const targetPath = path;

        try {
            const scriptSubmodule = `git submodule add ${url} ${targetPath}`;
            console.log(`\n▶ Добавляем сабмодуль ${url} в '${targetPath}' (${scriptSubmodule})`);
            execSync(scriptSubmodule, { stdio: 'inherit' });
            console.log(`\n✔️ Сабмодуль успешно добавлен в '${targetPath}'`);
        } catch (e) {
            console.error('❌ Ошибка при добавлении сабмодуля');
            process.exit(1);
        }
    })
    .catch((err) => {
        // Обработка прерывания Ctrl+C
        if (err && err.name === 'ExitPromptError') {
            console.log('\n❌ Прервано пользователем');
            process.exit(0);
        }
        console.error(err);
        process.exit(1);
    });
