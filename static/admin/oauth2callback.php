<?php

require_once '../../backend/lib/Auth.php';

try {
  Auth::authenticate();
} catch (Exception $exception) {
  Auth::clear();
}

header('Location: /admin/');
