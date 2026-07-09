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
