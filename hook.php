<?php
$addr = $_SERVER['REMOTE_ADDR'];
if ($addr !== '207.97.227.253' && $addr !== '50.57.128.197' && $addr !== '108.171.174.178' && $addr !== '50.57.231.61') {
    exec("echo 'Access denied to $addr' >> ../gitdefence.log");
    exit;
}

$payload = json_decode($_POST['payload']);
$branch = explode('/', $payload->ref);
$branch = $branch[2];
echo "Branch: '$branch'";
exec("echo 'pulling down $branch from $addr' >> gitdefence.log");

if (is_dir($branch)) {
    chdir($branch);
    exec("git checkout $branch >> ../gitdefence.log 2>&1");
    exec("git pull origin $branch >> ../gitdefence.log 2>&1");
} else {
    mkdir($branch);
    chdir($branch);
    exec("echo 'creating new repo for branch $branch' >> 
    ../gitdefence.log");
    exec("git clone git://github.com/gitdefence/game-off-2012.git . >> 
    ../gitdefence.log 2>&1");
    exec("git checkout $branch >> ../gitdefence.log 2>&1");
}
