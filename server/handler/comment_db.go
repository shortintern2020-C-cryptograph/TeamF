package handler

import (
	"fmt"
	"github.com/pkg/errors"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"log"
)

func getCommentByID(id int64, offset int64, limit int64) (*models.Dialog, []*models.Comment, []*models.Tag, error) {
	var resDialog models.Dialog
	resComments := make([]*models.Comment, 0)
	resTags := make([]*models.Tag, 0)

	// TODO: 1. Joinを用いてcomment, userテーブルからレスポンスに適したデータを取得するように変更
	// TODO: 2. offset, limitを用いた取得の実装

	// commentテーブルからselect
	var dialog dialog
	comments := []comment{}
	tags := []tag{}
	err := sqlHandler.DB.Get(&dialog, `
		SELECT * FROM dialog
		WHERE id = ? LIMIT 1
	`, id)
	if err != nil {
		log.Fatal(err)
		return &models.Dialog{}, nil, nil, err
	}
	err = sqlHandler.DB.Select(&comments, `
		SELECT * FROM comment 
		INNER JOIN user ON comment.user_id = user.id
		WHERE dialog_id = ?
		ORDER BY comment.utime DESC
		LIMIT ?
		OFFSET ?
	`, id, limit, offset)
	if err != nil {
		log.Fatal(err)
		return &models.Dialog{}, nil, nil, err
	}
	err = sqlHandler.DB.Select(&tags, `
		SELECT name, type FROM dialog_tag
		INNER JOIN tag ON dialog_tag.tag_id = tag.id
		WHERE dialog_id = ?
		ORDER BY tag.utime DESC
	`, id)
	if err != nil {
		log.Fatal(err)
		return &models.Dialog{}, nil, nil, err
	}

	// commentテーブルから取得したデータからuserテーブルを叩く？Join
	resDialog = mapDialog(dialog)
	for _, v := range comments {
		res := mapComment(v)
		resComments = append(resComments, &res)
	}
	for _, v := range tags {
		res := mapTag(v)
		resTags = append(resTags, &res)
	}

	return &resDialog, resComments, resTags, nil
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

func postComment(userID int64, dialogID int64, comment string) (int64, error) {
	tx := sqlHandler.DB.MustBegin()
	result, err := tx.NamedExec("INSERT INTO comment (content, user_id, dialog_id) VALUES (:content, :user_id, :dialog_id)",
		map[string]interface{}{
			"content":   comment,
			"user_id":   userID,
			"dialog_id": dialogID,
		})
	if err != nil {
		fmt.Println("err: ", err)
		return 0, err
	}
	id, _ := result.LastInsertId()
	if err != nil {
		fmt.Println("err: ", err)
		return 0, err
	}
	defer func() {
		if err != nil {
			if re := tx.Rollback(); re != nil {
				err = errors.Wrap(err, re.Error())
			}
		}
	}()
	return id, tx.Commit()
}
