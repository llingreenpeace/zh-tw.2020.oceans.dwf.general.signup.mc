/**
 * Scripts by Garry
 */
// default email content options
var optionName = [
    '通用版',
    '學生版',
    '上班族版',
    '家庭主婦版'
]

var optionsHTML = '';
for (let index in optionName) {
    optionsHTML += `<button type="button" onclick="changeEmailContent(${index})" class="btn btn-outline-secondary">${optionName[index]}</button>`
}
$('#changeEmailOptions').html(optionsHTML)

var optionContent = [
`董事長 李文宏先生，您好：
我是一位守護海洋的公民，我不願意購買不合法的水產、海鮮。
我請求您拒絕收購來自非法漁船、涉及人口販運和漁工剝削的非法漁獲！
身為全球海鮮龍頭的豐群水產，您有責任義務，承諾邁向永續漁業，應訂定相關企業規範，要求旗下所有魚貨供應漁船確實遵守，擴大永續漁獲採購準則，杜絕來自非法與勞工剝削漁船的漁獲！
`,
`董事長 李文宏先生，您好：
我是一名 學生，我不希望食用、購買非法漁獲。
我請求您拒絕收購來自非法漁船、涉及人口販運和漁工剝削的非法漁獲！
身為全球海鮮龍頭的豐群水產，您有責任義務，承諾邁向永續漁業，應訂定相關企業規範，要求旗下所有魚貨供應漁船確實遵守，擴大永續漁獲採購準則，杜絕來自非法與勞工剝削漁船的漁獲！
`,
`董事長 李文宏先生，您好：
我是一名 上班族，我請求您拒絕收購來自非法漁船、涉及人口販運和漁工剝削的非法漁獲！
身為全球海鮮龍頭的豐群水產，您有責任義務，承諾邁向永續漁業，追求企業社會責任，應訂定相關企業規範，要求旗下所有魚貨供應漁船確實遵守，擴大永續漁獲採購準則，杜絕來自非法與勞工剝削漁船的漁獲！
`,
`董事長 李文宏先生，您好：
我是一名 家庭主婦，是家中食物採購的主要決策者，我請求您拒絕收購來自非法漁船、涉及人口販運和漁工剝削的非法漁獲！
身為全球海鮮龍頭的豐群水產，您有責任義務，承諾邁向永續漁業，應訂定相關企業規範，要求旗下所有魚貨供應漁船確實遵守，擴大永續漁獲採購準則，杜絕來自非法與勞工剝削漁船的漁獲！
`
]

function changeEmailContent (index) {
    console.log(index)
    $('#modalEmailContent').html(optionContent[index]);
}

function saveEmailContent () {
    $('[name="contact.subject"]').val($('#modalEmailSubject').val());
    $('[name="contact.message"]').html($('#modalEmailContent').html());
    $('#toTargetContentModal').modal('hide');
}



$('.main_form').appendTo('#form_replace')

var targetFormHTNL = `
<div class="target-form-container">信件內容
    <div id="target_form_replace"></div>
    <div class="target-edit-btn">
        <button class="btn btn-light btn-sm" data-target="#toTargetContentModal" data-toggle="modal"
            type="button">修改內容</button>
    </div>
</div>`

// active modal btn event
$('#toTargetContentModal').on('show.bs.modal', function (e) {
    // console.log('modal called');
    var subject = $('[name="contact.subject"]').val();
    // console.log(subject);
    var content = $('[name="contact.message"]').html();
    // console.log(content);
    $('#modalEmailSubject').val(subject);
    $('#modalEmailContent').html(content);
});


// modalEmailContentOption1


$(targetFormHTNL).insertBefore('.en__field--checkbox');
$('.en__component--contactblock').appendTo('#target_form_replace')

// var formActionURL = $('form.en__component--page').attr('action');
var formActionURL = "https://act.greenpeace.org/page/56407/action/2"
console.log(formActionURL)

