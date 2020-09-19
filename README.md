# C日程 TeamF

## ディレクトリ構成

```
.
├──app // フロントサイドコード
├──docs // データ定義など
├──server // サーバサイドコード
│    ├──gen // swaggerが吐き出すファイルの保存先
│    ├──handler 
│    └──main.go
├──docker-compose.yml
├──Dockerfile
└──README.md
```

## サーバの起動
ローカルでサーバを起動する
```
# 起動
make local/run
```

dockerを利用してサーバを起動
```
# 起動
make docker/run

# 停止
make docker/stop
```

## 開発flow
git-flowに従う

## client直接さわりたいとき
`make mysql/client`で入れる

## migrateしたいとき
`database/migration/schema`にmigrationファイルを書き、

`make flyway/migrate`でmigrate

## migration失敗してどうにもならなくなったとき
`make flyway/clean`

`make flyway/baseline`

`make flyway/migrate`

で大抵直る
