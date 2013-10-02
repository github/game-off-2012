function collideRoundSquare(o, b) {
	var y1 = o.y - o.r
	var h1 = o.r * 2
	var y2 = b.y
	var h2 = b.h
	var x1 = o.x - o.r
	var w1 = o.r * 2
	var x2 = b.x
	var w2 = b.w
	return !(y1 + h1 < y2 || y1 > y2 + h2 || x1 + w1 < x2 || x1 > x2 + w2)
}

function collideRoundRound(o, b) {
	var y1 = o.y - o.r
	var h1 = o.r * 2
	var y2 = b.y - b.r
	var h2 = b.r * 2
	var x1 = o.x - o.r
	var w1 = o.r * 2
	var x2 = b.x - b.r
	var w2 = b.r * 2
	return !(y1 + h1 < y2 || y1 > y2 + h2 || x1 + w1 < x2 || x1 > x2 + w2)
}
