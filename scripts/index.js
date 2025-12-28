import { collection, getDocs } from "firebase/firestore";
import { db } from "./db.js";

// Load the database from localStorage when the page loads
document.addEventListener("DOMContentLoaded", function() {
    loadTasks();

    // Set up event listeners
    document.getElementById("create-project-btn").addEventListener("click", openNew);
});

/**
 * Function to load tasks from Firestore and populate the UI
 * @returns 
 */
async function loadTasks() {
    const querySnapshot = await getDocs(collection(db, "databases"));
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
    });
    
    // Check if data is empty
    if (data.length === 0) {
        console.error("No databases found in Firestore.");
        return;
    }
    // Change the title of the page to the user's database name
    document.getElementById("db-name").innerText = data[0].name;

    // Iterate through documents in the database
    const projects = await getDocs(collection(db, "databases", data[0].id, "projects"));
    projects.forEach(async (projectDoc) => {
        const projectData = projectDoc.data();
        let taskCount = 0;

        // Create project carousel item
        let projectDiv = document.createElement("div");
        projectDiv.className = "project-carousel-item";
        projectDiv.style.backgroundColor = projectData.color;
        projectDiv.innerHTML = `
            <h2>${projectData.name}</h2>
            <p id="task-count-${projectDoc.id}">0 tasks</p>
        `;
        document.getElementById("projects-carousel").appendChild(projectDiv);

        // Load tasks for the project
        const tasksSnapshot = await getDocs(collection(db, "databases", data[0].id, "projects", projectDoc.id, "tasks"));
        const tasksTableBody = document.querySelector("#projects-table tbody");
        tasksSnapshot.forEach((taskDoc) => {
            const taskData = taskDoc.data();
            // Only count tasks that are not completed
            if (taskData.completionPercentage < 100) {
                taskCount++;

                // Create task row
                let taskRow = document.createElement("tr");
                taskRow.innerHTML = `
                    <td>${taskData.name}</td>
                    <td>${taskData.dueDate}</td>
                    <td>${taskData.completionPercentage}%</td>
                    <td style="color: ${projectData.color};">${projectData.name}</td>
                `;
                taskRow.onclick = function() { taskClicked(projectDoc.id, taskDoc.id); };

                // Highlight overdue or due today tasks
                let today = new Date().toISOString().split('T')[0];
                if (taskData.dueDate < today) {
                    taskRow.style.backgroundColor = "#ffcccc"; // Overdue
                } else if (taskData.dueDate === today) {
                    taskRow.style.backgroundColor = "#ffffcc"; // Due today
                }

                tasksTableBody.appendChild(taskRow);
            }
        });

        // Update task count in project carousel
        document.getElementById(`task-count-${projectDoc.id}`).innerText = `${taskCount} tasks`;
    });
}

/**
 * Function called when a task is clicked from the tasks table
 * @param {string} projectId - The ID of the clicked project
 * @param {string} taskId - The ID of the clicked task
 */
function taskClicked(projectId, taskId) {
    window.location.href = `task.html?projectId=${projectId}&taskId=${taskId}`;
}

/**
 * Function to open the new project/task creation page
 */
function openNew() {
    window.location.href = "new.html";
}