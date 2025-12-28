import { doc, getDoc } from "firebase/firestore";
import { db } from "./db.js";

document.addEventListener("DOMContentLoaded", function() {
    // Check if there is a taskId in the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    const taskId = urlParams.get('taskId');
    if (taskId) {
        // Find the task in the database
        getDoc(doc(db, "databases", "skAvK4LFoplnfylt2ydZ", "projects", projectId, "tasks", taskId)).then((taskDoc) => {
            if (taskDoc.exists()) {
                const selectedTask = taskDoc.data();

                // Display the task details
                document.getElementById("task-name").innerText = selectedTask.name;
                // Percentage completion
                document.getElementById("completion-percentage").innerText = selectedTask.completionPercentage + "%";
                let progressBar = document.getElementById("progress-bar-container");
                let progressBarFill = document.getElementById("progress-bar-fill");
                let progressBarWidth = progressBar.offsetWidth;
                progressBarFill.style.width = selectedTask.completionPercentage + "%";
                document.getElementById("time-estimated").innerText = selectedTask.estimatedTime + " h estimated";
                document.getElementById("time-remaining").innerText = (selectedTask.estimatedTime * (100 - selectedTask.completionPercentage) / 100).toFixed(2) + " h remaining";
            } else {
                document.querySelector("main").innerHTML = `<p>Task not found.</p>`;
            }
        });
    }

    // Listeners
    document.getElementById("edit-task-percentage-btn").addEventListener("click", editTaskPercentage);
});

/**
 * Function to edit the completion percentage of the task
 * @returns 
 */
function editTaskPercentage() {
    console.log("Editing task percentage...");
    let newPercentage = parseInt(prompt("Enter new completion percentage (0-100):"));
    if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 100) {
        alert("Invalid percentage. Please enter a number between 0 and 100.");
        return;
    }

    // Get taskId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId');
    if (!taskId) {
        alert("Task ID not found in URL.");
        return;
    }

    // Load DB and find the task
    const db = loadDB();
    let taskFound = false;
    db.projects.forEach(project => {
        if(project.tasks === undefined) return;
        project.tasks.forEach(task => {
            if (task.id === taskId) {
                task.completionPercentage = newPercentage;
                taskFound = true;
            }
        });
    });

    if (taskFound) {
        saveDB(db);
        // Refresh the page to show updated percentage
        location.reload();
    } else {
        alert("Task not found.");
    }
}