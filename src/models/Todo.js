// Classe Todo
export class Todo {
    constructor(text, status) {
        this.id = Date.now() + Math.random();
        this.text = text;
        this.status = status;
        this.createdAt = new Date().toISOString();
    }
}