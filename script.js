/**
 * Initialize functions.
 */
async function initScript() {
    await includeHTML();
    focusSidebar();
    responsiveHeaderText();
}


/**
 * Include Header and Sidebar.
 */
async function includeHTML() {
    let file;
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


/**
 * If window matches media width, then add the kanban-text Container.
 */
function responsiveHeaderText() {
    if (window.matchMedia('(max-width: 640px)').matches) {
        document.body.innerHTML += `
        <div class="kanban-text-container-2">
            <span> Kanban Project Managnement Tool</span>
        </div>
        `;
        adjustMedia();
    }
}


/**
 * If path name is either legal-notice.html or help.html, add special classList.
 */
function adjustMedia() {
    const pathName = window.location.pathname;
    if (pathName === '/legal-notice.html') {
        document.querySelector('.kanban-text-container-2').classList.add('responsiveHeader');
    } 
    if (pathName == '/help.html') {
        document.querySelector('.kanban-text-container-2').classList.add('responsiveHeader');
    }   else {
        document.querySelector('.kanban-text-container-2').classList.remove('responsiveHeader');
    }
}


/**
 * Focus links on sidebar if corresponding page is displayed.
 */
function focusSidebar() {
    let pathName = window.location.pathname;

    let mappings = {
        '/Join/summary.html': 'summary-props',
        '/Join/board.html': 'board-props',
        '/Join/addTask.html': 'addTask-props',
        '/Join/contacts.html': 'contacts-props',
        '/Join/legal-notice.html': 'legal-props'
    };

    let elementId = mappings[pathName];
    if (elementId) {
        document.getElementById(elementId).classList.add('clicked');
    }
}



/**
 * Add a dropdown with toggle effect.
 */
function openImgDropDoen() {
    let dropdown = document.querySelector('.img-drop-down');

    if (dropdown) {
        dropdown.remove(); // Remove dropdown if it's already visible
    } else {
        setDropdownContent();
    }
}


/**
 * Set dropdown content for web and mobile.
 */
function setDropdownContent() {
    if (window.matchMedia('(max-width: 1000px)').matches) {
        pasteDropDownMobile();
    } else {
        pasteDropDownWeb();
    }
    removeDiv();
}


/**
 * Mobile dropdown HTML.
 */
function pasteDropDownMobile() {
    document.getElementById('profile-picture').innerHTML += `
                <div class="img-drop-down">
                    <a href="help.html">Help</a>
                    <a href="legal-notice.html">Legal Notice</a>
                    <a href="index.html">Log out</a>
                </div>
            `;
}


/**
 * Web dropdown HTML.
 */
function pasteDropDownWeb() {
    document.getElementById('profile-picture').innerHTML += `
                <div class="img-drop-down">
                    <a href="index.html">Log out</a>
                </div>
            `;
}


/**
 * Remove Dropdown after 2 seconds.
 */
function removeDiv() {
    dropdown = document.querySelector('.img-drop-down');
    setTimeout(function () {
        if (dropdown) {
            dropdown.remove();
        }
    }, 2000);
}