<?php

require_once __DIR__ . '/Utils.php';
require_once __DIR__ . '/ApiException.php';
require_once __DIR__ . '/Data.php';
require_once __DIR__ . '/Credential.php';
require_once __DIR__ . '/Site.php';
require_once __DIR__ . '/Apache.php';
require_once __DIR__ . '/Robots.php';

class Sites
{
  private const EXCLUDED_DIRS = ['api', Site::IMAGES_DIR];

  /**
   * @var object[]|null
   */
  private static $dirs = null;

  /**
   * @return object[]
   * @throws ApiException
   */
  private static function getDirs(): array
  {
    if (!self::$dirs) {
      try {
        $dirs = array_diff(scandir(Site::ROOT_PATH), array_merge(['.', '..'], self::EXCLUDED_DIRS));
      } catch (Exception $exception) {
        throw new ApiException('Unable to scan directory', 500, $exception);
      }

      $dirs = array_filter($dirs, function (string $name) {
        return is_dir(Utils::forceSlashes(Site::ROOT_PATH, false, true) . $name);
      });

      $dirs = array_map(function (string $name) {
        $dir = new stdClass();
        $dir->name = $name;
        $dir->url = Utils::forceSlashes(Utils::makeAbsUrl($name, Site::ROOT_URL), false, true);

        return $dir;
      }, $dirs);

      self::$dirs = $dirs;
    }

    return self::$dirs;
  }

  /**
   * @return void
   * @throws ApiException
   */
  private static function sync(): void
  {
    $data = Data::read();
    $dirs = self::getDirs();
    $newSites = [];

    foreach ($dirs as $dir) {
      $isNew = true;

      foreach ($data->sites as $site) {
        if (Utils::strStartsWith(Utils::forceSlashes($site->url, false, true), $dir->url)) {
          $isNew = false;
          break;
        }
      }

      if ($isNew) {
        $newSites[] = new Site(null, $dir->name, null, [], null, $dir->url, null, [], true, true);
      }
    }

    if (!empty($newSites)) {
      $siteIds = array_map(function (Site $site) {
        return $site->id;
      }, $data->sites);

      $id = empty($siteIds) ? 1 : max($siteIds) + 1;

      foreach ($newSites as $newSite) {
        $newSite->id = $id++;
        $data->sites[] = $newSite;
      }
    }

    foreach ($data->sites as $site) {
      $site->checkActiveness();
    }

    Data::update();
    Apache::updateSites();
    Robots::update();
  }

  /**
   * @return void
   * @throws ApiException
   */
  private static function deleteUnusedImages(): void
  {
    $data = Data::read();

    $usedImages = array_unique(
      array_reduce(
        $data->sites,
        function (array $usedImages, Site $site) {
          return array_merge($usedImages, $site->images);
        },
        []
      )
    );

    try {
      $images = array_diff(scandir(Site::IMAGES_PATH), ['.', '..', 'demo.png']);
    } catch (Exception $exception) {
      throw new ApiException('Unable to scan directory', 500, $exception);
    }

    $images = array_filter($images, function (string $image) {
      return is_file(Utils::forceSlashes(Site::IMAGES_PATH, false, true) . $image);
    });

    $images = array_map(function (string $filename) {
      $imagesDir = Site::IMAGES_DIR;
      $imagesPath = Site::IMAGES_PATH;
      $image = new stdClass();
      $image->url = "/$imagesDir/$filename";
      $image->path = "$imagesPath/$filename";

      return $image;
    }, $images);

    foreach ($images as $image) {
      if (!in_array($image->url, $usedImages)) {
        unlink($image->path);
      }
    }
  }

  /**
   * @param Site[] $sites
   * @return Site[]
   * @throws ApiException
   */
  public static function create(array $sites): array
  {
    $data = Data::read();

    $ids = array_map(function (Site $site) {
      return $site->id;
    }, $data->sites);

    $id = empty($ids) ? 1 : max($ids) + 1;
    $newIds = [];
    $newSites = [];

    foreach ($sites as $site) {
      $site->validate();
    }

    foreach ($sites as $site) {
      $newSite = new Site(
        $id++,
        $site->name,
        $site->description,
        $site->images ?? [],
        $site->year,
        $site->url,
        $site->github,
        $site->stack ?? [],
        true,
        (bool) $site->public
      );

      if ($site->isLocal()) {
        Utils::createDirIfNotExists($site->getPath());
      }

      $credentialIds = $site->getCredentialIds();

      if ($credentialIds) {
        foreach ($data->credentials as $credential) {
          if (in_array($credential->id, $credentialIds) && !in_array($newSite->id, $credential->siteIds)) {
            $credential->siteIds[] = $newSite->id;
          }
        }
      }

      $newIds[] = $newSite->id;
      $newSites[] = $newSite;
      $data->sites[] = $newSite;
    }

    Data::update();
    Apache::updateSites($newIds);
    Robots::update();

    return $newSites;
  }

