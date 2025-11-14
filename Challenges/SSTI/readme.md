This is a simple web challenge where the server takes the text you enter and tries to render it as a Jinja2 template.  
Your goal is to explore how the template system works and find a way to make it reveal the **hidden flag** stored inside the server.

##How to Run the Challenge (Local Setup)
1.Build the Docker image
docker build -t template-playground .

2.Run the container
docker run --rm -p 5000:5000 --name tpl template-playground

3.Open the challenge in your browser
http://localhost:5000



###Flag format:
CTF{...}

