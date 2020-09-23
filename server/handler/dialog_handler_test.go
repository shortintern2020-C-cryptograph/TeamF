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
	//"os"
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
			name:    "[異常系] パラメータの値が異常",
			in:      "./testdata/get_dialog_test_data_in2.json",
			status:  400,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
		{
			name:    "[異常系] 必須パラメータが揃っていない",
			in:      "./testdata/get_dialog_test_data_in3.json",
			status:  400,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
		{
			name:    "[正常系] オプションパラメータも含める",
			in:      "./testdata/get_dialog_test_data_in4.json",
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

type DialogRequest struct {
	Token string `json:"token"`
	Dialog struct {
		Content string `json:"content"`
		Title string `json:"title"`
		Author string `json:"author"`
		Link string `json:"link"`
		Style string `json:"style"`
		Source string `json:"source"`
		Comment string `json:"comment"`
	} `json:"content"`
}

func TestPostDialog(t *testing.T) {

	// TODO: firebase認証完成後、認証チェックもできるようにする

	idToken, err := setUpWithIDToken()
	if err != nil {
		fmt.Printf("%v\n", err)
	}

	tests := []struct {
		name    string
		in     string
		status  int
		want    string
		wantErr bool
		getToken bool
		checkDB bool
		increment int
	}{
		{
			name:    "[正常系] 必要なデータが全て揃ってる（titleとauthorが初めて登録される場合）",
			in:      "./testdata/post_dialog_test_data_in1.json",
			status:  200,
			want:    `{"message":"success", "id": 2}`,
			wantErr: false,
			getToken: true,
			checkDB: true,
			increment: 2,
		},
		{
			name:    "[正常系] 必要なデータが全て揃ってる（titleとauthorが既に登録されている場合）",
			in:      "./testdata/post_dialog_test_data_in2.json",
			status:  200,
			want:    `{"message":"success", "id": 3}`,
			wantErr: false,
			getToken: true,
			checkDB: true,
			increment: 0,
		},
		{
			name:    "[異常系] パラメータが不足している",
			in:      "./testdata/post_dialog_test_data_in3.json",
			status:  400,
			want:    `{"message":"success", "id": 2}`,
			wantErr: false,
			getToken: true,
			checkDB: false,
			increment: 0,
		},
		{
			// firebase認証できてからはじけるようにしたい
			name:    "[異常系] トークンが正しく無い",
			in:      "./testdata/post_dialog_test_data_in4.json",
			status:  400,
			want:    ``,
			wantErr: true,
			getToken: false,
			checkDB: false,
			increment: 0,
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
			if tt.getToken {
				params.Token = idToken
			}
			params.HTTPRequest = httptest.NewRequest("POST", "http://localhost:3000", nil)

			d0, c0, t0, r0, err := getRecordCount()
			if err != nil {
				log.Fatal(err)
			}
			resp := PostDialog(params)
			d1, c1, t1, r1, err := getRecordCount()
			if err != nil {
				log.Fatal(err)
			}
			if tt.checkDB {
				if d1 != d0+1 || c1 != c0+1 || r1 != r0+2 || t1 != t0+tt.increment {
					t.Errorf("record count of db is invalid")
				}
			}

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

func getRecordCount() (int, int, int, int, error) {
	dialogCnt, err := getDialogCount()
	commentCnt, err := getCommentCount()
	tagCnt, err := getTagCount()
	relationCnt, err := getTagRelationCount()
	return dialogCnt, commentCnt, tagCnt, relationCnt, err
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

func setUpWithIDToken() (string, error){
	client := NewClientWithNoToken()
	if client.err != nil {
		return "", client.err
	}

	customToken, err := client.auth.CustomToken(context.Background(), "S8p7iKzPyRU1JZnIOihXj4WgATW2")
	if err != nil {
		return "", err
	}
	idToken, err := customTokenToIDToken(customToken)
	fmt.Printf("%v\n", idToken)
	if err != nil {
		return "", err
	}
	return idToken, nil
}
