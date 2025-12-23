document.addEventListener("DOMContentLoaded", function() {
    // Check if there is a taskId in the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId');
    if (taskId) {
        // Load the database to find the task details
        const db = loadDB();
        let selectedTask = null;
        db.projects.forEach(project => {
            project.tasks.forEach(task => {
                if (task.id === taskId) {
                    selectedTask = task;
                }
            });
        });
        // Display the task details
        if (selectedTask) {
            document.getElementById("task-name").innerText = selectedTask.name;
            // Percentage completion
            document.getElementById("completion-percentage").innerText = selectedTask.completionPercentage + "%";
            let progressBar = document.getElementById("progress-bar-container");
            let progressBarFill = document.getElementById("progress-bar-fill");
            let progressBarWidth = progressBar.offsetWidth;
            console.log(progressBar.offsetWidth);
            progressBarFill.style.width = ((progressBarWidth * selectedTask.completionPercentage) / 100) + "px";
            console.log(((progressBarWidth * selectedTask.completionPercentage) / 100) + "px");
            document.getElementById("time-estimated").innerText = selectedTask.estimatedTime + " h estimated";
            document.getElementById("time-remaining").innerText = (selectedTask.estimatedTime * (100 - selectedTask.completionPercentage) / 100).toFixed(2) + " h remaining";

        } else {
            document.querySelector("main").innerHTML = `<p>Task not found.</p>`;
        }
    }
});