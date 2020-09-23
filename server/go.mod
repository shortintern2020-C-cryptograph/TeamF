module github.com/shortintern2020-C-cryptograph/TeamF/server

go 1.13

replace local.packages/gen => ../gen

require (
	cloud.google.com/go/firestore v1.3.0 // indirect
	cloud.google.com/go/storage v1.11.0 // indirect
	firebase.google.com/go v3.13.0+incompatible
	github.com/Cside/jsondiff v0.0.0-20180209072652-0e50d980b458
	github.com/evanphx/json-patch v4.9.0+incompatible // indirect
	github.com/go-openapi/errors v0.19.6
	github.com/go-openapi/loads v0.19.5
	github.com/go-openapi/runtime v0.19.21
	github.com/go-openapi/spec v0.19.8
	github.com/go-openapi/strfmt v0.19.5
	github.com/go-openapi/swag v0.19.9
	github.com/go-openapi/validate v0.19.10
	github.com/go-sql-driver/mysql v1.4.0
	github.com/jessevdk/go-flags v1.4.0
	github.com/jmoiron/sqlx v1.2.0
	github.com/labstack/gommon v0.3.0
	github.com/mattn/go-shellwords v1.0.10
	github.com/pkg/errors v0.8.1
	github.com/rs/cors v1.7.0
	github.com/sergi/go-diff v1.1.0 // indirect
	golang.org/x/net v0.0.0-20200822124328-c89045814202
	google.golang.org/api v0.32.0
)
