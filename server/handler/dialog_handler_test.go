package handler

import (
	"fmt"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/swag"
	"github.com/mattn/go-shellwords"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"net/http/httptest"
	"os/exec"
	"testing"
)

func setup() error {
	// テーブルデータを全て空にする
	cmds := []string{
		"docker-compose exec $DB_SERVICE mysql -uroot -hlocalhost -ppassword $DBNAME -e'set foreign_key_checks = 0;truncate table user;'",
		"docker-compose exec $DB_SERVICE mysql -uroot -hlocalhost -ppassword $DBNAME -e'set foreign_key_checks = 0;truncate table dialog;'",
		"docker-compose exec $DB_SERVICE mysql -uroot -hlocalhost -ppassword $DBNAME -e'set foreign_key_checks = 0;truncate table tag;'",
		"docker-compose exec $DB_SERVICE mysql -uroot -hlocalhost -ppassword $DBNAME -e'set foreign_key_checks = 0;truncate table comment;'",
		"docker-compose exec $DB_SERVICE mysql -uroot -hlocalhost -ppassword $DBNAME -e'set foreign_key_checks = 0;truncate table favorite;'",
		"docker-compose exec $DB_SERVICE mysql -uroot -hlocalhost -ppassword $DBNAME -e'set foreign_key_checks = 0;truncate table dialog_tag;'",
	}
	for _, cmd := range cmds {
		fmt.Printf("cmd: %s\n", cmd)
		c, err := shellwords.Parse(cmd)
		if err != nil {
			return err
		}
		err = exec.Command(c[0], c[1:]...).Run()
		if err != nil {
			return err
		}
	}
	return nil
}

func TestGetDialog(t *testing.T) {
	tests := []struct {
		name    string
		params  scenepicks.GetDialogParams
		status  int
		want    string
		wantErr bool
	}{
		{
			name: "[正常系] リクエスト成功",
			params: scenepicks.GetDialogParams{
				Genre:  "anime",
				Limit:  50,
				Offset: 0,
				Q:      swag.String(""),
				Sort:   swag.String(""),
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
