package handler

import (
	"encoding/json"
	"fmt"
	"github.com/Cside/jsondiff"
	"github.com/go-openapi/runtime"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"io/ioutil"
	"log"
	"net/http/httptest"
	"testing"
)

func TestGetDialog(t *testing.T) {
	tests := []struct {
		name    string
		in      string
		status  int
		want    string
		wantErr bool
	}{
		{
			name:    "[正常系] 必須パラメータのみ指定",
			in:      "./testdata/get_dialog_test_data_in1.json",
			status:  200,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
		{
			name:    "[正常系] オプションのパラメータも指定",
			in:      "./testdata/get_dialog_test_data_in2.json",
			status:  200,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
		{
			name:    "[異常系] genreの指定が空",
			in:      "./testdata/get_dialog_test_data_in3.json",
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
	// TODO: firebase認証完成後、認証チェックもできるようにする
	tests := []struct {
		name    string
		in      string
		status  int
		want    string
		wantErr bool
	}{
		{
			name:    "[正常系] 必要なデータが全て揃ってる",
			in:      "./testdata/post_dialog_test_data_in1.json",
			status:  200,
			want:    `{"message":"success", "id": 2}`,
			wantErr: false,
		},
		{
			// firebase認証できてからはじけるようにしたい
			// TODO: 本当は4XX系を受け取るようにしたい
			name:    "[異常系] トークンが正しく無い",
			in:      "./testdata/post_dialog_test_data_in2.json",
			status:  200,
			want:    `{"message":"success", "id": 3}`,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			bytes, err := ioutil.ReadFile(tt.in)
			if err != nil {
				log.Fatal(err)
			}
			var params scenepicks.PostDialogParams
			if err := json.Unmarshal(bytes, &params); err != nil {
				log.Fatal(err)
			}
			params.HTTPRequest = httptest.NewRequest("POST", "http://localhost:3000", nil)
			resp := PostDialog(params)

			w := httptest.NewRecorder()
			resp.WriteResponse(w, runtime.JSONProducer())

			if w.Result().StatusCode != tt.status {
				t.Errorf("status want %v got %v", tt.status, w.Result().StatusCode)
			}

			if diff := jsondiff.Diff([]byte(tt.want), w.Body.Bytes()); diff != "" {
				t.Errorf("case %v body diff:\n%s", tt.name, diff)
			} else {
				fmt.Printf("all ok\n")
			}
		})
	}
}
