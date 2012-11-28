var sprites = {

  background : new Sprite({
    filename: 'background.png'
  }),

  background_conveyer_belts : new Sprite({
    filename: 'background_conveyer_belts.png'
  }),

  background_boxes : new Sprite({
    filename: 'spritesheet_background_boxes.png',
    frames:[
      [0, 602, 633, 288],
      [0, 315, 640, 286],
      [0, 0, 640, 314],
      [641, 309, 613, 305],
      [641, 0, 632, 308]
    ]
  }),

  machine_back : new Sprite({
    filename: 'machine_back.png'
  }),

  dashboard : new Sprite({
    filename: 'dashboard.png'
  }),

  belts : new Sprite({
    filename: 'belts.png'
  }),

  machine_front : new Sprite({
    filename: 'machine_front.png',
  }),

  boxes : new Sprite({
    filename: 'boxes.png'
  }),

  octo_clone : new Sprite({
    filename: 'spritesheet_octo_clone.png',
    frames:[
      [0, 0, 71, 111],
      [72, 0, 52, 120]
    ]
  })
};

var markers = {
  marker_clone : new Sprite({
    filename: 'marker_clone.png'
  }),
}
