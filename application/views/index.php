<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Welcome to Fork It!</title>
    
    <!-- Resources -->
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
    <script type="text/javascript" src="js/utilities/underscore-min.js"></script>
    <script type="text/javascript" src="js/crafty.js"></script>
    <script type="text/javascript" src="js/components/components.js"></script>
    <script type="text/javascript" src="js/components/box.js"></script>
    <script type="text/javascript" src="js/components/floor.js"></script>
    <script type="text/javascript" src="js/components/movement.js"></script>
    <script type="text/javascript" src="js/components/player.js"></script>
    <script type="text/javascript" src="js/scenes/loading.js"></script>
    <script type="text/javascript" src="js/levelManager.js"></script>
    <script type="text/javascript" src="js/scenes/gameBoard.js"></script>
    <script type="text/javascript" src="js/game.js"></script>
    <link href="css/common.css" rel="stylesheet" type="text/css">
    <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Scada' rel='stylesheet' type='text/css'>
</head>
<body>
    <img id="gameTitle" src="images/title.png" />

    <div id="container">
        <div id="cr-stage"></div>
        <div id="levelTitle">Level 1: Moving blocks</div>
        <div id="levelReset" onclick="levelManager.resetLevel();"><div class="largeText">RESET</div><div class="smallText">level</div></div>
        <div class="clear"></div>
        <div id="levelText">To pass this level, you will need to use the SPACEBAR to grab and move blocks.</div>
        <div id="controlText">
            <span class="headerText">How To Play</span><br />
            <span><b>Movement</b>: <b>W</b> (up) <b>A</b> (left) <b>S</b> (down) <b>U</b> (up)</span><br />
            <span><b>Move Blocks</b>: Hold <b>SPACEBAR</b> to grab a block.  Use the movement keys to move the block</span><br />
            <span><b>Remove Blocks</b>: <b>F</b> (There must be 3 touching blocks of the same color)</span><br />
            <span><b>Take / Give Color</b>: <b>E</b> (Blocks with a white outline are <b>NOT</b> colorable)</span><br /><br />
            <span class="headerText">Block Types</span><br />
            <span><b>Colored Box</b>: These colored boxes can be pushed and pulled. You can also take and give colors to them. </span><br />
            <span><b>Stationary Box</b>: These boxes are screwed to the floor.  They can not be pushed but they can still be removed by joining together other boxes of the same color!</span><br />
            <span><b>Single Color Box</b>: Boxes with a white outline cannot have color taken or given to them.  They are locked to a single color.</span><br />
        </div>
    </div>
</body>
</html>
