const { Client } = require("pg");
require('dotenv').config()

const SQL = `
CREATE TABLE IF NOT EXISTS player (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 ),
  password VARCHAR ( 255 ),
  chimp_game_score INTEGER REFERENCES chimp_game_score(id) 
);

CREATE TABLE IF NOT EXISTS chimp_game_score (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  player_id INTEGER REFERENCES player(id),
  score FLOAT DEFAULT NULL
);

INSERT INTO player (username, password) 
VALUES
  ('pippi', 'broder');
`;

async function main() {
  console.log("seeding...");
  console.log(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_HOST, process.env.DB_NAME);
  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();