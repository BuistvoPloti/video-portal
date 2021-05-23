const migration = async (db) => {
  const create_pending_users_table = {
    text: `CREATE TABLE IF NOT EXISTS
                public.pending_users
              (
                  pending_user_id serial PRIMARY KEY,
                  user_id int UNIQUE NOT NULL, 
                  confirmation_code VARCHAR(200) NOT NULL,
                  FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
              );`
  };
  await db.query(create_pending_users_table);
};

module.exports = migration;
