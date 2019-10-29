<?php

require_once '../../backend/lib/Api.php';
require_once '../../backend/lib/Site.php';
require_once '../../backend/lib/Sites.php';

Api::post(function () {
  $params = Api::getRequestParams();
  $sites = Site::getFromRequestParams($params);
  $sites = Sites::create($sites);
  Api::sendSuccess($sites, 201);
});

Api::get(function () {
  $sites = Sites::read();
  Api::sendSuccess($sites);
});

Api::put(function () {
  $params = Api::getRequestParams();
  $sites = Site::getFromRequestParams($params);
  Sites::update($sites);
  Api::sendSuccess();
});

Api::delete(function () {
  $params = Api::getRequestParams();
  $ids = is_array($params) ? $params : [];
  $count = Sites::delete($ids);
  Api::sendSuccess($count);
});

Api::run();
