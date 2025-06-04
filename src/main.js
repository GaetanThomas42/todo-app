import { TodoManager } from "./services/TodoManager.js";
import { TodoRenderer } from "./utils/TodoRenderer.js";

class TodoApp {
  constructor() {
    this.todoManager = new TodoManager();
    this.renderer = new TodoRenderer(this.todoManager);
    this.init();
  }

  init() {
    // Générer les colonnes
    this.renderer.renderColumns();

    // Afficher les todos existants
    this.renderer.renderTodos();

    // Ajouter les event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Event listener pour les formulaires d'ajout
    document.addEventListener("submit", (e) => {
      if (e.target.tagName === "FORM") {
        e.preventDefault();
        const status = e.target.dataset.status;
        const input = e.target.querySelector("input");
        const text = input.value.trim();

        if (text) {
          this.todoManager.addTodo(text, status);
          input.value = "";
          this.renderer.renderTodos();
        }
      }
    });

    // Event listener pour la suppression
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const todoId = e.target.dataset.todoId;
        this.todoManager.deleteTodo(todoId);
        this.renderer.renderTodos();
      }
    });

    // Event listener pour le changement de statut
    document.addEventListener("change", (e) => {
      if (e.target.classList.contains("status-select")) {
        const todoId = e.target.dataset.todoId;
        const newStatus = e.target.value;
        this.todoManager.updateTodoStatus(todoId, newStatus);
        this.renderer.renderTodos();
      }
    });

    // Event listener pour vider toutes les listes
    document.getElementById("clear-all-btn").addEventListener("click", () => {
      if (confirm("Êtes-vous sûr de vouloir vider toutes les listes ?")) {
        this.todoManager.clearAll();
        this.renderer.renderTodos();
      }
    });
  }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  new TodoApp();
});
