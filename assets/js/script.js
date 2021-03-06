var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    //check if input values are empty
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();
    var isEdit = formEl.hasAttribute("data-task-id");

 // has data attribute, so get task id and call function to complete edit process
if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } 
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };
  
    createTaskEl(taskDataObj);
  }
}
  var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// set new values
taskSelected.querySelector("h3.task-name").textContent = taskName;
taskSelected.querySelector("span.task-type").textContent = taskType;
//loop through tasks array and task object with new content
for (var i = 0; i < tasks.length; i++){
    if (tasks[i].id === parseInt(taskId)){
        tasks[i].name = taskName;
        tasks[i].type = taskType;
    }
    saveTasks();
}
alert("Task Updated!")
formEl.removeAttribute("data-task-id");
document.querySelector("#save-task").textContent = "Add Task";
  };
var createTaskEl = function(taskDataObj) {
 // create list item
 var listItemEl = document.createElement("li");
 listItemEl.className = "task-item";
 // add task id as a custom attribute
 listItemEl.setAttribute("data-task-id", taskIdCounter);
 listItemEl.setAttribute("draggable", "true");
 //create div to hold task info and add to list item
 var taskInfoEl = document.createElement("div");
 //giv it a class name
 taskInfoEl.className = "task-info";
 //add html content to div
 taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
 listItemEl.appendChild(taskInfoEl);
 var taskActionsEl = createTaskActions(taskIdCounter);
 listItemEl.appendChild(taskActionsEl);
 //add entire list item to list
 tasksToDoEl.appendChild(listItemEl);
 taskDataObj.id = taskIdCounter;
 tasks.push(taskDataObj);
 // increase task counter for next unique id
 taskIdCounter++;
 saveTasks();
}
var createTaskActions = function(taskId){
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
      
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
}
var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    //set status of task based on dropzone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress"){
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed"){
        statusSelectEl.selectedIndex = 2;
    }
    dropZoneEl.appendChild(draggableElement);
    dropZoneEl.removeAttribute("style");
   // loop through tasks array to find and update the updated task's status
    for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(id)) {
      tasks[i].status = statusSelectEl.value.toLowerCase();
    }
  }
  saveTasks();
  console.log(tasks);
  };
formEl.addEventListener("submit" , taskFormHandler);

var taskButtonHandler = function(event) {
    //get target element from event
    var targetEl = event.target;
    //edit button clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }
    if (event.target.matches(".delete-btn")) {
        //get the elements task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
  };

pageContentEl.addEventListener("click", taskButtonHandler);
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    //create new array to hold updated list of tasks
    var updatedTaskArr = [];
    //loop through current tasks
    for (var i = 0; i <tasks.length; i++){
        //if tasks[i].id doesnt match the value in taskId, lets keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
};
var editTask = function(taskId) {
   //get task list iten elemtn
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
   //get content from task name and type
   var taskName = taskSelected.querySelector("h3.task-name").textContent;
   var taskType = taskSelected.querySelector("span.task-type").textContent;
   document.querySelector("input[name='task-name']").value = taskName;
   document.querySelector("select[name='task-type']").value = taskType;
   document.querySelector("#save-task").textContent = "Save Task";
   formEl.setAttribute("data-task-id", taskId);
};
var taskStatusChangeHandler = function(event){
 // get the task item's id
 var taskId = event.target.getAttribute("data-task-id");
 //get the currently selected option's value and convert to lowercase
 var statusValue = event.target.value.toLowerCase();
 //find the parent task item element based on the id
 var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
 if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } 
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } 
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
  //update tasks in task array
  for (var i =0; i < tasks.length; i++){
      if (tasks[i].id === parseInt(taskId)){
          tasks[i].status = statusValue;
      }
      console.log(tasks);
  }
}
var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("text/plain");
    console.log("getId:", getId, typeof getId);
}
  var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
      event.preventDefault();
      taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
  };
  var dragLeaveHandler = function(event){
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
      taskListEl.removeAttribute("style");
    }
  }
  var saveTasks = function(){
      localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");
    //see if it is null, meaning the local storage doesnt have anyting saved and is empty
    if (!savedTasks) {
      return false;
    }
  //un-string it 
    savedTasks = JSON.parse(savedTasks);
    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the `createTaskEl()` function
    createTaskEl(savedTasks[i]);
  }
  }
pageContentEl.addEventListener("change" , taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave" , dragLeaveHandler);
loadTasks();