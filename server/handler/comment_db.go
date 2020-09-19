package handler

import (
	"fmt"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"log"
)

func getCommentByID(id int64) ([]*models.Comment, error) {
	schema := make([]*models.Comment, 0)

	// TODO: 1. Joinを用いてcomment, userテーブルからレスポンスに適したデータを取得するように変更
	// TODO: 2. offset, limitを用いた取得の実装

	// commentテーブルからselect
	comments := []comment{}
	err := sqlHandler.DB.Select(&comments, "SELECT * FROM comment where id=?", id)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	// commentテーブルから取得したデータからuserテーブルを叩く？Join
	for _, v := range comments {
		res := mapComment(v)
		schema = append(schema, &res)
	}

	return schema, nil
}

func postUser(firebaseUid, displayName, photoUrl string) (int64, error) {
	// テスト実行用に仮でユーザをDBに登録
	tx := sqlHandler.DB.MustBegin()
	result, err := tx.NamedExec("INSERT INTO user (firebase_uid, display_name, photo_url) VALUES (:firebase_uid, :display_name, :photo_url)",
		map[string]interface{}{
			"firebase_uid": firebaseUid,
			"display_name": displayName,
			"photo_url":    photoUrl,
		})
	tx.Commit()
	if err != nil {
		fmt.Println("err: ", err)
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		fmt.Println("err: ", err)
		return 0, err
	}
	return id, nil
}

func postComment(comment string, id, dialogId int64) (int64, error) {
	tx := sqlHandler.DB.MustBegin()
	result, err := tx.NamedExec("INSERT INTO comment (content, user_id, dialog_id) VALUES (:content, :user_id, :dialog_id)",
		map[string]interface{}{
			"content":   comment,
			"user_id":   id,
			"dialog_id": dialogId,
		})
	tx.Commit()
	if err != nil {
		fmt.Println("err: ", err)
		return 0, err
	}
	id, _ = result.LastInsertId()
	if err != nil {
		fmt.Println("err: ", err)
		return 0, err
	}
	return id, nil
}
