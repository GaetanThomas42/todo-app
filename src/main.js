import { TodoManager } from "./services/TodoManager.js";
import { TodoRenderer } from "./utils/TodoRenderer.js";

// Application principale
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
                document.addEventListener('submit', (e) => {
                    if (e.target.tagName === 'FORM') {
                        e.preventDefault();
                        const status = e.target.dataset.status;
                        const input = e.target.querySelector('input');
                        const text = input.value.trim();
                        
                        if (text) {
                            this.todoManager.addTodo(text, status);
                            input.value = '';
                            this.renderer.renderTodos();
                        }
                    }
                });

                // Event listener pour la suppression
                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('delete-btn')) {
                        const todoId = e.target.dataset.todoId;
                        this.todoManager.deleteTodo(todoId);
                        this.renderer.renderTodos();
                    }
                });

                // Event listener pour le changement de statut
                document.addEventListener('change', (e) => {
                    if (e.target.classList.contains('status-select')) {
                        const todoId = e.target.dataset.todoId;
                        const newStatus = e.target.value;
                        this.todoManager.updateTodoStatus(todoId, newStatus);
                        this.renderer.renderTodos();
                    }
                });

                // Event listener pour vider toutes les listes
                document.getElementById('clear-all-btn').addEventListener('click', () => {
                    if (confirm('Êtes-vous sûr de vouloir vider toutes les listes ?')) {
                        this.todoManager.clearAll();
                        this.renderer.renderTodos();
                    }
                });

                // === DRAG AND DROP EVENT LISTENERS ===
                let draggedElement = null;
                let draggedTodoId = null;

                // Événement quand on commence à faire glisser
                document.addEventListener('dragstart', (e) => {
                    if (e.target.draggable) {

                        draggedElement = e.target;
                        draggedTodoId = parseInt(e.target.dataset.todoId);
                        e.target.style.opacity = '0.5';
                        
                        // Effet visuel sur l'élément glissé
                        e.target.classList.add('rotate-2', 'scale-105');
                    }
                });

                // Événement quand on survole une zone de dépôt
                document.addEventListener('dragover', (e) => {
                    e.preventDefault(); // Nécessaire pour permettre le drop
                    
                    const dropZone = e.target.closest('[data-column]');
                    if (dropZone && draggedElement) {
                        // Effet visuel sur la zone de dépôt
                        dropZone.classList.add('border-blue-300', 'bg-blue-50');
                    }
                });
                
                // Événement quand on quitte une zone de dépôt
                document.addEventListener('dragleave', (e) => {
                    const dropZone = e.target.closest('[data-column]');
                    if (dropZone) {
                        // Vérifier si on quitte vraiment la zone (pas un enfant)
                        if (!dropZone.contains(e.relatedTarget)) {
                            dropZone.classList.remove('border-blue-300', 'bg-blue-50');
                        }
                    }
                });

                // Événement quand on arrête de faire glisser
                document.addEventListener('dragend', (e) => {
                    if (e.target.draggable) {

                        e.target.style.opacity = '1';
                        e.target.classList.remove('rotate-2', 'scale-105');
                        
                        // Nettoyer tous les indicateurs visuels
                        document.querySelectorAll('[data-column]').forEach(column => {
                            column.classList.remove('border-blue-300', 'bg-blue-50');
                        });
                    }
                });

                // Événement de dépôt
                document.addEventListener('drop', (e) => {
                    e.preventDefault();
                    
                    const dropZone = e.target.closest('[data-column]');
                    
                    if (dropZone && draggedTodoId) {
                        const newStatus = dropZone.dataset.column;
                        
                        // Mettre à jour le statut du TODO
                        this.todoManager.updateTodoStatus(draggedTodoId, newStatus);
                        this.renderer.renderTodos();
                        
                        // Animation de succès
                        this.showDropSuccessAnimation(dropZone);
                    }
                    
                    // Nettoyer
                    draggedElement = null;
                    draggedTodoId = null;
                });
            }

            // Animation de succès lors du drop
            showDropSuccessAnimation(dropZone) {
                const originalBg = dropZone.className;
                dropZone.classList.add('bg-green-100', 'border-green-400');
                
                setTimeout(() => {
                    dropZone.className = originalBg;
                }, 500);
            }
        }

        // Initialiser l'application quand le DOM est chargé
        document.addEventListener('DOMContentLoaded', () => {
            new TodoApp();
        });