<?php

class Utils
{
  /**
   * @return void
   */
  public static function startSessionOnce(): void
  {
    if (session_status() === PHP_SESSION_NONE) {
      session_start();
    }
  }

  /**
   * @param string $string
   * @param string $prefix
   * @return bool
   */
  public static function strStartsWith(string $string, string $prefix): bool
  {
    return substr($string, 0, strlen($prefix)) === $prefix;
  }

  /**
   * @param string $string
   * @param bool $start
   * @param bool $end
   * @return string
   */
  public static function trimSlashes(string $string, bool $start = true, bool $end = true): string
  {
    if ($start) {
      $string = ltrim($string, '/');
    }

    if ($end) {
      $string = rtrim($string, '/');
    }

    return $string;
  }

  /**
   * @param string $string
   * @param bool $start
   * @param bool $end
   * @return string
   */
  public static function forceSlashes(string $string, bool $start = true, bool $end = true): string
  {
    if ($start && $string[0] !== '/') {
      $string = "/$string";
    }

    if ($end && $string[-1] !== '/') {
      $string = "$string/";
    }

    return $string;
  }

  /**
   * @return string
   */
  public static function getServerUrl(): string
  {
    if (php_sapi_name() === 'cli') {
      return 'https://works.beliarh.net';
    }

    $host = $_SERVER['HTTP_HOST'];
    $https = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    $protocol = $https ? 'https' : 'http';

    return "$protocol://$host";
  }

  /**
   * @param string $url
   * @return bool
   */
  public static function isLocalUrl(string $url): bool
  {
    return self::strStartsWith($url, self::getServerUrl());
  }

  /**
   * @param string $url
   * @return bool
   */
  public static function isAbsUrl(string $url): bool
  {
    return preg_match('#^http[s]?://.+#', $url);
  }

  /**
   * @param string $url
   * @return string|null
   */
  public static function makeRelUrl(string $url): ?string
  {
    if (!self::isAbsUrl($url)) {
      return $url;
    }

    preg_match('{http[s]?://[^/]+/([a-zA-Z0-9_\-/]+(?:\.[a-z]+)?)(?:[?#].*)?}', $url, $matches);

    if (!$matches) {
      return null;
    }

    return $matches[1];
  }

  /**
   * @param string $url
   * @param string $root
   * @return string
   */
  public static function makeAbsUrl(string $url, string $root = '/'): string
  {
    if (self::isAbsUrl($url)) {
      return $url;
    }

    $serverUrl = self::getServerUrl();

    if (self::strStartsWith($url, $root)) {
      return $serverUrl . $url;
    }

    return $serverUrl . $root . self::trimSlashes($url, true, false);
  }

  /**
   * @param string $path
   * @return bool
   */
  public static function createDirIfNotExists(string $path): bool
  {
    if (!is_dir($path)) {
      return mkdir($path, 0700);
    }

    return true;
  }

  /**
   * @param string $path
   * @return bool
   */
  public static function deleteDir(string $path): bool
  {
    if (!is_dir($path)) {
      return true;
    }

    $items = array_diff(scandir($path), ['.', '..']);

    foreach ($items as $item) {
      $itemPath = realpath("$path/$item");

      if (is_dir($itemPath)) {
        self::deleteDir($itemPath);
      } else {
        unlink($itemPath);
      }
    }

    return rmdir($path);
  }

  /**
   * @param string $date
   * @return bool
   */
  public static function isExpiredDate(string $date): bool
  {
    return strtotime("$date 23:59:59") < time();
  }
}
