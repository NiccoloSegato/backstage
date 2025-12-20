// Load the database from localStorage when the page loads
document.addEventListener("DOMContentLoaded", function() {
    const db = loadDB();
    db.projects.forEach(project => {
        // Count the number of tasks in localStorage with the current project's ID
        let taskCount = 0;
        for (let key in db.tasks) {
            console.log(key.id);
            if (key.startsWith("t_")) {
                const task = JSON.parse(localStorage.getItem(key));
                if (task.projectId === project.id) {
                    taskCount++;
                }
            }
        }
        project.taskCount = taskCount;

        let projectDiv = document.createElement("div");
        projectDiv.className = "project-carousel-item";
        projectDiv.style.backgroundColor = project.color;
        projectDiv.innerHTML = `
            <h2>${project.name}</h2>
            <p>${project.taskCount} tasks</p>
        `;
        document.getElementById("projects-carousel").appendChild(projectDiv);
    });
});

function openNew() {
    window.location.href = "new.html";
}   