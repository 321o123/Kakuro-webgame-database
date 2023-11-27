import {sql} from "@vercel/postgres";

export async function GET({url}){

    //console.log(url.searchParams.get('key'));
    //const urlParams = new URLSearchParams(url);

    //TODO better make sure that these are valid
    const offset = url.searchParams.has('offset') ? parseInt(url.searchParams.get('offset')) : 0;
    const count = url.searchParams.has('count') ? parseInt(url.searchParams.get('count')) : 10;
    const order = url.searchParams.has('order') ? url.searchParams.get('order') : 'DESC';
    let key = url.searchParams.has('key') ? url.searchParams.get('key') : 'score';

    console.log(typeof order);

    let result =
        await sql`SELECT Boards.board_id, creator, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  GROUP BY Boards.board_id
                  ORDER BY name ASC NULLS LAST;`;
    

    // console.log(result.rows)

    return new Response(
        JSON.stringify(result.rows),{
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200});

}