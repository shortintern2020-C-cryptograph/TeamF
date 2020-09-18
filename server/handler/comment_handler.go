package handler

import (
	"fmt"
	"github.com/go-openapi/runtime/middleware"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
)

func GetCommentById(p scenepicks.GetCommentByIDParams) middleware.Responder {
	offset := p.Offset
	limit := p.Limit
	fmt.Printf("offset: %s, limit: %s", offset, limit)

	schema := make([]*models.Comment, 0)
	result := &models.Comment{
		Content: "Cool!",
		User: &models.User{
			DisplayName: "John Doe",
			ID:          1,
			PhotoURL:    "http://example.com",
		},
	}
	schema = append(schema, result)
	params := &scenepicks.GetCommentOKBody{
		Message: "success",
		Schema:  schema,
	}

	return scenepicks.NewGetCommentOK().WithPayload(params)
}

func PostCommentById(p scenepicks.PostCommentByIDParams) middleware.Responder {
	comment := p.Comment
	fmt.Printf("comment: %s", comment)
	return scenepicks.NewPostCommentByIDOK().WithPayload("success")
}
