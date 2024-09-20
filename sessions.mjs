import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const sessionsDir = path.join(process.cwd(), 'sessions');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const getSessionFilePath = (sessionId) => path.join(sessionsDir, `${sessionId}.json`);

// Middleware simple para sesiones en archivos
export default async function session(req, res) {
    const sessionId = req.headers.cookie?.replace(/(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/, "$1") || Math.random().toString(36).slice(2);
    const sessionFile = getSessionFilePath(sessionId);

    req.session = {};
    try { 
        req.session = JSON.parse(await readFile(sessionFile, 'utf8'));
        req.session.id= sessionId;
    } catch {}

    res.on('finish', async () => {
        if (req.session && Object.keys(req.session).length) await writeFile(sessionFile, JSON.stringify(req.session));
        else await unlink(sessionFile).catch(() => {});
    });

    res.setHeader('Set-Cookie', `session=${sessionId}; HttpOnly; Path=/; Max-Age=86400`);

    setTimeout(wipe_olds) // así no retrasa respuesta
}

async function wipe_olds() {
    try {
        // Leer todos los archivos en el directorio de sesiones
        const files = await promisify(fs.readdir)(sessionsDir);

        // Obtener la fecha y hora actuales
        const now = Date.now();

        // Iterar sobre los archivos y comprobar si son más antiguos de 24 horas
        for (const file of files) {
            const filePath = path.join(sessionsDir, file);

            // Obtener estadísticas del archivo (incluyendo la fecha de modificación)
            const stats = await promisify(fs.stat)(filePath);

            // Calcular la diferencia de tiempo en milisegundos (24h = 86400000 ms)
            const ageInMs = now - stats.mtimeMs;
            const ageInHours = ageInMs / 1000 / 60 / 60;

            // Si el archivo tiene más de 24 horas, lo eliminamos
            if (ageInHours > 24) {
                await unlink(filePath);
            }
        }
    } catch (err) {
        console.error('Error limpiando sesiones antiguas:', err);
    }
}
