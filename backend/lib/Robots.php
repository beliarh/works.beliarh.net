<?php

require_once __DIR__ . '/ApiException.php';
require_once __DIR__ . '/Data.php';
require_once __DIR__ . '/Site.php';

class Robots
{
  private const PATH = __DIR__ . '/../../public_html/robots.txt';

  /**
   * @return void
   * @throws ApiException
   */
  public static function update(): void
  {
    $data = Data::read();
    $robotsTxt = ['User-agent: *'];

    $restrictedSites = array_filter($data->sites, function (Site $site) {
      return $site->isLocal() && !$site->public;
    });

    if (!empty($restrictedSites)) {
      foreach ($restrictedSites as $site) {
        $robotsTxt[] = "Disallow: {$site->url}";
      }
    } else {
      $robotsTxt[] = 'Disallow:';
    }

    $robotsTxt = join("\n", $robotsTxt);

    if (file_put_contents(self::PATH, $robotsTxt) === false) {
      throw new ApiException('Unable to update robots.txt', 500);
    }
  }
}
