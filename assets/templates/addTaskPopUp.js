let tasks = []
let assignedContacts = []
let prios = []
let categories = []
let colorsCategory = []
let prioImages = ['./assets/img/urgent.png', './assets/img/medium.png', './assets/img/low.png']
let prioImagesFullCard = ['./assets/img/urgentOnclick.png', './assets/img/mediumOnclick.png', './assets/img/lowOnclick.png']
let tasksToEdit = []
let subtasksToSave = []
let date = new Date();
let currentColumn = "";
contacts = []


/**
 * Disables the "buttonCreateTaskPopUpTask" button for 3 seconds.
 */
function disableButtonAddTask() {
    let button = document.getElementById('buttonCreateTaskPopUpTask')
    button.disabled = true;

    setTimeout(function () {
        button.disabled = false;
    }, 3000);
}


/**
 * Saves a new category with a specified name and color.
 * @param {string} value - The name of the category.
 * @param {string} colorValue - The color associated with the category.
 * @returns {Promise<void>} A promise that resolves once the category has been saved to the backend.
 * @throws {Error} Throws an error if unable to save the category to the backend.
 */
async function saveCategory(value, colorValue) {
    categories.push({ name: value, color: colorValue });
    await backend.setItem('categories', JSON.stringify(categories));
}


/**
 * Adds a selected category to a task.
 * If a category value is selected, this function will update the 'labelCategory' element
 * with the selected category's name and the default color from the 'colorsCategory' array.
 * Subsequently, it hides the 'hiddenInputCategory' element and the 'dropdownCategory' dropdown.
 */
function addCategoryOnTask() {
    let value = document.getElementById('selectedCategoryInputValue').value;
    let selectedColor = colorsCategory[0];

    if (value) {
        document.getElementById('labelCategory').innerHTML = `
            <div class="assignedCategoryValues">
                ${value}
                <div class="colorPicker colorPickerAssigned" style="background-color: ${selectedColor}"  id="assignedColor"></div>
            </div>`;
        document.getElementById('hiddenInputCategory').classList.add('displayNone');
        document.getElementById('dropdownCategory').style.display = 'none';
    }
}


/**
 * Retrieves the color associated with a given category name.
 * @param {string} categoryName - The name of the category to fetch the color for.
 * @returns {string|null} The color associated with the category, or `null` if the category isn't found.
 */
function getCategoryColor(categoryName) {
    let category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : null;
}


/**
 * Adds a new task based on DOM values. 
 * If the category doesn't exist and a category name is provided, a new category is added.
 * @returns {Promise<void>} A promise that resolves once the task and, if necessary, the category have been added.
 * @throws {Error} Throws an error if there are issues adding a new category or handling the task.
 */
async function addToTasks() {
    let values = getValuesFromDOM();
    let existingCategory = processCategories(values.categoryName);

    if (!existingCategory && values.categoryName) {
        await addNewCategory(values.categoryName);
    }

    let task = createTask(values, existingCategory);
    handleTask(task);
}


/**
 * Retrieves specific values related to tasks and categories from the DOM.
 * @returns {Object} An object containing values fetched from the DOM.
 */
function getValuesFromDOM() {
    let getValue = id => document.getElementById(id).value;
    let categoryName = getValue('selectedCategoryInputValue');
    let categoryLabel = document.getElementById('labelCategory').textContent.trim();
    let categoryInput = document.getElementById('selectedCategoryInputValue').value;
    let selectedCategory = categoryInput ? categoryInput : categoryLabel;

    return {
        categoryName,
        categoryLabel,
        categoryInput,
        selectedCategory,
        title: getValue('task'),
        description: getValue('description'),
        date: getValue('date')
    };
}


/**
 * Searches for a category by its name in the global `categories` array.
 * @param {string} categoryName - The name of the category to search for.
 * @returns {Object|null} The category object if found, or `null` if not found.
 */
function processCategories(categoryName) {
    let selectedColor = colorsCategory[0];
    return categories.find(cat => cat.name === categoryName);
}


/**
 * Adds a new category with a specified name and default color to the global `categories` array.
 * The new category is also stored asynchronously to the backend.
 * @param {string} categoryName - The name of the category to be added.
 * @returns {Promise<void>} A promise that resolves once the category has been saved to the backend.
 * @throws {Error} Throws an error if unable to save the category to the backend.
 */
