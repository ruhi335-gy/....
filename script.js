$(document).ready(function () {
  let userName = '';

  $('#birthday-form').on('submit', function (e) {
    e.preventDefault();

    userName = $('#name').val().trim() || 'Friend';
    const birthdate = new Date($('#birthdate').val());
    const today = new Date();

    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    if (age < 0 || isNaN(age)) age = 0;

    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
      bgMusic.play().catch(() => {});
    }

    $('#birthday-message').text(`Happy birthday, ${userName}! Let's celebrate your ${age}th birthday!`);
    $('.form-container').fadeOut();
    $('#popup-1').fadeIn();
  });

  $('#celebrate-btn').on('click', function () {
    $('#popup-1').fadeOut(() => {
      $('#cake-name').text(` ${userName}`).css('opacity', 0);
      $('#popup-2').fadeIn();
      animateCakeParts(() => {
        $('#cake-name').animate({opacity: 1}, 1000, () => {
          setTimeout(() => {
            $('#popup-2').fadeOut(() => {
              $('#user-name').text(userName);
              $('#popup-3').fadeIn();
              setTimeout(playSong, 1000); // wait 1.5 sec then play song
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
    const dropSound = document.getElementById('drop-sound');
    let i = 0;

    function dropNext() {
      if (i >= parts.length) {
        if (callback) callback();
        return;
      }
      const part = $(parts[i]);
      part.css({opacity: 0, transform: 'translateY(-100px)'})
        .animate({opacity: 1}, {
          duration: 400,
          step(now) {
            part.css('transform', `translateY(${(1 - now) * -100}px)`);
          },
          complete() {
            if (dropSound) {
              dropSound.currentTime = 0;
              dropSound.play().catch(() => {});
            }
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

    // Start highlight immediately as song starts
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
      setTimeout(() => {
        $('#final-name').text(userName);
        $('#popup-3').fadeOut(() => {
          $('#popup-4').fadeIn();
          setTimeout(() => {
            location.reload();
          }, 7000); // Auto-refresh after 7 seconds
        });
      }, 2000);
    };
  }
});
