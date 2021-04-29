const usersService = require('../../services/postgresql/users.service');

const createTables = async (db) => {
  try {
    const create_users_table = {
      text: `CREATE TABLE IF NOT EXISTS
                public.users
              (
                  user_id serial PRIMARY KEY,
                  role VARCHAR(20) NOT NULL,
                  username VARCHAR(20) UNIQUE NOT NULL,
                  email VARCHAR(320) UNIQUE NOT NULL,
                  password text NOT NULL,
                  salt text NOT NULL
              );`
    };
    await db.query(create_users_table);

    const select_users = {
      text: `SELECT user_id FROM users`
    };
    const users = await db.query(select_users);
    if (!users.rowCount) {
      const username = 'admin';
      const email = 'admin@gmail.com';
      const role = 'admin';
      const password = 'admin';
      const admin = await usersService.createUser(username, email, role, password);
    }

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
  } catch (e) {
    console.error(e.stack);
  }
}

module.exports.createTables = createTables;
