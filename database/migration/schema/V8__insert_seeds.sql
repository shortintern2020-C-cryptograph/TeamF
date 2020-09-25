INSERT INTO
  user(id, firebase_uid, display_name)
   /**
   * フレーズについて
   * @author Kaito Kuroiwa
   */
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
  dialog(id, content, title, author, source, link, style, user_id)
VALUES
  (1, "バルス", "天空の城ラピュタ", "宮崎駿", "anime", "https://www.amazon.co.jp/%E5%A4%A9%E7%A9%BA%E3%81%AE%E5%9F%8E%E3%83%A9%E3%83%94%E3%83%A5%E3%82%BF-DVD-%E5%AE%AE%E5%B4%8E%E9%A7%BF/dp/B00K72NG0M", "normal", 1),
  (2, "ブンブンハローYoutube", "【モンスト】鬼滅の刃コラボガチャ40連で確定からの超神引き！【ヒカキンゲームズ】", "HIKAKIN", "youtube", "https://youtu.be/w7olbu5dFsU", "normal", 1),
  (3, "人間はなぜこうまでして自分の似姿をつくりたがるのかしらね", "攻殻機動隊", "草薙素子", "anime", "https://item.rakuten.co.jp/neowing-r/bvch-44004/", "normal", 2),
  (4, "真実はいつも一つ！", "名探偵コナン", "青山剛昌", "anime", "https://tv.rakuten.co.jp/content/14627/", "normal", 1),
  (5, "これはお前が始めた物語だろ", "進撃の巨人", "諫山創", "anime", "https://item.rakuten.co.jp/mangazenkan/si-506/", "normal", 3),
  (6, "俺の大将は王様だが、お前のは玉だ！", "将棋", "東海オンエア", "youtube", "https://youtu.be/QscRqnBwCk0", "normal", 4),
  (7, "グーみたいな奴がいて、チョキみたいな奴もいて、パーみたいな奴もいる。誰が一番強いか答えを知ってる奴はいるか？", "宇宙兄弟", "小山宙哉", "manga", "https://books.rakuten.co.jp/rk/97fe015f07974e419c268d30c62722de/", "normal", 6),
  (8, "逃亡者は1週間以内にいずれかの空港より脱出すれば勝利となる", "アメリカ全土で1週間鬼ごっこしてみた。", "だいにぐるーぷ", "youtube", "https://youtu.be/rijrRFV_CWQ", "normal", 7);


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
