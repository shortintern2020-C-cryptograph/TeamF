package handler

import (
	"github.com/go-openapi/runtime/middleware"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
)

func HealthCheck(p scenepicks.HealthCheckParams) middleware.Responder {
	params := &scenepicks.HealthCheckOKBody{
		Message: "Serve is alive.",
	}
	return scenepicks.NewHealthCheckOK().WithPayload(params)
}
