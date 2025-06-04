import "./style.css";

// Configuration des couleurs par statut
const statusConfig = {
  note: {
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    textColor: "text-blue-800",
  },
  a_faire: {
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
    textColor: "text-yellow-800",
  },
  en_cours: {
    bgColor: "bg-orange-100",
    borderColor: "border-orange-300",
    textColor: "text-orange-800",
  },
  agenda: {
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    textColor: "text-green-800",
  },
};

// Classe Todo
class Todo {
  constructor(text, status) {
    this.id = Date.now() + Math.random();
    this.text = text;
    this.status = status;
    this.createdAt = new Date().toISOString();
  }
}

// Gestionnaire de todos
class TodoManager {
  constructor() {
    this.todos = this.loadTodos();
  }

  loadTodos() {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  }

  saveTodos() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  addTodo(text, status) {
    const todo = new Todo(text, status);
    this.todos.push(todo);
    this.saveTodos();
    return todo;
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.saveTodos();
  }

  getTodosByStatus(status) {
    return this.todos.filter((todo) => todo.status === status);
  }

  clearAll() {
    this.todos = [];
    this.saveTodos();
  }

  changeTodoStatus(id, newStatus) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.status = newStatus;
      this.saveTodos();
    }
  }
}

// Instance globale du gestionnaire
const todoManager = new TodoManager();

// Fonction pour créer l'HTML d'un todo
function createTodoHTML(todo) {
  const config = statusConfig[todo.status];
  const date = new Date(todo.createdAt).toLocaleDateString("fr-FR");

  return `
                <div class="p-3 ${config.bgColor} border ${
    config.borderColor
  } rounded-md shadow-sm" data-todo-id="${todo.id}">
                    <div class="flex justify-between items-start mb-2">
                        <p class="${
                          config.textColor
                        } font-medium text-sm break-words flex-1 mr-2">${
    todo.text
  }</p>
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
                              config.textColor
                            }"
                            data-todo-id="${todo.id}"
                        >
                            <option value="note" ${
                              todo.status === "note" ? "selected" : ""
                            }>Note</option>
                            <option value="a_faire" ${
                              todo.status === "a_faire" ? "selected" : ""
                            }>À faire</option>
                            <option value="en_cours" ${
                              todo.status === "en_cours" ? "selected" : ""
                            }>En cours</option>
                            <option value="agenda" ${
                              todo.status === "agenda" ? "selected" : ""
                            }>Agenda</option>
                        </select>
                    </div>
                </div>
            `;
}

// Fonction pour afficher tous les todos
function renderTodos() {
  const statuses = ["note", "a_faire", "en_cours", "agenda"];

  statuses.forEach((status) => {
    const container = document.getElementById(`${status}-todos`);
    const todos = todoManager.getTodosByStatus(status);

    if (todos.length === 0) {
      container.innerHTML =
        '<p class="text-gray-500 text-sm italic text-center py-4">Aucun élément</p>';
    } else {
      container.innerHTML = todos.map((todo) => createTodoHTML(todo)).join("");
    }
  });

  // Réattacher les event listeners pour les nouveaux éléments
  attachTodoEventListeners();
}

// Fonction pour attacher les event listeners aux todos
function attachTodoEventListeners() {
  // Event listeners pour les boutons de suppression
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const todoId = parseFloat(e.target.dataset.todoId);
      todoManager.deleteTodo(todoId);
      renderTodos();
    });
  });

  // Event listeners pour les selects de changement de statut
  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", (e) => {
      const todoId = parseFloat(e.target.dataset.todoId);
      const newStatus = e.target.value;
      todoManager.changeTodoStatus(todoId, newStatus);
      renderTodos();
    });
  });
}

// Initialisation de l'app
document.addEventListener("DOMContentLoaded", function () {
  // Event listeners pour les formulaires d'ajout
  document.querySelectorAll("form[data-status]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.dataset.status;
      const input = form.querySelector("input");
      const text = input.value.trim();

      if (text) {
        todoManager.addTodo(text, status);
        input.value = "";
        renderTodos();
      }
    });
  });

  // Event listener pour le bouton "Vider toutes les listes"
  document.getElementById("clear-all-btn").addEventListener("click", () => {
    if (confirm("Êtes-vous sûr de vouloir vider toutes les listes ?")) {
      todoManager.clearAll();
      renderTodos();
    }
  });

  // Rendu initial des todos
  renderTodos();
});
