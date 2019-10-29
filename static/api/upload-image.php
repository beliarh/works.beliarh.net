<?php

require_once '../../backend/lib/Api.php';
require_once '../../backend/lib/Upload.php';
require_once '../../backend/lib/Site.php';

Api::post(function () {
  $image = $_FILES['image'] ?? null;
  $maxSize = 2 * 1024 * 1024;
  $mimeTypes = ['image/jpeg', 'image/png'];
  Upload::validate($image, $maxSize, $mimeTypes);
  $filename = Upload::save($image, Site::IMAGES_PATH);
  $imagesDir = Site::IMAGES_DIR;
  Api::sendSuccess("/$imagesDir/$filename");
});

Api::run();
