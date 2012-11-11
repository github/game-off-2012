<?php
class Map_model extends CI_Model {
    
    function get_map($level)
    {
        $f=fopen("maps/map$level.txt","r");
        $map = array();
        $i = 0;
        if($f){
            while (!feof($f)) {
                $line = chop(fgets($f, 4096));
                $map[$i] = str_split($line);
                $i++;
            }
            fclose($f);
        }
        
        return json_encode($map);
    }
}