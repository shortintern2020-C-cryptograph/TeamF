package handler

import (
	"fmt"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	//"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi"
	"github.com/go-openapi/runtime/middleware"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	//"os"
)

func GetDialog(p scenepicks.GetDialogParams) middleware.Responder {
	genre := p.Genre
	fmt.Printf("GET /dialog genre: %s\n", genre)
	schema := make([]*models.Dialog, 0)
	params := &scenepicks.GetDialogOKBody{
		Message: "success",
		Schema:  schema,
	}
	return scenepicks.NewGetDialogOK().WithPayload(params)
}

func PostDialog(p scenepicks.PostDialogParams) middleware.Responder {
	//idToken := p.Token
	//token, err := auth.VerifyIDToken(context.Background(), idToken)
	//if err != nil {
	//	fmt.Printf("error verifying ID token: %v\n", err)
	//	return scenepicks.NewPostDialogBadRequest()
	//}
	//fmt.Printf("uid: %s", token.UID)
	//userRecord, err := auth.GetUser(context.Background(), token)
	//if err != nil {
	//	fmt.Printf("error getting user record: %v\n", err)
	//	return scenepicks.NewPostDialogBadRequest()
	//}
	// getUserWithFirebaseRecord(userRecord)
	// =>firebaseUidを持つuserがDBに存在すれば更新、存在しなければ新たに作成
	content := p.Content
	//title := p.Title
	//author := p.Author
	//link := p.Link
	//style := p.Style
	//comment := p.Comment
	//tags := p.Tags
	fmt.Printf("POST /dialog content: %s, key: %s\n", content.Comment, p.XToken)
	return scenepicks.NewPostDialogOK().WithPayload("success")
}
