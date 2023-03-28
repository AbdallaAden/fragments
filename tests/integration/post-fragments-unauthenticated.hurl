# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/csv
# Do not include Auth credentials
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`
# 1. We expect to get back an HTTP 401
HTTP/1.1 401

[Asserts]
# check status
jsonpath "$.status" == "error"

# Check error msg
jsonpath "$.error.code" == 401
#jsonpath "$.error.message" isString
#jsonpath "$.error.message" == "text/csv is not supported Content Type"
