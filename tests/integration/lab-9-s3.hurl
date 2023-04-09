# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain; charset=utf-8 
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in `...` when it's a string (deprecated to single quote)
`Hello S3!`

# Confirm that the server returns a 201, and capture the Location header value to a variable named url
HTTP/1.1 201
[Captures]
url: header "Location"

# Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "Hello S3!"

#DELETE the fragment using the url as an authorized user.
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 200.
HTTP/1.1 200

# Try to GET the fragment again using the url as an authorized user.
# Confirm that the server returns a 404, since the fragment should be deleted
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404
