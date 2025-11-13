This is a web-based CTF challenge that involves a vulnerable file viewer.  
Players must exploit a **path traversal vulnerability** to escape the allowed
directory and retrieve a secret flag located deep inside the server filesystem.

docker build -t path-traversal .
docker run --rm -p 5000:5000 --name path-traversal path-traversal
http://localhost:5000

