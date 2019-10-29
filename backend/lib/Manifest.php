<?php

class Manifest
{
  private const PATH = __DIR__ . '/../../public_html/parcel-manifest.json';

  /**
   * @var array|null
   */
  private static $json = null;

  /**
   * @return array
   */
  private static function read(): array
  {
    if (!self::$json) {
      self::$json = json_decode(file_get_contents(self::PATH), true);
    }

    return self::$json;
  }

  /**
   * @param string $key
   * @return string|null
   */
  public static function get(string $key): ?string
  {
    $json = self::read();

    return $json[$key] ?? null;
  }
}
