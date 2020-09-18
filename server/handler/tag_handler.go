package handler

import (
	"fmt"
	"github.com/go-openapi/runtime/middleware"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
)

func GetTag(p scenepicks.GetTagParams) middleware.Responder {
	//tagType := p.Type
	offset := p.Offset
	limit := p.Limit
	sort := p.Sort
	genre := p.Genre
	//q := p.Q
	fmt.Printf("GET /tag offset: %d, limit: %d, sort: %v, genre: %s\n", offset, limit, sort, genre)
	schema := make([]*models.Tag, 0)
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

	// Authentication

	//dialog_id := p.DialogId
	name := p.Tag.Name
	tagType := p.Tag.Type
	token := p.XToken
	fmt.Printf("POST /tag name: %s, type: %s, token: %s\n", name, tagType, token)
	return scenepicks.NewPostTagOK().WithPayload("success")
}
