<?php
class Map_model extends CI_Model {
    
    function get_map($level)
    {
        $f=fopen("maps/map$level.txt","r");
        $map = array();
        $i = 0;
        $object = '{"layers": [';
        // read file contents into JSON object
        if($f){
            $line = chop(fgets($f, 4096));
            $dimensions = explode(",", $line);
            $xLen = $dimensions[0];
            $yLen = $dimensions[1];
            
            while (!feof($f)) {
                $line = chop(fgets($f, 4096));
                
                $map[$i] = str_split($line);
                $i++;
                
                if ($i == $yLen) {
                    $i = 0;
                    $object .= json_encode($map);
                    $object .= ',';
                    $map = array();
                }
                
                if ($line == "METADATA")
                    break;
            }
            
            $object = substr($object, 0, -1);
            $object .= '], "metadata": {';
            
            while (!feof($f)) {
                $line = chop(fgets($f, 4096));
                $explosion = explode(':', $line, 2);
                $lineTemp = '"'.$explosion[0].'": "'.$explosion[1].'",';
                $object .= $lineTemp;
            }
            $object = substr($object, 0, -1);
            $object .= '}}';
            
            fclose($f);
        }
        
        return $object;
    }
}