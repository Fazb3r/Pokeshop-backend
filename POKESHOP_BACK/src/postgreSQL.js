import {pool} from "./database/connectionPostgreSQL.js";

const getUserList = async () =>{
    try {
        const result = await pool.query('SELECT id, username, password FROM "user"');
        console.log("Usuarios encontrados:", result.rows);
    }
    catch (error){
        console.error(error)


    }
};
getUserList()