package handler

import (
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"log"
)

func getDialog(genre string) ([]*models.Dialog, error) {

	// TODO: 1. offset, limitを利用した取得をできるようにする
	// TODO: 2. queryを利用した検索をできるようにする(likeを利用?)

	schema := make([]*models.Dialog, 0)
	dialogs := []dialog{}
	err := sqlHandler.DB.Select(&dialogs, "SELECT * FROM dialog where source=?", genre)
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
