<?php

require_once __DIR__ . '/ApiException.php';
require_once __DIR__ . '/Api.php';
require_once __DIR__ . '/Data.php';
require_once __DIR__ . '/Credential.php';
require_once __DIR__ . '/Site.php';
require_once __DIR__ . '/Sites.php';
require_once __DIR__ . '/Apache.php';
require_once __DIR__ . '/Robots.php';

class Credentials
{
  /**
   * @param Credential[] $credentials
   * @return Credential[]
   * @throws ApiException
   */
  public static function create(array $credentials): array
  {
    $data = Data::read();

    $ids = array_map(function (Credential $credential) {
      return $credential->id;
    }, $data->credentials);

    $id = empty($ids) ? 1 : max($ids) + 1;
    $newIds = [];
    $newCredentials = [];

    foreach ($credentials as $credential) {
      $credential->validate();

      $newCredential = new Credential(
        $id++,
        $credential->login,
        $credential->password,
        Credential::encryptPassword($credential->password),
        $credential->expirationDate,
        array_values(array_unique($credential->siteIds ?? []))
      );

      $newIds[] = $newCredential->id;
      $newCredentials[] = $newCredential;
      $data->credentials[] = $newCredential;
    }

    $siteIds = array_unique(
      array_reduce(
        $credentials,
        function (array $siteIds, Credential $credential) {
          return array_merge($siteIds, $credential->siteIds ?? []);
        },
        []
      )
    );

    Data::update();
    Apache::updateSites($siteIds);
    Robots::update();

    return $newCredentials;
  }

  /**
   * @return Credential[]
   * @throws ApiException
   */
  public static function read(): array
  {
    $data = Data::read();

    return $data->credentials;
  }

  /**
   * @param Credential[] $credentials
   * @return void
   * @throws ApiException
   */
  public static function update(array $credentials): void
  {
    $data = Data::read();
    $targetCredentials = [];

    foreach ($credentials as $credential) {
      $targetCredential = null;

      foreach ($data->credentials as $existingCredential) {
        if ($credential->id === $existingCredential->id) {
          $targetCredential = $existingCredential;
          break;
        }
      }

      if (!$targetCredential) {
        throw new ApiException("Cannot find credential with id {$credential->id}", 400);
      }

      $targetCredentials[] = $targetCredential;
    }

    foreach ($credentials as $i => $credential) {
      $targetCredential = $targetCredentials[$i];

      if (isset($credential->login) && $credential->login !== $targetCredential->login) {
        $credential->validateLogin();
        $targetCredential->login = $credential->login;
      }

      if (isset($credential->password) && $credential->password !== $targetCredential->password) {
        $credential->validatePassword();
        $targetCredential->password = $credential->password;
        $targetCredential->encryptedPassword = Credential::encryptPassword($credential->password);
      }

      if (isset($credential->expirationDate) && $credential->expirationDate !== $targetCredential->expirationDate) {
        $credential->validateExpirationDate();
        $targetCredential->expirationDate = $credential->expirationDate;
      }

      if (isset($credential->siteIds)) {
        $credential->validateSiteIds();
        $targetCredential->siteIds = array_values(array_unique($credential->siteIds));
      }
    }

    $siteIds = array_unique(
      array_reduce(
        $credentials,
        function (array $siteIds, Credential $credential) {
          return array_merge($siteIds, $credential->siteIds ?? []);
        },
        []
      )
    );

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
    $countBefore = count($data->credentials);
    $siteIds = [];

    $data->credentials = array_values(
      array_filter($data->credentials, function (Credential $credential) use ($ids, &$siteIds) {
        $shouldDelete = in_array($credential->id, $ids);

        if ($shouldDelete) {
          $siteIds = array_merge($siteIds, $credential->siteIds);
        }

        return !$shouldDelete;
      })
    );

    $countAfter = count($data->credentials);

    Data::update();
    Apache::updateSites(array_unique($siteIds));
    Robots::update();

    return $countBefore - $countAfter;
  }

  /**
   * @return string
   */
  public static function getJson(): string
  {
    try {
      $data = Data::read();

      return json_encode($data->credentials, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } catch (Exception $exception) {
      return '[]';
    }
  }
}
