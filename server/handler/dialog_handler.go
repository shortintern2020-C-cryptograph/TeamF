/**
 * @author Riku Nunokawa
 * @template writer Futa Nakayama
 */

package handler

import (
	//"context"
	//"context"
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
	offset := p.Offset
	limit := p.Limit
	sort := p.Sort
	q := p.Q
	if sort == nil {
		new := "new"
		sort = &new
	}
	if q == nil {
		empty := ""
		q = &empty
	}

	fmt.Printf("GET /dialog genre: %s, offset: %d, limit: %d\n", genre, offset, limit)

	if offset < 0 || limit <= 0 {
		return scenepicks.NewGetDialogBadRequest().WithPayload("parameter value is invalid")
	}

	if genre != "all" && genre != "anime" && genre != "manga" && genre != "book" && genre != "youtube" {
		return scenepicks.NewGetDialogBadRequest().WithPayload("genre is invalid")
	}
	if *sort != "new" && *sort != "like" && *sort != "comment" && *sort != "combined" {
		return scenepicks.NewGetDialogBadRequest().WithPayload("sort key is invalid")
	}
	schema, err := getDialog(genre, offset, limit, *sort, *q)
	if err != nil {
		log.Fatal(err)
	}

	params := &scenepicks.GetDialogOKBody{
		Message: "success",
		Schema:  schema,
	}
	return scenepicks.NewGetDialogOK().WithPayload(params)
}

func PostDialog(p scenepicks.PostDialogParams) middleware.Responder {

	//TODO: firebase認証
	idToken := p.Token
	client := NewClient(idToken)
	if client.err != nil {
		fmt.Printf("%v\n", client.err)
		return scenepicks.NewPostDialogBadRequest()
	}
	//fmt.Printf("Twitter's information\n")
	//fmt.Printf("id: %d\n", client.user.ID)
	//fmt.Printf("uid: %s\n", client.user.FirebaseUID)
	//fmt.Printf("display_name: %s\n", client.user.DisplayName)
	//fmt.Printf("photo_url: %s\n", client.user.PhotoURL)
	//=>firebaseUidを持つuserがDBに存在すれば更新、存在しなければ新たに作成
	userID := client.user.ID
	content := p.Content.Content
	title := p.Content.Title
	author := p.Content.Author
	source := p.Content.Source
	link := p.Content.Link
	style := p.Content.Style
	comment := p.Content.Comment
	//tags := p.Tags

	if content == "" || title == "" || author == "" || link == "" || style == "" || comment == "" {
		return scenepicks.NewGetDialogBadRequest().WithPayload("vacant parameter is invalid")
	}
	if source != "anime" && source != "manga" && source != "book" && source != "youtube" {
		return scenepicks.NewGetDialogBadRequest().WithPayload("got unknown source")
	}

	id, err := postDialog(content, title, author, source, link, style, comment, userID)
	if err != nil {
		log.Fatal(err)
	}
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

	// userID
	UserID int64 `json:"user_id,omitempty" db:"user_id"`

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
		UserID:  d.UserID,
	}
	return res
}
