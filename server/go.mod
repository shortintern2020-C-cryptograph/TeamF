module github.com/shortintern2020-C-cryptograph/TeamF/server

go 1.13

replace local.packages/gen => ../gen

require (
	cloud.google.com/go/firestore v1.3.0 // indirect
	cloud.google.com/go/storage v1.11.0 // indirect
	firebase.google.com/go v3.13.0+incompatible
	github.com/go-openapi/errors v0.19.6
	github.com/go-openapi/loads v0.19.5
	github.com/go-openapi/runtime v0.19.21
	github.com/go-openapi/spec v0.19.8
	github.com/go-openapi/strfmt v0.19.5
	github.com/go-openapi/swag v0.19.9
	github.com/go-openapi/validate v0.19.10
	github.com/jessevdk/go-flags v1.4.0
	golang.org/x/net v0.0.0-20200822124328-c89045814202
	google.golang.org/api v0.32.0
)
