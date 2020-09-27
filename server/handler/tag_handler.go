/**
 * @author Riku Nunokawa
 * @template writer Futa Nakayama
 */

package handler

import (
	"fmt"
	"github.com/go-openapi/runtime/middleware"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"log"
	"time"
)

func GetTag(p scenepicks.GetTagParams) middleware.Responder {
	//tagType := p.Type
	offset := p.Offset
	limit := p.Limit
	sort := p.Sort
	genre := p.Genre
	q := p.Q
	if sort == nil {
		empty := "new"
		sort = &empty
	}
	if q == nil {
		empty := ""
		q = &empty
	}

	fmt.Printf("GET /tag offset: %d, limit: %d, sort: %v, genre: %s, q: %v\n", offset, limit, sort, genre, q)

	if offset < 0 || limit <= 0 {
		return scenepicks.NewGetDialogBadRequest().WithPayload("parameter value is invalid")
	}
	if genre != "all" && genre != "title" && genre != "author" && genre != "other" {
		return scenepicks.NewGetDialogBadRequest().WithPayload("genre is invalid")
	}
	// 今のとこ新しい順のみ
	if *sort != "new" {
		return scenepicks.NewGetDialogBadRequest().WithPayload("sort key is invalid")
	}

	schema, err := getTag(offset, limit, *sort, genre, *q)
	if err != nil {
		log.Fatal(err)
	}

	//result := &models.Tag{
	//	ID:   1,
	//	Name: "ハウルの動く城",
	//	Type: "アニメ",
	//}
	//schema = append(schema, result)
	params := &scenepicks.GetTagOKBody{
		Message: "success",
		Schema:  schema,
	}
	return scenepicks.NewGetTagOK().WithPayload(params)
}

func PostTag(p scenepicks.PostTagParams) middleware.Responder {

	name := p.Tag.Name
	tagType := p.Tag.Type
	fmt.Printf("POST /tag name: %s, type: %s\n", name, tagType)

	if name == "" {
		return scenepicks.NewGetDialogBadRequest().WithPayload("vacant name is invalid")
	}
	if tagType != "title" && tagType != "author" && tagType != "other" {
		return scenepicks.NewGetDialogBadRequest().WithPayload("tagType is invalid")
	}

	// TODO: ここでfirebase認証'
	idToken := p.Token
	client := NewClient(idToken)
	if client.err != nil {
		fmt.Printf("%v\n", client.err)
		return scenepicks.NewPostDialogBadRequest()
	}

	// DBへ書き込み
	id, err := postTag(name, tagType)
	if err != nil {
		log.Println(err)
	}
	params := &scenepicks.PostTagOKBody{
		Message: "success",
		ID:      id,
	}
	return scenepicks.NewPostTagOK().WithPayload(params)
}

type tag struct {

	// id
	ID int64 `json:"id,omitempty" db:"id"`

	Name string `json:"name,omitempty" db:"name"`

	Type string `json:"type,omitempty" db:"type"`

	CTime time.Time `json:"ctime" db:"ctime"`

	UTime time.Time `json:"utime" db:"utime"`
}

func mapTag(t tag) models.Tag {
	res := models.Tag{
		ID:   t.ID,
		Name: t.Name,
		Type: t.Type,
	}
	return res
}
