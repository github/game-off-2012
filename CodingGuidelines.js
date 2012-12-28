//Gives example of correct and incorrect (but mostly correct), anything not mentioned
//in here should be coded to be relatively readable.


//A lot of these rules specialized, so if it is a function section, it doesn't apply to while loops,
//objects, or anything else... but functions. The general idea is that if a rule applies a lot of the
//time, but not all the time, we don't automatically apply it. No need to lose quality for laziness,
//we only need to implement the parser once and the number of keywords are finite anyway...
function everything() {

    //CORRECT STUFF:
    function correct() {
        //FUNCTION START
        function args (a, b) {
            return a + b;
        }

        function noArgs () {
            return 1;
        }

        var anon = function() {
            return 1;
        }

        var anon = function (a, b) {
            return 1;
        }
        //FUNCTION END

        //IF START
        if (true) {
        }

        if (true)
            return false;
        else if (false)
            return true;

        if (true) {
            return false;
        }
        else if (false) {
            return true;
        }

        if (true) return whynot;
        else return lololol;

        if (true) {
            return true;
        } else {
            while(true) {
                return true;
            }
        }

        //WRONG! But, the parser should still not make it worse! It should add braces or leave it be
        if (true)
            return nononono;
        else {
            return aahhhhhh;
        }

        //WRONG! But, the parser should still not make it worse! It should add braces or leave it be
        if (true) {
            return nononono;
        } else
            return aahhhhhh;

        //IF END


        //WHILE START
        while (true) {
        }
        //WHILE END

        //DO  START
        do {
        } while(false);
        //DO END

        for (var x = 0; x < 0; x++) {
            //stuff here
        }

        //Okay not the best... but... sometimes it is much better
        for (var x = 0; x < 0; x++)
            return false;

        //Also, not ideal
        while (true)
            return false;

        while (true) return false;
    }

    //INCORRECT STUFF:
    function incorrect() {
        //FUNCTION START
        function args(a, b)
        {
        return a + b;
        }

        function noArgs(){
            return 1;
        }

        var anon = function(){
            return 1;
        }

        var anon = function(a, b){
            return 1;
        }
        //FUNCTION END

        //IF START
        if(true){
        }

        if(true)
        return false;
        else
        if (false)
            return true;

        if(true)
            return whynot;
        else return lololol;

        //While should have braces around it... or be on next line
        if (true) {
            return true;
        } else while(true) {
            return true;
        }

        //You can put if on same line as else... in fact you really should
        if (true) {
            return true;
        } else
            if(true) {
                return true;
            }

        //WRONG! But, the parser should still not make it worse! It should add braces or leave it be
        if(true)
        return nononono;
        else
        {
            return aahhhhhh;
        }

        //WRONG! But, the parser should still not make it worse! It should add braces or leave it be
        if(true)
        {
            return nononono;
        }
        else
        return aahhhhhh;

        //IF END


        //WHILE START
        while(true)
        {
        }
        //WHILE END

        //DO  START
        do
        {
        }
        while(false);
        //DO END


        for (var x = 0; x < 0; x++)
        {//Why would you do such a thing!
            //stuff here
        }
    }
}