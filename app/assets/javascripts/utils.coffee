window.Utils =
  increase_brightness: (hex, percent) ->
    hex = hex.replace(/^\s*#|\s*$/g, '');
    hex = hex.replace(/(.)/g, '$1$1') if hex.length == 3

    r = parseInt(hex.substr(0, 2), 16)
    g = parseInt(hex.substr(2, 2), 16)
    b = parseInt(hex.substr(4, 2), 16)

    return '#' +
         ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
         ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
         ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1)

  polarCnv: (rad, ang) ->
    convertedAngle = ang * Math.PI / 180
    {
      x: rad * Math.cos(convertedAngle)
      y: rad * Math.sin(convertedAngle)
    }
