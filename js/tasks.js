

/**
 * Toggles the display state of the 'dropdownAddContact' element.
 * If the element is currently visible (display: block), it will be hidden. 
 * If it is hidden, it will be made visible.
 */
function toggleDropdownContacts() {
    let dropdown = document.getElementById('dropdownAddContact');
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
}


/**
 * Toggles the display state of the 'dropdownCategory' element.
 * If the element is currently visible (display: block), it will be hidden. 
 * If it is hidden, it will be made visible.
 */
function toggleDropdown() {
    let dropdown = document.getElementById('dropdownCategory');
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
}


/**
 * Explicitly hides both 'dropdownAddContact' and 'dropdownCategory' elements.
 */
function closeDropdown() {
    document.getElementById('dropdownAddContact').style.display = 'none';
    document.getElementById('dropdownCategory').style.display = 'none';
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
