<?php

require_once '../../backend/lib/Auth.php';

Auth::clear();

header('Location: /admin/');
