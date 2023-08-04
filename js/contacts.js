let contacts = [];
let contactsLoaded = false; // Global variable for tracking the state of charge of the contacts
let colors = ["#0048cd", "#81adfd", "#b6fa81", "#f99090", "#845400", "#fac66e", "#07ab1d"];
let letters = [];

/**
 * Loads the main functions to display the contacts
 */
async function initContacts() {
    await initScript();
    setURL("https://stefan-roth.developerakademie.net/Join/smallest_backend_ever-master");
    await downloadFromServer();
    await loadContacts();
    letters = [];
    sortContacts();
}

/**
 * Loads the contacts from the Backend.
 */
async function loadContacts() {
    try {
        contacts = JSON.parse(await backend.getItem('contacts')) || [];
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/**
 * This function sorts the keys 'name' in the json object 'conatcts' in an alphabetic order.
 */
async function sortContacts() {
    contacts.sort(function (a, b) {
        let nameA = a.name.toUpperCase(); // Use uppercase letters to standardize sorting
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    await backend.setItem('contacts', JSON.stringify(contacts));
    loadInitialLetters();
}


/**
 * This function generates for each contact its inital letter.
 */
async function loadInitialLetters() {
    document.getElementById('contactList').innerHTML = '';
    for (let l = 0; l < contacts.length; l++) {
        const contact = contacts[l];
        let initialLetter = contact['firstNameLetter'];

        setInitialLetters(initialLetter, contact, l);
    }
}


/**
 * This funtcion pushes the initial letter in the letters array or executes the function loadContactsLetter().
 * @param {string} initialLetter - carries the value of the current inital letter.
 * @param {string} contact - carries all the data of the contact.
 * @param {string} l - carries the nummber of the current contact in the json object.
 */
function setInitialLetters(initialLetter, contact, l) {
    if (!letters.includes(initialLetter)) {
        letters.push(initialLetter);
        addInitalLetterContainer(initialLetter, contact, l);
    } else {
        loadContactsLetter(initialLetter, contact, l);
    }
}


/**
 * This function creates a container with the inital letter of a new added contact.
 * @param {string} initialLetter - carries the value of the current inital letter.
 * @param {string} contact - carries all the data of the contact.
 * @param {string} l - carries the nummber of the current contact in the json object.
 */
function addInitalLetterContainer(initialLetter, contact, l) {
    document.getElementById('contactList').innerHTML += `
        <div class="initial-letter-container" id="initialLetterContacts${initialLetter}">
            <div id="initialLetterContainer">
                ${initialLetter.toUpperCase()}
            </div>
        </div>

    `;
    loadContactsLetter(initialLetter, contact, l);
}



/**
 * This function checks if the generated inital letter is already in the letters array.
 * @param {string} initialLetter - carries the value of the current inital letter.
 * @param {string} contact - carries all the data of the contact.
 * @param {string} l - carries the nummber of the current contact in the json object.
 */
function loadContactsLetter(initialLetter, contact, l) {
    let nameFirstLetter = contact['firstNameLetter'];

    if (initialLetter === nameFirstLetter) {
        renderContactList(initialLetter, contact, l);
        contactsLoaded = true; // Setze den Ladezustand auf true, um die Endlosschleife zu verhindern
    }
}


/**
 * Render the contactlist. In contact-templates.js you find the HTML-Part. 
 * @param {string} initialLetter - carries the value of the current inital letter.
 * @param {string} contact - carries all the data of the contact.
 * @param {string} l - carries the nummber of the current contact in the json object.
 */
async function renderContactList(initialLetter, contact, l) {
    let contactContainer = document.getElementById(`initialLetterContacts${initialLetter}`);
    contactContainer.innerHTML += memberHTML(l);
}


/**
 * Open a Popup to add new Contacts. In contact-templates.js you find the HTML-Part. 
 */
function openAddContacts() {
    clearContactCard();
    document.getElementById('overlayContainer').classList.remove('d-none');
    setTimeout(() => {
        let contentleft = document.getElementById('addContactLeft');
        contentleft.innerHTML += generateLeftSideNewContact();
        let contentright = document.getElementById('addContactRightContent');
        contentright.innerHTML += generateRightSideNewContact();
    }, 225);
}


/**
 * Open a Popup to edit Contacts. In contact-templates.js you find the HTML-Part. 
 * @param {string} l - carries the nummber of the current contact in the json object.
 */
async function openEditContacts(l) {
    document.getElementById('overlayContainer').classList.remove('d-none');
    setTimeout(() => {
        let contentleft = document.getElementById('addContactLeft');
        contentleft.innerHTML += generateLeftSideEditContact();
        let contentright = document.getElementById('addContactRightContent');
        for (let i = 0; i < contacts.length; i++) {
            contentright.innerHTML = generateRightSideEditContact(l);
        }
    }, 225);
}


/**
 * Close the Popup for adding some Contacts.
 */
function clearContactCard() {
    document.getElementById('addContactLeft').innerHTML = '';
    document.getElementById('addContactRightContent').innerHTML = '';
    document.getElementById('overlayContainer').classList.add('d-none');
}


/**
 * Deletes Contacts from the Backend. 
 * @param {string} l - carries the nummber of the current contact in the json object.
 */
async function deleteNewContact(l) {
    contacts.splice(l, 1);
    document.getElementById('overlayContainer').classList.add('d-none');
    clearContactCard();
    editing = false;
    await backend.setItem('contacts', JSON.stringify(contacts));
    document.getElementById('contactInfo').innerHTML = '';
    initContacts();

    if (window.innerWidth < 1000) {
        let contactContainer = document.querySelector(".contact-container");
        contactContainer.style.display = "none";
    }
}


/**
 * Add new Contacts, save it with the Backend and after that it will render the new Contacts.
 */
async function addContact() {
    const fullName = contactName.value;
    const names = fullName.split(' ');
    const firstName = names[0].charAt(0).toUpperCase();
    const lastName = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';

    contacts.push({
        "name": fullName,
        "email": contactMail.value,
        "phone": contactPhone.value,
        "firstNameLetter": firstName,
        "lastNameLetter": lastName,
    });
    contactCreatedSuccessfuly();
    await backend.setItem('contacts', JSON.stringify(contacts));
    clearInput();
    document.getElementById('contactList').innerHTML = '';
    clearContactCard();
    initContacts();
}


/**
 * Generate a Popup when a new Contact is added.
 */
function contactCreatedSuccessfuly() {
    document.getElementById('contactCreated').classList.remove('d-none');
    document.getElementById('contactCreated').classList.add('contact-created')
    setTimeout(() => {
        document.getElementById('contactCreated').classList.remove('contact-created');
        document.getElementById('contactCreated').classList.add('d-none');
    }, 2000);
}


/**
 * Assign for every Contact a Color. 
 * @param {string} index - to find the current contact in the JSON and assign it a backgroundcolor.
 */
function getContactBackgroundColor(index) {
    const colorIndex = index % colors.length;
    return colors[colorIndex];
}


/**
 * Edit Contacts and render it after that.
 * @param {string} l - carries the nummber of the current contact in the json object.
 */
async function editContact(l) {
    const editedFullName = contactNameEdit.value;
    const editedMail = contactMailEdit.value;
    const editedPhone = contactPhoneEdit.value;
    const editedNames = editedFullName.split(' ');
    const editedFirstName = editedNames[0].charAt(0).toUpperCase();
    const editedLastName = editedNames.length > 1 ? editedNames[editedNames.length - 1].charAt(0).toUpperCase() : '';

    contacts[l].name = editedFullName;
    contacts[l].email = editedMail;
    contacts[l].phone = editedPhone;
    contacts[l].firstNameLetter = editedFirstName;
    contacts[l].lastNameLetter = editedLastName;

    await backend.setItem('contacts', JSON.stringify(contacts));
    clearEditContacCard();
    showContacts(l);
    initContacts();
}

/**
 * Clears the input-field of the Edit-popup.
 */
function clearEditContactInput() {
    document.getElementById('contactNameEdit').value = '';
    document.getElementById('contactMailEdit').value = '';
    document.getElementById('contactPhoneEdit').value = '';
}


/**
 * Close the Edit-popup.
 */
function clearEditContacCard() {
    document.getElementById('overlayContainer').classList.add('d-none');
    document.getElementById('contactInfo').innerHTML = '';
}


/**
 * Clears the input-field of the Add-contact--popup.
 */
function clearInput() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactMail').value = '';
    document.getElementById('contactPhone').value = '';
}


/**
 * Shows the contact-container and the contact-informations.
 * @param {string} l - carries the nummber of the current contact in the json object.
 */
async function showContacts(l) {
    let contactsInfo = document.getElementById('contactInfo');
    contactsInfo.innerHTML = memberInfo(l);

    contactsInfo.style.display = "flex";

    let contactContainer = document.querySelector(".contact-container");
    contactContainer.style.display = "block";

}


/**
 * Close the contact-container and the contact-informations.
 */
function closeContactInfo() {
    let contactContainer = document.querySelector(".contact-container");
    contactContainer.style.display = "none";
}