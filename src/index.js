import './index.scss';
import * as serviceWorker from './serviceWorker';
import app from './App/main' // bootstrap

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

const {$, document} = window

$(window).load(function () {
	$('.flexslider').flexslider({
		animation: "fade",
		slideshow: true,
		slideshowSpeed: 5000,
		animationSpeed: 2000,
		selector: ".slides > .slide",
		controlNav: false
	});
});

$(document).ready(function () {
	if (document.body.clientWidth < 640) {
		$(".container_left").empty();
		$(".container_left").empty();
		//$("#sta").detach().appendTo(".menu_container .container_left");
		$("#sign").remove();
		$("#sta").remove();
		$(".menu_container").on("click", function () {
			$('html, body').animate({
				scrollTop: 0
			}, 'slow');
		});
		// $("<img src='https://secured-static.greenpeace.org/taiwan/Global/taiwan/code/2019/polarBear2.png' class='polarBear' />")
		// 	.appendTo(".menu_container .container_right");
		$("<h2>立即連署</h2>").appendTo(".menu_container .container_left");
	}

	$('.phoneExample').appendTo($('.normal.phone'));

	//隱藏dd頁面的捐款按鈕
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('utm_source') === "dd") {
		$('.is-hidden-at-dd-page-only').hide();
		
		//移除電話欄位 required Attr
		$('#center_phone').removeAttr("required");
    }
});

/*
const createBirthYearList = function() {
	const yearBegin = 1900
	const birthYear = document.getElementById('en__field_supporter_NOT_TAGGED_6')
	if (birthYear) {
		let c = document.createDocumentFragment()
		let cLabel = document.createElement('option')
		for (let i = new Date().getFullYear(); i > yearBegin; i--) {
			let opt = document.createElement('option')
			opt.value = '01/01/' + i.toString()
			opt.innerHTML = i.toString()
			c.appendChild(opt)
		}
		birthYear.append(c)
	}
}
const enFormType = function() {
	const email = document.getElementById('en__field_supporter_emailAddress')
	const phone = document.getElementById('en__field_supporter_phoneNumber')
	const formFields = document.querySelectorAll('.en__field--text')
	if (email && phone) {
		email.setAttribute('type', 'email')
		phone.setAttribute('type', 'tel')
	}
	// init keyboard type
	if (formFields) {
		formFields.forEach(field => {
			let textField = field.querySelector('.en__field__input--text')
			let label = field.querySelector('.en__field__label').textContent
			textField.placeholder = label
		})
	}
	// init form label
}

createBirthYearList();
enFormType();
*/