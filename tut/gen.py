import markdown

f = open("index.html", "w"); 
f.write(open("tut/html/begin.html").read())
f.write(markdown.markdown(open("README.md").read()))
f.write(open("tut/html/end.html").read())
