# tests/integration/lab-10-dynamodb.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a application/json fragment
Content-Type: application/json
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# The fragment's body should be the JSON value
{ "service": "DynamoDB" }

#Confirm that server returns 201,capture Location header value and id
HTTP/1.1 201
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

#GET the fragment info using the Location URL/info

GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

#Confirm that server returns 201,capture Location value and second id
HTTP/1.1 200

[Asserts]
# The Location header should look like what we expect (including the fragment id)
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.id" == {{fragment1_id}}

#-------------------------------------------------------------------------------------
#POST a second Markdown fragment as same user
POST http://localhost:8080/v1/fragments

Content-Type: text/markdown

[BasicAuth]
user1@email.com:password1

`DynamoDB is **great**.`

#Confirm server returns a 201 and capture location and id

HTTP/1.1 201

[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

#GET the fragment2 info using the Location URL/info

GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

#Confirm that server returns 201,capture Location value and second id
HTTP/1.1 200

[Asserts]
# The Location header should look like what we expect (including the fragment id)
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.id" == {{fragment2_id}}

#----------------------------------------------------------------------------------
#GET all of the fragments without expanding them
GET http://localhost:8080/v1/fragments

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

#DELETE the first fragment you created
DELETE {{fragment1_url}}

[BasicAuth]
user1@email.com:password1

#Confirm that the server returns a 200
HTTP/1.1 200

#Try to GET the first fragment using captured URL as authorized user
GET {{fragment1_url}}

[BasicAuth]
user1@email.com:password1

#Confirm that the server returns a 404
HTTP/1.1 404

#GET all of the fragments confirm that the first id is NOT included but second id is
GET http://localhost:8080/v1/fragments

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.fragments" not includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

