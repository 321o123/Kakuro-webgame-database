import {sql} from "@vercel/postgres";

export async function GET({url}){
    try {
        let board_id = 2;
        if (url.searchParams.has('board_id')) {
            const result = parseInt(url.searchParams.get('board_id'));
            if (!isNaN(result)) {
                board_id = Math.max(result, 2);
            }
        }

        const result =
            await sql`SELECT board_data 
                    FROM Boards 
                    WHERE Board_id = ${board_id}`

        return new Response(
            JSON.stringify(result.rows), {
                headers: {
                    'Content-Type': 'application/json'
                },
                status: 200
            });

    }catch (e) {
        return new Response(String(e), {status: 500});
    }
}