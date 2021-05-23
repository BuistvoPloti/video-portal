const migration = async (db) => {
  const create_videos_table = {
    text: `CREATE TABLE IF NOT EXISTS
                public.videos
              (
                  video_id serial PRIMARY KEY,
                  user_id int NOT NULL,
                  bucket_file_path text UNIQUE NOT NULL,
                  FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
              );`
  };
  await db.query(create_videos_table);
};

module.exports = migration;
