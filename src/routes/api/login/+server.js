import { sql, createPool } from '@vercel/postgres';
import { json } from '@sveltejs/kit';
import {genToken, isAlphaNumeric, verifyPassword} from "$lib/cryptography.js";

export async function POST({request}) {
    try {

        const {username, password} = await request.json();
        if(username.length <= 3){
            return new Response(
                JSON.stringify({error: 'Username is too short'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 401});
        }

        if(password.length <= 3){
            return new Response(
                JSON.stringify({error: 'Password is too short'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 401});
        }

        if(!isAlphaNumeric(username)){
            return new Response(
                JSON.stringify({error: 'Username must be alphanumeric'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 403});
        }

        const result =
            sql`SELECT Password_hash FROM Users WHERE Username = ${username};`;

        if ((await result).rows.length > 0 && await verifyPassword(password, (await result).rows[0].password_hash)){
            const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const token = await genToken(username);
            sql`UPDATE Users 
                SET Active_token = ${token}, 
                    active_token_timestamp = ${currentDateTime}
                WHERE username = ${username}`;

            const result2 =
                await sql`SELECT user_id FROM Users WHERE Username = ${username};`;

            return new Response(
                JSON.stringify({username: username,
                                        token: token,
                                        userId: (await result2).rows[0].user_id}),{
                headers: {
                    'Content-Type': 'application/json'
                },
                status: 200});
        }

        return new Response(
            JSON.stringify({error:'User not existing'}),{
                headers: {
                    'Content-Type': 'application/json'
                },
                status: 401});

    }catch (e) {
        return new Response(String(e));
    }
}