function Sprite(el) {
	var x = 0;
	var y = 0;
	var cb;
	var type = "";
	var el;
	if (el === undefined) {
		el = document.createElement('div');
		document.getElementById('view').appendChild(el);
	}
	this.x = function(newx) {
		if (newx !== undefined) {
			x = newx;
			el.style.left = x+'px';
			return this;
		}
		return x;
	}
	
	this.y = function(newy) {
		if (newy !== undefined) {
			y = newy;
			el.style.top = y+'px';
			return this;
		}
		return y;
	}
	
	this.type = function(newtype) {
		if (newtype !== undefined) {
			type = newtype;
			el.className = newtype;
			return this;
		}
		return type;
	}
	
	this.render = function() {
		return;
	}
	
	this.dispose = function() {
		el.remove();
	}
	
	this.click = function(cb) {
		if (cb !== undefined) {
			el.onclick = cb;
			return this;
		}
		el.onclick();
	}
}