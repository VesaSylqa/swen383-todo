export class TodoController {
  constructor(todoService, todoRenderer) {
    this.todoService = todoService;
    this.todoRenderer = todoRenderer;
  }

  start() {
    this.todoRenderer.onToggle((id) => this.toggleTask(id));
    this.todoRenderer.onDelete((id) => this.deleteTask(id));
    this.todoRenderer.render(this.todoService);
  }

  addTask(description, type) {
    const task = this.todoService.addTask(description, type);
    if (task) {
      this.todoRenderer.render(this.todoService, task.id);
    }
    return task;
  }

  toggleTask(id) {
    this.todoService.toggleComplete(id);
    this.todoRenderer.render(this.todoService);
  }

  deleteTask(id) {
    this.todoService.deleteTask(id);
    this.todoRenderer.render(this.todoService);
  }
}
