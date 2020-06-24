var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

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
   // package data as an object
   var taskDataObj = {
       name: taskNameInput,
       type: taskTypeInput
   };
   createTaskEl(taskDataObj);
}
var createTaskEl = function(taskDataObj) {
 // create list item
 var listItemEl = document.createElement("li");
 listItemEl.className = "task-item";
 //create div to hold task info and add to list item
 var taskInfoEl = document.createElement("div");
 //giv it a class name
 taskInfoEl.className = "task-item";
 //add html content to div
 taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
 listItemEl.appendChild(taskInfoEl);
 //add entire list item to list
 tasksToDoEl.appendChild(taskInfoEl);
}
formEl.addEventListener("submit" , taskFormHandler);

