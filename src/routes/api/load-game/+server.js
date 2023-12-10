import {sql} from "@vercel/postgres";
import {verifyToken} from "$lib/cryptography.js";

export async function POST({request}){
    try {
        const {user_id, board_id, token} = await request.json();

        if(!user_id || !board_id || !token){
            return new Response(
                JSON.stringify({error: 'Required request body JSON property is missing'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 400});
        }
        const result =
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

        const result2 =
            await sql`SELECT Save_data 
                      FROM Saves 
                      WHERE User_id=${user_id} AND Board_id=${board_id};`;

        if(result2.rows.length === 0){
            return new Response(
                JSON.stringify({message: "No save-game for this board"}), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    status: 404
                });
        }

        return new Response(
            JSON.stringify({save_data: result2.rows[0].save_data}), {
                headers: {
                    'Content-Type': 'application/json',
                },
                status: 200
            });
    }catch (e){
        return new Response("Internal server error", {status: 500});
    }
}