<?php

error_reporting(E_ERROR | E_PARSE);

require_once __DIR__ . '/ApiException.php';
require_once __DIR__ . '/Credentials.php';
require_once __DIR__ . '/Sites.php';
require_once __DIR__ . '/Auth.php';

class Api
{
  /**
   * @var callable[]
   */
  private static $callbacks = [];

  /**
   * @return mixed
   * @throws ApiException
   */
  public static function getRequestParams()
  {
    $headers = getallheaders();
    $contentType = 'application/json';

    foreach ($headers as $headerKey => $headerValue) {
      if (strtolower($headerKey) === 'content-type') {
        $contentType = $headerValue;
        break;
      }
    }

    if ($contentType === 'application/json') {
      try {
        $body = json_decode(file_get_contents('php://input'), false, 512, JSON_THROW_ON_ERROR);

        return $body;
      } catch (Exception $exception) {
        throw new ApiException('Invalid body json', 400, $exception);
      }
    }

    return $_POST;
  }

  /**
   * @param mixed $response
   * @param int $code
   * @return void
   */
  public static function sendResponse($response, $code = 200): void
  {
    http_response_code($code);
    header('Cache-Control: no-store, no-cache, must-revalidate');
    header('Content-Type: application/json', false);
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
  }

  /**
   * @param string $message
   * @param int $code
   * @return void
   */
  public static function sendError(string $message, int $code): void
  {
    self::sendResponse(
      [
        'status' => 'error',
        'message' => $message
      ],
      $code
    );
  }

  /**
   * @param mixed $data
   * @param int $code
   * @return void
   */
  public static function sendSuccess($data = null, int $code = 200): void
  {
    self::sendResponse(
      [
        'status' => 'success',
        'data' => $data
      ],
      $code
    );
  }

  /**
   * @param callable $callback
   * @return void
   */
  public static function post(callable $callback): void
  {
    self::$callbacks['POST'] = $callback;
  }

  /**
   * @param callable $callback
   * @return void
   */
  public static function get(callable $callback): void
  {
    self::$callbacks['GET'] = $callback;
  }

  /**
   * @param callable $callback
   * @return void
   */
  public static function put(callable $callback): void
  {
    self::$callbacks['PUT'] = $callback;
  }

  /**
   * @param callable $callback
   * @return void
   */
  public static function delete(callable $callback): void
  {
    self::$callbacks['DELETE'] = $callback;
  }

  /**
   * @return void
   */
  public static function run(): void
  {
    if ($_SERVER['SERVER_NAME'] !== '127.0.0.1' && !Auth::isAuthorized()) {
      Api::sendError('Unauthorized', 401);
    }

    set_exception_handler(function () {
      Api::sendError('Internal server error', 500);
    });

    $method = $_SERVER['REQUEST_METHOD'];
    $callback = self::$callbacks[$method] ?? null;

    if ($callback) {
      try {
        $callback();
      } catch (ApiException $apiException) {
        self::sendError($apiException->getMessage(), $apiException->getCode());
      }
    } else {
      self::sendError('Not implemented', 501);
    }
  }
}
