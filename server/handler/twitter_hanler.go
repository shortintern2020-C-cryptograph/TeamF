package handler

import (
	"github.com/ChimeraCoder/anaconda"
	"github.com/go-openapi/runtime/middleware"
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/restapi/scenepicks"
	"log"
	"strconv"
)

func PostToTwitter(p scenepicks.PostToTwitterParams) middleware.Responder {

	popularDialogID, err := getPopularDialog()
	if err != nil {
		log.Fatal(err)
	}
	log.Println(popularDialogID)

	consumerKey := "cPkhgkEuZz4EJg7s2KmLRxZIN"
	consumerSecret := "vNx0PXtpiUsp4mU9p35pSIpFeaisG9XxtcaIS29dpUAG6OecO4"
	accessToken := "1305800631911739392-da3BZVAKQWzqRYyhjFSjHT7mVa1euk"
	accessSecret := "rzRQ0qsMl6qUjtI5MBDDkTv6h0Oo8pcS5SX5IJRUuIXrA"

	anaconda.SetConsumerKey(consumerKey)
	anaconda.SetConsumerSecret(consumerSecret)
	api := anaconda.NewTwitterApi(accessToken, accessSecret)

	// ツイート実行
	_, err = api.PostTweet("https://app.scenepicks.tk/dialog/"+strconv.Itoa(popularDialogID), nil)
	if(err != nil){
		panic(err)
	}

	params := &scenepicks.PostToTwitterOKBody{
		Message: "success",
	}

	return scenepicks.NewPostToTwitterOK().WithPayload(params)
}
