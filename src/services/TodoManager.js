        // Gestionnaire de todos
export class TodoManager {
            constructor() {
                this.todos = JSON.parse(localStorage.getItem('todos')) || [];
                this.nextId = parseInt(localStorage.getItem('nextId')) || 1;
            }

            addTodo(text, status) {
                const todo = {
                    id: this.nextId++,
                    text: text.trim(),
                    status: status,
                    createdAt: new Date().toISOString()
                };
                this.todos.push(todo);
                this.saveTodos();
                return todo;
            }

            deleteTodo(id) {
                this.todos = this.todos.filter(todo => todo.id !== parseInt(id));
                this.saveTodos();
            }

            updateTodoStatus(id, newStatus) {
                const todo = this.todos.find(todo => todo.id === parseInt(id));
                if (todo) {
                    todo.status = newStatus;
                    this.saveTodos();
                }
            }

            getTodosByStatus(status) {
                return this.todos.filter(todo => todo.status === status);
            }

            clearAll() {
                this.todos = [];
                this.nextId = 1;
                this.saveTodos();
            }

            saveTodos() {
                localStorage.setItem('todos', JSON.stringify(this.todos));
                localStorage.setItem('nextId', this.nextId.toString());
            }
        }