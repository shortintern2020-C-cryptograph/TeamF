package handler

import (
	"context"
	"fmt"
	"os"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

type Client struct {
	auth *auth.Client
}

func NewClient() *Client {
	return &Client{}
}

func (c *Client) Init() error {
	opt := option.WithCredentialsFile(os.Getenv("rakuten-ec1cd-firebase-adminsdk-tzhja-b3295121a5.json"))
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		fmt.Printf("error: %v\n", err)
		os.Exit(1)
	}
	authClient, err := app.Auth(context.Background())
	if err != nil {
		fmt.Printf("error: %v\n", err)
		os.Exit(1)
	}
	c.auth = authClient
	return nil
}