/**
 * @author Riku Nunokawa
 */

package handler

import (
	"context"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	//"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	//"os"
	"firebase.google.com/go/auth"
	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

type Client struct {
	auth *auth.Client
	user *models.User
	err error
}

func NewClient(idToken string) *Client {
	client := &Client{}
	client.Init(idToken) // init client
	return client
}

func NewClientWithNoToken() *Client {
	client := &Client{}
	client.InitWithNoToken() // init client
	return client
}

func (c *Client) Init(idToken string) {

	c.getAuthClient()

	token, err := c.auth.VerifyIDToken(context.Background(), idToken)
	if err != nil {
		c.err = err
		return
	}
	userRecord, err := c.auth.GetUser(context.Background(), token.UID)
	if err != nil {
		c.err = err
		return
	}
	user := getUserFromFirebaseRecord(userRecord)
	err = syncUser(&user)
	if err != nil {
		c.err = err
		return
	}
	c.user = &user
}

func (c *Client) InitWithNoToken() {
	c.getAuthClient()
}

func (c *Client) getAuthClient() {
	// DANGEROUS
	opt := option.WithCredentialsJSON([]byte(`{
		"type": "service_account",
		"project_id": "rakuten-ec1cd",
		"private_key_id": "9663e4ab3df4cbdb0bcd4a23e19fa3c55f64798a",
		"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUnox0kyxX8zEQ\nNtc1jRZ1Oz9V+2rkPU50GGDZrFZ3U8LHNkJyTzSD8yXdz1saPPUIbB553d6u7sUb\nFg0GOez6JBYlY+xjBkfbYHUK3PdpF29fCG2SfShE66npQA16t4GH8CrIj5ol4oT2\nPAHS31rH/rsZh+oT1rhA7KM4XNygWq0iyrEvKXLZt4zzqHEgW5/6I8JVldQIWSbd\nAW1x/QAoPQ9zoOitTJMNJZgbvnFf3mwauJJmU+h/Uu7/NL4rvs1PCpOm1eDcnAff\n4PB8yEgWzKJ9mPAnUo9wBDpdanvWcVOTAAcP0ty5CDwvf48+mt1oryZ6bZM3jjaF\nh34yY5cvAgMBAAECggEAUFRgm5CZIddzU31svMJD2GHckYcuQPI6qFknikX22xmN\nzwccfqSXIj0kstNrR5P9PcPflcpyHiR+2rdvj0kmU/F7XoAMqPMQBf3A6qxGW3Gr\ntbtw7nYT10o0RThaf2FCcpIWD/VVV3foJUHRrJKPcV034jL8CKfIsFrXZe2Lu5cm\nHIiUGZZfOlqCBSu/t7cslf3yMOXxk3XT64ORpL5dWOLr3GTIoty+814sLEeTYeOm\nLt53ZQO/2w1rQ+0494qs7IEO5qaucfVFjgO1Pro+9sSDNIXdgk10tCq6gV8zdQMe\nJo5VHhvaw39Kcnw8H4WPothZjpjvbC7c/wQOiYCMwQKBgQD26k1JKeskhWvWnNso\nGDxzoo0uFx/5XCkdZ4Kq07H7xFgT5G7tJsjTC1T1yNNRCz1T91ZJxyd2HJOd3Vsr\nNVO7SiZU3HuvmSo4S5yWsjDMrt3UEnRPTiwrdHab/JPzAcE2MSgMwj/JA1rxX6EV\n38lVHFeZlgYH3kYdJDhAPSrtQQKBgQDccTaNLBEZs4FvbUa1TXeFvf8DDJas/uVW\nrDBXky8DTVD9/FvMagAyqnwkmK255uk1WdvbmhSEuAqo0bznrZFd2AUyYaSLccGP\nm8fgUuBAYANsM87JvMj/dG1+U4Dxx8DGQ3phuE9aNT/3vCFCEG0JBTROOP0BYh5a\ndzZXAkC4bwKBgQC5DEf3uS69JDD5mny0w9UqZHyiOjqAS42Ut+q51AXjxfaskdqA\naTzAzhFSUrvsVRwVPZyxlkwAvNH00dxtuX2TM7Mejk8z/vohTqmAVvMzsyoUse/x\nL4jy2Em8BcNrr7j5wEVfqoTbRWR22VCEcD8XRjJwrHrAktjBJk/x9OWjAQKBgHK8\nnncmK5RkAQe9KeNt+brr5FJy9+39EeNl5hd+7SZb1L8N3b3sokO8xrbJnQq4rENv\njOalMO7PWAT8fcVcauAccsABYIKP5/5WR9dza3M2RjHIWWZZU4ja0a7ByciOfsDz\nGDzKkMrUEoJgMjNPl2Dti4b3VICm0EOn7umkq4kTAoGABrXPm7BkzLZ17IOV/oAu\nAYMycZg/zcUUP0ICxRFKbDnFLxjasCUFmVyuuYpBVpB8E1A8GJsIVZJ6D0jF9x2E\nEF97aHP3rWIitgezY2u/1rmBAWOMjgCNbGQTBqatBY5R/ofGdKPoO8IQuYU2ZT+R\nVEmusfPTxhteP3meQkb770E=\n-----END PRIVATE KEY-----\n",
		"client_email": "firebase-adminsdk-tzhja@rakuten-ec1cd.iam.gserviceaccount.com",
		"client_id": "108277810203922191656",
		"auth_uri": "https://accounts.google.com/o/oauth2/auth",
		"token_uri": "https://oauth2.googleapis.com/token",
		"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
		"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tzhja%40rakuten-ec1cd.iam.gserviceaccount.com"
	}`))
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		c.err = err
		return
	}
	authClient, err := app.Auth(context.Background())
	if err != nil {
		c.err = err
		return
	}
	c.auth = authClient
}

func getUserFromFirebaseRecord(u *auth.UserRecord) models.User {
	return models.User{
		FirebaseUID: u.UID,
		DisplayName: u.DisplayName,
		PhotoURL:    u.PhotoURL,
	}
}