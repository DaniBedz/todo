$(document).ready(function () {
	
	$('ul.switcher li').click(function () {
		var tab_id = $(this).attr('data-tab');

		$('li').removeClass('active');
		$('div.tab-pane').removeClass('active');

		$(this).addClass('active');
		$("#" + tab_id).addClass('active');
	})
})

// Add curved corners
const signupTab = document.querySelector("[data-tab='sign_up']");
signupTab.addEventListener('click', e => {
	loginTab.classList.add('signup-selected-login');
	signupTab.classList.add('signup-selected-signup');
	loginTab.classList.remove('login-selected-login');
	signupTab.classList.remove('login-selected-signup');
	console.log(signupTab);
});

const loginTab = document.querySelector("[data-tab='login']");
loginTab.addEventListener('click', e => {
	loginTab.classList.add('login-selected-login');
	signupTab.classList.add('login-selected-signup');
	loginTab.classList.remove('signup-selected-login')
	signupTab.classList.remove('signup-selected-signup');
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
	const loginBtn = document.getElementById('login-btn');
	loginBtn.innerText = 'Logging in..'
	const loginEmail = loginForm['login_username'].value;
	const loginPassword = loginForm['login_password'].value;
	auth.signInWithEmailAndPassword(loginEmail, loginPassword).then(() => {
		console.log('Logged in successfully');
		alertify.notify('<strong class="font__weight-semibold"><i class="start-icon fa fa-thumbs-up faa-bounce animated ml-n2"></i>&nbsp;&nbsp;Log in successful.</strong>', 'success', 5);
		location = 'index.html';
	}).catch(err => {
	  loginBtn.innerText = 'Log In'
		console.log(err.message);
		alertify.notify(`<strong class="font__weight-semibold"><i class="start-icon fa fa-exclamation-triangle faa-shake animated ml-n2"></i>&nbsp;&nbsp;Error! </strong>&nbsp;${err.message}`, 'error', 5);
	})
})

// Already signed up?
const signedUp = document.getElementById('signed-up');
const loginTabBtn = document.getElementById('login-tab-btn');
signedUp.addEventListener('click', e => {
	e.preventDefault();
	loginTabBtn.click();
});