<?php
require_once '../backend/lib/Manifest.php';
require_once '../backend/lib/Sites.php';
?>
<!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns#">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="description" content="" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="works.beliarh.net" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://works.beliarh.net/" />
    <meta property="og:title" content="Works | Dmitry Artemov" />
    <meta property="og:description" content="" />
    <meta property="og:image" content="<?= Manifest::get('images/share.png') ?>" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@artbeliarh" />
    <meta name="twitter:creator" content="@artbeliarh" />
    <title>Works | Dmitry Artemov</title>
    <link rel="apple-touch-icon" sizes="180x180" href="<?= Manifest::get('images/apple-touch-icon.png') ?>" />
    <link rel="icon" type="image/png" sizes="32x32" href="<?= Manifest::get('images/favicon-dark-32x32.png') ?>" />
    <link rel="icon" type="image/png" sizes="16x16" href="<?= Manifest::get('images/favicon-dark-16x16.png') ?>" />
    <link rel="mask-icon" href="<?= Manifest::get('images/safari-pinned-tab.svg') ?>" color="#ea4335" />
    <link rel="manifest" href="<?= Manifest::get('site.webmanifest') ?>" />
    <style>
      @font-face {
        font-family: 'Roboto Condensed';
        src: local('Roboto Condensed'), local('RobotoCondensed-Regular'),
          url(<?= Manifest::get('fonts/roboto-condensed-400.woff2') ?>) format('woff2'),
          url(<?= Manifest::get('fonts/roboto-condensed-400.woff') ?>) format('woff');
        font-weight: 400;
        font-style: normal;
      }

      @font-face {
        font-family: 'Roboto Condensed';
        src: local('Roboto Condensed'), local('RobotoCondensed-Regular'),
          url(<?= Manifest::get('fonts/roboto-condensed-700.woff2') ?>) format('woff2'),
          url(<?= Manifest::get('fonts/roboto-condensed-700.woff') ?>) format('woff');
        font-weight: 700;
        font-style: normal;
      }
    </style>
    <link rel="stylesheet" href="<?= Manifest::get('index.css') ?>" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://works.beliarh.net/#website",
        "url": "https://works.beliarh.art/",
        "inLanguage": "en",
        "name": "Works | Dmitry Artemov",
        "description": ""
      }
    </script>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://beliarh.net/#person",
        "url": "https://beliarh.net/",
        "name": "Dmitry Artemov",
        "sameAs": [
          "https://www.facebook.com/art.beliarh",
          "https://twitter.com/artbeliarh",
          "https://github.com/beliarh/",
          "https://www.linkedin.com/in/beliarh/",
          "https://t.me/beliarh"
        ]
      }
    </script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-150940509-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'UA-150940509-1');
    </script>
  </head>
  <body>
    <svg class="visually-hidden">
      <symbol id="icon-link" viewBox="0 0 100 100">
        <path
          d="M59.09 0v9.09h25.285L28.551 64.916l6.534 6.534L90.91 15.625v25.284H100V0zM0 18.182V100h81.818V40.91L72.728 50v40.91H9.09V27.272H50l9.09-9.091z"
        />
      </symbol>
      <symbol id="icon-github" viewBox="0 0 100 100">
        <path
          d="M100 0H0v100h34.3c1.4 0 2.5-.8 2.5-2.1.1-3.5 0-7 0-10.3-2.5.1-4.9.4-7.3.3-5.2-.3-9.3-2.5-11.4-7.7-1.2-3-3.1-5.6-6-7.4-.5-.3-1-.8-1.4-1.3-.5-.6-.4-1.3.4-1.5.9-.2 1.8-.3 2.7-.1 3.3.6 5.7 2.7 7.4 5.5 3.5 5.5 8.9 7.2 15 4.7.3-.1.8-.5.8-.8.5-2.4 1.4-4.7 3.2-6.6-2-.4-3.9-.7-5.8-1.1-5.4-1.2-10.2-3.5-13.7-7.9-2.9-3.6-4.2-7.8-4.8-12.3-.9-7-.1-13.6 4.7-19.3.2-.3.4-.9.3-1.2-1.2-4-1-7.9.2-11.8.6-2.1.8-2.2 2.9-1.9.1 0 .3.1.4.1 4.2.7 7.8 2.7 11.4 4.9.5.3 1.2.5 1.7.4 8.5-2.1 17-2.1 25.5 0 .5.1 1.2-.1 1.6-.3 1.9-1 3.8-2.2 5.8-3.2 2.3-1.1 4.7-2 7.3-1.9.5 0 1.2.4 1.3.8 1.6 4.1 1.9 8.3.6 12.6-.1.5.1 1.1.3 1.6 1.2 2.3 2.9 4.3 3.7 6.7 2.4 7.3 1.5 14.5-1.7 21.3-2.9 6.3-8.4 9.4-14.9 11.1-2.2.6-4.4.9-6.8 1.4 3.1 3.2 3.6 7.2 3.5 11.3-.1 4.3 0 8.5 0 12.8 0 2.1.9 3.2 2.5 3.3h33.6V0z"
        />
      </symbol>
    </svg>
    <div class="container">
      <h1 class="title">
        Works
      </h1>
      <?php $sites = Sites::getPublicSites(); ?>
      <?php if ($sites): ?>
        <ul class="works">
          <?php foreach ($sites as $site): ?>
            <li class="work">
              <div class="work__images<?= !$site->images ? ' work__images--empty' : '' ?>">
                <?php foreach ($site->images as $i => $image): ?>
                  <img
                    class="work__image<?= $i === 0 ? ' work__image--active' : '' ?>"
                    src="<?= htmlspecialchars($image) ?>"
                    alt="<?= htmlspecialchars($site->name) ?>"
                    draggable="false"
                  >
                <?php endforeach; ?>
              </div>
              <div class="work__container">
                <h2 class="work__name">
                  <a href="<?= htmlspecialchars($site->url) ?>" target="_blank" rel="noopener noreferrer">
                    <?= htmlspecialchars($site->name) ?>
                  </a>
                </h2>
                <?php if ($site->description): ?>
                  <div class="work__description work__text">
                    <b>Description:</b>
                    <?= htmlspecialchars($site->description) ?>
                  </div>
                <?php endif; ?>
                <?php if ($site->year): ?>
                  <div class="work__year work__text">
                    <b>Year:</b>
                    <?= htmlspecialchars($site->year) ?>
                  </div>
                <?php endif; ?>
                <?php if ($site->stack): ?>
                  <div class="work__stack work__text">
                    <b>Stack:</b>
                    <?= htmlspecialchars(join(', ', $site->stack)) ?>
                  </div>
                <?php endif; ?>
                <ul class="work__links">
                  <li>
                    <a
                      class="work__link"
                      href="<?= htmlspecialchars($site->url) ?>"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Link"
                      aria-label="Link"
                    >
                      <svg>
                        <use xlink:href="#icon-link"/>
                      </svg>
                    </a>
                  </li>
                  <?php if ($site->github): ?>
                    <li>
                      <a
                        class="work__link"
                        href="<?= htmlspecialchars($site->github) ?>"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="GitHub"
                        aria-label="GitHub"
                      >
                        <svg>
                          <use xlink:href="#icon-github"/>
                        </svg>
                      </a>
                    </li>
                  <?php endif; ?>
                </ul>
              </div>
            </li>
          <?php endforeach; ?>
        </ul>
      <?php else: ?>
        <!-- TODO -->
      <?php endif; ?>
    </div>
    <script src="<?= Manifest::get('index.js') ?>"></script>
  </body>
</html>
