var ProgressBar = require('progressbar.js')
const {$, anime, autosize, Cookies, Highcharts, dataLayer} = window

const donateUrl = "https://supporter.ea.greenpeace.org/tw/s/donate?ref=2020-oceans_dwf_thankyou_page&campaign=oceans";
const shareUrl = "https://cloud.greentw.greenpeace.org/petition-oceans-dwf?utm_campaign=2020-dwf&utm_source=facebook&utm_medium=socialorganic&utm_content=2020-dwv_petition_tkpage";
const shareFBUrl = "https://cloud.greentw.greenpeace.org/petition-oceans-dwf?utm_campaign=2020-dwf&utm_source=facebook&utm_medium=socialorganic&utm_content=2020-dwv_petition_tkpage";
const shareLineUrl = "https://cloud.greentw.greenpeace.org/petition-oceans-dwf?utm_campaign=2020-dwf&utm_source=facebook&utm_medium=socialorganic&utm_content=2020-dwv_petition_tkpage";
const redirectDonateLink = "https://supporter.ea.greenpeace.org/tw/s/donate?ref=2020-oceans_dwf_thankyou_page&campaign=oceans"

window.donate = () => {
	window.open(
		donateUrl,
		"_blank"
	);
}

window.share = () => {
	if (navigator.share) {
		// we can use web share!
		navigator
			.share({
				title: "我守護漁工人權，支持海洋永續！",
				text: "身為遠洋漁業強權，我們更應該帶領改變，守護漁工人權，現在就加入連署，用您的行動，督促產業進步、守護漁工人權，成為其他國家的典範。",
				url: shareUrl
			})
			.catch(error => console.log("Error sharing:", error));
	} else {
		var baseURL = "https://www.facebook.com/sharer/sharer.php";

		//console.log('open', baseURL + "?u=" + encodeURIComponent(shareFBUrl))
		window.open(
			baseURL + "?u=" + encodeURIComponent(shareFBUrl),
			"_blank"
		);
	}
}

