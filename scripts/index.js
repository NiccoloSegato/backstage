import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
//import { loadDB } from './db.js';

const firebaseConfig = {
  apiKey: "AIzaSyAwx9IeSD2Ib9uYRAQaW9Kc_XtQoxjTIww",
  authDomain: "backstage-tasks.firebaseapp.com",
  projectId: "backstage-tasks",
  storageBucket: "backstage-tasks.firebasestorage.app",
  messagingSenderId: "949920359936",
  appId: "1:949920359936:web:a3b2f881e6cb3f32a61ae5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load the database from localStorage when the page loads
document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
});

async function loadTasks() {
    console.log("Loading tasks from Firestore...");
    const querySnapshot = await getDocs(collection(db, "databases"));
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
    });
    console.log("Data loaded from Firestore:", data);
    
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
                taskRow.onclick = function() { taskClicked(this); };

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
    /*const db = loadDB();
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

    // Link the listeners to the buttons
    document.getElementById("create-project-btn").addEventListener("click", openNew);*/

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

function exportJSON() {
    const db = loadDB();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "backstage_data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importJSON() {
    // Ask for confirmation before importing and overwriting existing data
    if (!confirm("Importing data will overwrite your existing data. Are you sure you want to continue?")) {
        return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            const importedData = JSON.parse(event.target.result);
            localStorage.setItem('project-tracker-db', JSON.stringify(importedData));
            alert("Data imported successfully! The page will now reload.");
            location.reload();
        };
        reader.readAsText(file);
    };
    input.click();
}