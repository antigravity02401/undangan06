'use strict';
/* ============================================================
   UNDANGAN06 – app.js  (base)
   ============================================================ */

let audioPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
  readGuestName();
  startLoading();
  initVideoOverlay();
  document.body.style.overflow = 'hidden';
});

/* --- Guest name from ?to= --- */
function readGuestName() {
  const name = new URLSearchParams(window.location.search).get('to');
  const el   = document.getElementById('cover-guest');
  if (name && el) el.textContent = decodeURIComponent(name);
}

/* --- Loading screen --- */
function startLoading() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  setTimeout(() => {
    screen.classList.add('done');
    setTimeout(() => { screen.style.display = 'none'; }, 700);
  }, 1800);
}

/* --- Open invitation --- */
function openInvitation() {
  const cover = document.getElementById('cover-section');
  const main  = document.getElementById('main-content');

  // Play audio
  const audio = document.getElementById('bg-audio');
  if (audio) {
    audio.play()
      .then(() => { audioPlaying = true; updateAudioIcon(); })
      .catch(() => {});
  }

  // Slide cover away
  if (cover) {
    cover.classList.add('slide-away');
    setTimeout(() => { cover.style.display = 'none'; }, 950);
  }

  // Ensure video plays (some browsers require user interaction)
  const video = document.getElementById('hero-video');
  if (video) {
    video.play().catch(() => {});
  }

  // Show main content
  if (main) {
    main.classList.remove('hidden');
    document.body.style.overflow = '';
    window.scrollTo(0, 0);
  }
}

/* --- Audio toggle --- */
function toggleAudio() {
  const audio = document.getElementById('bg-audio');
  if (!audio) return;
  if (audioPlaying) {
    audio.pause();
    audioPlaying = false;
  } else {
    audio.play().then(() => { audioPlaying = true; }).catch(() => {});
  }
  updateAudioIcon();
}
function updateAudioIcon() {
  const el = document.getElementById('audio-note');
  if (el) el.textContent = audioPlaying ? '♪' : '♩';
}

/* --- Back to top --- */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.addEventListener('scroll', () => {
  const btn = document.getElementById('fab-top');
  if (btn) btn.classList.toggle('hidden', window.scrollY < 400);
}, { passive: true });

/* --- Section 1 Video Overlay & Fallback --- */
function initVideoOverlay() {
  const video = document.getElementById('hero-video');
  const overlay = document.getElementById('s1-overlay');
  
  if (video) {

    if (overlay) {
      video.addEventListener('timeupdate', () => {
        // Pause slightly before the end to prevent video disappearing on some browsers
        if (video.duration && video.currentTime >= video.duration - 0.1) {
          video.pause();
        }
        
        // Show overlay after 10 seconds of playback
        if (video.currentTime >= 10 && !overlay.classList.contains('show')) {
          overlay.classList.add('show');
        }
      });
    }
  }
}

/* --- Countdown Timer (Target: Akad Nikah 26 Juli 2026, 08:00 WIB) --- */
(function initCountdown() {
  const target = new Date('2026-07-26T08:00:00+07:00').getTime();

  function update() {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
      });
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('cd-days',  days);
    set('cd-hours', String(hours).padStart(2,'0'));
    set('cd-mins',  String(mins).padStart(2,'0'));
    set('cd-secs',  String(secs).padStart(2,'0'));
  }

  update();
  setInterval(update, 1000);
})();

/* --- Copy Rekening --- */
function copyRekening(rekNumber, btn) {
  navigator.clipboard.writeText(rekNumber).then(() => {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}
