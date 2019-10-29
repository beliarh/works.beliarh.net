<?php

require_once __DIR__ . '/Utils.php';
require_once __DIR__ . '/ApiException.php';
require_once __DIR__ . '/Data.php';
require_once __DIR__ . '/Credential.php';
require_once __DIR__ . '/Site.php';

class Apache
{
  private const HTPASSWD_ROOT_PATH = __DIR__ . '/../htpasswd/';
  private const MARK_START = '# START: ACCESS CONTROL';
  private const MARK_END = "# END: ACCESS CONTROL\n";

  /**
   * @param Site $site
   * @return string
   */
  private static function getSiteHtaccessPath(Site $site): string
  {
    return $site->getPath() . '/.htaccess';
  }

  /**
   * @param Site $site
   * @return string
   */
  private static function getSiteHtpasswdPath(Site $site): string
  {
    return self::HTPASSWD_ROOT_PATH . "{$site->id}.htpasswd";
  }

  /**
   * @param Site $site
   * @param Credential[] $credentials
   * @return void
   * @throws ApiException
   */
  private static function updateHtpasswd(Site $site, array $credentials = []): void
  {
    $path = self::getSiteHtpasswdPath($site);

    $credentials = array_filter($credentials, function (Credential $credential) {
      return !Utils::isExpiredDate($credential->expirationDate);
    });

    $htpasswd = array_map(function (Credential $credential) {
      $login = $credential->login;
      $encryptedPassword = $credential->encryptedPassword;

      return "$login:$encryptedPassword";
    }, $credentials);

    $htpasswd = join("\n", $htpasswd);

    if (file_put_contents($path, $htpasswd) === false) {
      throw new ApiException('Unable to update .htpasswd', 500);
    }
  }

  /**
   * @param Site $site
   * @return void
   */
  public static function deleteHtpasswd(Site $site): void
  {
    $path = self::getSiteHtpasswdPath($site);

    if (file_exists($path)) {
      unlink($path);
    }
  }

  /**
   * @param string $htaccess
   * @return array
   */
  private static function parseHtaccess(string $htaccess): array
  {
    $markStart = self::MARK_START;
    $markEnd = self::MARK_END;
    preg_match("/(.*?)($markStart.*?$markEnd)(.*)/s", $htaccess, $matches);

    return [
      'before' => $matches ? $matches[1] : '',
      'section' => $matches ? $matches[2] : '',
      'after' => $matches ? $matches[3] : $htaccess
    ];
  }

  /**
   * @param Site $site
   * @return string
   */
  private static function createHtaccessSection(Site $site): string
  {
    if ($site->public) {
      return '';
    }

    $htpasswdPath = realpath(self::getSiteHtpasswdPath($site));

    return join("\n", [
      self::MARK_START,
      'AuthType Basic',
      'AuthName "Authentication Required"',
      'AuthUserFile "' . $htpasswdPath . '"',
      'Require valid-user',
      self::MARK_END
    ]);
  }

  /**
   * @param Site $site
   * @return void
   * @throws ApiException
   */
  private static function createHtaccess(Site $site): void
  {
    $path = self::getSiteHtaccessPath($site);
    $htaccess = self::createHtaccessSection($site);

    if (file_put_contents($path, $htaccess) === false) {
      throw new ApiException('Unable to create .htaccess', 500);
    }
  }

  /**
   * @param Site $site
   * @return void
   * @throws ApiException
   */
  private static function updateHtaccess(Site $site): void
  {
    $path = self::getSiteHtaccessPath($site);
    $htaccess = self::parseHtaccess(file_get_contents($path));
    $htaccess['section'] = self::createHtaccessSection($site);
    $htaccess = $htaccess['before'] . $htaccess['section'] . $htaccess['after'];

    if (file_put_contents($path, $htaccess) === false) {
      throw new ApiException('Unable to update .htaccess', 500);
    }
  }

  /**
   * @param Site $site
   * @return void
   * @throws ApiException
   */
  public static function updateSite(Site $site): void
  {
    if (!$site->isLocal() || !$site->active) {
      self::deleteHtpasswd($site);

      return;
    }

    $data = Data::read();

    $credentials = array_filter($data->credentials, function (Credential $credential) use ($site) {
      return in_array($site->id, $credential->siteIds);
    });

    self::updateHtpasswd($site, $credentials);

    if (!file_exists(self::getSiteHtaccessPath($site))) {
      self::createHtaccess($site);
    } else {
      self::updateHtaccess($site);
    }
  }

  /**
   * @param int[]|null $ids
   * @return void
   * @throws ApiException
   */
  public static function updateSites(array $ids = null): void
  {
    $data = Data::read();

    foreach ($data->sites as $site) {
      if (!$ids || in_array($site->id, $ids)) {
        self::updateSite($site);
      }
    }
  }
}
