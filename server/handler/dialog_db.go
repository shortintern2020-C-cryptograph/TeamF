package handler

import (
	"github.com/pkg/errors"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"log"
)

func getDialog(genre string, offset int64, limit int64, sort string, q string) ([]*models.Dialog, error) {

	// TODO: 1. offset, limitを利用した取得をできるようにする
	// TODO: 2. queryを利用した検索をできるようにする(likeを利用?)

	schema := make([]*models.Dialog, 0)
	dialogs := []dialog{}
	var err error
	if genre == "all" {
		err = sqlHandler.DB.Select(&dialogs, `
			SELECT * FROM dialog 
			WHERE content LIKE ?
			ORDER BY utime DESC
			LIMIT ?
			OFFSET ?
		`, "%"+q+"%", limit, offset)
	} else {
		err = sqlHandler.DB.Select(&dialogs, `
			SELECT * FROM dialog 
			WHERE source = ? AND content LIKE ?
			ORDER BY utime DESC
			LIMIT ?
			OFFSET ?
		`, genre, "%"+q+"%", limit, offset)
	}
	if err != nil {
		log.Fatal(err)
	}
	for _, x := range dialogs {
		res := mapDialog(x)
		schema = append(schema, &res)
	}
	return schema, nil
}

func postDialog(content string, title string, author string, source string, link string, style string, comment string, userID int64) (int64, error) {
	// DBへの書き込み
	tx := sqlHandler.DB.MustBegin()
	result, err := tx.NamedExec("INSERT INTO dialog (content, title, author, source, link, style, user_id) VALUES (:content, :title, :author, :source, :link, :style, :user_id)",
		map[string]interface{}{
			"content": content,
			"title":   title,
			"author":  author,
			"source":  source,
			"link":    link,
			"style":   style,
			"user_id": userID,
		})
	if err != nil {
		log.Fatal(err)
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		log.Fatal(err)
		return 0, nil
	}

	//comment
	_, err = tx.NamedExec("INSERT INTO comment (content, user_id, dialog_id) VALUES (:content, :user_id, :dialog_id)",
		map[string]interface{}{
			"content":   comment,
			"user_id":   userID,
			"dialog_id": id,
		})
	if err != nil {
		log.Fatal(err)
		return 0, err
	}

	//tag
	titleTagResult, err := tx.NamedExec("INSERT INTO tag (name, type) VALUES (:name, :type) ON DUPLICATE KEY UPDATE type = :type, id=LAST_INSERT_ID(id)",
		map[string]interface{}{
			"name": title,
			"type": "title",
		})
	if err != nil {
		log.Fatal(err)
		return 0, err
	}
	authorTagResult, err := tx.NamedExec("INSERT INTO tag (name, type) VALUES (:name, :type) ON DUPLICATE KEY UPDATE type = :type, id=LAST_INSERT_ID(id)",
		map[string]interface{}{
			"name": author,
			"type": "author",
		})
	if err != nil {
		log.Fatal(err)
		return 0, err
	}

	titleTagID, err := titleTagResult.LastInsertId()
	if err != nil {
		log.Fatal(err)
		return 0, nil
	}
	authorTagID, err := authorTagResult.LastInsertId()
	if err != nil {
		log.Fatal(err)
		return 0, nil
	}

	//dialog_tag
	_, err = tx.NamedExec("INSERT INTO dialog_tag (dialog_id, tag_id) VALUES (:dialog_id, :tag_id)",
		map[string]interface{}{
			"dialog_id": id,
			"tag_id":    titleTagID,
		})
	if err != nil {
		log.Fatal(err)
		return 0, err
	}
	_, err = tx.NamedExec("INSERT INTO dialog_tag (dialog_id, tag_id) VALUES (:dialog_id, :tag_id)",
		map[string]interface{}{
			"dialog_id": id,
			"tag_id":    authorTagID,
		})
	if err != nil {
		log.Fatal(err)
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
