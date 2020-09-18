package handler

import (
	"fmt"
	"github.com/go-openapi/runtime/middleware"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"log"
)

func GetTag(p scenepicks.GetTagParams) middleware.Responder {
	//tagType := p.Type
	offset := p.Offset
	limit := p.Limit
	sort := p.Sort
	genre := p.Genre
	//q := p.Q
	fmt.Printf("GET /tag offset: %d, limit: %d, sort: %v, genre: %s", offset, limit, sort, genre)
	schema := make([]*models.Tag, 0)

	// TODO: offset, limit, sortを利用した取得をできるように実装
	//SELECTを実行
	rows, err := sqlHandler.DB.Queryx("SELECT * FROM tag")
	if err != nil {
		log.Fatal(err)
	}

	var tag *models.Tag
	for rows.Next() {

		//rows.Scanの代わりにrows.StructScanを使う
		err := rows.StructScan(tag)
		if err != nil {
			log.Fatal(err)
		}
		schema = append(schema, tag)
	}

	result := &models.Tag{
		ID:   1,
		Name: "ハウルの動く城",
		Type: "アニメ",
	}
	schema = append(schema, result)
	params := &scenepicks.GetTagOKBody{
		Message: "success",
		Schema:  schema,
	}
	return scenepicks.NewGetTagOK().WithPayload(params)
}

func PostTag(p scenepicks.PostTagParams) middleware.Responder {

	name := p.Tag.Name
	tagType := p.Tag.Type
	fmt.Printf("name: %s, type: %s", name, tagType)

	// TODO: ここでfirebase認証

	// DBへ書き込み
	tx := sqlHandler.DB.MustBegin()
	result, err := tx.NamedExec("INSERT INTO tag (name, type) VALUES (:name, :type)",
		map[string]interface{}{
			"name": p.Tag.Name,
			"type": p.Tag.Type,
		})
	tx.Commit()
	if err != nil {
		log.Fatal(err)
	}
	id, _ := result.LastInsertId()
	params := &scenepicks.PostTagOKBody{
		Message: "success",
		ID:      id,
	}
	return scenepicks.NewPostTagOK().WithPayload(params)
}
