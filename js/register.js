let joinUsers = [];


/**
 * This function displays the Sign Up form and hides the Login form.
 */
function openSignUpContainer() {
    document.getElementById('signup-btn').disabled = true; // disable while loading
    document.getElementById('login-main').classList.add('d-none');
    document.getElementById('signup-forgotPsw-container').classList.add('container-style');
    document.getElementById('signup-forgotPsw-container').innerHTML = returnSignupForm();
    document.getElementById('signup-btn').disabled = false;
}


/**
 * This function returns the Sign up Form.
 */
function returnSignupForm() {
    return `
            <form onsubmit="register(); return false;" class="login-form">
                <img class="arrow-left" onclick="backToLogin()" src="assets/img/arrow-left.png">
                <h1>Sign up</h1>
                <hr>
                <input class="input-field" placeholder="Name" type="text" id="userName" autocomplete="on" required>
                <input class="input-field" placeholder="Email" type="email" id="emailSignUp" name="emailSignUp" autocomplete="on" required>
                <input class="input-field" placeholder="Password" type="password" id="password" autocomplete="on"
                title="Must contain at least 8 or more characters" required>
                <button type="submit" id="registerBtn">Sign up</button>
            </form>
            `;
}


/**
 * This function pushes the new registered users and saves them.
 */
async function register() {
    pushNewUser();
}


/**
 * This function creates a new user and saves it in backend.
 */
async function pushNewUser() {
    registerBtn.disabled = true;
    joinUsers.push({
        'userName': userName.value,
        'userEmail': emailSignUp.value,
        'password': password.value
    });
    await backend.setItem('joinUsers', JSON.stringify(joinUsers));
    setSignUpFeedback();
}


/**
 * This function creates a Feedback container for successfull registration.
 */
function setSignUpFeedback() {
    document.getElementById('signup-forgotPsw-container').innerHTML += `
    <div class="sent-mail-container" onclick="backToLogin()">
        <div class="sent-mail-message">
        <img src="assets/img/checkmark-icon.png">
        You have successfully registered.
        </div>
    </div>
    `;
    resetForm();
}


/**
 * This function resets all the inputs and enables the register button.
 */
function resetForm() {
    userName.value = '';
    emailSignUp.value = '';
    password.value = '';
    registerBtn.disabled = false;
}


/**
 * This function displays the Login form and hides the Sign up form.
 */
function backToLogin() {
    document.getElementById('signup-forgotPsw-container').classList.remove('container-style');
    document.getElementById('signup-forgotPsw-container').innerHTML = '';
    document.getElementById('login-main').classList.remove('d-none');
}