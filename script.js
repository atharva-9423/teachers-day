document.addEventListener('DOMContentLoaded', () => {
  const bgVideo = document.getElementById('bgVideo');

  // Video is paused by default on page load / refresh
  bgVideo.pause();
  bgVideo.currentTime = 0;
  bgVideo.volume = 1.0;
  bgVideo.muted = false;

  // Keyboard Controls
  window.addEventListener('keydown', (e) => {
    // Ignore keypresses if user is typing inside an input or textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      return;
    }

    // 1. Spacebar: Toggle Pause / Play
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault(); // Prevent default page scroll
      if (bgVideo.paused) {
        bgVideo.play().catch((err) => console.log('Playback error:', err));
      } else {
        bgVideo.pause();
      }
    }

    // 2. "j" key: Jump back to start (0:00)
    // If paused, keep it paused. If playing, keep playing from start.
    if (e.key === 'j' || e.key === 'J' || e.code === 'KeyJ') {
      e.preventDefault();
      const wasPaused = bgVideo.paused;
      bgVideo.currentTime = 0;
      if (!wasPaused) {
        bgVideo.play().catch((err) => console.log('Playback error:', err));
      }
    }

    // 3. "p" key: Toggle Mute / Unmute
    if (e.key === 'p' || e.key === 'P' || e.code === 'KeyP') {
      e.preventDefault();
      bgVideo.muted = !bgVideo.muted;
    }

    // 4. "f" key: Enter Fullscreen
    if (e.key === 'f' || e.key === 'F' || e.code === 'KeyF') {
      e.preventDefault();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn('Fullscreen error:', err);
        });
      }
    }

    // 5. "Escape" key: Exit Fullscreen
    if (e.key === 'Escape' || e.code === 'Escape') {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.warn('Exit fullscreen error:', err);
        });
      }
    }
  });
});
