<?php

$rootPath = "../src/assets/i18n/";
$languages = array(1 => $rootPath."en_GB.json", 2 => $rootPath."de_AT.json");

foreach ($languages as $language => $outputFilename) {
  $translations = getBackEndTranslations($language);

  $julieGeneralTranslations = getJulieGeneralTranslations($language);
  $translations->general = $julieGeneralTranslations;

  echo "Generating output file for language #$language: $outputFilename" . PHP_EOL;
  file_put_contents("./$outputFilename", json_encode($translations,JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

function getBackEndTranslations($language) {
  $translations = getTranslations(12, $language);

  $sections = array("BackEnd_WikiLanguage", "FrontEnd_WikiLanguage");

  foreach ($sections as $section) {
    $translations->{$section} = (array)$translations->{$section};
    foreach ($translations->{$section} as $key => $value) {
      if (property_exists($value,"text")) {
        $translations->{$section}[$key] = $value->text;
      }
    }
    $translations->{$section} = (object)$translations->{$section};
  }

  return $translations;
}

function getJulieGeneralTranslations($language) {
  $translations = getTranslations(25, $language);

  return $translations->general;
}

function getTranslations($projectId, $language) {
  echo "Load language #$language from project #$projectId" . PHP_EOL;
  $apiRootUrl = 'https://gsrv001.easy-booking.at/ebTranslate/api/v1/translation/easybooking';
  $contents = file_get_contents("$apiRootUrl/$projectId/$language/latest");
  if (!$contents) {
    echo 'ERROR: could not open url' . PHP_EOL;
    exit;
  }
  return json_decode($contents);
}

?>
