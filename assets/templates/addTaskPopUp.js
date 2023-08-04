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
contacts = []


function disableButtonAddTask() {
    let button = document.getElementById('buttonCreateTaskPopUpTask')
    button.disabled = true;

    setTimeout(function () {
        button.disabled = false;
    }, 3000);
}

async function addToTasks() {

    let title = document.getElementById('task');
    let description = document.getElementById('description');
    let date = document.getElementById('date');
    let subtasks = subtasksToSave.splice(0, subtasksToSave.length)
    let category = document.getElementById('selectedCategoryInputValue');
    let assignedTo = assignedContacts.splice(0, assignedContacts.length)
    let prio = prios.slice(0).toString()
    let colorCategory = colorsCategory.slice(0).toString()


    let task = {
        title: title.value,
        description: description.value,
        category: category.value,
        colorCategory,
        assignedTo: assignedTo.value,
        date: date.value,
        prio,
        subtasks,
        readinessState: 'toDo',
        assignedTo,
        pace: 0
    };

    clearValuesOfAddTask(title, description, category, assignedTo, date)
    tasks.push(task);
    disableButtonAddTask()
    await backend.setItem('tasks', JSON.stringify(tasks))
    popTheAddedDesk()
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
        <label class="subtaskLabel">${subtask.subtask}</label><img src=".././assets/img/closeButtonBoard.png" onclick="deleteSubtask(${index})">
        </div>`
    })
}


function openPopUpAddTask() {

    document.getElementById('addTaskPopUp').classList.add('openPopUp')
    document.getElementById(`date`).setAttribute("min", date.toISOString().split("T")[0]);
}


function closePopUpAddTask() {
    document.getElementById('addTaskPopUp').classList.remove('openPopUp')
}


async function popTheAddedDesk() {
    document.getElementById('popUpWhenAdded').classList.remove('displayNone')
    setTimeout(function () { document.getElementById('popUpWhenAdded').classList.add('displayNone') }, 2000)
}


function clearValuesOfAddTask(title, description, category, assignedTo, date) {
    title.value = '',
        description.value = '',
        category.value = '',
        assignedTo.value = '',
        date.value = '',
        assignedContacts = []
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


function openInputAddCategory() {
    document.getElementById('selectedCategoryInputValue').value = ''
    document.getElementById('hiddenInputCategory').classList.remove('displayNone')
    document.getElementById('dropdownCategory').style = 'display:none'
}



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
    checkForCheckedAssignedPopUp()
}

function checkForCheckedAssignedPopUp() {
    let checkedbox

    contacts.forEach((contact, index) => {

        assignedContacts.forEach(assigned => {
            checkedbox = document.getElementById(`checkboxAssigned${index}`)
            if (contact.email === assigned.email) {
                checkedbox.checked = true;
            }
        });
    });
}




