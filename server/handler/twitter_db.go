/**
 * @author Riku Nunokawa
 */

package handler

import (
	"log"
)

func getPopularDialog() (int, error) {

	var popularDialogID int
	err := sqlHandler.DB.Get(&popularDialogID, `
		SELECT id FROM dialog
		ORDER BY RAND() 
		LIMIT 1
	`)
	if err != nil {
		log.Fatal(err)
		return 0, err
	}

	return popularDialogID, nil
}
