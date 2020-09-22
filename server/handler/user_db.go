package handler

import (
	"github.com/shortintern2020-C-cryptograph/TeamF/server/gen/models"
	//"github.com/pkg/errors"
	"log"
)

func syncUser(user *models.User) error {

	// Transaction

	//tx, err := sqlHandler.DB.Begin()
	//if err != nil {
	//	log.Fatal(err)
	//	return err
	//}

	_, err := sqlHandler.DB.Exec(`
		INSERT INTO user (firebase_uid, display_name, photo_url)
		VALUES (?, ?, ?)
		ON DUPLICATE KEY
		UPDATE display_name = ?, photo_url = ?
	`, user.FirebaseUID, user.DisplayName, user.PhotoURL, user.DisplayName, user.PhotoURL)
	if err != nil {
		log.Fatal(err)
		return err
	}
	var id int64
	err = sqlHandler.DB.Get(&id, `
		SELECT id FROM user WHERE firebase_uid = ? LIMIT 1
	`, user.FirebaseUID)
	if err != nil {
		log.Fatal(err)
		return err
	}
	user.ID = id

	//defer func() {
	//	if err != nil {
	//		if re := tx.Rollback(); re != nil {
	//			err = errors.Wrap(err, re.Error())
	//		}
	//	}
	//}()

	//return tx.Commit()

	return nil

}