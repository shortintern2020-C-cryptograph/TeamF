package handler

import (
	"encoding/json"
	"fmt"
	"github.com/Cside/jsondiff"
	"github.com/go-openapi/runtime"
	"github.com/mattn/go-shellwords"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"io/ioutil"
	"log"
	"net/http/httptest"
	"os/exec"
	"testing"
)

func setup() error {
	// テーブルデータを全て空にする
	cmds := []string{
		"docker container exec nexus-db mysql -uroot -hlocalhost -ppassword nexus_db -e 'set foreign_key_checks = 0;truncate table user;'",
		"docker container exec nexus-db mysql -uroot -hlocalhost -ppassword nexus_db -e'set foreign_key_checks = 0;truncate table dialog;'",
		"docker container exec nexus-db mysql -uroot -hlocalhost -ppassword nexus_db -e'set foreign_key_checks = 0;truncate table tag;'",
		"docker container exec nexus-db mysql -uroot -hlocalhost -ppassword nexus_db -e'set foreign_key_checks = 0;truncate table comment;'",
		"docker container exec nexus-db mysql -uroot -hlocalhost -ppassword nexus_db -e'set foreign_key_checks = 0;truncate table favorite;'",
		"docker container exec nexus-db mysql -uroot -hlocalhost -ppassword nexus_db -e'set foreign_key_checks = 0;truncate table dialog_tag;'",
		"docker container exec nexus-db mysql -uroot -hlocalhost -ppassword nexus_db -e'insert into user (id, display_name, photo_url, firebase_uid) values (1, \"name\", \"http://example.com\", \"0123456789\");'",
	}
	for _, cmd := range cmds {
		fmt.Printf("cmd: %s\n", cmd)
		c, err := shellwords.Parse(cmd)
		if err != nil {
			fmt.Println("cmd parse err")
			return err
		}
		err = exec.Command(c[0], c[1:]...).Run()
		if err != nil {
			return err
		}
	}
	return nil
}

func setupPostCommentById() error {
	// コメントできるように先にセリフデータを1つ追加しておく
	content := "test"
	title := "testTitle"
	author := "testAuthor"
	source := "test"
	link := "http://example.com"
	style := "test"
	comment := "test"
	userID := int64(1)
	_, err := postDialog(content, title, author, source, link, style, comment, userID)
	if err != nil {
		return err
	}
	return nil
}

func TestGetCommentById(t *testing.T) {

	err := setup() // テスト実行するとこいつが一番早く呼ばれるので、ここでテーブルのデータを綺麗にする

	if err != nil {
		fmt.Printf("setup error: %v\n", err)
	}

	err = setupPostCommentById()
	if err != nil {
		fmt.Printf("setup insert err: %v", err)
	}
	tests := []struct {
		name    string
		in      string
		status  int
		want    string
		wantErr bool
	}{
		{
			name:    "[正常系] 必須パラメータのみ指定",
			in:      "./testdata/get_comment_by_id_test_data_in1.json",
			status:  200,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
		{
			name:    "[異常系] パラメータの値が異常",
			in:      "./testdata/get_comment_by_id_test_data_in2.json",
			status:  400,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
		{
			name:    "[異常系] 必須パラメータが揃っていない",
			in:      "./testdata/get_comment_by_id_test_data_in3.json",
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
			var params scenepicks.GetCommentByIDParams
			if err := json.Unmarshal(bytes, &params); err != nil {
				log.Fatal(err)
			}
			params.HTTPRequest = httptest.NewRequest("GET", "http://localhost:3000", nil)
			resp := GetCommentById(params)

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

type CommentRequest struct {
	Token   string `json:"token"`
	ID      int    `json:"id"`
	Comment struct {
		Comment string `json:"comment"`
	} `json:"comment"`
}

func TestPostCommentById(t *testing.T) {

	idToken, err := setUpWithIDToken()
	if err != nil {
		fmt.Printf("%v\n", err)
	}

	tests := []struct {
		name     string
		params   scenepicks.PostCommentByIDParams
		in       string
		status   int
		want     string
		wantErr  bool
		getToken bool
		checkDB  bool
	}{
		{
			name:     "[正常系] 必要なデータが全て揃ってる",
			in:       "./testdata/post_comment_by_id_test_data_in1.json",
			status:   200,
			want:     `{"message":"success", "id": 2}`,
			wantErr:  false,
			getToken: true,
			checkDB:  true,
		},
		{
			name:     "[異常系] パラメータが不足している",
			in:       "./testdata/post_comment_by_id_test_data_in2.json",
			status:   400,
			want:     `{"message":"success", "id": 3}`,
			wantErr:  false,
			getToken: true,
			checkDB:  false,
		},
		{
			name:     "[異常系] トークンが正しく無い",
			in:       "./testdata/post_comment_by_id_test_data_in3.json",
			status:   400,
			want:     `{"message":"success", "id": 3}`,
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
			var params scenepicks.PostCommentByIDParams
			if err := json.Unmarshal(bytes, &params); err != nil {
				log.Fatal(err)
			}
			if tt.getToken {
				params.Token = idToken
			}
			params.HTTPRequest = httptest.NewRequest("POST", "http://localhost:3000", nil)

			c0, err := getCommentCount()
			if err != nil {
				log.Fatal(err)
			}
			resp := PostCommentById(params)
			c1, err := getCommentCount()
			if err != nil {
				log.Fatal(err)
			}
			if tt.checkDB {
				if c1 != c0+1 {
					t.Errorf("record count of db is invalid")
				}
			}

			w := httptest.NewRecorder()
			resp.WriteResponse(w, runtime.JSONProducer())

			if w.Result().StatusCode != tt.status {
				t.Errorf("status want %v got %v", tt.status, w.Result().StatusCode)
			}

			if tt.status == 400 {
				fmt.Printf("all ok\n")
				return
			}

			if diff := jsondiff.Diff([]byte(tt.want), w.Body.Bytes()); diff != "" {
				t.Errorf("case %v body diff:\n%s", tt.name, diff)
			}
		})
	}
}
