package handler

import (
	"fmt"
	"github.com/go-openapi/runtime/middleware"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"log"
	"time"
)

func GetCommentById(p scenepicks.GetCommentByIDParams) middleware.Responder {
	offset := p.Offset
	limit := p.Limit
	fmt.Printf("offset: %s, limit: %s", offset, limit)

	schema := make([]*models.Comment, 0)

	// TODO: 1. Joinを用いてcomment, userテーブルからレスポンスに適したデータを取得するように変更
	// TODO: 2. offset, limitを用いた取得の実装

	// commentテーブルからselect
	comments := []comment{}
	err := sqlHandler.DB.Select(&comments, "SELECT * FROM comment where id=?", p.ID)
	if err != nil {
		log.Fatal(err)
	}

	// commentテーブルから取得したデータからuserテーブルを叩く？Join
	for _, v := range comments {
		res := mapComment(v)
		schema = append(schema, &res)
	}

	params := &scenepicks.GetCommentOKBody{
		Message: "success",
		Schema:  schema,
	}

	return scenepicks.NewGetCommentOK().WithPayload(params)
}

func PostCommentById(p scenepicks.PostCommentByIDParams) middleware.Responder {
	comment := p.Comment
	fmt.Printf("comment: %s", comment)

	// TODO: ここでfirebase認証

	// テスト実行用に仮でユーザをDBに登録
	tx := sqlHandler.DB.MustBegin()
	result, err := tx.NamedExec("INSERT INTO user (firebase_uid, display_name, photo_url) VALUES (:firebase_uid, :display_name, :photo_url)",
		map[string]interface{}{
			"firebase_uid": 12345,
			"display_name": "John Doe",
			"photo_url":    "https://example.com",
		})
	tx.Commit()
	if err != nil {
		log.Fatal(err)
	}
	id, _ := result.LastInsertId()
	tx.Commit()

	// DBへの書き込み
	tx = sqlHandler.DB.MustBegin()
	result, err = tx.NamedExec("INSERT INTO comment (content, user_id, dialog_id) VALUES (:content, :user_id, :dialog_id)",
		map[string]interface{}{
			"content":   p.Comment.Comment,
			"user_id":   id,
			"dialog_id": p.ID,
		})
	tx.Commit()
	if err != nil {
		log.Fatal(err)
	}
	id, _ = result.LastInsertId()
	params := &scenepicks.PostCommentByIDOKBody{
		Message: "success",
		ID:      id,
	}
	return scenepicks.NewPostCommentByIDOK().WithPayload(params)
}

type comment struct {
	ID int64 `json:"id" db:"id"`

	Content string `json:"content" db:"content"`

	UserID int64 `json:"user_id" db:"user_id"`

	DialogID int64 `json:"dialog_id" db:"dialog_id"`

	CTime time.Time `json:"ctime" db:"ctime"`

	UTime time.Time `json:"utime" db:"utime"`
}

func mapComment(c comment) models.Comment {
	res := models.Comment{
		Content: c.Content,
		User: &models.User{
			DisplayName: "Twitter 太郎",
			ID:          1,
			PhotoURL:    "https://example.com",
		},
	}
	return res
}
