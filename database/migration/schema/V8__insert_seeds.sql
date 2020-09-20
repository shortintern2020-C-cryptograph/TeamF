INSERT INTO
  user(id, firebase_uid, display_name)
VALUES
  (1, "firebase01", "Alice"),
  (2, "firebase02", "Bob"),
  (3, "firebase03", "Carol"),
  (4, "firebase04", "Eve"),
  (5, "firebase05", "Oscar"),
  (6, "firebase06", "Steve"),
  (7, "firebase07", "Walter"),
  (8, "firebase08", "Zoe");

INSERT INTO
  dialog(id, content, title, author, source, link, style)
VALUES
  (1, "バルス", "天空の城ラピュタ", "宮崎駿", "anime", "https://example.com", "normal"),
  (2, "ブンブンハローYoutube", "モンスト100連ガチャやってみた", "HIKAKIN", "youtube", "https://example.com", "normal"),
  (3, "人間はなぜこうまでして自分の似姿をつくりたがるのかしらね", "攻殻機動隊", "草薙素子", "anime", "https://example.com", "normal"),
  (4, "真実はいつも一つ！", "名探偵コナン", "青山剛昌", "anime", "https://example.com", "normal"),
  (5, "これはお前が始めた物語だろ", "進撃の巨人", "諫山創", "anime", "https://example.com", "normal"),
  (6, "俺の大将は王様だが、お前のは玉だ！", "将棋", "東海オンエア", "youtube", "https://example.com", "normal"),
  (7, "グーみたいな奴がいて、チョキみたいな奴もいて、パーみたいな奴もいる。誰が一番強いか答えを知ってる奴はいるか？", "宇宙兄弟", "小山宙哉", "manga", "https://example.com", "normal"),
  (8, "逃亡者は1週間以内にいずれかの空港より脱出すれば勝利となる", "アメリカ全土で1週間鬼ごっこしてみた。", "だいにグループ", "youtube", "https://example.com", "normal");

INSERT INTO
  comment(id, content, user_id, dialog_id)
VALUES
  (1, "バルス！", 2, 1),
  (2, "HIKAKIN大好き", 2, 2),
  (3, "どんなシーン？", 1, 3),
  (4, "たまに二つあるよね！", 5, 4),
  (5, "よくわからんがアツいな", 3, 5),
  (6, "どういうシーン？笑", 6, 6),
  (7, "すごい元気出た", 4, 7),
  (8, "スケール大きすぎ...", 7, 8);

INSERT INTO
  favorite(id, user_id, dialog_id)
VALUES
  (1, 4, 1),
  (2, 6, 2),
  (3, 8, 3),
  (4, 7, 4),
  (5, 6, 5),
  (6, 5, 6);

INSERT INTO
  tag(id, name, type)
VALUES
  (1, "天空の城ラピュタ", "title"),
  (2, "宮崎駿", "author"),
  (3, "HIKAKIN", "author"),
  (4, "攻殻機動隊", "title"),
  (5, "草薙素子", "author"),
  (6, "名探偵コナン", "title"),
  (7, "青山剛昌", "author"),
  (8, "進撃の巨人", "title"),
  (9, "諫山創", "author"),
  (10, "東海オンエア", "author"),
  (11, "宇宙兄弟", "title"),
  (12, "小山宙哉", "author"),
  (13, "だいにグループ", "author"),
  (14, "名言", "other"),
  (15, "愛すべきバカ", "other");

INSERT INTO
  dialog_tag(tag_id, dialog_id)
VALUES
  (1, 1),
  (2, 1),
  (3, 2),
  (4, 3),
  (5, 3),
  (6, 4),
  (7, 4),
  (8, 5),
  (9, 5),
  (10, 6),
  (11, 7),
  (12, 7),
  (13, 8),
  (14, 3),
  (14, 5),
  (14, 7),
  (15, 6);
