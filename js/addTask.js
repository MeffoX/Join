let tasks = []
let assignedContacts = []
let prios = []
let categories = []
let colorsCategory = []
let prioImages = ['./assets/img/urgent.png', './assets/img/medium.png', './assets/img/low.png']
let prioImagesFullCard = ['./assets/img/urgentOnclick.png', './assets/img/mediumOnclick.png', './assets/img/lowOnclick.png']
let tasksToEdit = []
let subtasksToSave = []
let percentOfDone
let colorOfBar
let checkboxState;
let checkedInput
let date = new Date();


/**
 * Initializes the add task functionality. Loads tasks and contacts data from the backend and sets minimum date for date picker.
 * @returns {Promise<void>}
 */
async function initAddTask() {
    initScript();
    try {
        setURL("https://stefan-roth.developerakademie.net/Join/smallest_backend_ever-master");
        await downloadFromServer();
        tasks = await JSON.parse(await backend.getItem('tasks')) || []
        contacts = JSON.parse(backend.getItem('contacts')) || [];
        document.getElementById("date").setAttribute("min", date.toISOString().split("T")[0])
        contactList()
    } catch (er) {
        console.error(er)
    }
}


/**
 * Disables add task button for a duration to prevent spamming.
 */
function disableButtonAddTask() {
    let button = document.getElementById('addTaskButton')
    button.disabled = true;

    setTimeout(function () {
        button.disabled = false;
    }, 3000);
}


/**
 * Fetches task data from form.
 * @returns {Promise<Object>} An object representing task data.
 */
async function getTaskData() {
    let title = document.getElementById('task');
    let description = document.getElementById('description');
    let date = document.getElementById('date');
    let category = document.getElementById('selectedCategoryInputValue');
    let assignedTo = assignedContacts.splice(0, assignedContacts.length);
    let colorCategory = colorsCategory.slice(0).toString();
    let prio = prios.slice(0).toString();
    let subtasks = subtasksToSave.splice(0, subtasksToSave.length);

    return {
        title: title.value,
        description: description.value,
        category: category.value,
        colorCategory,
        assignedTo: assignedTo.value,
        date: date.value,
        prio,
        subtasks
    };
}


/**
 * Creates a task object from provided data.
 * @param {Object} data The task data.
 * @returns {Promise<Object>} The task object.
 */
async function createTask(data) {
    let task = {
        ...data,
        readinessState: 'toDo',
        pace: 0
    };
    return task;
}


/**
 * Saves a task to backend and updates local tasks array.
 * @param {Object} task The task to save.
 * @returns {Promise<void>}
 */
async function saveTask(task) {
    tasks.push(task);
    disableButtonAddTask();
    await backend.setItem('tasks', JSON.stringify(tasks));
}


/**
 * Adds a new task from form data.
 * @returns {Promise<void>}
 */
async function addToTasks() {
    let data = await getTaskData();
    let task = await createTask(data);
    await saveTask(task);
    popTheAddedDesk();

    window.location.href = 'board.html';
}


/**
 * Resets form fields to default.
 */
function clearValuesOfAddTask(title, description, category, assignedTo, date) {
    title.value = '',
        description.value = '',
        category.value = '',
        assignedTo.value = '',
        date.value = '',
        assignedContacts = []
}


/**
 * Handles priority selection and UI updates.
 * @param {number} i The priority level index.
 */
function addPriority(i) {
    let selectedPriority = document.getElementById("prio" + i);
    let selectedUrgency = selectedPriority.getAttribute("value")
    if (prios.length == 0) {
        colorPrios(selectedUrgency, i)
        prios.push(selectedUrgency)
    } else {
        prios = []
        colorPrios(selectedUrgency, i)
        prios.push(selectedUrgency)
    }
}


/**
 * Updates UI based on selected priority.
 * @param {string} selectedUrgency The selected priority.
 * @param {number} i The priority level index.
 */
function colorPrios(selectedUrgency, i) {
    if (selectedUrgency == 'urgent') {
        document.getElementById("prio" + i).src = "./assets/img/urgentOnclick.png";
        document.getElementById("prio" + 2).src = "./assets/img/mediumImg.png";
        document.getElementById("prio" + 3).src = "./assets/img/lowImg.png";
    }
    if (selectedUrgency == 'medium') {
        document.getElementById("prio" + i).src = "./assets/img/mediumOnclick.png"
        document.getElementById("prio" + 1).src = "./assets/img/urgentImg.png"
        document.getElementById("prio" + 3).src = "./assets/img/lowImg.png"
    }
    if (selectedUrgency == 'low') {
        document.getElementById("prio" + i).src = "./assets/img/lowOnclick.png"
        document.getElementById("prio" + 1).src = "./assets/img/urgentImg.png"
        document.getElementById("prio" + 2).src = "./assets/img/mediumImg.png"
    }

}