async function addNewCategory(categoryName) {
    let selectedColor = colorsCategory[0];
    let newCategory = { name: categoryName, color: selectedColor };
    categories.push(newCategory);
    await backend.setItem('categories', JSON.stringify(categories));
}


/**
 * Creates a task object based on the provided values and the existing category.
 * @param {Object} values - The values containing details about the task.
 * @param {Object} existingCategory - The category object that matches the selected category from the `values` parameter.
 * @returns {Object} An object representing the task with properties including title, description, category, color of the category, assigned contacts, date, priority, subtasks, readiness state, and pace.
 */
function createTask(values, existingCategory) {
    let selectedColorCategory = getCategoryColor(values.selectedCategory);
    return {
        title: values.title,
        description: values.description,
        category: values.selectedCategory,
        colorCategory: selectedColorCategory,
        assignedTo: assignedContacts.splice(0, assignedContacts.length),
        date: values.date,
        prio: prios.slice(0).toString(),
        subtasks: subtasksToSave.splice(0, subtasksToSave.length),
        readinessState: currentColumn,
        pace: 0
    };
}


/**
 * Processes the provided task, adding it to the current column and performing subsequent operations.
 * This function will:
 * 1. Create the task in the designated column.
 * 2. Clear input values related to task creation.
 * 3. Add the task to the global `tasks` array.
 * 4. Disable the 'Add Task' button temporarily.
 * 5. Save the updated tasks to the backend.
 * 6. Invoke a function to perform further UI updates after the task has been added (presumably popping up a notification or task element).
 * 7. Adjust the category on the task.
 * 8. Reset the current column value.
 * @param {Object} task - The task object to be handled, which contains task details such as title, description, etc.
 */
function handleTask(task) {
    createTaskInColumn(task, currentColumn);
    clearValuesOfAddTask();
    tasks.push(task);
    disableButtonAddTask();
    backend.setItem('tasks', JSON.stringify(tasks));
    popTheAddedDesk();
    addCategoryOnTask();
    currentColumn = "";
}


/**
 * Fetches the value of a DOM element by its ID. 
 * If the element is not found, a warning is logged in the console.
 * @param {string} id - The ID of the DOM element to retrieve the value from.
 * @returns {string|null} The value of the DOM element or `null` if the element is not found.
 */
function getValue(id) {
    let elem = document.getElementById(id);
    if (elem) {
        return elem.value;
    } else {
        console.warn(`Element mit der ID ${id} nicht gefunden!`);
        return null;
    }
}


/**
 * Creates a visual representation of a task in the specified column on the board.
 * @param {Object} task - The task object to be displayed, which contains details such as title and description.
 * @param {string} column - The column in which the task should be displayed. Can be one of: 'toDo', 'inProgress', 'awaitingFeedback', or 'done'.
 */
function createTaskInColumn(task, column) {
    let taskDiv = document.createElement("div");
    taskDiv.className = "taskDiv";
    taskDiv.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
    
    let columnMapping = {
        'toDo': 'boardSubsectionToDo',
        'inProgress': 'boardSubsectionInProgress',
        'awaitingFeedback': 'boardSubsectionFeedback',
        'done': 'boardSubsectionDone',
    };

    document.getElementById(columnMapping[column]).appendChild(taskDiv);
}


/**
 * Adds a subtask from the pop-up input to the global `subtasksToSave` array.
 * After adding the subtask, the input value is cleared and the subtasks are re-rendered on the pop-up.
 */
function addSubtaskOnPopUp() {
    let subtask = document.getElementById('subtaskPopUp');
    if (subtask.value) {
        subtasksToSave.push({
            subtask: subtask.value,
            checkedValue: 0,
        })
    }
    subtask.value = ''
    renderSubtasksOnPopUpAddTask()
}


/**
 * Deletes a subtask from the global `subtasksToSave` array by its index.
 * After deletion, the subtasks are re-rendered on the pop-up.
 * @param {number} i - The index of the subtask in the `subtasksToSave` array to be deleted.
 */
function deleteSubtask(i) {
    subtasksToSave.splice(i, 1)
    renderSubtasksOnPopUpAddTask()
}


/**
 * Renders subtasks from the `subtasksToSave` array to the pop-up. 
 * Each rendered subtask comes with a delete icon that, when clicked, will remove the subtask.
 */
