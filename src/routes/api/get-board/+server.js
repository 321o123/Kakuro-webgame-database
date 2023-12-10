import {sql} from "@vercel/postgres";

export async function GET({url}){
    try {
        let board_id = 54;
        if (url.searchParams.has('board_id')) {
            const result = parseInt(url.searchParams.get('board_id'));
            if (!isNaN(result)) {
                board_id = Math.max(result, 54);
            }
        }

        const result =
            await sql`SELECT board_data 
                    FROM Boards 
                    WHERE Board_id = ${board_id}`

        if(result.rows.length === 0){
            return new Response(
                JSON.stringify({error:"Non existing board"}), {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    status: 401
                });
        }

        return new Response(
            JSON.stringify(result.rows), {
                headers: {
                    'Content-Type': 'application/json'
                },
                status: 200
            });

    }catch (e) {
        return new Response("Internal server error", {status: 500});
    }
}

