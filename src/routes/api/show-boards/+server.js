import {sql} from "@vercel/postgres";
import {isAlphaNumeric} from "$lib/cryptography.js";

export async function GET({url}){
    try {
        let offset = 0;
        if (url.searchParams.has('offset')) {
            const result = parseInt(url.searchParams.get('offset'));
            if (!isNaN(result)) {
                offset = Math.max(result, 0);
            }
        }

        let count = 10;
        if (url.searchParams.has('count')) {
            const result = parseInt(url.searchParams.get('count'));
            if (!isNaN(result)) {
                count = Math.min(result, 50);
            }
        }

        let order = 'DESC';
        if (url.searchParams.has('order')) {
            const result = url.searchParams.get('order');
            if (result === 'DESC' || result === 'ASC') {
                order = result;
            }
        }

        let key = 'score';
        if (url.searchParams.has('key')) {
            const result = url.searchParams.get('key');
            if (result === 'score' || result === 'creation_date' || result === 'username' || result === 'name') {
                key = result;
            }
        }

        let search = '';
        if (url.searchParams.has('search')) {
            const result = url.searchParams.get('search');
            if(isAlphaNumeric(result)) {
                search = result;
            }
        }

        let result;
        if(search !== ''){
            if (key === 'name') {
                if (order === 'DESC') {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  WHERE username = ${search}
                  GROUP BY Boards.board_id, username
                  ORDER BY name DESC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                } else {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  WHERE username = ${search}
                  GROUP BY Boards.board_id, username
                  ORDER BY name ASC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                }

            } else if (key === 'username') {
                if (order === 'DESC') {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  WHERE username = ${search}
                  GROUP BY Boards.board_id, username
                  ORDER BY username DESC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                } else {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  WHERE username = ${search}
                  GROUP BY Boards.board_id, username
                  ORDER BY username ASC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                }
            } else if (key === 'creation_date') {
                if (order === 'DESC') {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  WHERE username = ${search}
                  GROUP BY Boards.board_id, username
                  ORDER BY date DESC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                } else {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  WHERE username = ${search}
                  GROUP BY Boards.board_id, username
                  ORDER BY date ASC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                }
            } else if (key === 'score') {
                if (order === 'DESC') {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  WHERE username = ${search}
                  GROUP BY Boards.board_id, username
                  ORDER BY score DESC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                } else {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  WHERE username = ${search}
                  GROUP BY Boards.board_id, username
                  ORDER BY score ASC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                }
            }
        }else {
            if (key === 'name') {
                if (order === 'DESC') {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  GROUP BY Boards.board_id, username
                  ORDER BY name DESC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                } else {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  GROUP BY Boards.board_id, username
                  ORDER BY name ASC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                }

            } else if (key === 'username') {
                if (order === 'DESC') {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  GROUP BY Boards.board_id, username
                  ORDER BY username DESC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                } else {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  GROUP BY Boards.board_id, username
                  ORDER BY username ASC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                }
            } else if (key === 'creation_date') {
                if (order === 'DESC') {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  GROUP BY Boards.board_id, username
                  ORDER BY date DESC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                } else {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  GROUP BY Boards.board_id, username
                  ORDER BY date ASC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                }
            } else if (key === 'score') {
                if (order === 'DESC') {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  GROUP BY Boards.board_id, username
                  ORDER BY score DESC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                } else {
                    result =
                        await sql`SELECT Boards.board_id, username, name, AVG(Rating) as score, creation_date 
                  FROM Boards LEFT JOIN Reviews
                    ON Boards.board_id = Reviews.board_id
                  LEFT JOIN Users
                    ON Boards.creator = Users.user_id
                  GROUP BY Boards.board_id, username
                  ORDER BY score ASC NULLS LAST
                  LIMIT ${count} OFFSET ${offset};`;
                }
            }
        }
        const result2 =
            await (await sql`select COUNT(Board_id)
                      FROM Boards;`).rows[0].count;

        return new Response(
            JSON.stringify(result.rows), {
                headers: {
                    'Content-Type': 'application/json',
                    'count': result2
                },
                status: 200
            });

    }catch (e) {
        return new Response("Internal server error", {status: 500});
    }
}