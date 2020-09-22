package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/Cside/jsondiff"
	"github.com/go-openapi/runtime"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"io/ioutil"
	"log"
	"net/http"
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

type Response struct {
	Kind string `json:"kind,omitempty"`
	IDToken string `json:"idToken,omitempty"`
	RefreshToken string `json:"refreshToken,omitempty"`
	ExpiresIn string `json:"expiresIn,omitempty"`
	IsNewUser bool `json:"isNewUser,omitempty"`
}

func TestPostDialog(t *testing.T) {
	// TODO: firebase認証完成後、認証チェックもできるようにする

	client := NewClientWithNoToken()
	if client.err != nil {
		fmt.Printf("%v\n", client.err)
	}

	customToken, err := client.auth.CustomToken(context.Background(), "S8p7iKzPyRU1JZnIOihXj4WgATW2")
	if err != nil {
		fmt.Printf("%v\n", err)
	}
	idToken, err := customTokenToIDToken(customToken)
	if err != nil {
		fmt.Printf("%v\n", err)
	}

	okJson := `{
  		"token": "` + idToken + `",
  		"content": {
    		"content": "string",
	    	"title": "string",
			"author": "string",
    		"link": "string",
    		"style": "string",
    		"user_id": 1,
    		"comment": "string"
  		}
	}`
	ngJson := `{
		"token": "1234567890",
		"content": {
			"content": "string",
			"title": "string",
			"author": "string",
			"link": "string",
			"style": "string",
			"user_id": 1,
			"comment": "string"
		}
	}`

	tests := []struct {
		name    string
		in      string
		status  int
		want    string
		wantErr bool
	}{
		{
			name:    "[正常系] 必要なデータが全て揃ってる",
			in:      okJson,
			status:  200,
			want:    `{"message":"success", "id": 2}`,
			wantErr: false,
		},
		{
			// firebase認証できてからはじけるようにしたい
			name:    "[異常系] トークンが正しく無い",
			in:      ngJson,
			status:  400,
			want:    ``,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			bytes := []byte(tt.in)
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

			// 異常系ならBadRequestを返していればいいはず
			if tt.status == 400 {
				fmt.Printf("all ok\n")
				return
			}

			if diff := jsondiff.Diff([]byte(tt.want), w.Body.Bytes()); diff != "" {
				t.Errorf("case %v body diff:\n%s", tt.name, diff)
			} else {
				fmt.Printf("all ok\n")
			}
		})
	}
}

func customTokenToIDToken(customToken string) (string, error) {
	jsonStr := `{"token":"` + customToken + `","returnSecureToken":true}`

	url := "https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyDZ-zZYBZ6yjEt5OUShw9OyhnLOM92SLsc"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer([]byte(jsonStr)))
	req.Header.Set("Content-Type", "application/json")
	c := &http.Client{}
	resp, err := c.Do(req)
	if err != nil {
		panic(err)
		return "", err
	}

	decoder := json.NewDecoder(resp.Body)
	val := &Response{}
	err = decoder.Decode(val)
	if err != nil {
		panic(err)
		return "", err
	}

	defer resp.Body.Close()

	return val.IDToken, nil
}
