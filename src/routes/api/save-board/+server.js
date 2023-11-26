import {sql} from "@vercel/postgres";
import {verifyToken} from "$lib/cryptography.js";

export async function POST({request}) {
    try {
        const {user_id, xml, name, token} = await request.json();
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const result =
            sql`SELECT Active_token FROM Users WHERE User_id = ${user_id};`;

        if((await result).rows[0].active_token !== token){
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

        await sql`INSERT INTO Boards(Creator, Board_data, Name, Creation_date)
                  VALUES(${user_id}, ${xml}, ${name}, ${currentDateTime});`;

        return new Response(JSON.stringify({message: 'Success'}),{
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200});
    }catch (e){
        return new Response();
    }
}
