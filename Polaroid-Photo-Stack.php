<?php
$location = 'images/photos';
$album_name	= $_GET['albumName'];
$files = glob($location . '/' . $album_name . '/*.{jpg,gif,png}', GLOB_BRACE);
$encoded = json_encode($files);
echo $encoded;
unset($encoded);
?>