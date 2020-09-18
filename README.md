# C日程 TeamF

## ディレクトリ構成

```
.
├──app // フロントサイドコード
├──docs // データ定義など
├──gen // swaggerが吐き出すファイルの保存先
├──server // サーバサイドコード
├──docker-compose.yml
├──Dockerfile
└──README.md
```

## 開発flow

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
