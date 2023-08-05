function HTMLrenderTaskCards(i, j) {

    return `<div draggable="true" ondragstart="startDragging(${i})" onclick="renderDialogFullCard(${i})" class="boardCard" >
                <div class="category" style="background-color: ${tasks[i].colorCategory}">
                   ${tasks[i].category}
                </div>
                <h4 >${tasks[i].title}
                </h4>
                <div class="task">${tasks[i].description}
                </div>
                <div id="progressBarSection${i}" class="progressBarSection">
                   <div id="progressBar${i}" class="progressBar"></div>
                   <div>${tasks[i].pace}/${tasks[i].subtasks.length} Done</div>
                </div>
                <div  class="assignedToBoard">
                    <span id="assignedToCircles${i}" class="assignedToAvatars" ></span>
                    <img id="urgencyBoard${j}" src=" ">
                </div>

                <div onclick="openChangeStatus(${i})"> <!--For mobile devices-->
                <div  id="dropdownForMobileDevices${i}" class="dropdownForMobileDevices">
                    <div class="headerForSelectionField">
                        <label id="statusForMobileDevices" style="position: relative;">Change status</label>
                        <img class="arrDownStatus" src="assets/img/arrDown.png">
                    </div>

                    <div id="dropdown-contentForMobileDevices${i}" class="dropdown-contentForMobileDevices">
                    </div>

                </div>
            </div>

            </div>`

}


function HTMLrenderDialogFullCard(i) {
    return `
    <div id="dialogFullCardContent" class="dialogFullCardContent">
        <div class="wrapperDialog">
                 <img onclick="closeTask()" class="closeButtondialogFullCard" src="./assets/img/closeButtonBoard.png">
                 <div class="categoryDialog" style="background-color: ${tasks[i].colorCategory}"> 
                      ${tasks[i].category}
                 </div>
                 <h1>${tasks[i].title}</h1>  
                 <div class="taskDescript">
                      ${tasks[i].description}
                 </div>
                 <div class="dueDate">
                      <p>Due Date:</p> <span>${tasks[i].date}</span>
                 </div>
                 <div class="dueDate">
                     <p>Priority:</p> <img class="priorityImgFullCard" id="urgencyFullCard${i}" src=" ">
                 </div>
              
                 <div>
                    <p>Subtasks:</p>
                    <div  id="subtasksFullCard" style="display:flex; flex-direction:column;">
                    </div>
                </div>

                 <div class="assignedTo">
    
                      <p>Assigned to:</p>
                      <div class="assignedToFullCard" id="assignedToFullCard">
                      </div>
                     
                 </div>
              <div class="editDelete">
                   <img  class="deleteButton" onclick="deleteTask(${i})"  src="assets/img/blueDelete.png">
                  <img  class="editButton" onclick="openEditTask(${i})" src="assets/img/blueEdit.png">   
             </div>
        </div>
   </div>`
}

function HTMLrenderSubtasksDialogFullCard(i, subtask, counter) {
    return `<div class="checkBoxDiv">
    <span>${subtask.subtask}</span><input type="checkbox" onclick="countTasks(${i},${counter})"  id="checkBox${counter}" class="addedSubtaskOnEdit">
</div>`}


function openEditTaskHTML(i) {

    return `<div id="entireEditTaskCard" class="dialogFullCardContent"
        style="display:flex; justify-content: center !important; align-items: center;">
        <form class="boardEditTaskForm" onsubmit="editTask(${i}); return false;">
            <div>
                <label>Title</label>
                <input class="inputEdit" id="editedTask" type="text" placeholder="Enter a title" required value="${tasks[i].title}">
            </div>

            <div>
                <label>Description</label>
                <textarea class="textareaEdit" id="editedDescription" required type="text"
                    placeholder="Enter a description">${tasks[i].description}</textarea>
            </div>

            <div>
                <label>Due date</label>
                <input class="inputEdit" type="date" id="editedDate" value="${tasks[i].date}" required />
            </div>

            <div><!--Prio container-->
                <label>Prio</label>
                <div class="priorities">
                    <img id="prio4" value="urgent" onclick="addEditedPriority(${i},${4})" class="priorityImgEdit"
                        src="assets/img/urgentImg.png">
                    <img id="prio5" value="medium" onclick="addEditedPriority(${i},${5})" class="priorityImgEdit"
                        src="assets/img/mediumImg.png">
                    <img id="prio6" value="low" onclick="addEditedPriority(${i},${6})" class="priorityImgEdit"
                        src="assets/img/lowImg.png">
                </div>
            </div>

             

            <div class="AssignedTo" style="padding:6px;"> <!--Assigned to container-->
                <label>Assigned to</label>
                <div id="reassignContacts" class="dropdownEditTask">
                    <div  class="headerForSelectionField">
                        <span style="position: relative;">Reassign contacts</span>
                        <img class="arrDown" src="assets/img/arrDown.png">
                        <div>
                            <input id="editedHiddenInputAddContact" class="hiddenInput displayNone"
                                placeholder="New category name"> <!--Hidden input addContact-->
                        </div>
                    </div>
                    
                    <div id="editedDropdownAddContact" class="dropdown-content" >
                  
                    </div>
                </div>
            </div><!--Assigned to container closed-->
            <div class="okButtonDiv">
               <button class="okButton">Ok  &#10004;</button>
            </div>
    </form><!--Content edit card container closed-->
    
  </div><!--Edit card container closed-->
  `
}



