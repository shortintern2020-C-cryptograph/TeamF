package handler

import (
	"fmt"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	"log"
	"time"

	//"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi"
	"github.com/go-openapi/runtime/middleware"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	//"os"
)

func GetDialog(p scenepicks.GetDialogParams) middleware.Responder {
	genre := p.Genre

	fmt.Printf("genre: %s", genre)
	schema := make([]*models.Dialog, 0)

	// TODO: 1. offset, limitを利用した取得をできるようにする
	// TODO: 2. queryを利用した検索をできるようにする(likeを利用?)
	dialogs := []dialog{}
	err := sqlHandler.DB.Select(&dialogs, "SELECT * FROM dialog where source=?", p.Genre)
	if err != nil {
		log.Fatal(err)
	}
	for _, x := range dialogs {
		res := mapDialog(x)
		schema = append(schema, &res)
	}

	params := &scenepicks.GetDialogOKBody{
		Message: "success",
		Schema:  schema,
	}
	return scenepicks.NewGetDialogOK().WithPayload(params)
}

func PostDialog(p scenepicks.PostDialogParams) middleware.Responder {

	//TODO: firebase認証
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
	fmt.Printf("POST /tag content: %s, key: %s", content.Comment, p.Token)

	// DBへの書き込み
	tx := sqlHandler.DB.MustBegin()
	result, err := tx.NamedExec("INSERT INTO dialog (content, title, author, source, link, style) VALUES (:content, :title, :author, :source, :link, :style)",
		map[string]interface{}{
			"content": p.Content.Content,
			"title":   p.Content.Title,
			"author":  p.Content.Author,
			"source":  "normal",
			"link":    p.Content.Link,
			"style":   p.Content.Style,
		})
	tx.Commit()
	if err != nil {
		log.Fatal(err)
	}
	id, _ := result.LastInsertId()
	params := &scenepicks.PostDialogOKBody{
		Message: "success",
		ID:      id,
	}
	return scenepicks.NewPostDialogOK().WithPayload(params)
}

type dialog struct {
	// author
	Author string `json:"author,omitempty" db:"author"`

	// content
	Content string `json:"content,omitempty" db:"content"`

	// id
	ID int64 `json:"id,omitempty" db:"id"`

	// link
	Link string `json:"link,omitempty" db:"link"`

	// style
	Style string `json:"style,omitempty" db:"style"`

	// title
	Title string `json:"title,omitempty" db:"title"`

	// genre
	Source string `json:"genre,omitempty" db:"source"`

	CTime time.Time `json:"ctime" db:"ctime"`

	UTime time.Time `json:"utime" db:"utime"`
}

func mapDialog(d dialog) models.Dialog {
	res := models.Dialog{
		Author:  d.Author,
		Content: d.Content,
		ID:      d.ID,
		Link:    d.Link,
		Style:   d.Style,
		Title:   d.Title,
		Source:  d.Source,
	}
	return res
}
