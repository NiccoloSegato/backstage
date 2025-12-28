import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./db.js";

/**
 * Load the database from localStorage when the page loads
 */
document.addEventListener("DOMContentLoaded", function() {
    loadProjects();

    // Listeners
    document.getElementById("create-project-button").addEventListener("click", submitNewProject);
    document.getElementById("project-select").addEventListener("change", selectedProjectChanged);
    document.getElementById("submit-task-button").addEventListener("click", submitNewTask);
});

/**
 * Load the projects from Firebase and populate the project selection dropdown.
 */
async function loadProjects() {
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

    // Iterate through documents in the database
    const projects = await getDocs(collection(db, "databases", data[0].id, "projects"));
    projects.forEach(async (projectDoc) => {
        const projectData = projectDoc.data();

        // Add project to the selection dropdown
        let option = document.createElement("option");
        option.value = projectDoc.id;
        option.text = projectData.name;
        document.getElementById("project-select").appendChild(option);
    });
}

/**
 * Handles the change event when the selected project changes.
 */
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

/**
 * Function to submit a new project to Firestore.
 * @returns 
 */
async function submitNewProject() {
    let projectName = document.getElementById("project-name").value;
    let projectColor = document.getElementById("project-color").value;
    // Check if project name is provided
    if (!projectName) {
        alert("Please enter a project name.");
        return;
    }

    // Add the new project to the skAvK4LFoplnfylt2ydZ database in Firestore
    try {
        await addDoc(collection(db, "databases", "skAvK4LFoplnfylt2ydZ", "projects"), {
            name: projectName,
            color: projectColor
        });
        window.location.href = "index.html";
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

/**
 * Function to submit a new task to the selected project in Firestore.
 * @returns 
 */
async function submitNewTask() {
    let taskName = document.getElementById("task-name").value;
    let taskDueDate = document.getElementById("task-due-date").value;
    let taskCompletionPercentage = parseInt(document.getElementById("task-completion-percentage").value);
    let taskEstimatedTime = parseFloat(document.getElementById("task-estimated-time").value);
    let selectObject = document.getElementById("project-select");
    let selectedProjectId = selectObject.value;

    // Check if task name is provided
    if (!taskName) {
        alert("Please enter a task name.");
        return;
    }

    try {
        // Add the new task to the selected project in Firestore
        await addDoc(collection(db, "databases", "skAvK4LFoplnfylt2ydZ", "projects", selectedProjectId, "tasks"), {
            name: taskName,
            dueDate: taskDueDate,
            completionPercentage: taskCompletionPercentage,
            estimatedTime: taskEstimatedTime
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }

    // Redirect to home page
    window.location.href = "index.html";
}