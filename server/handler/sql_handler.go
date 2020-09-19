package handler

import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"log"
)

var sqlHandler = NewSQLHandler()

type SQLHandler struct {
	DB *sqlx.DB
}

func NewSQLHandler() SQLHandler {
	// db接続
	dburl := "root:password@tcp(localhost:3306)/nexus_db?parseTime=true"
	db, err := sqlx.Connect("mysql", dburl)
	if err != nil {
		log.Fatal(err)
	}

	sqlHandler := SQLHandler{
		DB: db,
	}
	return sqlHandler
}
