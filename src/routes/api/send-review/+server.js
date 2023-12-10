import {sql} from "@vercel/postgres";
import {verifyToken} from "$lib/cryptography.js";
import {isCompleted} from "$lib/KakuroBoard.js";

export async function POST({request}) {
    try {
        const {user_id, board_id, token, rating, text} = await request.json();

        if(!user_id || !board_id || !token || typeof rating !== 'number' || isNaN(rating)){
            return new Response(
                JSON.stringify({error: 'Required request body JSON property is missing'}),{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 400});
        }
        let result;
        result =
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
        // result =
        //     await sql`SELECT * FROM SAVES WHERE user_id = ${user_id} AND board_id = ${board_id};`;
        //
        // if(result.raw.length === 0){
        //     return new Response(
        //         JSON.stringify({message: "No save-game for this board"}), {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             status: 404
        //         });
        // }
        const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        result =
            await sql`SELECT review_id FROM Reviews WHERE Reviewer=${user_id} AND board_id=${board_id};`;

        if(!text){
            if(result.rows.length === 0){
                await sql`INSERT INTO Reviews(Reviewer, Board_id, Rating, Creation_time)
                  VALUES(${user_id}, ${board_id}, ${rating}, ${currentDateTime});`;
            }else{
                await sql`UPDATE Reviews
                      SET Rating = ${rating},
                      Creation_time = ${currentDateTime}
                      WHERE Reviewer = ${user_id} AND Board_id=${board_id}; `;
            }
        }else{
            if(result.rows.length === 0){
                await sql`INSERT INTO Reviews(Reviewer, Board_id, Rating, Creation_time, Review_text)
                  VALUES(${user_id}, ${board_id}, ${rating}, ${currentDateTime}, ${text});`;
            }else{
                await sql`UPDATE Reviews
                      SET rating = ${rating},
                      Creation_time = ${currentDateTime},
                      Review_text = ${text}
                      WHERE Reviewer = ${user_id} AND board_id=${board_id}; `;
            }
        }


        return new Response(JSON.stringify({message: 'Success'}),{
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200});

    }catch (e){
        console.log(e);
            return new Response("Internal server error", {status: 500});
    }
}