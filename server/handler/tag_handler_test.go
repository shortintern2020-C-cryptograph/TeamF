/**
 * @author Riku Nunokawa
 * @template writer Futa Nakayama
 */

package handler

import (
	"encoding/json"
	"fmt"
	"github.com/go-openapi/runtime"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"io/ioutil"
	"log"
	"net/http/httptest"
	"testing"
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
		{
			name:    "[異常系] パラメータの値が異常",
			in:      "./testdata/get_tag_test_data_in3.json",
			status:  400,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
		{
			name:    "[異常系] 必須パラメータが揃っていない",
			in:      "./testdata/get_tag_test_data_in4.json",
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
	Tag   struct {
		Name string `json:"name"`
		Type string `json:"type"`
	} `json:"tag"`
}

func TestPostTag(t *testing.T) {

	idToken, err := setUpWithIDToken()
	if err != nil {
		fmt.Printf("%v\n", err)
	}

	tests := []struct {
		name     string
		params   scenepicks.PostTagParams
		in       string
		status   int
		want     string
		wantErr  bool
		getToken bool
		checkDB  bool
	}{
		{
			name:     "[正常系] 必要なデータが全て揃ってる",
			in:       "./testdata/post_tag_test_data_in1.json",
			status:   200,
			want:     `{"message":"success", "id": 1}`,
			wantErr:  false,
			getToken: true,
			checkDB:  true,
		},
		{
			name:     "[異常系] パラメータが不足している",
			in:       "./testdata/post_tag_test_data_in2.json",
			status:   400,
			want:     `{"message":"success", "id": 1}`,
			wantErr:  false,
			getToken: true,
			checkDB:  false,
		},
		{
			name:     "[異常系] トークンが正しく無い",
			in:       "./testdata/post_tag_test_data_in3.json",
			status:   400,
			want:     `{"message":"success", "id": 1}`,
			wantErr:  false,
			getToken: false,
			checkDB:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			bytes, err := ioutil.ReadFile(tt.in)
			if err != nil {
				log.Fatal(err)
			}
			var params scenepicks.PostTagParams
			if err := json.Unmarshal(bytes, &params); err != nil {
				log.Fatal(err)
			}
			if tt.getToken {
				params.Token = idToken
			}
			params.HTTPRequest = httptest.NewRequest("POST", "http://localhost:3000", nil)

			t0, err := getTagCount()
			if err != nil {
				log.Fatal(err)
			}
			resp := PostTag(params)
			t1, err := getTagCount()
			if err != nil {
				log.Fatal(err)
			}
			if tt.checkDB {
				if t1 != t0+1 {
					t.Errorf("record count of db is invalid")
				}
			}

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
