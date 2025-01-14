import dotenv from 'dotenv';
dotenv.config({ path: '.env.' + process.env.NODE_ENV });
export const DbConfig = {
	charset: process.env["DATABASE_CHARSET"],
	host: process.env["DATABASE_HOST"],
	user: process.env["DATABASE_USER_NAME"],
	password: process.env["DATABASE_PASSWORD"],
	port: process.env["DATABASE_PORT"],
	database: process.env["DATABASE_NAME"]
}