var menuBtns = document.getElementById("menuBtns")

function hideMenu() {
  menuBtns.style.top = "-500px";
}

function showMenu() {
  menuBtns.style.top = "0";
}

var signUpPage = document.getElementById("sign-up-page");
var logInPage = document.getElementById("log-in-page");

function swapToSignUp() {
  logInPage.style.display = "none";
  signUpPage.style.display = "block";
}

function swapToLogIn() {
  logInPage.style.display = "block";
  signUpPage.style.display = "none";
}


//Error message functions

function setErrorMessage(inputElement, inputType, message) {
  inputElement.classList.add("input-error")
  var displayedError = document.getElementById(`${inputType}-input-error-message`);
  displayedError.classList.remove("no-error-message");
  displayedError.innerHTML = message;
}

function removeErrorMessage(inputElement, inputType){
  inputElement.classList.remove("input-error")
  var displayedError = document.getElementById(`${inputType}-input-error-message`);
  displayedError.innerHTML = "";
  displayedError.classList.add("no-error-message");
}


const personDetails = JSON.parse(localStorage.getItem("accounts")) || []

//Grabs the input elements and the forms from the sign up page and log in page
var fnameInput = document.getElementById("fname");
var lnameInput = document.getElementById("lname");
var emailInput = document.getElementById("email");
var usernameInput = document.getElementById("username");
var passwordInput = document.getElementById("password");
var verifyPasswordInput = document.getElementById("verify-password");
var logInEmailInput = document.getElementById("login-email");
var logInPasswordInput = document.getElementById("login-password");
var logInForm = document.getElementById("log-in-form");
var signUpForm = document.getElementById("sign-up-form");
var inputFields = document.querySelectorAll(".field-input");
let signedIn = false;
// could also do...
// var fnameInput = singUpForm['fname'], as long as the input has a name attribute assigned in the HTML file

function isSignedIn(id) {
if(JSON.parse(localStorage.getItem('accounts'))[id].signedIn) {
  JSON.parse(localStorage.getItem('accounts'))[id].signedIn = false;
  document.getElementById("sign-up-btn").style.display = "inline";
  document.getElementById("log-out-btn").style.display = "none";
}else{
  JSON.parse(localStorage.getItem('accounts'))[id].signedIn = true;
  document.getElementById("sign-up-btn").style.display = "none";
  document.getElementById("log-out-btn").style.display = "inline";
}
}

inputFields.forEach(inputElement => {
  inputElement.addEventListener("blur", e => {
    if (e.target.id === "username" && e.target.value.length > 0 && e.target.value.length < 6){
      setErrorMessage(inputElement, e.target.id, "Please enter a username with at least 6 characters")
    }else if(e.target.id === "password" && e.target.value.length > 0 && e.target.value.length < 8) {
      setErrorMessage(inputElement, e.target.id, "Please enter a password with at least 8 characters")
    }else if(e.target.id === "verify-password" && e.target.value !== passwordInput.value) {
      setErrorMessage(verifyPasswordInput, e.target.id, "Your passwords do not match")
    }
  })

  inputElement.addEventListener("input", e => {
    if (e.target.id === "username" && e.target.value.length >= 6){
      removeErrorMessage(inputElement, e.target.id)
    }else if(e.target.id === "password" && e.target.value.length >= 8) {
      removeErrorMessage(inputElement, e.target.id)
    }else if(e.target.id === "verify-password" && e.target.value === passwordInput.value) {
      removeErrorMessage(inputElement, e.target.id)
    }else if(e.target.id === "email") {
      removeErrorMessage(inputElement, e.target.id)
    }else if(e.target.id === "login-email"){
      removeErrorMessage(inputElement, e.target.id)
    }else if(e.target.id === "login-password"){
      removeErrorMessage(inputElement, e.target.id)
    }
  })
})

const addAccount = ( id, fname, lname, email, user, pass, signedIn ) => {
  personDetails.push({
    id,
    fname,
    lname,
    email,
    user,
    pass,
    signedIn,
  })
  localStorage.setItem("accounts", JSON.stringify(personDetails))

  return { id, fname, lname, email, user, pass, signedIn };
}

function submitSignUpForm(e) {
  e.preventDefault();
  var fname = fnameInput.value;
  var lname = lnameInput.value;
  var email = emailInput.value.toLowerCase();
  var user = usernameInput.value.toLowerCase();
  var pass = passwordInput.value;
  var id = personDetails.length + 1;
  var incompletePage = document.getElementById("incomplete-input-error-message");

  for (let i = 0; i < personDetails.length; i++) {
    if(email === personDetails[i].email) {
      setErrorMessage(emailInput, "email", "This email belongs to an existing account. Try logging in instead.");
    }else {
      removeErrorMessage(emailInput, "email")
    }
  }
  
  if(!document.getElementById("username-input-error-message").classList.contains("no-error-message") || !document.getElementById("password-input-error-message").classList.contains("no-error-message") || !document.getElementById("email-input-error-message").classList.contains("no-error-message")) {
    incompletePage.classList.remove("no-error-message")
    incompletePage.innerHTML = "Please complete the field(s) above."
  }else {
    addAccount(id, fname, lname, email, user, pass, signedIn);
    JSON.parse(localStorage.getItem('accounts'))[0].signedIn = true;
    //isSignedIn(id-1);
    removeErrorMessage(emailInput, "email")
    incompletePage.classList.add("no-error-message")
    incompletePage.innerHTML = "";
    usernameInput.value = "";
    //console.log(JSON.parse(localStorage.getItem('accounts'))[0].signedIn)
    //window.location.href = "index.html"
  }
}

function submitLogInForm(e) {
  e.preventDefault();
  var email = logInEmailInput.value.toLowerCase();
  var pass = logInPasswordInput.value;

  for (let i = 0; i < personDetails.length; i++) {
    if(email === personDetails[i].email && pass === personDetails[i].pass){
      removeErrorMessage(logInEmailInput, "login-email")
      removeErrorMessage(logInPasswordInput, "login-password")
      isSignedIn();
      //console.log(JSON.parse(localStorage.getItem('accounts'))[0].id)
      return;
    }
  }
  setErrorMessage(logInPasswordInput, "login-password", "This email and password combination does not exsit");
  setErrorMessage(logInEmailInput, "login-email", "");
}


signUpForm.addEventListener("submit", submitSignUpForm)
logInForm.addEventListener("submit", submitLogInForm)
    