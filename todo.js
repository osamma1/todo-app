import inquirer from 'inquirer';
import fs from 'fs';
const todosFilePath = 'todos.json';
function loadTodos() {
    try {
        const data = fs.readFileSync(todosFilePath, 'utf8');
        return JSON.parse(data);
    }
    catch (err) {
        return [];
    }
}
function saveTodos(todos) {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2), 'utf8');
}
async function promptUser() {
    const todos = loadTodos();
    const choices = todos.map((todo, index) => ({
        name: `${todo.completed ? '[x]' : '[ ]'} ${todo.task}`,
        value: index
    }));
    const questions = [
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                { name: 'Add a new todo', value: 'add' },
                { name: 'Toggle todo status', value: 'toggle' },
                { name: 'Remove a todo', value: 'remove' },
                { name: 'Exit', value: 'exit' }
            ]
        },
        {
            type: 'input',
            name: 'newTodo',
            message: 'Enter your new todo:',
            when: (answers) => answers.action === 'add'
        },
        {
            type: 'list',
            name: 'todoIndex',
            message: 'Select a todo:',
            choices: choices,
            when: (answers) => ['toggle', 'remove'].includes(answers.action)
        }
    ];
    const answers = await inquirer.prompt(questions);
    switch (answers.action) {
        case 'add':
            todos.push({ task: answers.newTodo, completed: false });
            saveTodos(todos);
            break;
        case 'toggle':
            todos[answers.todoIndex].completed = !todos[answers.todoIndex].completed;
            saveTodos(todos);
            break;
        case 'remove':
            todos.splice(answers.todoIndex, 1);
            saveTodos(todos);
            break;
        case 'exit':
            process.exit();
            break;
    }
    await promptUser();
}
promptUser();
