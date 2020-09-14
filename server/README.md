# サーバ

## セットアップ
Goのバージョンを確認し、`go mod`を初期化、その後`go-swagger`をインストールする。
```
# check go version
$ go version 
go version go1.14.3 darwin/amd64

# init go mod
$ go mod init

# install go-swagger
$ go get -u github.com/go-swagger/go-swagger/cmd/swagger@v0.25.0

```

## swagger generate
`go-swagger`を利用して、SwaggerファイルからGoコードを生成する。

[Custom Server Tutorial](https://goswagger.io/tutorial/custom-server.html) をこのリポジトリでは参考にする。

```bash
$ swagger generate server -a routemangement --exclude-main --strict-additional-properties -t gen -f ./swagger.yml
```