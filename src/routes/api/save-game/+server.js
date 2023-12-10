import {sql} from "@vercel/postgres";
import {verifyToken} from "$lib/cryptography.js";
import {isCompleted, KakuroBoard, loadSave} from "$lib/KakuroBoard.js";

export async function POST({request}) {
    try {
        const {user_id, board_id, token, xml} = await request.json();
        if(!user_id || !board_id || !token || !xml){
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
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        result =
            await sql`SELECT board_id FROM Saves WHERE User_id = ${user_id} AND Board_id=${board_id};`;


        if(result.rows.length !== 0){
            result =
                await sql`SELECT board_data FROM Boards WHERE board_id = ${board_id};`;
            await sql`UPDATE Saves 
                      SET Save_data = ${xml},
                      Creation_time = ${currentDateTime},
                      Completed = ${isCompleted(result.rows[0].board_data, xml)}
                      WHERE user_id = ${user_id} AND board_id=${board_id};`;
        }else{
            result =
                await sql`SELECT board_data FROM Boards WHERE board_id = ${board_id};`;
            await sql`INSERT INTO SAVES(user_id, board_id, Save_data, Completed, Creation_time)
                      VALUES(${user_id}, ${board_id}, ${xml}, ${isCompleted(result.rows[0].board_data, xml)}, ${currentDateTime});`;
        }
        return new Response(JSON.stringify({message: 'Success'}),{
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200});
    }catch (e){
        return new Response("Internal server error", {status: 500});
    }
}
