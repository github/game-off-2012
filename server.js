var http = require("http");
var fs = require("fs");
var mime = require("mime");
http.createServer(function(req, res){
	var path = __dirname+req.url
	var file, type;
	try{
		file = fs.readFileSync(path);
		type = mime.lookup(path)
	}catch(e){
		file = ""
	}
	console.log(mime.lookup(path))
	res.writeHead(200, {'Content-Type':type});
	res.end(file)
}).listen(8080, '127.0.0.1');
console.log("running")
