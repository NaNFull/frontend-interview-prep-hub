#!/usr/bin/env node

import inquirer from 'inquirer';
import { execSync } from 'child_process';

try {
    // Получаем список сабмодулей
    const output = execSync('git config --file .gitmodules --get-regexp path', {
        encoding: 'utf8',
    });

    const submodules = output
        .split('\n')
        .filter(Boolean)
        .map((line) => line.split(' ')[1]);

    if (!submodules.length) {
        console.log('Сабмодулей не найдено.');
        process.exit(0);
    }

    // Спрашиваем пользователя, какой сабмодуль удалить
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'submodule',
                message: 'Выберите сабмодуль для удаления:',
                choices: submodules,
            },
        ])
        .then((answer) => {
            const submodule = answer.submodule;

            const run = (cmd) => {
                console.log('▶', cmd);
                execSync(cmd, { stdio: 'inherit' });
            };

            try {
                run(`git submodule deinit -f ${submodule}`);
                run(`rm -rf .git/modules/${submodule}`);
                run(`git rm -f ${submodule}`);

                console.log(`\n✔️ Сабмодуль '${submodule}' удалён`);
            } catch (e) {
                console.error('❌ Ошибка при удалении сабмодуля');
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
} catch (e) {
    console.error('❌ Нет сабмодулей или ошибка Git');
    process.exit(1);
}