function initProgressBar() {
    let barTarget = document.querySelector('input[name="numSignupTarget"]').value ? parseInt(document.querySelector('input[name="numSignupTarget"]').value, 10) : 0;
    let barNumber = document.querySelector('input[name="numResponses"]').value ? parseInt(document.querySelector('input[name="numResponses"]').value, 10) : 0;
	//console.log(barNumber);
    if (barNumber < 18280)
		barNumber += 18280;
	if (isNaN(barTarget) || barTarget < 50000)
	barTarget = 50000;
    if (barNumber > barTarget)
        barTarget = Math.ceil(barNumber / 10000) * 10000;
    
    $('#petition-count').html(barNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    $('#petition-target').html(barTarget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
	
    let bar = new ProgressBar.Line('#content_bar', {
        strokeWidth: 2,
        easing: 'easeInOut',
        duration: 1400,
        color: 'rgb(85, 112,71)',
        trailColor: 'transparent',
        trailWidth: 2,
        svgStyle: {width: '100%', height: '80%', borderRadius: "10px", padding: "1px 0"}
    });
    //bar.animate(0.15);
    bar.animate(barNumber / barTarget);
}

/**
 * Send the tracking event to the ga
 * @param  {string} eventLabel The ga trakcing name, normally it will be the short campaign name. ex 2019-plastic_retailer
 * @param  {[type]} eventValue Could be empty
 * @return {[type]}            [description]
 */
const sendPetitionTracking = (eventLabel, eventValue) => {
	window.dataLayer = window.dataLayer || [];

	window.dataLayer.push({
	    'event': 'gaEvent',
	    'eventCategory': 'petitions',
	    'eventAction': 'signup',
	    'eventLabel': eventLabel,
	    'eventValue' : eventValue
	});

	window.dataLayer.push({
	    'event': 'fbqEvent',
	    'contentName': eventLabel,
	    'contentCategory': 'Petition Signup'
	});

	window.uetq = window.uetq || [];  
	window.uetq.push ('event', 'signup', {'event_category': 'petitions', 'event_label': eventLabel, 'event_value': 0});
}

var pageInit = function(){
	var _ = this;
	_.$container = $('#form');

	_.$container.find('input, select').bind('change blur', function(){
		if($(this).val() !== ''){
			$(this).addClass('filled');
		}
		else{
			$(this).removeClass('filled');
		}
	});

	// create the year options
	let currYear = new Date().getFullYear()
	for (var i = 0; i < 100; i++) {

		let option = `<option value="${currYear-i}-01-01">${currYear-i}</option>`
		$("#center_yearofbirth").append(option);
		$('#en__field_supporter_NOT_TAGGED_6').append(option);
	}

	$.validator.addMethod( //override email with django email validator regex - fringe cases: "user@admin.state.in..us" or "name@website.a"
		'email',
		(value, element) => {
			if (value) {
				return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/i.test(value);
			}
	
			return true
		},
		'Email 格式錯誤'
	);

	$.validator.addMethod(
		'validate-name',
		(value, element) => {
			return new RegExp(/^[\u4e00-\u9fa5_a-zA-Z_ ]{1,40}$/i).test(value);
		},
		'姓氏格式不正確，請不要輸入數字或符號'
	);

	$.validator.addMethod(
		"taiwan-phone",
		(value, element) => {
			const phoneReg6 = new RegExp(/^(0|886|\+886)?(9\d{8})$/).test(value);
			const phoneReg7 = new RegExp(/^(0|886|\+886){1}[3-8]-?\d{6,8}$/).test(value);
			const phoneReg8 = new RegExp(/^(0|886|\+886){1}[2]-?\d{8}$/).test(value);
	
			if (value) {
				return (phoneReg6 || phoneReg7 || phoneReg8)
			}
			return true
		},
		"電話格式不正確，請只輸入數字 0912345678 和 02-23456789"
	);

	$.validator.addClassRules({ // connect it to a css class
		"email": {email: true},
		"taiwan-phone" : { "taiwan-phone" : true },
		"validate-name": { "validate-name" : true }
	});

	$("#center_sign-form").validate({
		errorPlacement: function(error, element) {
			//console.log(error)
			element.parents("div.form-field:first").after( error );
		},
		submitHandler: function(form) {
			showFullPageLoading();			

			// collect values in the mc form
			$('#mc-form [name="FirstName"]').val($('#center_name').val());
			$('#mc-form [name="LastName"]').val($('#center_lastname').val());
			$('#mc-form [name="Email"]').val($('#center_email').val());
			$('#mc-form [name="MobilePhone"]').val($('#center_phone').val());
			$('#mc-form [name="Birthdate"]').val($('#center_yearofbirth').val());
			
			$('#mc-form [name="OptIn"]').eq(0).prop("checked", $('#center_rememberme').prop('checked')); 
						
			let formData = new FormData();
			$("#mc-form input").each(function (idx, el) {
				let v = null
				if (el.type==="checkbox") {
					v = el.checked
				} else {
					v = el.value
				}

				formData.append(el.name, v)
				//console.log("Use", el.name, v)
			});
			
			// send the request			
			let postUrl = $("#mc-form").prop("action");
			fetch(postUrl, {
				method: 'POST',
				body: formData
			})
			.then(response => response.json())
			.then(response => {
				//console.log('fetch response', response);
				if (response) {
					if (response.Supporter) { // ok, go to next page
						sendPetitionTracking("2020-dwf");
					}

					hideFullPageLoading();
					changeToPage(2);
					
				  //console.log('fetch response', response);
			  	}
			})
			.catch(error => {
				hideFullPageLoading();
				//alert(error);
				//console.warn("fetch error");
				console.error(error);
			});
		},
		invalidHandler: function(event, validator) {
			// 'this' refers to the form
			var errors = validator.numberOfInvalids();
			if (errors) {
				console.log(errors)				
			}
		}
	});

	//email suggestion
	// for email correctness
	let domains = [
		"me.com",
		"outlook.com",
		"netvigator.com",
		"cloud.com",
		"live.hk",
		"msn.com",
		"gmail.com",
		"hotmail.com",
		"ymail.com",
		"yahoo.com",
		"yahoo.com.tw",
		"yahoo.com.hk"
	];
	let topLevelDomains = ["com", "net", "org"];

	var Mailcheck = require('mailcheck');
	//console.log(Mailcheck);
	$("#center_email").on('blur', function() {
		if ($('.email-suggestion').length === 0) {		
			Mailcheck.run({
				email: $("#center_email").val(),
				domains: domains, // optional
				topLevelDomains: topLevelDomains, // optional
				suggested: (suggestion) => {
					$(`<div class="email-suggestion" style="font-size:small; color:blue;">您想輸入的是 <strong id="emailSuggestion">${suggestion.full}</strong> 嗎？</div>`).insertAfter("#center_email");
					
					$(".email-suggestion").click(function() {
						$("#center_email").val($('#emailSuggestion').html());
						$('.email-suggestion').remove();
					});
				},
				empty: () => {
					this.emailSuggestion = null
				}
			});
		}
	});
}

/**
 * Switch to the page
 * @param  {int} pageNo 1 or 2
 */
const changeToPage = (pageNo) => {
	if (pageNo===1) {
		$("#page-2").hide();
	} else if (pageNo===2) {
		$('#page-1').hide();
		$('#page-2').show();

		// console.log("go to thank you page", redirectDonateLink)
		// window.location.href = redirectDonateLink;
	} else {
		throw new Error("Unkonw PageNo:"+pageNo)
	}
}

/**
 * Show the full page loading
 */
const showFullPageLoading = () => {
	if ($("#page-loading").length===0) {
		$("body").append(
			`<div id="page-loading" class="hide">
			  <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
			</div>`)
	}

	setTimeout(() => { // to enable the transition
		$("#page-loading").removeClass("hide")
	}, 0)
}

/**
 * Hide the full page loading
 */
const hideFullPageLoading = () => {
	$("#page-loading").addClass("hide")

	setTimeout(() => {
		$("#page-loading").remove()
	}, 1100)
}

const resolveEnPagePetitionStatus = () => {
	let status = "FRESH";
	// console.log(window);
	if (window.pageJson.pageNumber === 2) {
		status = "SUCC"; // succ page
	} else {
		status = "FRESH"; // start page
	}

	return status;
};

$(function(){
	const EN_PAGE_STATUS = resolveEnPagePetitionStatus()

	//console.log("EN_PAGE_STATUS", EN_PAGE_STATUS)

	if (EN_PAGE_STATUS==="FRESH") {
		pageInit();
		// $("#page-2").hide();
		changeToPage(1)
	} else if (EN_PAGE_STATUS==="SUCC") {
		// $('#page-1').hide();

		changeToPage(2)
	}
	initProgressBar();
	// pageInit();
	// changeToPage(1)
})
