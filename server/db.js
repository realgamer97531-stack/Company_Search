require('dotenv').config();

const mysql = require('mysql2');

function configFromUrl(connectionUrl) {
    const url = new URL(connectionUrl);

    return {
        host: url.hostname,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, ''),
        port: url.port ? Number(url.port) : undefined
    };
}

const connectionUrl =
process.env.DATABASE_URL || process.env.MYSQL_URL;

const urlConfig =
connectionUrl ? configFromUrl(connectionUrl) : {};

const missingConfig =
['DB_HOST', 'DB_USER', 'DB_NAME'].filter((key) => !process.env[key]);

if (!connectionUrl && missingConfig.length > 0) {
    console.warn(
        `MySQL config warning: missing ${missingConfig.join(', ')}`
    );
}

const sslEnabled =
String(process.env.DB_SSL || '').toLowerCase() === 'true';

const db = mysql.createPool({
    ...urlConfig,
    host: process.env.DB_HOST || urlConfig.host,
    user: process.env.DB_USER || urlConfig.user,
    password: process.env.DB_PASSWORD || urlConfig.password,
    database: process.env.DB_NAME || urlConfig.database,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : urlConfig.port,
    ssl: sslEnabled
        ? {
            rejectUnauthorized:
            String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'true').toLowerCase() !== 'false'
        }
        : undefined,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 10000)
});

if (process.env.DB_CONNECT_ON_START !== 'false' && !process.env.VERCEL) {
    db.getConnection((err, connection) => {
        if (err) {
            console.error(
                'MySQL Pool Error:',
                err.message
            );
            return;
        }

        console.log('MySQL Connected Successfully');
        connection.release();
    });
}

module.exports = db;