  /**
   * @return Site[]
   * @throws ApiException
   */
  public static function read(): array
  {
    self::sync();
    $data = Data::read();

    return $data->sites;
  }

  /**
   * @param Site[] $sites
   * @return void
   * @throws ApiException
   */
  public static function update(array $sites): void
  {
    $data = Data::read();
    $targetSites = [];

    foreach ($sites as $site) {
      $targetSite = null;

      foreach ($data->sites as $existingSite) {
        if ($site->id === $existingSite->id) {
          $targetSite = $existingSite;
          break;
        }
      }

      if (!$targetSite) {
        throw new ApiException("Cannot find site with id {$site->id}", 400);
      }

      $targetSites[] = $targetSite;
    }

    foreach ($sites as $i => $site) {
      $targetSite = $targetSites[$i];

      if (isset($site->name)) {
        $site->validateName();
        $targetSite->name = $site->name;
      }

      if (isset($site->description)) {
        $targetSite->description = $site->description;
      }

      if (isset($site->images)) {
        $site->validateImages();
        $targetSite->images = $site->images;
      }

      if (isset($site->year)) {
        $targetSite->year = $site->year;
      }

      if (isset($site->url)) {
        $site->validateUrl();
        $targetSite->url = $site->url;
      }

      if (isset($site->github)) {
        $site->validateGithub();
        $targetSite->github = $site->github;
      }

      if (isset($site->stack)) {
        $site->validateStack();
        $targetSite->stack = $site->stack;
      }

      if (isset($site->public)) {
        $targetSite->public = $site->public;
      }

      $credentialIds = $site->getCredentialIds();

      if (isset($credentialIds)) {
        $site->validateCredentialIds();

        foreach ($data->credentials as $credential) {
          $connectedBefore = in_array($site->id, $credential->siteIds);
          $connectedAfter = in_array($credential->id, $credentialIds);

          if ($connectedBefore !== $connectedAfter) {
            if ($connectedAfter) {
              $credential->siteIds[] = $site->id;
            } else {
              $credential->siteIds = array_values(array_diff($credential->siteIds, [$site->id]));
            }
          }
        }
      }
    }

    $siteIds = array_map(function (Site $site) {
      return $site->id;
    }, $sites);

    self::deleteUnusedImages();
    Data::update();
    Apache::updateSites($siteIds);
    Robots::update();
  }

  /**
   * @param int[] $ids
   * @return int
   * @throws ApiException
   */
  public static function delete(array $ids = []): int
  {
    $data = Data::read();
    $countBefore = count($data->sites);

    $data->credentials = array_map(function (Credential $credential) use ($ids) {
      $credential->siteIds = array_values(array_diff($credential->siteIds, $ids));

      return $credential;
    }, $data->credentials);

    $data->sites = array_values(
      array_filter($data->sites, function (Site $site) use ($ids) {
        $shouldDelete = in_array($site->id, $ids);

        if (!$shouldDelete) {
          return true;
        }

        if ($site->isLocal() && !$site->isAdmin() && $site->active && !Utils::deleteDir($site->getPath())) {
          throw new ApiException('Unable to delete site', 500);
        }

        Apache::deleteHtpasswd($site);

        return false;
      })
    );

    $countAfter = count($data->sites);

    self::deleteUnusedImages();
    Data::update();
    Apache::updateSites();
    Robots::update();

    return $countBefore - $countAfter;
  }

  /**
   * @return string
   */
  public static function getJson(): string
  {
    try {
      $sites = self::read();

      return json_encode($sites, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } catch (Exception $exception) {
      return '[]';
    }
  }

  /**
   * @return Site[]
   */
  public static function getPublicSites(): array
  {
    try {
      $sites = self::read();

      return array_filter($sites, function (Site $site) {
        return $site->public && $site->active;
      });
    } catch (Exception $exception) {
      return [];
    }
  }
}
