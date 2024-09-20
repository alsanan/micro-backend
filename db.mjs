import sql from 'mssql';

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_IP,
    database: process.env.DB_DB,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Función para inicializar el pool de conexiones
async function initializePool() {
    if (!global.dbPoolPromise) {
        try {
            global.dbPoolPromise = sql.connect(dbConfig)
        } catch(err) {
            console.error('Database connection error:', err);
            global.dbPoolPromise = null; // Reset para reintentar en el futuro
            throw err;
            return;
        };
    }
    return global.dbPoolPromise;
}

// Función para obtener el pool de conexiones
export async function getPool() {
    return await initializePool();
}

// Función para hacer consultas
export async function query(sqlQuery, params = []) {
    let pool;
    try {
        pool = await getPool();
    } catch(err) {
        console.log('ONdbError',err)
        throw err;
    }
    //console.log('pool',pool)
    return pool.request()
        //.input('params', params) // Manejar correctamente los parámetros
        .query(sqlQuery);
}