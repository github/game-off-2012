<?php
$addr = $_SERVER['REMOTE_ADDR'];
if ($addr !== '207.97.227.253' && $addr !== '50.57.128.197' && $addr !== '108.171.174.178') {
    echo "Access denied!";
    exit;
}
exec('git pull &> ../gitdefence.log');