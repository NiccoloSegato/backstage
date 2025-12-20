// Load the database from localStorage when the page loads
document.addEventListener("DOMContentLoaded", function() {
    const db = loadDB();
    let selectObject = document.getElementById("project-select");
    db.projects.forEach(project => {
        selectObject.innerHTML += `
            <option value="${project.id}">${project.name}</option>
        `;
    });
});

function selectedProjectChanged() {
    let selectObject = document.getElementById("project-select");
    let selectedValue = selectObject.value;
    if (selectedValue !== "new") {
        document.getElementById("new-task-form").style.display = "block";
        document.getElementById("new-project-form").style.display = "none";
    }
    else {
        document.getElementById("new-project-form").style.display = "block";
        document.getElementById("new-task-form").style.display = "none";
    }
}

function submitNewProject() {
    let projectName = document.getElementById("project-name").value;
    let projectColor = document.getElementById("project-color").value;
    // Check if project name is provided
    if (!projectName) {
        alert("Please enter a project name.");
        return;
    }

    const db = loadDB();
    const newProject = {
        id: "p_" + Date.now(), // semplice e sufficiente
        name: projectName,
        color: projectColor
    };

    db.projects.push(newProject);
    saveDB(db);

    // Redirect to home page
    window.location.href = "index.html";
}

function submitNewTask() {
    let taskName = document.getElementById("task-name").value;
    let taskDueDate = document.getElementById("task-due-date").value;
    let taskCompletionPercentage = parseInt(document.getElementById("task-completion-percentage").value);
    let selectObject = document.getElementById("project-select");
    let selectedProjectId = selectObject.value;

    // Check if task name is provided
    if (!taskName) {
        alert("Please enter a task name.");
        return;
    }

    const db = loadDB();
    const newTask = {
        id: "t_" + Date.now(), // semplice e sufficiente
        name: taskName,
        dueDate: taskDueDate,
        completionPercentage: taskCompletionPercentage,
        projectId: selectedProjectId
    };

    // Find the project and add the task ID to its tasks array
    const project = db.projects.find(proj => proj.id === selectedProjectId);
    if (!project) {
        alert("Selected project not found.");
        return;
    }
    db.projects.forEach(proj => {
        if (proj.id === selectedProjectId) {
            if (!proj.tasks) {
                proj.tasks = [];
            }
            proj.tasks.push(newTask);
        }
    });
    saveDB(db);

    // Redirect to home page
    window.location.href = "index.html";
}