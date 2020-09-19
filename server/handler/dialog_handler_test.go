package handler

import (
	"encoding/json"
	"github.com/go-openapi/runtime"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"io/ioutil"
	"log"
	"net/http/httptest"
	"testing"
)

func TestGetDialog(t *testing.T) {
	tests := []struct {
		name string
		//params  scenepicks.GetDialogParams
		in      string
		status  int
		want    string
		wantErr bool
	}{
		{
			name: "[正常系] 必須パラメータのみ指定",
			//params: scenepicks.GetDialogParams{
			//	Genre:  "anime",
			//	Limit:  50,
			//	Offset: 0,
			//	Q:      swag.String(""),
			//	Sort:   swag.String(""),
			//},
			in:      "./testdata/dialog_test_data_in1.json",
			status:  200,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
		{
			name:    "[正常系] q, sortを指定",
			in:      "./testdata/dialog_test_data_in2.json",
			status:  200,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
		{
			name:    "[異常系] 必須パラメータが足りない",
			in:      "./testdata/dialog_test_data_in3.json",
			status:  400,
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
			var params scenepicks.GetDialogParams
			if err := json.Unmarshal(bytes, &params); err != nil {
				log.Fatal(err)
			}
			//params := tt.params
			params.HTTPRequest = httptest.NewRequest("GET", "http://localhost:3000", nil)
			resp := GetDialog(params)

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

func TestPostDialog(t *testing.T) {
	tests := []struct {
		name    string
		params  scenepicks.PostDialogParams
		status  int
		want    string
		wantErr bool
	}{
		{
			name: "[正常系] リクエスト成功",
			params: scenepicks.PostDialogParams{
				Token: "12345",
				Content: scenepicks.PostDialogBody{
					Author:  "宮崎駿",
					Title:   "天空の城ラピュタ",
					Content: "バルス",
					Link:    "https://example.com",
					Style:   "normal",
					UserID:  1,
					Comment: "cool",
				},
			},
			status:  200,
			want:    `{"message":"success", "id": 6}`,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			params := tt.params
			params.HTTPRequest = httptest.NewRequest("GET", "http://localhost:3000", nil)
			resp := PostDialog(params)

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
