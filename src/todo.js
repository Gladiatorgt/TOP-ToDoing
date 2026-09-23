class Project {
  //
  constructor(name, description) {
    this.id = crypto.randomUUID();
    this.projectName = name;
    this.description = description;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todoId) {
    this.todos = this.todos.filter((x) => x.id !== todoId);
  }
}

class Todo {
  //
  constructor(title, description, due, priority, isDone = false) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.due = due;
    // this.priority = priority.toLowerCase();
    this.priority = priority;
    this.isDone = isDone;
  }

  toggleIsDone = () => (this.isDone = !this.isDone);
}

export { Todo, Project };
