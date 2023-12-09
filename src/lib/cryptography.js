import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { TOKEN_KEY } from '$env/static/private';

export async function hashPassword(password) {

    try {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    } catch (error) {
        console.error('Error: ', error);
        throw error;
    }
}


export async function genToken(username){

    const secretKey = TOKEN_KEY;

    const userData = {
        username: username
    };

    const token = jwt.sign({username: username}, secretKey, { expiresIn: '1d' });

    return token;
}

export async function verifyToken(token){
    try {
        return jwt.verify(token, TOKEN_KEY);
    }catch (e){
        return false;
    }
}

export async function verifyPassword(password, password_hash){
    return bcrypt.compare(password, password_hash);
}

export function isAlphaNumeric(str) {
    let code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
}