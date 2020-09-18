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
	//q := p.Q
	fmt.Printf("offset: %d, limit: %d, sort: %v", offset, limit, sort)
	schema := make([]*models.Tag, 0)
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
	fmt.Printf("name: %s, type: %s", name, tagType)
	return scenepicks.NewPostTagOK().WithPayload("success")
}
