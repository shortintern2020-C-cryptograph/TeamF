package handler

import (
	"github.com/pkg/errors"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"log"
)

func getTag(offset int64, limit int64, sort string, genre string, q string) ([]*models.Tag, error) {
	schema := make([]*models.Tag, 0)

	// TODO: offset, limit, sortを利用した取得をできるように実装
	//SELECTを実行
	tags := []tag{}
	var err error
	if genre == "all" {
		err = sqlHandler.DB.Select(&tags, `
			SELECT * FROM tag
			WHERE name LIKE ?
			ORDER BY utime DESC
			LIMIT ?
			OFFSET ?
		`, "%"+q+"%", limit, offset)
	} else {
		err = sqlHandler.DB.Select(&tags, `
			SELECT * FROM tag
			WHERE type = ? AND name LIKE ?
			ORDER BY utime DESC
			LIMIT ?
			OFFSET ?
		`, genre, "%"+q+"%", limit, offset)
	}
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
	if err != nil {
		log.Println("err: ", err)
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		log.Println("err: ", err)
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
