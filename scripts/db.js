const STORAGE_KEY = "project-tracker-db";

export function loadDB() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { projects: [] };
}

export function saveDB(db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}