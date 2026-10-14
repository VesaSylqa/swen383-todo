import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { LocalStorageFactory } from './StorageFactory.js';

// Composition root: the only place that decides which storage the app uses.
window.addEventListener('DOMContentLoaded', () => {
    const factory = new LocalStorageFactory();
    const service = factory.createService();
    const renderer = new TodoRenderer('task-container');
    const controller = new TodoController(service, renderer);
    controller.start();

    const input = document.getElementById('task-input');
    const addBtn = document.getElementById('add-task-btn');
    const addUrgentBtn = document.getElementById('add-urgent-btn');

    addBtn.addEventListener('click', () => {
        const task = controller.addTask(input.value, 'simple');
        if (task) {
            input.value = '';
        }
    });

    addUrgentBtn.addEventListener('click', () => {
        const task = controller.addTask(input.value, 'urgent');
        if (task) {
            input.value = '';
        }
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addBtn.click();
        }
    });
});