function renderSubtasksOnPopUpAddTask() {
    document.getElementById('subtasksPopUp').innerHTML = ''
    subtasksToSave.forEach((subtask, index) => {
        document.getElementById('subtasksPopUp').innerHTML += `<div class="checkBoxDiv">
        <label class="subtaskLabel">${subtask.subtask}</label><img src="./assets/img/closeButtonBoard.png" onclick="deleteSubtask(${index})">
        </div>`
    })
}


/**
 * Renders categories from the global `categories` array into the dropdown within the pop-up.
 * It starts by offering an option to add a new category. Subsequent categories are rendered with their name
 * and a visual representation of their color. Each rendered category is clickable and will trigger a function 
 * to select the respective category in the pop-up.
 */
function renderCategoriesInPopup() {
    let dropdownCategory = document.getElementById('dropdownCategory');
    dropdownCategory.innerHTML = `<a onclick="openInputAddCategory()" href="#">Add Category</a>`;
    
    categories.forEach(category => {
        dropdownCategory.innerHTML += `
            <a onclick="selectCategoryInPopup('${category.name}')" href="#">
                ${category.name}
                <div class="colorPicker" style="background-color: ${category.color}; border-radius: 50%;"></div>
            </a>`;
    });
}


/**
 * Selects and displays a category within the pop-up based on the given category name.
 * If the category is found, its name and color representation are shown in the pop-up.
 * @param {string} categoryName - The name of the category to be selected and displayed in the pop-up.
 */
function selectCategoryInPopup(categoryName) {
    let category = categories.find(cat => cat.name === categoryName);
    if (category) {
        document.getElementById('labelCategory').innerHTML = `
            ${category.name}
            <div class="colorPicker" style="background-color: ${category.color}; border-radius: 50%;"></div>
        `;
    }
}


/**
 * Opens the 'Add Task' pop-up and sets up initial configurations based on the provided column.
 * It initializes the date input with a minimum value, sets the current column, assigns a default priority,
 * and renders available categories into the pop-up.
 * @param {string} column - The column context from which the pop-up is being opened (e.g., 'toDo', 'inProgress').
 */
function openPopUpAddTask(column) {
    document.getElementById('addTaskPopUp').classList.add('openPopUp');
    document.getElementById(`date`).setAttribute("min", date.toISOString().split("T")[0]);
    currentColumn = column;
    addPriority(2);
    renderCategoriesInPopup(); // Laden der Kategorien beim Öffnen des Pop-ups
}


/**
 * Closes the 'Add Task' pop-up by removing the 'openPopUp' class from it.
 */
function closePopUpAddTask() {
    document.getElementById('addTaskPopUp').classList.remove('openPopUp')
}


/**
 * Shows a pop-up briefly to notify the user that a task (desk) has been added successfully.
 * The pop-up is displayed for 2 seconds and then automatically hidden.
 * @async
 */
async function popTheAddedDesk() {
    document.getElementById('popUpWhenAdded').classList.remove('displayNone')
    setTimeout(function () { document.getElementById('popUpWhenAdded').classList.add('displayNone') }, 2000)
}


/**
 * Clears the input values from the 'Add Task' pop-up form.
 * This function is used to reset the form fields after a task has been added or when the pop-up is closed.
 * Additionally, the global variable `assignedContacts` is reset to an empty array.
 */
function clearValuesOfAddTask() {
    document.getElementById('task').value = '';
    document.getElementById('description').value = '';
    document.getElementById('selectedCategoryInputValue').value = '';
    document.getElementById('date').value = '';
    assignedContacts = [];
}


/**
 * Deletes a task from the global `tasks` array based on its index and updates the backend storage.
 * After deletion, the task cards are re-rendered and the full card dialog is closed.
 * @async
 * @param {number} i - The index of the task in the `tasks` array to be deleted.
 */
async function deleteTask(i) {
    tasks.splice(i, 1);
    await backend.setItem('tasks', JSON.stringify(tasks))
    renderTaskCards();
    document.getElementById('dialogFullCard').classList.add('displayNone')
}


/**
 * Edits the priority of a specific task and updates the backend storage.
 * The function fetches the updated priority value from the DOM, modifies the task's priority, 
 * updates the visual representation of priorities, and then persists the changes to the backend.
 * @async
 * @param {number} i - The index of the task in the `tasks` array to be edited.
 * @param {number} j - Identifier used to target the specific DOM element representing priority.
 */
