<?php

require_once __DIR__ . '/ApiException.php';
require_once __DIR__ . '/Data.php';
require_once __DIR__ . '/Site.php';

class Credential
{
  /**
   * @var int|null
   */
  public $id;

  /**
   * @var string|null
   */
  public $login;

  /**
   * @var string|null
   */
  public $password;

  /**
   * @var string|null
   */
  public $encryptedPassword;

  /**
   * @var string|null
   */
  public $expirationDate;

  /**
   * @var int[]|null
   */
  public $siteIds;

  /**
   * Credential constructor.
   * @param int|null $id
   * @param string|null $login
   * @param string|null $password
   * @param string|null $encryptedPassword
   * @param string|null $expirationDate
   * @param int[]|null $siteIds
   */
  public function __construct(
    int $id = null,
    string $login = null,
    string $password = null,
    string $encryptedPassword = null,
    string $expirationDate = null,
    array $siteIds = null
  ) {
    $this->id = $id;
    $this->login = $login;
    $this->password = $password;
    $this->encryptedPassword = $encryptedPassword;
    $this->expirationDate = $expirationDate;
    $this->siteIds = $siteIds;
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validate(): void
  {
    $this->validateLogin();
    $this->validatePassword();
    $this->validateExpirationDate();
    $this->validateSiteIds();
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validateLogin(): void
  {
    if (!$this->login) {
      throw new ApiException('Login is required', 400);
    }

    if (!trim($this->login)) {
      throw new ApiException('Login cannot be empty', 400);
    }

    if (!preg_match('/^[a-zA-Z0-9_-]+$/', $this->login)) {
      throw new ApiException('Login does not match pattern [a-zA-Z0-9_-]+', 400);
    }

    $data = Data::read();

    foreach ($data->credentials as $credential) {
      if ($credential->id !== $this->id && $credential->login === $this->login) {
        throw new ApiException('Login has already been taken', 400);
      }
    }
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validatePassword(): void
  {
    if (!$this->password) {
      throw new ApiException('Password is required', 400);
    }

    if (!trim($this->password)) {
      throw new ApiException('Password cannot be empty', 400);
    }
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validateExpirationDate(): void
  {
    if (!$this->expirationDate) {
      throw new ApiException('Expiration date is required', 400);
    }

    if (!trim($this->expirationDate)) {
      throw new ApiException('Expiration date cannot be empty', 400);
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $this->expirationDate)) {
      throw new ApiException('Expiration date does not match pattern YYYY-MM-DD', 400);
    }
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validateSiteIds(): void
  {
    if (!isset($this->siteIds)) {
      return;
    }

    $data = Data::read();

    $siteIds = array_map(function (Site $site) {
      return $site->id;
    }, $data->sites);

    foreach ($this->siteIds as $siteId) {
      if (!in_array($siteId, $siteIds)) {
        throw new ApiException("Cannot find site with id $siteId", 400);
      }
    }
  }

  /**
   * @param string $password
   * @return string
   */
  public static function encryptPassword(string $password): string
  {
    return password_hash($password, PASSWORD_BCRYPT);
  }

  /**
   * @param object|object[] $params
   * @return Credential[]
   */
  public static function getFromRequestParams($params): array
  {
    return array_map(
      function ($params) {
        return new self(
          $params->id ?? null,
          $params->login ?? null,
          $params->password ?? null,
          null,
          $params->expirationDate ?? null,
          $params->siteIds ?? null
        );
      },
      is_array($params) ? $params : [$params]
    );
  }
}
