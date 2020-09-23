module github.com/shortintern2020-C-cryptograph/TeamF/server

go 1.13

replace local.packages/gen => ../gen

require (
	cloud.google.com/go/firestore v1.3.0 // indirect
	cloud.google.com/go/storage v1.11.0 // indirect
	firebase.google.com/go v3.13.0+incompatible
	github.com/ChimeraCoder/anaconda v2.0.0+incompatible
	github.com/ChimeraCoder/tokenbucket v0.0.0-20131201223612-c5a927568de7 // indirect
	github.com/Cside/jsondiff v0.0.0-20180209072652-0e50d980b458
	github.com/azr/backoff v0.0.0-20160115115103-53511d3c7330 // indirect
	github.com/dustin/go-jsonpointer v0.0.0-20160814072949-ba0abeacc3dc // indirect
	github.com/dustin/gojson v0.0.0-20160307161227-2e71ec9dd5ad // indirect
	github.com/evanphx/json-patch v4.9.0+incompatible // indirect
	github.com/garyburd/go-oauth v0.0.0-20180319155456-bca2e7f09a17 // indirect
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
