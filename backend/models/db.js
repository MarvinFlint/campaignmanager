import pg from 'pg';

const pool = new pg.Pool({
    user: 'module_manager',
    host: 'localhost',
    database: 'modules',
    password: 'neverwinternights',
    port: 5432,
});

export default pool;