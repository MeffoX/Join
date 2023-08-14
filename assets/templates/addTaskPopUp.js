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


function disableButtonAddTask() {
    let button = document.getElementById('buttonCreateTaskPopUpTask')
    button.disabled = true;

    setTimeout(function () {
        button.disabled = false;
    }, 3000);
}


async function saveCategory(value, colorValue) {
    categories.push({ name: value, color: colorValue });
    await backend.setItem('categories', JSON.stringify(categories));
}


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



function getCategoryColor(categoryName) {
    let category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : null; // Gibt die Farbe oder null zurück, falls die Kategorie nicht gefunden wird.
}


async function addToTasks() {
    let getValue = id => document.getElementById(id).value;
    let categoryName = getValue('selectedCategoryInputValue');
    console.log("Category Name:", categoryName);
    
    // Überprüfen und Hinzufügen der Kategorie hier
    let selectedColor = colorsCategory[0];
    let existingCategory = categories.find(cat => cat.name === categoryName);
    let categoryLabel = document.getElementById('labelCategory').textContent.trim();
    let categoryInput = document.getElementById('selectedCategoryInputValue').value;
    let selectedCategory = categoryInput ? categoryInput : categoryLabel;
    let selectedColorCategory = getCategoryColor(selectedCategory);

    if (!existingCategory && categoryName) {
        existingCategory = { name: categoryName, color: selectedColor };
        categories.push(existingCategory);
        await backend.setItem('categories', JSON.stringify(categories));
    }

    let task = {
        title: getValue('task'),
        description: getValue('description'),
        category: selectedCategory,
        colorCategory: selectedColorCategory,
        assignedTo: assignedContacts.splice(0, assignedContacts.length),
        date: getValue('date'),
        prio: prios.slice(0).toString(),
        subtasks: subtasksToSave.splice(0, subtasksToSave.length),
        readinessState: currentColumn,
        pace: 0
    };

    createTaskInColumn(task, currentColumn);
    clearValuesOfAddTask();
    tasks.push(task);
    disableButtonAddTask();
    await backend.setItem('tasks', JSON.stringify(tasks));
    popTheAddedDesk();
    addCategoryOnTask();
    currentColumn = "";
}

function getValue(id) {
    let elem = document.getElementById(id);
    if (elem) {
        return elem.value;
    } else {
        console.warn(`Element mit der ID ${id} nicht gefunden!`);
        return null;
    }
}






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


function deleteSubtask(i) {
    subtasksToSave.splice(i, 1)
    renderSubtasksOnPopUpAddTask()

}


function renderSubtasksOnPopUpAddTask() {
    document.getElementById('subtasksPopUp').innerHTML = ''
    subtasksToSave.forEach((subtask, index) => {
        document.getElementById('subtasksPopUp').innerHTML += `<div class="checkBoxDiv">
        <label class="subtaskLabel">${subtask.subtask}</label><img src="./assets/img/closeButtonBoard.png" onclick="deleteSubtask(${index})">
        </div>`
    })
}


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


function selectCategoryInPopup(categoryName) {
    let category = categories.find(cat => cat.name === categoryName);
    if (category) {
        document.getElementById('labelCategory').innerHTML = `
            ${category.name}
            <div class="colorPicker" style="background-color: ${category.color}; border-radius: 50%;"></div>
        `;
    }
}




function openPopUpAddTask(column) {
    document.getElementById('addTaskPopUp').classList.add('openPopUp');
    document.getElementById(`date`).setAttribute("min", date.toISOString().split("T")[0]);
    currentColumn = column;
    addPriority(2);
    renderCategoriesInPopup(); // Laden der Kategorien beim Öffnen des Pop-ups
}




function closePopUpAddTask() {
    document.getElementById('addTaskPopUp').classList.remove('openPopUp')

}


async function popTheAddedDesk() {
    document.getElementById('popUpWhenAdded').classList.remove('displayNone')
    setTimeout(function () { document.getElementById('popUpWhenAdded').classList.add('displayNone') }, 2000)
}


function clearValuesOfAddTask() {
    document.getElementById('task').value = '';
    document.getElementById('description').value = '';
    document.getElementById('selectedCategoryInputValue').value = '';
    document.getElementById('date').value = '';
    assignedContacts = [];
}




async function deleteTask(i) {

    tasks.splice(i, 1);
    await backend.setItem('tasks', JSON.stringify(tasks))
    renderTaskCards();
    document.getElementById('dialogFullCard').classList.add('displayNone')

}


async function addEditedPriority(i, j) {
    let selectedPriority = document.getElementById("prio" + j);
    let selectedUrgency = selectedPriority.getAttribute("value")
    tasks[i].prio = selectedUrgency
    editColorPrios(selectedUrgency, j)
    await backend.setItem('tasks', JSON.stringify(tasks))
}


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


function closeHiddenInput() {
    document.getElementById('hiddenInputCategory').classList.add('displayNone')
    document.getElementById('dropdownCategory').style = 'display:inlineBlock'
}


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
