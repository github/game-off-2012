#= require colors

window.Utils =

  polarCnv: (rad, ang) ->
    convertedAngle = ang * Math.PI / 180
    {
      x: rad * Math.cos(convertedAngle)
      y: rad * Math.sin(convertedAngle)
    }

  change_hue: (hex, val) ->
    hex = hex.replace(/^\s*#|\s*$/g, '');
    hex = hex.replace(/(.)/g, '$1$1') if hex.length == 3

    r = parseInt(hex.substr(0, 2), 16)
    g = parseInt(hex.substr(2, 2), 16)
    b = parseInt(hex.substr(4, 2), 16)

    res = rgbToHsl(r, g, b)
    res = hslToRgb(res[0] * val , res[1], res[2])

    r = res[0]
    g = res[1]
    b = res[2]

    return '#' +
    (0|(1<<8) + r).toString(16).substr(1) +
    (0|(1<<8) + g).toString(16).substr(1) +
    (0|(1<<8) + b).toString(16).substr(1)

String.prototype.format = ->
  args = arguments
  return this.replace /{(\d+)}/g, (match, number) ->
    if typeof args[number] != 'undefined' then args[number] else match