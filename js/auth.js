$(document).ready(function () {
	
	$('ul.switcher li').click(function () {
		var tab_id = $(this).attr('data-tab');

		$('li').removeClass('active');
		$('div.tab-pane').removeClass('active');

		$(this).addClass('active');
		$("#" + tab_id).addClass('active');
	})
})

// Style tabs
const signupTab = document.querySelector("[data-tab='sign_up']");
signupTab.addEventListener('click', e => {
	loginTab.classList.add('signup-selected-login');
	signupTab.classList.add('signup-selected-signup');
	loginTab.classList.remove('login-selected-login');
	signupTab.classList.remove('login-selected-signup');
});

const loginTab = document.querySelector("[data-tab='login']");
loginTab.addEventListener('click', e => {
	const loginBtn = document.querySelector('#login-btn');
	const passwordField = document.querySelector('#login_password');
	loginBtn.innerText = "Log In";
	passwordField.style.display = 'block';
	loginTab.classList.add('login-selected-login');
	signupTab.classList.add('login-selected-signup');
	loginTab.classList.remove('signup-selected-login')
	signupTab.classList.remove('signup-selected-signup');

});

// Password reset
const passwordField = document.querySelector('#login_password');
function passwordReset(emailAddress) {
	const auth = firebase.auth();
	auth.sendPasswordResetEmail(emailAddress).then(function () {
		const loginBtn = document.querySelector('#login-btn');
		loginBtn.innerText = "Log In";
		passwordField.style.display = 'block';
			alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Successfully sent password reset - please check your email!</strong>', 'success', 5);
		}).catch(function (error) {
			alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error! </strong>&nbsp;${error.message}`, 'error', 4);
		});
}

const resetPasswordLink = document.querySelector('#password-reset');
const loginBtn = document.querySelector('#login-btn');
resetPasswordLink.addEventListener('click', e => {
	if (resetPasswordLink.innerText === "Forgot your password?") {
		const passwordField = document.querySelector('#login_password');
		resetPasswordLink.innerHTML = `<label><a href="#">Return to Log In</a></label>`;
		loginBtn.innerText = "Reset Password";
		passwordField.style.display = 'none';	
	} else {
		resetPasswordLink.innerHTML = `<label><a href="#">Forgot your password?</a></label>`;
		loginBtn.innerText = "Log In";
		passwordField.style.display = 'block';
	}
});




loginBtn.addEventListener('click', e => {
	const loginEmail = loginForm['login_username'].value;
	if (loginEmail && loginBtn.innerText === 'Reset Password') {
		passwordReset(loginEmail);
	} else {
		alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error! </strong>&nbsp;Please enter your email address.`, 'error', 4);
	}
});

if (localStorage.getItem("loginState") == 2) {
	alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error! </strong>&nbsp;Your session has expired, please log in again to continue.`, 'error', 4);
	localStorage.setItem("loginState", 0);
} else if (localStorage.getItem("loginState") == 3) {
	  alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Successfully logged out!</strong>', 'success', 5);
		localStorage.setItem("loginState", 0);	
}

// Signup functionality
const signupForm = document.getElementById('signup_form');
signupForm.addEventListener('submit', e => {
	e.preventDefault();
	loginBtn.innerText = "Log In";
	passwordField.style.display = 'block';
	resetPasswordLink.innerHTML = `<label><a href="#">Forgot your password?</a></label>`;
	const signupBtn = document.getElementById('signup-btn');
	signupBtn.innerText = "Signing up.."
	const signupEmail = signupForm['signup_username'].value;
	const signupPassword = signupForm['signup_password'].value;
	const signupPassword2 = signupForm['signup_password2'].value;

	if (signupPassword !== signupPassword2) {
		alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Passwords do not match! </strong>&nbsp;Please try again.', 'error', 5);
	} else {
		auth.createUserWithEmailAndPassword(signupEmail, signupPassword)
			.then((cred) => {
			alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Sign-up successful, please log in.</strong>', 'success', 5);
			document.getElementById('login-tab-btn').click();
			return fs.collection('users').doc(cred.user.uid).set({
				Email: signupEmail,
				Password: signupPassword
			})
				.catch(err => {
				signupForm['signup_password'].value = '';
				signupForm['signup_password'].value = '';
				console.log(err.message);
				alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error! </strong>&nbsp;${err.message}`, 'error', 5);
			})
			})
			.catch(err => {
				signupBtn.innerText = "Sign Up"
				signupForm['signup_password'].value = '';
				signupForm['signup_password2'].value = '';
				console.log(err.message);
				alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error! </strong>&nbsp;${err.message}`, 'error', 5);
			})
	}
});

// Login functionality
const loginForm = document.getElementById('login_form');
loginForm.addEventListener('submit', e => {
	e.preventDefault();
	const loginEmail = loginForm['login_username'].value;
	const loginBtn = document.getElementById('login-btn');
	if (loginBtn.innerText === 'Log In') {
		const loginPassword = loginForm['login_password'].value;
		loginBtn.innerText = 'Logging in..'
		auth.signInWithEmailAndPassword(loginEmail, loginPassword).then(() => {
			console.log('Logged in successfully');
			alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Log in successful.</strong>', 'success', 5);
			location = 'index.html';
		}).catch(err => {
			loginBtn.innerText = 'Log In'
			console.log(err.message);
			alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error! </strong>&nbsp;${err.message}`, 'error', 5);
		})
	}
});

// Already signed up?
const signedUp = document.getElementById('signed-up');
const loginTabBtn = document.getElementById('login-tab-btn');
signedUp.addEventListener('click', e => {
	e.preventDefault();
	resetPasswordLink.innerHTML = `<label><a href="#">Forgot your password?</a></label>`;
	loginBtn.innerText = "Log In";
	passwordField.style.display = 'block';
	loginTabBtn.click();
});