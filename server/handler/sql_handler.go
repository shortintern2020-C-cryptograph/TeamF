package handler

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"log"
	"os"
)

var sqlHandler = NewSQLHandler()

type SQLHandler struct {
	DB *sqlx.DB
}

func NewSQLHandler() SQLHandler {
	// db接続
	dbenv := os.Getenv("DB_ENV")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	dburl := fmt.Sprintf("%s:%s@tcp(%s:3306)/nexus_db?parseTime=true", user, pass, dbenv)
	db, err := sqlx.Connect("mysql", dburl)
	if err != nil {
		log.Fatal(err)
	}

	sqlHandler := SQLHandler{
		DB: db,
	}

	return sqlHandler
}
