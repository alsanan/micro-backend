export default async function handler(req, res) {
    const { params } = req;
    try {
        global.mssql.query('SELECT top 10 * FROM fope')
        const result = await global.mssql.query('SELECT top 10 * FROM fope');
        res.setHeader('Content-Type', 'application/json')        
        res.end(JSON.stringify(result))
        return
    } catch (err) {
        console.error('Error running queries:', err);
        throw err;
    } finally {
        //await global.mssql.closePool();
    }
}
