import {sql} from "@vercel/postgres";
import {verifyToken} from "$lib/cryptography.js";

export async function POST({request}){
    try {
        const {user_id, offset, count, key, order, token} = await request.json();

        if(!user_id || !token || !count || !order || !key || typeof offset !== 'number' || isNaN(offset)){
            return new Response(
                JSON.stringify({error: 'Required request body JSON property is missing'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 400});
        }

        let result =
            await sql`SELECT Active_token FROM Users WHERE User_id = ${user_id};`;

        if(result.rows[0].active_token !== token){
            return new Response(
                JSON.stringify({error: 'Unauthorized'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 401});
        }

        let a = (await verifyToken(token));

        if (!a){
            return new Response(
                JSON.stringify({error: 'Invalid token'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 403});
        }
        if (key === 'name') {
            if (order === 'DESC') {
                result = await sql`SELECT name, completed, creation_time, Boards.board_id
                      FROM Saves 
                      LEFT JOIN Boards
                        ON Boards.board_id = Saves.board_id
                      WHERE User_id=${user_id}
                      ORDER BY name DESC NULLS LAST
                      LIMIT ${count} OFFSET ${offset};`;
            }else{
                result = await sql`SELECT name, completed, creation_time, Boards.board_id
                      FROM Saves 
                      LEFT JOIN Boards
                        ON Boards.board_id = Saves.board_id
                      WHERE User_id=${user_id}
                      ORDER BY name ASC NULLS LAST
                      LIMIT ${count} OFFSET ${offset};`;
            }
        }else if(key === 'completed'){
            if(order === 'DESC') {
                result = await sql`SELECT name, completed, creation_time, Boards.board_id
                      FROM Saves 
                      LEFT JOIN Boards
                        ON Boards.board_id = Saves.board_id
                      WHERE User_id=${user_id}
                      ORDER BY completed DESC NULLS LAST
                      LIMIT ${count} OFFSET ${offset};`;
            }else{
                result = await sql`SELECT name, completed, creation_time, Boards.board_id
                      FROM Saves 
                      LEFT JOIN Boards
                        ON Boards.board_id = Saves.board_id
                      WHERE User_id=${user_id}
                      ORDER BY completed ASC NULLS LAST
                      LIMIT ${count} OFFSET ${offset};`;
            }
        }else{
            if(order ==='ASC'){
                result = await sql`SELECT name, completed, creation_time, Boards.board_id
                      FROM Saves 
                      LEFT JOIN Boards
                        ON Boards.board_id = Saves.board_id
                      WHERE User_id=${user_id}
                      ORDER BY creation_time ASC NULLS LAST
                      LIMIT ${count} OFFSET ${offset};`;
            }else{
                result = await sql`SELECT name, completed, creation_time, Boards.board_id
                      FROM Saves 
                      LEFT JOIN Boards
                        ON Boards.board_id = Saves.board_id
                      WHERE User_id=${user_id}
                      ORDER BY creation_time DESC NULLS LAST
                      LIMIT ${count} OFFSET ${offset};`;
            }
        }
        const result2 =
             (await sql`SELECT COUNT(Board_id)
                        FROM Saves
                        WHERE user_id = ${user_id};`).rows[0].count;

        return new Response(
            JSON.stringify(result.rows), {
                headers: {
                    'Content-Type': 'application/json',
                    'count': result2
                },
                status: 200
            });


    }catch (e){
        return new Response("Internal server error", {status: 500});
    }
}