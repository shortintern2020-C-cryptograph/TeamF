/**
 * @author Riku Nunokawa
 */

package handler

import "log"

func getDialogCount() (int, error) {
	var cnt int
	err := sqlHandler.DB.Get(&cnt, "SELECT count(*) FROM dialog")
	if err != nil {
		log.Fatal(err)
		return 0, err
	}
	return cnt, err
}

func getCommentCount() (int, error) {
	var cnt int
	err := sqlHandler.DB.Get(&cnt, "SELECT count(*) FROM comment")
	if err != nil {
		log.Fatal(err)
		return 0, err
	}
	return cnt, err
}

func getTagCount() (int, error) {
	var cnt int
	err := sqlHandler.DB.Get(&cnt, "SELECT count(*) FROM tag")
	if err != nil {
		log.Fatal(err)
		return 0, err
	}
	return cnt, err
}

func getTagRelationCount() (int, error) {
	var cnt int
	err := sqlHandler.DB.Get(&cnt, "SELECT count(*) FROM dialog_tag")
	if err != nil {
		log.Fatal(err)
		return 0, err
	}
	return cnt, err
}
