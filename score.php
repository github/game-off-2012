<?php
// SERVER SIDE SCRIPT USED TO SAVE SCORE AND RETURN RANKING
mysql_connect('localhost', 'USERNAME', 'PASSWORD');
mysql_select_db('hotfixscores');


if (isset($_REQUEST['score'])) {
	$time = time();
	$score = intval($_REQUEST['score']);
	if ($score < 0) {
		$score = 0;
	}
	
	mysql_query('INSERT INTO scores (score, created_at) VALUES ('.mysql_real_escape_string($score).', '.mysql_real_escape_string($time).');');
	
	$rank_24 = 0;
	$total_24 = 0;
	
	$query = 'SELECT COUNT(id) as nb FROM scores WHERE score > '.mysql_real_escape_string($score).' AND created_at > '.mysql_real_escape_string($time - 24 * 3600).';';

	$result = mysql_query($query);
	while ($res = mysql_fetch_array($result)) {
		$rank_24 = $res['nb'] + 1;
	}
	
	$query = 'SELECT COUNT(id) as nb FROM scores WHERE created_at > '.mysql_real_escape_string($time - 24 * 3600).';';
	$result = mysql_query($query);
	while ($res = mysql_fetch_array($result)) {
		$total_24 = $res['nb'];
	}
	
	
	$rank_overall = 0;
	$total_overall = 0;
	
	$query = 'SELECT COUNT(id) as nb FROM scores WHERE score > '.mysql_real_escape_string($score).';';
	
	$result = mysql_query($query);
	while ($res = mysql_fetch_array($result)) {
		$rank_overall = $res['nb'] + 1;
	}
	
	$query = 'SELECT COUNT(id) as nb FROM scores;';
	$result = mysql_query($query);
	while ($res = mysql_fetch_array($result)) {
		$total_overall = $res['nb'];
	}
	
	
	
	
	
	
	echo $rank_24.' / '.$total_24.':'.$rank_overall.' / '.$total_overall;

}
