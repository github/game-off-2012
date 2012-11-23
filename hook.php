<?php
$addr = $_SERVER['REMOTE_ADDR'];
if ($addr !== '207.97.227.253' && $addr !== '50.57.128.197' && $addr !== '108.171.174.178') {
    exec("echo 'Access denied! $addr' >> ../gitdefence.log");
    exit;
}
exec("echo 'pulling down... $addr' >> ../gitdefence.log")
exec('git pull >> ../gitdefence.log 2>&1');