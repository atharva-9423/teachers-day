document.addEventListener('DOMContentLoaded', () => {
  const bgVideo = document.getElementById('bgVideo');
  const posterOverlay = document.getElementById('posterOverlay');

  // Video settings
  bgVideo.volume = 1.0;
  bgVideo.muted = false;
  bgVideo.pause();

  // Helper functions
  const showPoster = () => {
    posterOverlay.classList.remove('hidden');
  };

  const hidePoster = () => {
    posterOverlay.classList.add('hidden');
  };

  // Safe play helper with unmuted fallback
  const playVideo = () => {
    bgVideo.muted = false;
    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Direct unmuted play blocked, falling back to muted play:', err);
        // Fallback: play muted so video is never stuck or black
        bgVideo.muted = true;
        bgVideo.play().then(() => {
          // Immediately unmute on next user action
          const unmute = () => {
            bgVideo.muted = false;
            window.removeEventListener('click', unmute);
            window.removeEventListener('keydown', unmute);
          };
          window.addEventListener('click', unmute, { once: true });
          window.addEventListener('keydown', unmute, { once: true });
        }).catch((e) => console.error('Play failed:', e));
      });
    }
  };

  // Action to dismiss poster and start video
  const startFromPoster = () => {
    hidePoster();
    if (bgVideo.ended || bgVideo.currentTime >= (bgVideo.duration || 0)) {
      bgVideo.currentTime = 0;
    }
    playVideo();
  };

  // Click on poster overlay directly starts video
  posterOverlay.addEventListener('click', () => {
    startFromPoster();
  });

  // Video ended event: show the poster again
  bgVideo.addEventListener('ended', () => {
    showPoster();
  });

  // Keyboard Controls
  window.addEventListener('keydown', (e) => {
    // Ignore when typing inside input or textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      return;
    }

    // 1. Spacebar: Play/Pause or Hide Poster and Start Video
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault(); // Prevent default page scroll

      const isPosterVisible = !posterOverlay.classList.contains('hidden');

      if (isPosterVisible) {
        startFromPoster();
      } else {
        if (bgVideo.paused) {
          playVideo();
        } else {
          bgVideo.pause();
        }
      }
    }

    // 2. "j" key: Jump back to start (0:00)
    if (e.key === 'j' || e.key === 'J' || e.code === 'KeyJ') {
      e.preventDefault();
      const wasPaused = bgVideo.paused;
      bgVideo.currentTime = 0;
      if (!wasPaused) {
        hidePoster();
        playVideo();
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
