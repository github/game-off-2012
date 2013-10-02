function Controls(){
	if(localStorage.keyMaps)
		this.keyMaps = JSON.parse(localStorage.keyMaps)
	else
		this.keyMaps = {
			1 : [['A', 'F'], ['A', 'F'], ['A', 'F'], ['A', 'F']],
			4 : [['A', 'S'], ['D', 'F'], ['J', 'K'], ['L', ';']]
		}
	this.colors = ["#E67373", "#ECEC85", "#9DE970", "#708EE9"]//red, yellow, green, blue
	
	//This should be done with backbone/knockout.js, but I like small footprints
	this.showControls=function(){
		var controls=document.getElementById("controls")
		controls.innerHTML=""
		for(var i =0;i<this.keyMaps[4].length;i++){
			var keys = this.keyMaps[4][i]
			var color = this.colors[i]
			for(var k=0;k<keys.length;k++){
				var key = document.createElement("span")
				key.setAttribute("class","key")
				key.setAttribute("style","background-color:"+color+";")
				key.innerHTML=keys[k]
				key.my={}
				key.my.row=i
				key.my.col=k
				function keyClick(e){
					if(selecting){
						alert("please type either a number or letter")
						return
					}
					selecting=true
					this.innerHTML="_"
					var self = this
					var oldKeydown = window.onkeydown
					global_controls.keyMaps[4][self.my.row][self.my.col]=""
					window.onkeydown=function(e){
						var valid = new RegExp("\\w")
						var tar=String.fromCharCode(e.which)
						if(valid.test(tar)){
							if(global_controls.notUsed(tar)){
								self.innerHTML=tar
								global_controls.keyMaps[4][self.my.row][self.my.col]=tar
								localStorage.keyMaps=JSON.stringify(global_controls.keyMaps)
								window.onkeydown=oldKeydown
								selecting=false
							}
							else{
								alert("That key is already in use,\ntry again")
							}
						}
						else{
							alert("please type either a number or letter")
						}
					}
				}
				key.onclick=keyClick
				controls.appendChild(key)
			}
		}	
	}
	this.notUsed=function(tar){
		var keys = this.keyMaps[4].join('')//a,sd,fj...
		return keys.indexOf(tar)==-1
	}
	this.reset=function(){
		this.keyMaps = {
			1 : [['A', 'F'], ['A', 'F'], ['A', 'F'], ['A', 'F']],
			4 : [['A', 'S'], ['D', 'F'], ['J', 'K'], ['L', ';']]
		}
		localStorage.keyMaps=JSON.stringify(global_controls.keyMaps)
		this.showControls()
	}
	this.showControls()
}
