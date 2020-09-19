package handler

import (
	"github.com/Cside/jsondiff"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/swag"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"net/http/httptest"
	"testing"
)

func TestGetDialog(t *testing.T) {
	tests := []struct {
		name    string
		genre   string
		limit   int64
		offset  int64
		q       string
		sort    string
		status  int
		want    string
		wantErr bool
	}{
		{
			name:    "[正常系] リクエスト成功",
			genre:   "anime",
			limit:   50,
			offset:  0,
			q:       "",
			sort:    "",
			status:  200,
			want:    `{"message":"success", "schema":[]}`,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			params := scenepicks.NewGetDialogParams()
			params.HTTPRequest = httptest.NewRequest("GET", "http://localhost:3000", nil)
			params.Genre = tt.genre
			params.Offset = tt.offset
			params.Limit = tt.limit
			params.Q = swag.String(tt.q)
			params.Sort = swag.String(tt.sort)

			resp := GetDialog(params)

			w := httptest.NewRecorder()
			resp.WriteResponse(w, runtime.JSONProducer())

			if w.Result().StatusCode != tt.status {
				t.Errorf("status want %v got %v", tt.status, w.Result().StatusCode)
			}

			if diff := jsondiff.Diff([]byte(tt.want), w.Body.Bytes()); diff != "" {
				t.Errorf("case %v body diff:\n%s", tt.name, diff)
			}
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
			want:    `{"message":"success", "id": 4}`,
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

			if diff := jsondiff.Diff([]byte(tt.want), w.Body.Bytes()); diff != "" {
				t.Errorf("case %v body diff:\n%s", tt.name, diff)
			}
		})
	}
}
