<?php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/Utils.php';

class Auth
{
  private const ALLOWED_EMAILS_PATH = __DIR__ . '/../data/oauth-allowed-emails.json';

  /**
   * @var Google_Client|null
   */
  private static $client = null;

  /**
   * @var bool|null
   */
  private static $isAuthorized = null;

  /**
   * @return string|null
   */
  private static function getCode(): ?string
  {
    return $_GET['code'] ?? null;
  }

  /**
   * @return mixed|null
   */
  private static function getToken()
  {
    return $_SESSION['token'] ?? null;
  }

  /**
   * @param mixed|null $token
   * @return void
   */
  private static function setToken($token): void
  {
    if (is_null($token)) {
      unset($_SESSION['token']);
    } else {
      $_SESSION['token'] = $token;
    }
  }

  /**
   * @return object|null
   */
  public static function getUser(): ?object
  {
    return $_SESSION['user'] ?? null;
  }

  /**
   * @return string
   */
  public static function getUserJson(): string
  {
    return json_encode(self::getUser(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  }

  /**
   * @param object|null $user
   * @return void
   */
  private static function setUser(?object $user): void
  {
    if (is_null($user)) {
      unset($_SESSION['user']);
    } else {
      $_SESSION['user'] = $user;
    }
  }

  /**
   * @return string
   */
  public static function getUrl(): string
  {
    return self::$client->createAuthUrl();
  }

  /**
   * @return void
   * @throws Exception
   */
  public static function authenticate(): void
  {
    if (self::getToken()) {
      self::authenticateWithExistingToken();
    } elseif (self::getCode()) {
      self::authenticateWithNewToken();
    } else {
      throw new Exception();
    }

    $service = new Google_Service_Oauth2(self::$client);
    $user = $service->userinfo->get();
    self::setUser($user);
  }

  /**
   * @return void
   */
  private static function authenticateWithExistingToken(): void
  {
    self::$client->setAccessToken(self::getToken());
  }

  /**
   * @return void
   */
  private static function authenticateWithNewToken(): void
  {
    $token = self::$client->fetchAccessTokenWithAuthCode(self::getCode());
    self::setToken($token);
  }

  /**
   * @return bool
   */
  public static function isAuthenticated(): bool
  {
    return !is_null(self::getUser());
  }

  /**
   * @return bool
   */
  public static function isAuthorized(): bool
  {
    if (!is_null(self::$isAuthorized)) {
      return self::$isAuthorized;
    }

    if (self::isAuthenticated()) {
      $user = self::getUser();
      $allowedEmails = file_get_contents(self::ALLOWED_EMAILS_PATH);
      $allowedEmails = json_decode($allowedEmails, false, 512, JSON_THROW_ON_ERROR);
      self::$isAuthorized = in_array($user->email, $allowedEmails);
    } else {
      self::$isAuthorized = false;
    }

    return self::$isAuthorized;
  }

  /**
   * @return void
   */
  public static function init(): void
  {
    if (self::$client) {
      return;
    }

    Utils::startSessionOnce();

    $serverUrl = Utils::getServerUrl();
    $client = new Google_Client();

    try {
      $client->setAuthConfig(__DIR__ . '/../data/oauth-client-secret.json');
    } catch (Exception $exception) {
      http_response_code(500);
      exit();
    }

    $client->setRedirectUri("$serverUrl/admin/oauth2callback.php");
    $client->addScope(Google_Service_Oauth2::USERINFO_EMAIL);

    self::$client = $client;
  }

  /**
   * @return void
   */
  public static function clear(): void
  {
    self::setToken(null);
    self::setUser(null);
  }
}

Auth::init();
