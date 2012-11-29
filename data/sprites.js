var sprites = {

  background : new Sprite({
    filename: 'background.png'
  }),

  background_boxes : new Sprite({
    filename: 'spritesheet_background_boxes.png',
    frames:[
      [0, 0, 640, 340],
      [0, 341, 640, 340],
      [0, 682, 640, 340],
      [641, 0, 640, 340],
      [641, 341, 640, 340]
    ],
    destX : 0,
    destY : 60,
    continuous: true,
    duration : 1500
  }),

  machine_back : new Sprite({
    filename: 'machine_back.png',
    destX : 28,
    destY : 56
  }),

  octo_legs : new Sprite({
    filename: 'spritesheet_octo_legs.png',
    frames:[
      [0, 0, 102, 100],
      [103, 0, 102, 100]
    ],
    destX : 479,
    destY : 351,
    continuous: true,
    duration : 1000
  }),

  dashboard : new Sprite({
    filename: 'dashboard.png',
    destX : 0,
    destY : 429,
  }),

  octo_clone : new Sprite({
    filename: 'spritesheet_octo_clone.png',
    frames:[
      [0, 0, 71, 120],
      [72, 0, 71, 120]
    ],
    destX : 560,
    destY : 334
  }),

  octo_fork : new Sprite({
    filename: 'spritesheet_octo_fork.png',
    frames:[
      [0, 0, 500, 90],
      [0, 91, 500, 90]
    ],
    destX : 4,
    destY : 300
  }),

  octo_pull : new Sprite({
    filename: 'spritesheet_octo_pull.png',
    frames:[
      [0, 0, 57, 249],
      [58, 0, 57, 249]
    ],
    destX : 435,
    destY : 92
  }),

  octo_push : new Sprite({
    filename: 'spritesheet_octo_push.png',
    frames:[
      [0, 0, 50, 86],
      [51, 0, 50, 86]
    ],
    destX : 475,
    destY : 365
  }),

  octo_body : new Sprite({
    filename: 'octo_body.png',
    destX : 472,
    destY : 221
  }),

  octo_face : new Sprite({
    filename: 'spritesheet_octo_face.png',
    frames:[
      [0, 0, 85, 43],
      [0, 44, 85, 43],
      [86, 0, 85, 43],
      [86, 44, 85, 43]
    ],
    destX : 474,
    destY : 277
  }),

  music : new Sprite({
    filename: 'spritesheet_music.png',
    frames:[
      [0, 0, 27, 32],
	  [28, 0, 27, 32]
    ],
    destX : 582,
    destY : 218,
    continuous: true,
    duration : 500
  }),

  octo_grinder_back : new Sprite({
    filename: 'spritesheet_grinder_back.png',
    frames:[
      [0, 0, 413, 39],
	  [0, 40, 413, 39],
      [0, 80, 413, 39],
      [0, 120, 413, 39]
    ],
    destX : 19,
    destY : 440,
    continuous: true,
    duration : 500
  }),

  belts : new Sprite({
    filename: 'belts.png',
    destX : 36,
    destY : 0
  }),

  boxes : new Sprite({
    filename: 'boxes.png',
    destX : 0,
    destY : 381
  }),

  octo_grinder_front : new Sprite({
    filename: 'spritesheet_grinder_front.png',
    frames:[
      [0, 0, 439, 27],
	  [0, 28, 439, 27],
      [0, 56, 439, 27],
      [0, 84, 439, 27]
    ],
    destX : 6,
    destY : 453,
    continuous: true,
    duration : 500
  }),

  machine_front : new Sprite({
    filename: 'machine_front.png',
    destX : 0,
    destY : 0
  }),

  flexible_pipe : new Sprite({
    filename: 'spritesheet_flexible_pipe.png',
    frames:[
      [0, 0, 110, 41],
      [0, 42, 110, 41],
      [0, 84, 110, 41]
    ],
    destX : 453,
    destY : 0,
    continuous: true,
    duration : 500
  })
};

var markers = [
  new Sprite({filename: 'marker_fork.png'}),
  new Sprite({filename: 'marker_push.png'}),
  new Sprite({filename: 'marker_pull.png'}),
  new Sprite({filename: 'marker_clone.png'})
]
