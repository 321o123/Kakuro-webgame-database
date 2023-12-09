import { sql } from '@vercel/postgres';
import {hashPassword, genToken, isAlphaNumeric} from "$lib/cryptography.js";

export async function POST({request}) {
    try {
        const {username, password} = await request.json();
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        if(username.length === 0 || password.length === 0){
            return new Response(
                JSON.stringify({error: 'Missing login or password'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 400});
        }

        if(username.length < 3){
            return new Response(
                JSON.stringify({error: 'Too short username'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 401});
        }

        if(username.length < 3){
            return new Response(
                JSON.stringify({error: 'Too short password'}),{
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
            await sql`SELECT username FROM Users WHERE username=${username}`;

        if(result.rows.length === 0){
            const token = await genToken(username);

                await sql`INSERT INTO Users(username, password_hash, registration_date, active_token, active_token_timestamp)
                                  VALUES(${username}, ${await hashPassword(password)}, ${currentDateTime}, ${token}, ${currentDateTime});`;

                const result2 =
                await sql`SELECT user_id FROM Users WHERE Username = ${username};`;

            const data = {
                username: username,
                token: token,
                userId: (await result2).rows[0].user_id
            }

            return new Response(
                JSON.stringify(data),{
                headers: {
                    'Content-Type': 'application/json'
                },
                status: 200});
        }

        // console.log(`pri${username}`);
        let options = {
            status: 409,
            headers: {'Content-Type': 'application/json'}
        };
        return new Response(JSON.stringify({error: 'This username is not available'}), options);
    } catch (e) {
        return new Response(String(e), {status: 500});
    }
}
