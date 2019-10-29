<?php

require_once __DIR__ . '/Utils.php';
require_once __DIR__ . '/ApiException.php';

class Upload
{
  /**
   * @var string[]
   */
  private static $fileMimeTypes = [];

  /**
   * @param int $size
   * @return string
   */
  private static function humanizeFileSize(int $size): string
  {
    $i = (int) floor(log($size, 1024));
    $size /= pow(1024, $i);
    $unit = ['b', 'kb', 'mb', 'gb', 'tb'][$i];
    $precision = [0, 0, 2, 2, 3][$i];

    return round($size, $precision) . $unit;
  }

  /**
   * @param array $file
   * @return string
   * @throws ApiException
   */
  private static function getMimeType(array $file): string
  {
    if (!isset(self::$fileMimeTypes[$file['tmp_name']])) {
      $finfo = finfo_open(FILEINFO_MIME_TYPE);

      if (!$finfo) {
        throw new ApiException('Unable to open finfo', 500);
      }

      self::$fileMimeTypes[$file['tmp_name']] = finfo_file($finfo, $file['tmp_name']) ?: '';
      finfo_close($finfo);
    }

    return self::$fileMimeTypes[$file['tmp_name']];
  }

  /**
   * @param string $mimeType
   * @return string|null
   */
  private static function getExtensionByMimeType(string $mimeType): ?string
  {
    $mapMimeTypeToExtension = [
      'image/jpeg' => 'jpg',
      'image/png' => 'png'
    ];

    return $mapMimeTypeToExtension[$mimeType] ?? null;
  }

  /**
   * @param array $file
   * @return string
   * @throws ApiException
   */
  private static function getExtension(array $file): string
  {
    $mimeType = self::getMimeType($file);

    return self::getExtensionByMimeType($mimeType) ?: pathinfo($file['name'], PATHINFO_EXTENSION);
  }

  /**
   * @param array|null $file
   * @param int|null $maxSize
   * @param string[]|null $mimeTypes
   * @return void
   * @throws ApiException
   */
  public static function validate(?array $file, int $maxSize = null, array $mimeTypes = null): void
  {
    self::validateFile($file);

    if ($maxSize) {
      self::validateSize($file, $maxSize);
    }

    if ($mimeTypes) {
      self::validateMimeType($file, $mimeTypes);
    }
  }

  /**
   * @param array|null $file
   * @return void
   * @throws ApiException
   */
  public static function validateFile(?array $file): void
  {
    if (!$file) {
      throw new ApiException('No file was uploaded', 400);
    }

    if ($file['error'] !== UPLOAD_ERR_OK) {
      $errors = [
        UPLOAD_ERR_INI_SIZE => [400, 'The uploaded file exceeds the upload_max_filesize directive in php.ini'],
        UPLOAD_ERR_FORM_SIZE => [400, 'The uploaded file exceeds the MAX_FILE_SIZE directive in the HTML form'],
        UPLOAD_ERR_PARTIAL => [400, 'The uploaded file was only partially uploaded'],
        UPLOAD_ERR_NO_FILE => [400, 'No file was uploaded'],
        UPLOAD_ERR_NO_TMP_DIR => [500, 'Missing a temporary folder'],
        UPLOAD_ERR_CANT_WRITE => [500, 'Failed to write file to disk'],
        UPLOAD_ERR_EXTENSION => [500, 'A PHP extension stopped the file upload']
      ];

      [$code, $message] = $errors[$file['error']] ?? [500, 'Unknown upload error'];

      throw new ApiException($message, $code);
    }

    if (!is_uploaded_file($file['tmp_name'])) {
      throw new ApiException('No file was uploaded', 400);
    }
  }

  /**
   * @param array $file
   * @param string[] $mimeTypes
   * @return void
   * @throws ApiException
   */
  public static function validateMimeType(array $file, array $mimeTypes): void
  {
    if (!in_array(self::getMimeType($file), $mimeTypes)) {
      throw new ApiException('Invalid mime type', 400);
    }
  }

  /**
   * @param array $file
   * @param int $maxSize
   * @return void
   * @throws ApiException
   */
  public static function validateSize(array $file, int $maxSize): void
  {
    if ($file['size'] > $maxSize) {
      $strMaxSize = self::humanizeFileSize($maxSize);
      throw new ApiException("File size must be less than $strMaxSize", 400);
    }
  }

  /**
   * @param array $file
   * @param string $dirPath
   * @return string
   * @throws ApiException
   */
  public static function save(array $file, string $dirPath): string
  {
    $hash = hash_file('md5', $file['tmp_name']);
    $extension = self::getExtension($file);
    $filename = join('.', [$hash, $extension]);

    Utils::createDirIfNotExists($dirPath);

    if (!move_uploaded_file($file['tmp_name'], "$dirPath/$filename")) {
      throw new ApiException('Unable to save file', 500);
    }

    return $filename;
  }
}
