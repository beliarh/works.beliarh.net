<?php

require_once '../../backend/lib/Api.php';
require_once '../../backend/lib/Credential.php';
require_once '../../backend/lib/Credentials.php';

Api::post(function () {
  $params = Api::getRequestParams();
  $credentials = Credential::getFromRequestParams($params);
  $credentials = Credentials::create($credentials);
  Api::sendSuccess($credentials, 201);
});

Api::get(function () {
  $credentials = Credentials::read();
  Api::sendSuccess($credentials);
});

Api::put(function () {
  $params = Api::getRequestParams();
  $credentials = Credential::getFromRequestParams($params);
  Credentials::update($credentials);
  Api::sendSuccess();
});

Api::delete(function () {
  $params = Api::getRequestParams();
  $ids = is_array($params) ? $params : [];
  $count = Credentials::delete($ids);
  Api::sendSuccess($count);
});

Api::run();
