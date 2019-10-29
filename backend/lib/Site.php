<?php

require_once __DIR__ . '/Utils.php';
require_once __DIR__ . '/ApiException.php';
require_once __DIR__ . '/Data.php';
require_once __DIR__ . '/Credential.php';

class Site
{
  public const ROOT_URL = '/';
  public const ROOT_PATH = __DIR__ . '/../../public_html/';
  public const IMAGES_DIR = 'images';
  public const IMAGES_PATH = self::ROOT_PATH . self::IMAGES_DIR;

  /**
   * @var int|null
   */
  public $id;

  /**
   * @var string|null
   */
  public $name;

  /**
   * @var string|null
   */
  public $description;

  /**
   * @var string[]|null
   */
  public $images;

  /**
   * @var int|null
   */
  public $year;

  /**
   * @var string|null
   */
  public $url;

  /**
   * @var string|null
   */
  public $github;

  /**
   * @var string[]|null
   */
  public $stack;

  /**
   * @var bool|null
   */
  public $active;

  /**
   * @var bool|null
   */
  public $public;

  /**
   * @var int[]|null
   */
  private $credentialIds = null;

  /**
   * Site constructor.
   * @param int|null $id
   * @param string|null $name
   * @param string|null $description
   * @param string[]|null $images
   * @param int|null $year
   * @param string|null $url
   * @param string|null $github
   * @param string[]|null $stack
   * @param bool|null $active
   * @param bool|null $public
   * @param int[]|null $credentialIds
   */
  public function __construct(
    int $id = null,
    string $name = null,
    string $description = null,
    array $images = null,
    int $year = null,
    string $url = null,
    string $github = null,
    array $stack = null,
    bool $active = null,
    bool $public = null,
    array $credentialIds = null
  ) {
    $this->id = $id;
    $this->name = $name;
    $this->description = $description;
    $this->images = $images;
    $this->year = $year;
    $this->url = $url;
    $this->github = $github;
    $this->stack = $stack;
    $this->active = $active;
    $this->public = $public;
    $this->credentialIds = $credentialIds;
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validate(): void
  {
    $this->validateName();
    $this->validateImages();
    $this->validateUrl();
    $this->validateGithub();
    $this->validateStack();
    $this->validateCredentialIds();
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validateName(): void
  {
    if (!$this->name) {
      throw new ApiException('Name is required', 400);
    }

    if (!trim($this->name)) {
      throw new ApiException('Name cannot be empty', 400);
    }

    $data = Data::read();

    foreach ($data->sites as $site) {
      if ($site->id !== $this->id && $site->name === $this->name) {
        throw new ApiException('Name has already been taken', 400);
      }
    }
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validateImages(): void
  {
    if (!$this->images) {
      return;
    }

    foreach ($this->images as $image) {
      if (!is_string($image)) {
        throw new ApiException('Images must be an array of strings', 400);
      }

      if (!preg_match('#^/images/[a-z0-9]+\.(?:jpg|png)$#', $image)) {
        throw new ApiException('Image does not patch pattern /images/*.{jpg,png}', 400);
      }
    }
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validateUrl(): void
  {
    if (!$this->url) {
      throw new ApiException('URL is required', 400);
    }

    if (!trim($this->url)) {
      throw new ApiException('URL cannot be empty', 400);
    }

    if (!Utils::isAbsUrl($this->url)) {
      throw new ApiException('URL does not match pattern', 400);
    }

    $data = Data::read();

    foreach ($data->sites as $site) {
      if ($site->id !== $this->id && $site->url === $this->url) {
        throw new ApiException('URL has already been taken', 400);
      }
    }
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validateGithub(): void
  {
    if (!$this->github) {
      return;
    }

    if (!preg_match('#https://github\.com/.+#', $this->github)) {
      throw new ApiException('GitHub URL must start with "https://github.com/"', 400);
    }
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validateStack(): void
  {
    if (!$this->stack) {
      return;
    }

    foreach ($this->stack as $i => $technology) {
      if (!is_string($technology)) {
        throw new ApiException('Stack must be an array of strings', 400);
      }

      $technology = trim($technology);

      if (!$technology) {
        throw new ApiException('Stack cannot contain empty strings', 400);
      }

      $this->stack[$i] = $technology;
    }
  }

  /**
   * @return void
   * @throws ApiException
   */
  public function validateCredentialIds(): void
  {
    if (!$this->credentialIds) {
      return;
    }

    $data = Data::read();

    $existingCredentialIds = array_map(function (Credential $credential) {
      return $credential->id;
    }, $data->credentials);

    foreach ($this->credentialIds as $credentialId) {
      if (!in_array($credentialId, $existingCredentialIds)) {
        throw new ApiException("Cannot find credential with id $credentialId", 400);
      }
    }
  }

  /**
   * @return bool
   */
  public function isLocal(): bool
  {
    return Utils::isLocalUrl($this->url);
  }

  /**
   * @return bool
   */
  public function isAdmin(): bool
  {
    if ($this->isLocal()) {
      return Utils::strStartsWith($this->getPath(), self::ROOT_PATH . 'admin');
    }

    return false;
  }

  /**
   * @return int[]|null
   */
  public function getCredentialIds(): ?array
  {
    return $this->credentialIds;
  }

  /**
   * @return string|null
   */
  public function getPath(): ?string
  {
    if (!$this->isLocal()) {
      return null;
    }

    $path = self::ROOT_PATH . Utils::trimSlashes(Utils::makeRelUrl($this->url));

    return is_file($path) ? dirname($path) : $path;
  }

  /**
   * @return void
   */
  public function checkActiveness(): void
  {
    if ($this->isLocal()) {
      $this->active = is_dir($this->getPath());
    } else {
      $this->active = true;
    }
  }

  /**
   * @param object|object[] $params
   * @return Site[]
   */
  public static function getFromRequestParams($params): array
  {
    return array_map(
      function ($params) {
        return new self(
          $params->id ?? null,
          $params->name ?? null,
          $params->description ?? null,
          $params->images ?? null,
          $params->year ?? null,
          $params->url ?? null,
          $params->github ?? null,
          $params->stack ?? null,
          null,
          $params->public ?? null,
          $params->credentialIds ?? null
        );
      },
      is_array($params) ? $params : [$params]
    );
  }
}
