const STORAGE_KEY = "project-tracker-db";

function loadDB() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { projects: [] };
}

function saveDB(db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}