// using ajax post
$('.en__component--page').removeAttr('action');
$('.en__component--page').attr('onsubmit', 'formSubmit(this);return false;');

function formSubmit() {
    console.log('form submitting !')
    $('.en__submit button').prop('disabled', true);
    $('input[name="supporter.emailAddress"]').val($('input[name="supporter.emailAddress"]').val().trim());
    setTimeout(function () {
        if ($('.en__field__error').length == 0) {
            // check if there is any errors present
            let data = $('form.en__component--page').serializeArray();
            // let dataS = $('form.en__component--page').serialize();

            let formData = new URLSearchParams();
            for (var d of data) {
                formData.append(d.name, d.value);
            }
            
            axios.post(formActionURL, formData, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(res => {
                // console.log(res.data)
                let msg = res.data
                console.log(msg)
                if (~msg.indexOf('謝謝您於關鍵時刻為海洋發聲！')) {
                    window.dataLayer = window.dataLayer || []
                    dataLayer.push({
                        event: 'formSubmitted'
                    })
                    //
                    console.log('success')
                    if (redirectUrl) {
                        window.location.href = redirectUrl
                    } else {
                        $('html,body').animate({
                            scrollTop: 0
                        });
                        $('.sidebar').addClass('share')
                    }
                } else if (
                    ~msg.indexOf('not a valid email address. Can you try again?')
                ) {
                    console.log('email error')
                    $('#en__field_supporter_emailAddress')
                        .parent()
                        .prepend(
                            '<div class="en__field__error">Please enter a valid Email</div>'
                        )
                    $('.en__submit button').prop('disabled', false)
                } else {
                    console.log('error')
                    $('.en__submit button').prop('disabled', false)
                }

            }).catch(err => {
                console.log(err)

            })
            // return 
            // $.ajax({
            //     method: 'POST',
            //     url: formActionURL,
            //     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            //     data: formData,
            // }).done(function (msg) {
            //     console.log(msg)
            //     console.log(msg.indexOf('感謝您支持！'));
            //     if (~msg.indexOf('感謝您支持！')) {
            //         window.dataLayer = window.dataLayer || []
            //         dataLayer.push({
            //             event: 'formSubmitted'
            //         })
            //         //
            //         console.log('success')
            //         if (redirectUrl) {
            //             // window.location.href = redirectUrl
            //         } else {
            //             $('html,body').animate({
            //                 scrollTop: 0
            //             });
            //             $('.sidebar').addClass('share')
            //         }
            //     } else if (
            //         ~msg.indexOf('not a valid email address. Can you try again?')
            //     ) {
            //         console.log('email error')
            //         $('#en__field_supporter_emailAddress')
            //             .parent()
            //             .prepend(
            //                 '<div class="en__field__error">Please enter a valid Email</div>'
            //             )
            //         $('.en__submit button').prop('disabled', false)
            //     } else {
            //         console.log('error')
            //         $('.en__submit button').prop('disabled', false)
            //     }
            // })
        } else {
            console.log('error') // console log error if any ajax errors are found
            $('.en__submit button').prop('disabled', false)
        }
    }, 150);
}

$(document).ready(function () {
    var targetElement = document.querySelector(".sidebar_content.form");
    var targetElement2 = document.querySelector(".sidebar_content.signed");
    bodyScrollLock.disableBodyScroll(targetElement);
    bodyScrollLock.disableBodyScroll(targetElement2);
    if (typeof (reverseScroll) != "undefined") {
        if (reverseScroll) {
            $('.en__component--row--1')
                .first()
                .addClass('active')
        } else {
            $('.en__component--row--1')
                .last()
                .addClass('active')
        }
    } else {
        $('.en__component--row--1')
            .last()
            .addClass('active')
    }


    if ($(window).width() < 767) {
        if (typeof $.fn.fullpage.destroy == 'function') {
            $.fn.fullpage.destroy('all');
        }
    } else {
        $('.en__component--page').fullpage({
            sectionSelector: '.en__component--row--1',
            scrollingSpeed: 1000,
            verticalCentered: false,
            responsiveWidth: 767,
            normalScrollElements: '.sidebar',
            onLeave: function (index, nextIndex, direction) {

                // console.log(direction)
                if (direction === 'up') {
                    $('.fullpage-wrapper .fp-section').removeClass('down')
                    $('.fp-section:eq(' + index + ')').addClass('down')
                    $('.fp-section:eq(' + (index - 1) + ')').addClass('down')
                } else if (direction === 'down') {
                    $('.fp-section:eq(' + (index - 1) + ')').removeClass('down')
                    $('.fp-section:eq(' + (index - 2) + ')').removeClass('down')
                }

                if (direction === 'down') {
                    $('.fullpage-wrapper .fp-section').removeClass('down')
                    $('.fp-section:eq(' + index + ')').addClass('down')
                    $('.fp-section:eq(' + (index - 1) + ')').addClass('down')
                } else if (direction === 'up') {
                    $('.fp-section:eq(' + (index - 1) + ')').removeClass('down')
                    $('.fp-section:eq(' + (index - 2) + ')').removeClass('down')
                }

            },
            afterLoad: function (aL, index) {
                $('.fp-section:not(:eq(' + (index - 1) + '))').removeClass('down')
            }
        })
    }



    $('.en__field--text').each(function () {
        $(this)
            .find('.en__field__input--text')
            .attr(
                'placeholder',
                $(this)
                .children('.en__field__label')
                .html()
            )
    })


    // $('.en__field--checkbox')
    //   .last()
    //   .appendTo('.opt_label')

    // show labels for triple select fields (needed for dob field)
    $('.en__field--tripleselect').each(function () {
        $(this)
            .find('label')
            .css('display', 'block')
    })

    $('.en__field__label').each(function (i) {
        // console.log($(this).html())
        if ($(this).html().length < 2) {
            $(this).attr('style', 'display:none !important');
        }
    })

    var ogTitle = jQuery('meta[property="og:title"]').attr('content')
    var ogDescription = jQuery('meta[property="og:description"]').attr('content')
    var ogImage = jQuery('meta[property="og:image"]').attr('content')

    $('#facebook_img').attr('src', ogImage)
    $('#facebook_img').attr('alt', ogTitle)
    $('#facebook_title').html(ogTitle)
    $('#facebook_desc').html(ogDescription)

    if (typeof facebookShareURL !== 'undefined') {
        facebookShareURL = encodeURIComponent(facebookShareURL)
    } else {
        var facebookShareURL
        facebookShareURL = encodeURIComponent(window.location.href)
    }
    $('.facebook_button').attr(
        'href',
        'https://www.facebook.com/sharer/sharer.php?u=' + facebookShareURL
    )

    if (typeof facebookShareURL !== 'undefined') {
        facebookShareURL = encodeURIComponent(facebookShareURL)
    } else {
        var facebookShareURL
        facebookShareURL = encodeURIComponent(window.location.href)
    }

    if (typeof twitterCopy !== 'undefined') {
        twitterCopy = encodeURIComponent(twitterCopy)
        $('.twitter_button').attr(
            'href',
            'http://www.twitter.com/intent/tweet?text=' + twitterCopy
        )
    }

    if (typeof emailSubject !== 'undefined') {
        emailSubject = encodeURIComponent(emailSubject)
        var emailBody = encodeURIComponent($('#email_body').val())
        $('.email_button').attr(
            'href',
            'mailto:?%20&subject=' + emailSubject + '&body=' + emailBody
        )
    }

    if (typeof showTwitter == 'undefined' || !showTwitter) {
        $('.twitter_button').hide()
    }

    if (typeof showEmail == 'undefined' || !showEmail) {
        $('.email_button').hide()
    }

    $(document).on('click', '.facebook_button, .facebook_wrap', function (e) {
        e.preventDefault();
        window.open(
            $('a.facebook_button').attr('href'),
            'fbShareWindow',
            'height=450, width=550, top=' +
            ($(window).height() / 2 - 275) +
            ', left=' +
            ($(window).width() / 2 - 225) +
            ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
        );
    })

    $(document).on('click', '.twitter_button', function (e) {
        e.preventDefault();
        window.open(
            $('a.twitter_button').attr('href'),
            'fbShareWindow',
            'height=450, width=550, top=' +
            ($(window).height() / 2 - 275) +
            ', left=' +
            ($(window).width() / 2 - 225) +
            ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
        );
    })

    $(document).on('click', '.whatsapp_button', function (e) {
        e.preventDefault();
        window.open(
            'whatsapp://send?text=' + encodeURIComponent(whatsappCopy),
            '_blank'
        );
    })

    /* ******************************************* */
    /* CUSTOM VARIABLES - CHANGE FOR YOUR CAMPAIGN */
    /* ******************************************* */

    /* Set the Identifier for the Ticket HTML Element */
    var tickerElementId = '#ticker'

    /* Set the campaign for the global petition counter */
    // var counterCampaign = "antarctic";

    /* ***************************** */
    /* START OF SCRIPT - DO NOT EDIT */
    /* ***************************** */

    /* Get Petition Count */
    $.ajax({
        type: 'GET',
        url: counterBaseUrl,
        dataType: 'json',
        success: function (response) {
            ticker(response.unique_count, tickerElementId);
            setBar(response.unique_count);
        }
    })

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function setBar(n) {
        var total
        switch (true) {
            case n < 1000:
                total = 5000
                break
            case n >= 1000 && n < 5000:
                total = 10000
                break
            case n >= 5000 && n < 10000:
                total = 20000
                break
            case n >= 10000 && n < 50000:
                total = 100000
                break
            case n >= 50000 && n < 150000:
                total = 200000
                break
            case n >= 150000 && n < 200000:
                total = 250000
                break
            case n >= 200000 && n < 300000:
                total = 350000
                break
            case n >= 300000 && n < 400000:
                total = 450000
                break
            case n >= 400000 && n < 500000:
                total = 550000
                break
            case n >= 500000 && n < 1000000:
                total = 1000000
                break
            case n >= 1000000 && n < 2000000:
                total = 2000000
                break
            case n >= 2000000 && n < 3000000:
                total = 3000000
                break
            case n >= 3000000 && n < 4000000:
                total = 4000000
                break
            case n >= 4000000 && n < 5000000:
                total = 5000000
                break
            case n >= 5000000 && n < 6000000:
                total = 6000000
                break
            case n >= 6000000 && n < 7000000:
                total = 7000000
                break
            case n >= 8000000 && n < 9000000:
                total = 9000000
                break
            case n >= 9000000 && n < 10000000:
                total = 10000000
                break
            default:
                total = 20000000
        }
        $('#total').html(numberWithCommas(total));
        $('.thermom_tooltip').addClass('animateIn');
        var perc = Math.round((n / total) * 100);
        $('.bar').css('max-height', perc + '%');
    }

    function ticker(n, identifier) {
        /* Update the value */
        $(identifier).text(n)
        /* Perform animation */
        $(identifier).each(function () {
            $(this)
                .prop('Counter', 0)
                .animate({
                    Counter: $(this).text()
                }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now))
                    },
                    /* Add comma */
                    complete: function () {
                        $(identifier).text(numberWithCommas(n))
                    }
                })
        })
    }

    $('input[name="supporter.emailAddress"]').on('change', function (e) {
        // console.log('test');
        $('input[name="supporter.emailAddress"]').val($('input[name="supporter.emailAddress"]').val().trim())
    })


    // $('form').on('submit', function(e) {
    //     e.preventDefault();
    //     console.log('form submitting !')
    //     $('.en__submit button').prop('disabled', true);
    //     $('input[name="supporter.emailAddress"]').val($('input[name="supporter.emailAddress"]').val().trim());
    //     setTimeout(function() {
    //         if ($('.en__field__error').length == 0) {
    //             // check if there is any errors present
    //             let data = $('form.en__component--page').serialize();
    //             console.log(data);
    //             console.log($('form.en__component--page').attr('action'))
    //             // return
    //             $.ajax({
    //                 method: 'POST',
    //                 url: $('form.en__component--page').attr('action'),
    //                 data: data
    //             }).done(function(msg) {
    // 				console.log(msg.indexOf('謝謝您參與連署！'));
    //                 if (~msg.indexOf('謝謝您參與連署！')) {
    //                     window.dataLayer = window.dataLayer || []
    //                     dataLayer.push({
    //                         event: 'formSubmitted'
    //                     })

    //                     //
    //                     console.log('success')
    //                     if (redirectUrl) {
    //                         // window.location.href = redirectUrl
    //                     } else {
    //                         $('html,body').animate({
    //                             scrollTop: 0
    //                         });
    //                         $('.sidebar').addClass('share')
    //                     }
    //                 } else if (
    //                     ~msg.indexOf('not a valid email address. Can you try again?')
    //                 ) {
    //                     console.log('email error')
    //                     $('#en__field_supporter_emailAddress')
    //                         .parent()
    //                         .prepend(
    //                             '<div class="en__field__error">Please enter a valid Email</div>'
    //                         )
    //                     $('.en__submit button').prop('disabled', false)
    //                 } else {
    //                     console.log('error')
    //                     $('.en__submit button').prop('disabled', false)
    //                 }
    //             })
    //         } else {
    //             console.log('error') // console log error if any ajax errors are found
    //             $('.en__submit button').prop('disabled', false)
    //         }
    //     }, 150)
    // })

    $('.scroll_icon').on('click', function () {
        if ($(this).hasClass('down')) {
            $.fn.fullpage.moveSectionDown()
        } else {
            $.fn.fullpage.moveSectionUp()
        }
    })

    $('.sidebar_content').scroll(function (e) {
        var contentScroll = $(this).scrollTop()
        if ($(window).width() < 767) {
            $('.thermom_tooltip').css('top', 16 - contentScroll + 'px')
        } else {
            $('.thermom_tooltip').css('top', 30 - contentScroll + 'px')
        }
    })

    $(window).resize(function () {
        var contentScroll = $('.sidebar_content').scrollTop()
        if ($(window).width() < 767) {
            $('.thermom_tooltip').css('top', 16 - contentScroll + 'px')
            if (typeof $.fn.fullpage.destroy == 'function') {
                $.fn.fullpage.destroy('all');
            }
        } else {
            if (!$('html').hasClass('fp-enabled')) {
                $('.en__component--page').fullpage({
                    sectionSelector: '.en__component--row--1',
                    scrollingSpeed: 1000,
                    verticalCentered: false,
                    responsiveWidth: 767,
                    normalScrollElements: '.sidebar',
                    onLeave: function (index, nextIndex, direction) {
                        if (direction === 'down') {
                            $('.fullpage-wrapper .fp-section').removeClass('down')
                            $('.fp-section:eq(' + index + ')').addClass('down')
                            $('.fp-section:eq(' + (index - 1) + ')').addClass('down')
                        } else if (direction === 'up') {
                            $('.fp-section:eq(' + (index - 1) + ')').removeClass('down')
                            $('.fp-section:eq(' + (index - 2) + ')').removeClass('down')
                        }
                    },
                    afterLoad: function (aL, index) {
                        $('.fp-section:not(:eq(' + (index - 1) + '))').removeClass('down')
                    }
                })
            }

            $('.thermom_tooltip').css('top', 30 - contentScroll + 'px')
        }
    })
});


$('#en__field_supporter_emailAddress').attr("autocorrect", "off");
$('#en__field_supporter_emailAddress').attr("autocapitalize", "off");

$('.privacy').append()