/**
 * Adds a subtask to the task.
 */
function addSubtask() {
    let subtask = document.getElementById('subtask');
    if (subtask.value) {
        subtasksToSave.push({
            subtask: subtask.value,
            checkedValue: 0,
        })
    }
    subtask.value = ''
    renderSubtasksOnAddTask()
}


/**
 * Removes a subtask from the task.
 * @param {number} i The subtask index.
 */
function deleteSubtask(i) {
    subtasksToSave.splice(i, 1)
    renderSubtasksOnAddTask()
}


/**
 * Removes a task.
 * @param {number} i The task index.
 * @returns {Promise<void>}
 */
async function deleteTask(i) {

    tasks.splice(i, 1);
    await backend.setItem('tasks', JSON.stringify(tasks))
    renderTaskCards();
    document.getElementById('dialogFullCard').classList.add('displayNone')

}


/**
 * Opens category input.
 */
function openInputAddCategory() {
    document.getElementById('selectedCategoryInputValue').value = ''
    document.getElementById('hiddenInputCategory').classList.remove('displayNone')
    document.getElementById('dropdownCategory').style = 'display:none'
}


/**
 * Assigns a category to a task.
 */
function addCategoryOnTask() {
    let value = document.getElementById('selectedCategoryInputValue').value;
    if (value) {
        document.getElementById('labelCategory').innerHTML = '';
        document.getElementById('labelCategory').innerHTML = `<div class="assignedCategoryValues">
         ${value}
          <div class="colorPicker colorPickerAssigned" style="background-color: ${colorsCategory}"  id="assignedColor"></div>
         </div>` ;
        document.getElementById('hiddenInputCategory').classList.add('displayNone')
        document.getElementById('dropdownCategory').style = 'none'
    }
}


/**
 * Assigns a category color to a task.
 * @param {number} i The color index.
 */
function addCategoryColorOnTask(i) {
    let value = document.getElementById('selectedCategoryInputValue').value;
    if (value) {
        let color = document.getElementById("color" + i).style.backgroundColor
        if (colorsCategory.length == 0) {
            colorsCategory.push(color)
        } else {
            colorsCategory = []
            colorsCategory.push(color)
        }
        addCategoryOnTask()
    }
}


/**
 * Opens contact input.
 */
function openInputAddContact() {
    document.getElementById('hiddenInputAddContact').classList.remove('displayNone')
    document.getElementById('dropdownAddContact').style = 'display:none'
  
}


/**
 * Adds a contact to the assigned contacts for a task.
 * @param {number} index The contact index.
 */
function addToAssignedContacts(index) {
    if (index >= 0 && index < contacts.length) {
        let contact = contacts[index];
        contact.id = 1
        if (!assignedContacts.includes(contact)) {
            assignedContacts.push(contact);
        } else {
            assignedContacts.splice(assignedContacts.indexOf(contact), 1);
        }
    }
}


/**
 * Shows a popup when a task is added.
 * @returns {Promise<void>}
 */
async function popTheAddedDesk() {
    document.getElementById('popUpWhenAdded').classList.remove('displayNone')
    setTimeout(function () { document.getElementById('popUpWhenAdded').classList.add('displayNone') }, 2000)
}


/**
 * Closes the category input.
 */
function closeHiddenInput() {
    document.getElementById('hiddenInputCategory').classList.add('displayNone')
    document.getElementById('dropdownCategory').style = 'display:inlineBlock'
}


/**
 * Renders subtasks on the task form.
 */
function renderSubtasksOnAddTask() {
    document.getElementById('subtasksOnAddTask').innerHTML = ''
    subtasksToSave.forEach((subtask, index) => {
        document.getElementById('subtasksOnAddTask').innerHTML += `<div class="checkBoxDiv">
        <label class="subtaskLabel">${subtask.subtask}</label><img src="./assets/img/closeButtonBoard.png" onclick="deleteSubtask(${index})">
        </div>`
    })
}


/**
 * Renders the contact list for task assignment.
 */
function contactList() {
    let dropdownAddContact = document.getElementById('dropdownAddContact');
    dropdownAddContact.innerHTML = ''

    contacts.forEach((contact, index) => {
        dropdownAddContact.innerHTML += `<div class="droppedContacts"><a>${contact.name}</a><input id="checkboxAssigned${index}" onclick="addToAssignedContacts('${index}')" type="checkbox"></div>`;
    })
}