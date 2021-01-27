// Check if user is logged in and redirect if so
setTimeout(() => {
	if (auth.currentUser) {
		window.location.href = 'tasklist.html';
	};
}, 1500);

// Selectors
const passwordField = document.querySelector('#login_password');
const resetPasswordLink = document.querySelector('#password-reset');
const loginBtn = document.querySelector('#login-btn');
const loginTab = document.querySelector("[data-tab='login']");
const signupTab = document.querySelector("[data-tab='sign_up']");
const loginForm = document.getElementById('login_form');
const signupForm = document.getElementById('signup_form');
const signedUp = document.getElementById('signed-up');

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
signupTab.addEventListener('click', e => {
	loginTab.classList.add('signup-selected-login');
	signupTab.classList.add('signup-selected-signup');
	loginTab.classList.remove('login-selected-login');
	signupTab.classList.remove('login-selected-signup');
});

loginTab.addEventListener('click', e => {
	loginBtn.innerText = "Log In";
	passwordField.style.display = 'block';
	loginTab.classList.add('login-selected-login');
	signupTab.classList.add('login-selected-signup');
	loginTab.classList.remove('signup-selected-login')
	signupTab.classList.remove('signup-selected-signup');

});

// Password reset
function passwordReset(emailAddress) {
	loginBtn.innerText = "Resetting password..";
	const auth = firebase.auth();
	auth.sendPasswordResetEmail(emailAddress).then(function () {
		loginBtn.innerText = "Log In";
		passwordField.style.display = 'block';
		resetPasswordLink.innerHTML = `<label><a href="#">Forgot your password?</a></label>`;
		alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Successfully sent password reset - please check your email!</strong>', 'success', 5);
	}).catch(function (error) {
	  loginBtn.innerText = "Reset Password";	
	  alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error! </strong>&nbsp;${error.message}`, 'error', 4);
		});
}

resetPasswordLink.addEventListener('click', e => {
	if (resetPasswordLink.innerText === "Forgot your password?") {
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
	} else if (loginBtn.innerText === 'Reset Password'){
		alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error! </strong>&nbsp;Please enter your email address.`, 'error', 4);
	}
});

if (localStorage.getItem("loginState") == 2) {
	alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-info-circle faa-shake animated ml-n2"></i>&nbsp;&nbsp;</strong>&nbsp;Please log in or sign up to continue.`, 'notify', 6);
	localStorage.setItem("loginState", 0);
} else if (localStorage.getItem("loginState") == 3) {
	  alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Successfully logged out!</strong>', 'success', 5);
		localStorage.setItem("loginState", 0);	
}

// Signup functionality
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
			fs.collection('users').doc(cred.user.uid).set({
					Email: signupEmail,
					Password: signupPassword
				});
				fs.collection('todos').doc(cred.user.uid).set({
					tasks: '[]'
				})
				fs.collection('customAssignees').doc(cred.user.uid).set({
					customAssignees: '[]'
				})
			})
				.catch(err => {
				signupForm['signup_password'].value = '';
				signupForm['signup_password'].value = '';
				console.log(err.message);
				alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error! </strong>&nbsp;${err.message}`, 'error', 5);
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
loginForm.addEventListener('submit', e => {
	e.preventDefault();
	const loginEmail = loginForm['login_username'].value;
	const loginBtn = document.getElementById('login-btn');
	if (loginBtn.innerText === 'Log In') {
		const loginPassword = loginForm['login_password'].value;
		loginBtn.innerText = 'Logging in..'
		auth.signInWithEmailAndPassword(loginEmail, loginPassword).then(() => {
			window.location.href = 'tasklist.html';
		}).catch(err => {
			loginBtn.innerText = 'Log In'
			alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error! </strong>&nbsp;${err.message}`, 'error', 5);
		})
	}
});

// Already signed up?
signedUp.addEventListener('click', e => {
	e.preventDefault();
	resetPasswordLink.innerHTML = `<label><a href="#">Forgot your password?</a></label>`;
	loginBtn.innerText = "Log In";
	passwordField.style.display = 'block';
	loginTab.click();
});