function ifStatusToDoForMobile(i) {
    let statuses = document.getElementById(`dropdown-contentForMobileDevices${i}`)

    if (tasks[i].readinessState === "toDo") {
        statuses.innerHTML = ''
        statuses.innerHTML += `<div id="statusesDropdown${i}" class="statusesDropdown">
        <p onclick="statusInProgress(${i})">In Progress</p>
        <p onclick="statusAwaitingFeedback(${i})">Awaiting Feedback</p>
        <p onclick="statusDone(${i})">Done</p>
        </div>`
    }
}


function ifStatusInProgressForMobile(i) {
    let statuses = document.getElementById(`dropdown-contentForMobileDevices${i}`)

    if (tasks[i].readinessState === "inProgress") {
        statuses.innerHTML = ''
        statuses.innerHTML += `<div id="statusesDropdown${i}" class="statusesDropdown">
        <p onclick="statusToDo(${i})">To Do</p>
        <p onclick="statusAwaitingFeedback(${i})">Awaiting Feedback</p>
        <p onclick="statusDone(${i})">Done</p>
        </div>`
    }
}


function ifStatusAwaitingFeedbackForMobile(i) {
    let statuses = document.getElementById(`dropdown-contentForMobileDevices${i}`)

    if (tasks[i].readinessState === "awaitingFeedback") {
        statuses.innerHTML = ''
        statuses.innerHTML += `<div id="statusesDropdown${i}" class="statusesDropdown">
        <p onclick="statusToDo(${i})">To Do</p>
        <p onclick="statusInProgress(${i})">In Progress</p>
        <p onclick="statusDone(${i})">Done</p>
        </div>`
    }
}


function ifStatusDoneForMobile(i) {
    let statuses = document.getElementById(`dropdown-contentForMobileDevices${i}`)

    if (tasks[i].readinessState === "done") {
        statuses.innerHTML = ''
        statuses.innerHTML += `<div id="statusesDropdown${i}" class="statusesDropdown">
        <p onclick="statusToDo(${i})">To Do</p>
        <p onclick="statusInProgress(${i})">In Progress</p>
        <p onclick="statusAwaitingFeedback(${i})">Awaiting Feedback</p>
        </div>
        `
    }
}


function HTMLforRenderAssignedContactsOnBoard(i, colorCircle, contact) {
    let element = document.getElementById(`colors${colorCircle}`);
    let backgroundColorCircle = element.style.backgroundColor;
    document.getElementById(`assignedToCircles${i}`).innerHTML += `<span style="background-color:${backgroundColorCircle}" class="assignedToAvatar">${tasks[i].assignedTo[contact].firstNameLetter}${tasks[i].assignedTo[contact].lastNameLetter}</span>`
}


function HTMLforRenderAssignedContactsOnFullCard(i, colorCircle, contact) {
    let element = document.getElementById(`colors${colorCircle}`);
    let backgroundColorCircle = element.style.backgroundColor;
    document.getElementById(`assignedToFullCard`).innerHTML += `<div class="assignedToContact"><span style="background-color:${backgroundColorCircle}" class="assignedToAvatar">${tasks[i].assignedTo[contact].firstNameLetter}${tasks[i].assignedTo[contact].lastNameLetter}</span><p>${tasks[i].assignedTo[contact].name}</p><div>`
}

























