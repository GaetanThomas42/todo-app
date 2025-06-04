import { columnsConfig } from "../config/columnsConfig.js";

export class TodoRenderer {
  constructor(todoManager) {
    this.todoManager = todoManager;
  }

  createColumnHTML(column) {
    return `
                    <div class="${column.colors.bg} rounded-lg p-4 shadow-md">
                        <h2 class="text-xl font-semibold mb-4 ${column.colors.text} flex items-center">
                            <span class="w-3 h-3 ${column.colors.accent} rounded-full mr-2"></span>
                            ${column.title}
                        </h2>
                        
                        <form class="mb-4" data-status="${column.id}">
                            <div class="flex flex-col space-y-2">
                                <input 
                                    type="text" 
                                    placeholder="${column.placeholder}"
                                    class="px-3 py-2 border ${column.colors.border} rounded-md focus:outline-none focus:ring-2 ${column.colors.focus} text-sm"
                                    required
                                >
                                <button 
                                    type="submit"
                                    class="${column.colors.button} text-white px-3 py-2 rounded-md text-sm transition-colors"
                                >
                                    + Ajouter
                                </button>
                            </div>
                        </form>
                        
                        <div 
                            id="${column.id}-todos" 
                            class="space-y-2 min-h-[200px] p-2 rounded-md border-2 border-dashed border-transparent transition-colors"
                            data-column="${column.id}"
                        >
                        </div>
                    </div>
                `;
  }

  createTodoHTML(todo) {
    const column = columnsConfig.find((col) => col.id === todo.status);
    const date = new Date(todo.createdAt).toLocaleDateString("fr-FR");

    return `
                    <div 
                        class="p-3 ${column.colors.todoBg} border ${
      column.colors.todoBorder
    } rounded-md shadow-sm cursor-move transition-all duration-200 hover:shadow-md" 
                        data-todo-id="${todo.id}"
                        draggable="true"
                    >
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex items-center gap-2 flex-1">
                                <span class="text-gray-400 cursor-grab">⋮⋮</span>
                                <p class="${
                                  column.colors.todoText
                                } font-medium text-sm break-words flex-1 mr-2">${
      todo.text
    }</p>
                            </div>
                            <button 
                                class="delete-btn text-red-500 hover:text-red-700 text-xs flex-shrink-0"
                                title="Supprimer"
                                data-todo-id="${todo.id}"
                            >
                                ✕
                            </button>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-gray-500">${date}</span>
                            <select 
                                class="status-select text-xs border rounded px-1 py-0.5 ${
                                  column.colors.todoText
                                }"
                                data-todo-id="${todo.id}"
                            >
                                ${columnsConfig
                                  .map(
                                    (col) =>
                                      `<option value="${col.id}" ${
                                        todo.status === col.id ? "selected" : ""
                                      }>${col.title}</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                    </div>
                `;
  }

  renderColumns() {
    const container = document.getElementById("columns-container");
    container.innerHTML = columnsConfig
      .map((column) => this.createColumnHTML(column))
      .join("");
  }

  renderTodos() {
    columnsConfig.forEach((column) => {
      const container = document.getElementById(`${column.id}-todos`);
      const todos = this.todoManager.getTodosByStatus(column.id);

      if (todos.length === 0) {
        container.innerHTML =
          '<p class="text-gray-500 text-sm italic text-center py-4">Aucun élément</p>';
      } else {
        container.innerHTML = todos
          .map((todo) => this.createTodoHTML(todo))
          .join("");
      }
    });
  }
}