async function addEditedPriority(i, j) {
    let selectedPriority = document.getElementById("prio" + j);
    let selectedUrgency = selectedPriority.getAttribute("value")
    tasks[i].prio = selectedUrgency
    editColorPrios(selectedUrgency, j)
    await backend.setItem('tasks', JSON.stringify(tasks))
}


/**
 * Updates the visuals of the priority icons based on the selected priority level (urgency).
 * This function adjusts the source of priority icons to represent the selection visually.
 * @param {string} selectedUrgency - The urgency level ('urgent', 'medium', or 'low') that was selected.
 * @param {number} i - Identifier used to target the specific DOM element representing priority.
 */
function editColorPrios(selectedUrgency, i) {
    if (selectedUrgency == 'urgent') {
        document.getElementById("prio" + i).src = "./assets/img/urgentOnclick.png";
        document.getElementById("prio" + 5).src = "./assets/img/mediumImg.png";
        document.getElementById("prio" + 6).src = "./assets/img/lowImg.png";
    }
    if (selectedUrgency == 'medium') {
        document.getElementById("prio" + i).src = "./assets/img/mediumOnclick.png"
        document.getElementById("prio" + 4).src = "./assets/img/urgentImg.png"
        document.getElementById("prio" + 6).src = "./assets/img/lowImg.png"
    }
    if (selectedUrgency == 'low') {
        document.getElementById("prio" + i).src = "./assets/img/lowOnclick.png"
        document.getElementById("prio" + 4).src = "./assets/img/urgentImg.png"
        document.getElementById("prio" + 5).src = "./assets/img/mediumImg.png"
    }
}


/**
 * Handles the priority selection, updates visuals, and stores the selected priority in a global variable.
 * This function first retrieves the urgency level based on the selected icon. It then updates the 
 * visuals of the priority icons and adjusts the global `prios` array accordingly.
 * @param {number} i - Identifier used to target the specific DOM element representing priority.
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
 * Updates the visual representation of priority icons based on the selected urgency level.
 * When an urgency level is selected, the corresponding icon is highlighted, and the other icons
 * are set to their default state.
 * @param {string} selectedUrgency - The urgency level which can be 'urgent', 'medium', or 'low'.
 * @param {number} i - Identifier used to target the specific DOM element representing priority.
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
 * Opens the input field to add a new category.
 * Resets the value of the category input, reveals the hidden category input field, 
 * and hides the dropdown menu for categories.
 */
function openInputAddCategory() {
    document.getElementById('selectedCategoryInputValue').value = ''
    document.getElementById('hiddenInputCategory').classList.remove('displayNone')
    document.getElementById('dropdownCategory').style = 'display:none'
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
 * Toggles the inclusion of a contact in the `assignedContacts` array based on its index in the `contacts` array.
 * If the contact is already in the `assignedContacts` array, it gets removed. If it's not, it gets added.
 * @param {number} index - The index of the contact in the `contacts` array.
 */
function addToAssignedContacts(index) {
    if (index >= 0 && index < contacts.length) {
        let contact = contacts[index];

        if (!assignedContacts.includes(contact)) {
            assignedContacts.push(contact);
        } else {
            assignedContacts.splice(assignedContacts.indexOf(contact), 1);
        }
    }
}


/**
 * Closes the hidden input field for categories and shows the dropdown menu for categories.
 */
function closeHiddenInput() {
    document.getElementById('hiddenInputCategory').classList.add('displayNone')
    document.getElementById('dropdownCategory').style = 'display:inlineBlock'
}


/**
 * Toggles the display of the contact dropdown and renders the list of contacts.
 * For each contact, it creates a checkbox to allow the user to assign the contact.
 */
function contactList() {
    let droppedContacts = document.getElementById('dropdownAddContactPopUp');
    if (droppedContacts.style.display === 'none') {
        droppedContacts.style.display = 'block'
    } else { droppedContacts.style.display = 'none' }
    droppedContacts.innerHTML = ''

    contacts.forEach((contact, index) => {
        droppedContacts.innerHTML += `<div class="droppedContacts"><a>${contact.name}</a><input id="checkboxAssigned${index}" onclick="addToAssignedContacts('${index}')" type="checkbox"></div>`;
    })
}