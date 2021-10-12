// taskList.js

document.addEventListener('DOMContentLoaded',function() {

    // Submit button is disabled while Task Title is empty
    document.addEventListener('input', function() {
        if (document.querySelector("#task-title").value.length == 0) {
            document.querySelector("#submit").disabled = true;
        }
        else {
            document.querySelector("#submit").disabled = false;
        }
    })

    // A function to pick color of task-priority text
    function pickColor(task_priority) {
        if (task_priority == "High") {
            return "red";
        }
        else if (task_priority == "Medium") {
            return "orange";
        }
        else {
            return "cornflowerblue";
        }
    }

    // Creating an array to store information about each task
    let all_tasks = [];
    all_tasks.toString = () => {
        array.forEach(element => {
            return `element.innerHTML\n`
        });
    }

    // Changing the inital text-decoration based on task-status
    function radioDec() {
        let status = document.querySelector("#pending").checked;
        return ((!status)?"line-through":"none");
    }

    // Changing the initial checkbox state based on task-status
    function radioCheck(element) {
        let status = document.querySelector("#pending").checked;
        if (!status) {
            element.querySelector(".checkbox").checked = true;
        }
    }

    // Returns the name representation based on task-status
    function radioChoice() {
        if (document.querySelector("#pending").checked == true) {
            return "pending";
        }
        else {
            return "completed";
        }
    }

    // Upon submitting a new task...
    document.querySelector("#add-task").onsubmit = () => {
        // Grab values of input fields and create a new <li> element with that data
        let li = document.createElement('li');
        let task_title = document.querySelector("#task-title").value;
        let task_priority = document.querySelector("#task-priority").value;
        let task_status = radioChoice();
        /* alert(task_status); */
        li.innerHTML = `
            <input class="checkbox" type="checkbox">
            <p class="displayed-task-title" style="text-decoration:${radioDec()}">${task_title}</p>
            <button class="remove">Remove</button>
            <span class="displayed-task-priority" style="color:${pickColor(task_priority)}">${task_priority} Priority </span>
            `        
        
        radioCheck(li);
        document.querySelector("#task-list").append(li); // Appending to the displayed task list
        all_tasks.push(li) // Pushing to the local all_tasks array

        // Adding event listeners for clicking the remove button or the completion checkbox
        li.addEventListener('click', function(event) {
            element = event.target;
            if (element.className == "remove") { // If the remove button was clicked...
                element.parentElement.remove()
                index = all_tasks.indexOf(element.parentElement);
                all_tasks.splice(index,1)
            }
            else if (element.className == "checkbox") {
                this.querySelector('.displayed-task-title').style.textDecoration = (this.querySelector(".checkbox").checked) ? "line-through" : "none";
            }
        })

        document.querySelector("#task-title").value = ''; // Resetting the "Task Title" input box
        document.querySelector("#task-priority").value = "High"; // Resetting the "Task Priority" box
        document.querySelector("#submit").disabled = true; // Disabling the submit button again
        document.querySelector("#pending").checked = "true"; // Resetting the "Task Status" to pending

        return false; // Stopping the page from reloading
    }

})