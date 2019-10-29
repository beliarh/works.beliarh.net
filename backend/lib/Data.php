<?php

require_once __DIR__ . '/ApiException.php';
require_once __DIR__ . '/Credential.php';
require_once __DIR__ . '/Site.php';

class Data
{
  private const PATH = __DIR__ . '/../data/data.json';

  /**
   * @var Data|null
   */
  private static $instance = null;

  /**
   * @var Credential[]
   */
  public $credentials;

  /**
   * @var Site[]
   */
  public $sites;

  /**
   * Data constructor.
   */
  private function __construct()
  {
    $data = json_decode(file_get_contents(self::PATH), false, 512, JSON_THROW_ON_ERROR);

    $this->credentials = array_map(function ($credential) {
      return new Credential(
        $credential->id,
        $credential->login,
        $credential->password,
        $credential->encryptedPassword,
        $credential->expirationDate,
        $credential->siteIds
      );
    }, $data->credentials);

    $this->sites = array_map(function ($site) {
      return new Site(
        $site->id,
        $site->name,
        $site->description,
        $site->images,
        $site->year,
        $site->url,
        $site->github,
        $site->stack,
        $site->active,
        $site->public
      );
    }, $data->sites);
  }

  /**
   * @return Data
   * @throws ApiException
   */
  public static function read(): Data
  {
    if (!self::$instance) {
      try {
        self::$instance = new self();
      } catch (Exception $exception) {
        throw new ApiException('Unable to read data', 500, $exception);
      }
    }

    return self::$instance;
  }

  /**
   * @return void
   * @throws ApiException
   */
  public static function update(): void
  {
    try {
      $data = json_encode(self::$instance, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

      if (file_put_contents(self::PATH, $data) === false) {
        throw new Exception();
      }
    } catch (Exception $exception) {
      throw new ApiException('Unable to save data', 500, $exception);
    }
  }
}
