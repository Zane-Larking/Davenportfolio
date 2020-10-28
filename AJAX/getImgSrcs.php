<?php 
$path = "../" .$_REQUEST['path'];
$out = array();

//debugginh
// echo $path."<br>";

if (is_dir($path)) {
    if ($dh = opendir($path)) {
        while (($file = readdir($dh)) !== false) {
            //debugging
            // echo "filename: $file : filetype: " . filetype($path . $file) . "<br>";
            $filePath = $path . $file;
            // echo $filePath . "<br>";
            if (filetype($filePath) == "file") {
                $p = pathinfo($file);
                $out[] = $_REQUEST['path'] . $p['filename'] . "." . pathinfo($filePath, PATHINFO_EXTENSION);
            }
        }
        closedir($dh);
    }
}
echo json_encode($out);
?>