$(document).ready(function () {
  // 🔁 Auto-redirect if opened in Instagram (Android trick)
  if (navigator.userAgent.includes("Instagram")) {
    const alreadyRedirected = sessionStorage.getItem('redirectedFromInstagram');
    if (!alreadyRedirected) {
      sessionStorage.setItem('redirectedFromInstagram', 'true');
      window.location.href = window.location.href;
    }
  }

  let userName = '';

  // Utility function to focus popup content for accessibility
  function focusPopup(popupId) {
    const popup = $(`#${popupId}`);
    popup.show();
    popup.find('.popup-content').attr('tabindex', -1).focus();
  }

  $('#birthday-form').on('submit', function (e) {
    e.preventDefault();

    userName = $('#name').val().trim() || 'Friend';
    const birthdateStr = $('#birthdate').val();
    if (!birthdateStr) {
      alert('Please enter a valid birthdate.');
      return;
    }
    const birthdate = new Date(birthdateStr);
    const today = new Date();

    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    if (age < 0 || isNaN(age)) age = 0;

    const bgMusic = document.getElementById('bg-music');
    if (bgMusic && bgMusic.paused) {
      bgMusic.play().catch(() => {});
    }

    $('#birthday-message').text(`Happy birthday, ${userName}! Let's celebrate your ${age}th birthday!`);
    $('.form-container').fadeOut();
    focusPopup('popup-1');
  });

  $('#celebrate-btn').on('click', function () {
    $('#popup-1').fadeOut(() => {
      $('#cake-name').text(` ${userName}`).css('opacity', 0);
      focusPopup('popup-2');
      animateCakeParts(() => {
        $('#cake-name').animate({ opacity: 1 }, 1000, () => {
          setTimeout(() => {
            $('#popup-2').fadeOut(() => {
              $('#user-name').text(userName);
              focusPopup('popup-3');
              setTimeout(playSong, 1000);
            });
          }, 1200);
        });
      });
    });
  });

  function animateCakeParts(callback) {
    const parts = [
      '#plate', '#base', '#frosting', '#middle', '#top',
      '#candle1', '#candle2', '#candle3',
      '#flame1', '#flame2', '#flame3'
    ];
    let i = 0;

    function dropNext() {
      if (i >= parts.length) {
        if (callback) callback();
        return;
      }
      const part = $(parts[i]);
      part.css({ opacity: 0, transform: 'translateY(-100px)' })
        .animate({ opacity: 1 }, {
          duration: 400,
          step(now) {
            part.css('transform', `translateY(${(1 - now) * -100}px)`);
          },
          complete() {
            i++;
            setTimeout(dropNext, 150);
          }
        });
    }
    dropNext();
  }

  function playSong() {
    const lines = $('.song .line');
    const audio = document.getElementById('birthday-audio');
    const bgMusic = document.getElementById('bg-music');

    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }

    audio.play();

    let i = 0;
    const interval = setInterval(() => {
      lines.removeClass('active');
      if (i < lines.length) {
        $(lines[i]).addClass('active');
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1450);

    audio.onended = () => {
      if (bgMusic) {
        bgMusic.play().catch(() => {});
      }
      setTimeout(() => {
        $('#final-name').text(userName);
        $('#popup-3').fadeOut(() => {
          focusPopup('popup-4');
          setTimeout(() => {
            location.reload();
          }, 7000);
        });
      }, 2000);
    };
  }

  $('#thankyou-btn').on('click', function () {
    const thankYouMessage = `Thank you so much for the wonderful birthday wishes! 🎉🎂😊 - ${userName}`;
    const encodedMessage = encodeURIComponent(thankYouMessage);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  });
});
