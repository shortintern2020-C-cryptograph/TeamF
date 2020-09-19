package handler

import (
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"log"
)

func getTag() ([]*models.Tag, error) {
	schema := make([]*models.Tag, 0)

	// TODO: offset, limit, sortを利用した取得をできるように実装
	//SELECTを実行
	tags := []tag{}
	err := sqlHandler.DB.Select(&tags, "SELECT * FROM tag")
	if err != nil {
		log.Println("err: ", err)
		return nil, err
	}
	for _, x := range tags {
		res := mapTag(x)
		schema = append(schema, &res)
	}
	return schema, nil
}

func postTag(name, tagType string) (int64, error) {
	tx := sqlHandler.DB.MustBegin()
	result, err := tx.NamedExec("INSERT INTO tag (name, type) VALUES (:name, :type)",
		map[string]interface{}{
			"name": name,
			"type": tagType,
		})
	tx.Commit()
	if err != nil {
		log.Println("err: ", err)
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		log.Println("err: ", err)
		return 0, err
	}
	return id, nil
}
