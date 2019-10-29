const favicon = {
  light: {
    '16x16': require('../images/favicon-light-16x16.png'),
    '32x32': require('../images/favicon-light-32x32.png'),
  },
  dark: {
    '16x16': require('../images/favicon-dark-16x16.png'),
    '32x32': require('../images/favicon-dark-32x32.png'),
  },
};

const mediaDark = window.matchMedia('(prefers-color-scheme: dark)');
const linkIcon32x32 = document.querySelector('link[rel="icon"][sizes="32x32"]');
const linkIcon16x16 = document.querySelector('link[rel="icon"][sizes="16x16"]');

function applyFavicon(theme) {
  linkIcon32x32.href = favicon[theme]['32x32'];
  linkIcon16x16.href = favicon[theme]['16x16'];
}

function updateFavicon() {
  if (mediaDark.matches) {
    applyFavicon('dark');
  } else {
    applyFavicon('light');
  }
}

if (mediaDark.addEventListener) {
  mediaDark.addEventListener('change', updateFavicon);
} else {
  mediaDark.addListener(updateFavicon);
}

updateFavicon();
