// Loads all the scripts in this folder (well, at least, as of now...)
(function() {
    function loadScript(name) {
        var s = document.createElement('script')
        s.src = 'ui/' + name + '.js';
        document.getElementById('scripts').appendChild(s);
    }
    scripts = [
        'button',
        'label',
        'radioButton',
        'textBox',
        'toggleButton',
        'textWrapper',
        'vbox',
        'hbox',
    ];
    for (var i = 0; i < scripts.length; i++) {
        loadScript(scripts[i]);
    }
}())