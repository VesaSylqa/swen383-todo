import { TodoRenderer } from './TodoRenderer.js';
import { TodoController } from './TodoController.js';
import { ArchivingStorageFactory } from './StorageFactory.js';
import { IdeaBox } from './IdeaBox.js';
import { IdeaBoxAdapter } from './IdeaBoxAdapter.js';
import { LoggingTodoServiceDecorator } from './LoggingTodoServiceDecorator.js';
import { ConfirmDeleteProxy } from './ConfirmDeleteProxy.js';
import { TaskCounter } from './TaskObservers.js';
import { AddTaskCommand, CommandHistory } from './Commands.js';

// Composition root: the only place that decides which storage the app uses.
window.addEventListener('DOMContentLoaded', () => {
    const factory = new ArchivingStorageFactory();
    const todoService = factory.createService();
    const service = new ConfirmDeleteProxy(
        new LoggingTodoServiceDecorator(todoService)
    );
    const renderer = new TodoRenderer('task-container');
    const controller = new TodoController(service, renderer);
    controller.start();

    const counter = new TaskCounter();
    todoService.subscribe(counter);
    counter.update(todoService.tasks);

    const suggestions = new IdeaBoxAdapter(new IdeaBox());
    const suggestBtn = document.getElementById('suggest-btn');
    suggestBtn.addEventListener('click', () => {
        controller.addTask(suggestions.getSuggestion());
    });

    const input = document.getElementById('task-input');
    const addBtn = document.getElementById('add-task-btn');
    const addUrgentBtn = document.getElementById('add-urgent-btn');
    const history = new CommandHistory();

    addBtn.addEventListener('click', () => {
        history.run(new AddTaskCommand(controller, input.value));
        input.value = '';
    });

    document.getElementById('undo-btn').addEventListener('click', () => {
        history.undo();
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
