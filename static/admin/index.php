<?php
require_once '../../backend/lib/Manifest.php';
require_once '../../backend/lib/Auth.php';
require_once '../../backend/lib/Credentials.php';
require_once '../../backend/lib/Sites.php';
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
    <meta property="og:url" content="https://works.beliarh.net/admin/" />
    <meta property="og:title" content="Admin Panel | Works | Dmitry Artemov" />
    <meta property="og:description" content="" />
    <meta property="og:image" content="<?= Manifest::get('images/share.png') ?>" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@artbeliarh" />
    <meta name="twitter:creator" content="@artbeliarh" />
    <title>Admin Panel | Works | Dmitry Artemov</title>
    <link rel="apple-touch-icon" sizes="180x180" href="<?= Manifest::get('images/apple-touch-icon.png') ?>" />
    <link rel="icon" type="image/png" sizes="32x32" href="<?= Manifest::get('images/favicon-dark-32x32.png') ?>" />
    <link rel="icon" type="image/png" sizes="16x16" href="<?= Manifest::get('images/favicon-dark-16x16.png') ?>" />
    <link rel="mask-icon" href="<?= Manifest::get('images/safari-pinned-tab.svg') ?>" color="#ea4335" />
    <link rel="manifest" href="<?= Manifest::get('site.webmanifest') ?>" />
    <link rel="stylesheet" href="<?= Manifest::get('admin/index.css') ?>">
  </head>
  <body>
    <div id="root"></div>
    <?php if (isset($_GET['demo'])): ?>
      <script src="<?= Manifest::get('admin/demo/index.js') ?>"></script>
    <?php elseif (Auth::isAuthenticated()): ?>
      <?php if (Auth::isAuthorized()): ?>
        <script>
          window.__PRELOADED_STATE__ = {
            user: <?= Auth::getUserJson() ?>,
            isAuthorized: true,
            credentials: {
              list: <?= Credentials::getJson() ?>
            },
            sites: {
              list: <?= Sites::getJson() ?>
            }
          };
        </script>
      <?php else: ?>
        <script>
          window.__PRELOADED_STATE__ = {
            user: <?= Auth::getUserJson() ?>,
            isAuthorized: false
          };
        </script>
      <?php endif; ?>
    <?php else: ?>
      <script>
        window.__PRELOADED_STATE__ = {
          authUrl: '<?= Auth::getUrl() ?>'
        };
      </script>
    <?php endif; ?>
    <script src="<?= Manifest::get('admin/index.js') ?>"></script>
  </body>
</html>
