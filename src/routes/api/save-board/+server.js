import {sql} from "@vercel/postgres";
import {verifyToken} from "$lib/cryptography.js";

export async function POST({request}) {
    try {
        const {user_id, xml, name, token} = await request.json();

        if(!user_id || !xml || !name || !token){
            return new Response(
                JSON.stringify({error: 'Required request body JSON property is missing'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 400});
        }

        if(name.length > 20){
            return new Response(
                JSON.stringify({error: 'Too long name.'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 420});
        }

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
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const result2 =
            await sql`SELECT board_id FROM Boards WHERE creator = ${user_id} AND name=${name};`;

        if(result2.rows.length !== 0){
            return new Response(JSON.stringify({message: 'Existing name'}),{
                headers: {
                    'Content-Type': 'application/json'
                },
                status: 409});
        }

        await sql`INSERT INTO Boards(Creator, Board_data, Name, Creation_date)
                  VALUES(${user_id}, ${xml}, ${name}, ${currentDateTime});`;

        const result3 =
            await sql`SELECT board_id FROM Boards WHERE creator = ${user_id} AND name=${name};`;


        return new Response(JSON.stringify({message: 'Success', board_id: result3.rows[0].board_id}),{
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200});
    }catch (e){
        return new Response("Internal server error", {status: 500});
    }
}
