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
  } catch (e) {
    console.error(e.stack);
  }
}

module.exports.createTables = createTables;
