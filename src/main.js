import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { ArchivingStorageFactory } from './StorageFactory.js';
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';
import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';
import { ConfirmDeleteProxy } from './ConfirmDeleteProxy.js';

// Composition root: the only place that decides which storage the app uses.
window.addEventListener('DOMContentLoaded', () => {
    const factory = new ArchivingStorageFactory();
    const service = new ConfirmDeleteProxy(
        new LoggingTodoServiceDecorator(factory.createService())
    );
    const renderer = new TodoRenderer('task-container');
    const controller = new TodoController(service, renderer);
    controller.start();

    const suggestions = new IdeaBoxAdapter(new IdeaBox());
    const suggestBtn = document.getElementById('suggest-btn');
    suggestBtn.addEventListener('click', () => {
        controller.addTask(suggestions.getSuggestion());
    });

    const input = document.getElementById('task-input');
    const addBtn = document.getElementById('add-task-btn');
    const addUrgentBtn = document.getElementById('add-urgent-btn');

    addBtn.addEventListener('click', () => {
        const newId = controller.addTask(input.value);
        if (newId) {
            input.value = '';
        }
    });

    addUrgentBtn.addEventListener('click', () => {
        const newId = controller.addUrgentTask(input.value);
        if (newId) {
            input.value = '';
        }
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addBtn.click();
        }
    });
});
