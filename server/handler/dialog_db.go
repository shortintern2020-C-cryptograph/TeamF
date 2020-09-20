package handler

import (
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
		`, "%" + q + "%", limit, offset)
	} else {
		err = sqlHandler.DB.Select(&dialogs, `
			SELECT * FROM dialog 
			WHERE source = ? AND content LIKE ?
			ORDER BY utime DESC
			LIMIT ?
			OFFSET ?
		`, genre, "%" + q + "%", limit, offset)
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

func postDialog(content, title, author, source, link, style string) (int64, error) {
	// DBへの書き込み
	source = "anime"
	tx := sqlHandler.DB.MustBegin()
	result, err := tx.NamedExec("INSERT INTO dialog (content, title, author, source, link, style) VALUES (:content, :title, :author, :source, :link, :style)",
		map[string]interface{}{
			"content": content,
			"title":   title,
			"author":  author,
			"source":  source,
			"link":    link,
			"style":   style,
		})
	tx.Commit()
	if err != nil {
		log.Fatal(err)
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, nil
	}
	return id, nil
}
