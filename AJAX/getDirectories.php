<?php 
$path = "../" . $_REQUEST['path'];
$out = array();

//debugginh
// echo $path."<br>";

if (is_dir($path)) {
    if ($dh = opendir($path)) {
        while (($dir = readdir($dh)) !== false) {
            //debugging
            // echo "filename: $file : filetype: " . filetype($path . $file) . "<br>";
            $dirPath = $path . $dir;
            // echo $filePath . "<br>";
            if (is_dir($dirPath) && $dir != "." && $dir != ".." ) {
                $out[] = $dir . "/";
            }
        }
        closedir($dh);
    }
}
echo json_encode($out);
?>