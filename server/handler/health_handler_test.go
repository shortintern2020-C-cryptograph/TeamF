package handler

import (
	"github.com/go-openapi/runtime"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"net/http/httptest"
	"testing"
)

func TestHealthCheck(t *testing.T) {
	var params scenepicks.HealthCheckParams

	params.HTTPRequest = httptest.NewRequest("GET", "http://localhost:3000", nil)
	resp := HealthCheck(params)

	w := httptest.NewRecorder()
	resp.WriteResponse(w, runtime.JSONProducer())

	if w.Result().StatusCode != 200 {
		t.Errorf("status want 200 got %v", w.Result().StatusCode)
	}
}
