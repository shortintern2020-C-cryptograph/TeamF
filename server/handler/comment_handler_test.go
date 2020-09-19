package handler

import (
	"fmt"
	"github.com/go-openapi/runtime"
	"github.com/mattn/go-shellwords"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
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
	content := "test"
	title := "test"
	author := "test"
	source := "test"
	link := "http://example.com"
	style := "test"
	_, err := postDialog(content, title, author, source, link, style)
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
		params  scenepicks.GetCommentByIDParams
		status  int
		want    string
		wantErr bool
	}{
		{
			name: "[正常系] リクエスト成功",
			params: scenepicks.GetCommentByIDParams{
				ID:     1,
				Limit:  50,
				Offset: 0,
			},
			status:  200,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			params := tt.params
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

func TestPostCommentById(t *testing.T) {
	tests := []struct {
		name    string
		params  scenepicks.PostCommentByIDParams
		status  int
		want    string
		wantErr bool
	}{
		{
			name: "[正常系] リクエスト成功",
			params: scenepicks.PostCommentByIDParams{
				Token: "12345",
				ID:    1,
				Comment: scenepicks.PostCommentByIDBody{
					Comment: "cool",
				},
			},
			status:  200,
			want:    `{"message":"success", "id": 1}`,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			params := tt.params
			params.HTTPRequest = httptest.NewRequest("GET", "http://localhost:3000", nil)
			resp := PostCommentById(params)

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
