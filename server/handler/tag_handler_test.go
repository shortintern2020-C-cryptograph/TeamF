package handler

import (
	"encoding/json"
	"github.com/go-openapi/runtime"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"io/ioutil"
	"log"
	"net/http/httptest"
	"testing"
	"fmt"
)

func TestGetTag(t *testing.T) {
	tests := []struct {
		name    string
		params  scenepicks.GetTagParams
		in      string
		status  int
		want    string
		wantErr bool
	}{
		{
			name:    "[正常系] 必須パラメータのみ",
			in:      "./testdata/get_tag_test_data_in1.json",
			status:  200,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
		{
			name:    "[正常系] オプションパラメータも含める",
			in:      "./testdata/get_tag_test_data_in2.json",
			status:  200,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			bytes, err := ioutil.ReadFile(tt.in)
			if err != nil {
				log.Fatal(err)
			}
			var params scenepicks.GetTagParams
			if err := json.Unmarshal(bytes, &params); err != nil {
				log.Fatal(err)
			}
			params.HTTPRequest = httptest.NewRequest("GET", "http://localhost:3000", nil)
			resp := GetTag(params)

			w := httptest.NewRecorder()
			resp.WriteResponse(w, runtime.JSONProducer())

			if w.Result().StatusCode != tt.status {
				t.Errorf("status want %v got %v", tt.status, w.Result().StatusCode)
			}

			//if diff := jsondiff.Diff([]byte(tt.want), w.Body.Bytes()); diff != "" {
			//	t.Errorf("case %v body diff:\n%s", tt.name, diff)
			//}
		})
	}
}

type TagRequest struct {
	Token string `json:"token"`
	Tag struct {
		Name string `json:"name"`
		Type string `json:"type"`
	} `json:"tag"`
}

func TestPostTag(t *testing.T) {

	idToken, err := setUpWithIDToken()
	if err != nil {
		fmt.Printf("%v\n", err)
	}

	inputData, err := ioutil.ReadFile("./testdata/post_tag_test_data_in1.json")
	if err != nil {
		fmt.Printf("%v\n", err)
	}
	var request TagRequest
	json.Unmarshal(inputData, &request)
	request.Token = idToken

	req, _ := json.Marshal(request)

	tests := []struct {
		name    string
		params  scenepicks.PostTagParams
		in      string
		status  int
		want    string
		wantErr bool
	}{
		{
			name:    "[正常系] リクエスト成功",
			in:      string(req),
			status:  200,
			want:    `{"message":"success", "id": 1}`,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			bytes := []byte(tt.in)
			if err != nil {
				log.Fatal(err)
			}
			var params scenepicks.PostTagParams
			if err := json.Unmarshal(bytes, &params); err != nil {
				log.Fatal(err)
			}
			params.HTTPRequest = httptest.NewRequest("POST", "http://localhost:3000", nil)
			resp := PostTag(params)

			w := httptest.NewRecorder()
			resp.WriteResponse(w, runtime.JSONProducer())

			if w.Result().StatusCode != tt.status {
				t.Errorf("status want %v got %v", tt.status, w.Result().StatusCode)
			}

			//if diff := jsondiff.Diff([]byte(tt.want), w.Body.Bytes()); diff != "" {
			//	t.Errorf("case %v body diff:\n%s", tt.name, diff)
			//}
		})
	}
}
