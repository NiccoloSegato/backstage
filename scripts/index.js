// Load the database from localStorage when the page loads
document.addEventListener("DOMContentLoaded", function() {
    const db = loadDB();
    db.projects.forEach(project => {
        // Count tasks for each project
        let taskCount = project.tasks ? project.tasks.length : 0;
        project.taskCount = taskCount;

        let projectDiv = document.createElement("div");
        projectDiv.className = "project-carousel-item";
        projectDiv.style.backgroundColor = project.color;
        projectDiv.innerHTML = `
            <h2>${project.name}</h2>
            <p>${project.taskCount} tasks</p>
        `;
        document.getElementById("projects-carousel").appendChild(projectDiv);

        // Add the tasks to the tasks list, that is a table
        if (project.tasks && project.tasks.length > 0) {
            project.tasks.forEach(task => {
                let tasksTableBody = document.querySelector("#projects-table tbody");
                let taskRow = document.createElement("tr");
                taskRow.innerHTML = `
                    <td>${task.name}</td>
                    <td>${task.dueDate}</td>
                    <td>${task.completionPercentage}%</td>
                    <td style="color: ${project.color};">${project.name}</td>
                `;
                taskRow.onclick = function() { taskClicked(this); };
                // If the task is overdue, highlight the row in red
                let today = new Date().toISOString().split('T')[0];
                if (task.dueDate < today && task.completionPercentage < 100) {
                    taskRow.style.backgroundColor = "#ffcccc";
                }
                // If the task is due today, highlight the row in yellow
                else if (task.dueDate === today && task.completionPercentage < 100) {
                    taskRow.style.backgroundColor = "#ffffcc";
                }
                // If the completion percentage is not 100%, add to the table
                if (task.completionPercentage < 100) {
                    tasksTableBody.appendChild(taskRow);
                }
            });
        }
    });
});

function taskClicked(row) {
    let taskName = row.cells[0].innerText;
    let projectName = row.cells[3].innerText;

    // Load the database to find the task details
    const db = loadDB();
    let selectedTask = null;
    db.projects.forEach(project => {
        if (project.name === projectName) {
            project.tasks.forEach(task => {
                if (task.name === taskName) {
                    selectedTask = task;
                }
            });
        }
    });
    // Redirect to task.html with task id as query parameter
    if (selectedTask) {
        window.location.href = `task.html?taskId=${selectedTask.id}`;
    }
}

function openNew() {
    window.location.href = "new.html";
}