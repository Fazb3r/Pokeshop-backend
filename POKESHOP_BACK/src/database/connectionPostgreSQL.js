import pg from "pg"

export const pool = new pg.Pool({
    host:"localhost",
    port: 5432,
    database: "pokeshop",
    user: "postgres",
    password:"Faiberman123"
});
