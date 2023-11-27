// import { sql, createPool } from '@vercel/postgres';
// import {json, error} from "@sveltejs/kit";

export async function GET({url}) {
    try {
        // const result =
            // await sql`CREATE TABLE Users (user_id SERIAL PRIMARY KEY,
            //                               username TEXT UNIQUE NOT NULL,
            //                               password_hash TEXT NOT NULL,
            //                               registration_date timestamp with time zone NOT NULL,
            //                               active_token TEXT NOT NULL,
            //                               active_token_timestamp timestamp with time zone NOT NULL);`;
            // await sql`CREATE TABLE Boards (board_id SERIAL PRIMARY KEY,
            //                                creator INTEGER NOT NULL,
            //                                board_data TEXT NOT NULL,
            //                                name TEXT NOT NULL,
            //                                creation_date timestamp with time zone NOT NULL,
            //                                CONSTRAINT fk_users
            //                                FOREIGN KEY(creator) REFERENCES Users(user_id),
            //                                CONSTRAINT unique_creator_name UNIQUE (creator, name)
        //                                    );`;
            // await sql`CREATE TABLE Saves (user_id SERIAL REFERENCES Users(user_id) NOT NULL,
//                                           board_id INTEGER REFERENCES Boards(board_id) NOT NULL,
//                                           save_data TEXT NOT NULL,
//                                           creation_time timestamp with time zone NOT NULL,
//                                           Completed boolean NOT NULL DEFAULT false,
//                                           CONSTRAINT fk_users
//                                           FOREIGN KEY(user_id) REFERENCES Users(user_id),
//                                           CONSTRAINT fk_boards
//                                           FOREIGN KEY(board_id) REFERENCES Boards(board_id));`;

            // await sql`CREATE TABLE Reviews (review_id SERIAL PRIMARY KEY,
            //                                 reviewer INTEGER NOT NULL,
            //                                 board_id INTEGER NOT NULL,
            //                                 rating SMALLINT NOT NULL CHECK (rating <= 10 AND rating >= 1),
            //                                 review_text TEXT,
            //                                 creation_time timestamp with time zone NOT NULL,
            //                                 CONSTRAINT fk_users
            //                                 FOREIGN KEY(reviewer) REFERENCES Users(user_id),
            //                                 CONSTRAINT fk_boards
            //                                 FOREIGN KEY(board_id) REFERENCES Boards(board_id));`;


            //await sql`drop table Pets;`;
            //await sql`INSERT INTO Pets VALUES('Kotek', 'Karol');`;
            // await  sql`SELECT * FROM Pets;`;
            // await sql`drop table Reviews;`;
            // await sql`drop table Saves;`;
            // await sql`drop table Boards;`;
            // await sql`drop table Users;`;
        return new Response();
    } catch (e) {
        return new Response(String(e));
    }
}