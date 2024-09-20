// router: https://www.npmjs.com/package/micro-http-router
// librerias: https://github.com/amio/awesome-micro

// Importar micro y el módulo http de Node.js
import { send } from 'micro';
import http from 'http';
import sessionHandler from './sessions.mjs';
import { getCachedModule } from './cache.mjs';
import url from 'url';
import path from 'path';
import { createReadStream, statSync, readdirSync, readFileSync } from 'fs';
import fs from 'fs';
import { Eta } from 'eta';
import { renderETA } from './utils.mjs';
import { query } from './db.mjs';
import error from './error.mjs';

global.mssql = { query };

console.clear();

const publicDir = path.join(process.cwd(), 'public');

// Definir el handler para el servidor
const serverHandler = async (req, res) => {
    // Manejar las sesiones en sessions.mjs
    const sessionHandled = await sessionHandler(req, res);
    if (sessionHandled) return; // Si sessionHandler manejó la solicitud, salimos

    const { pathname } = url.parse(req.url);
    let segments = pathname.split('/').slice(1)//.filter(segment => segment);
    let currentDir = publicDir;
    if (JSON.stringify(segments)=='[""]') segments=['index'];

    for (let i = 0; i < segments.length; i++) {
        let segment = segments[i];
        const dirPath = path.join(currentDir, segment);
        console.log('chk0 segment:',`${segment}`)

        try {
            let stats = statSync(dirPath);
            if (stats.isFile()) {
                console.log('chk1 file',`${segment}.`)
                // Servir archivo directamente
                // Leer el archivo y servirlo
                const fileContent = await fs.readFileSync(dirPath);
                //res.setHeader('Content-Type', 'text/plain'); // Ajusta el tipo de contenido según corresponda
                console.log('file served ',dirPath)
                res.end(fileContent);
                return;
            }
            if (segment!='' && stats.isDirectory()) {
                currentDir = dirPath;
                console.log('chk1 path',`${segment}.`,dirPath,segments)
                if (segments[i+1]!=undefined) continue;
            }
        } catch (err) {
            console.error('error',JSON.stringify(err))
            // Si no existe, continúa
        }

        console.log('chk ini')

        try {
            // Manejo de archivos con extensiones específicas
            const files = readdirSync(currentDir);
            const handlers = {
                html: async () => {
                    console.log('html',path.join(currentDir, `${segment}.html`))
                    const fileContent = await fs.readFileSync(path.join(currentDir, `${segment}.html`));
                    res.setHeader('Content-Type', 'text/html');
                    res.end(fileContent);
                    return;
                },
                mjs: async () => {
                    console.log('mjs',path.join(currentDir, `${segment}.mjs`))
                    const module = await getCachedModule(path.join(currentDir, `${segment}.mjs`));
                    req.params= segments.slice(i+1)
                    console.log('PRE-mjs [@index:76]')
                    try {
                        res.end(await module.default(req, res))
                        console.log('afterMJS')
                    } catch(err) {
                        console.log('mjs error') 
                        return error(err,req,res); 
                    }
                    return 
                },
                eta: async () => {
                    console.log('eta',path.join(currentDir, `${segment}.eta`))
                    req.params= segments.slice(i+1)
                    try {
                        const fname= path.join(currentDir, `${segment}.eta`);
                        const html= await renderETA( fname, req )
                        res.end(html);
                    } catch(err) { return error(err,req,res); }
                    return;
                    const eta = new Eta({ 
                        views: path.dirname(currentDir), 
                        autoEscape: true, 
                        useWith: true
                    });
                    const template = readFileSync(path.join(currentDir, `${segment}.eta`), 'utf8');
                    req.params= segments.slice(i+1)
                    try {
                        const html = await eta.renderStringAsync(template, { req, res, mssql:global.mssql });
                    } catch(err) { return error(err,req,res); }
                    res.end(html);
                },
                json: () => {
                    console.log('json',path.join(currentDir, `${segment}.json`))
                    const config = JSON.parse(readFileSync(path.join(currentDir, `${segment}.json`), 'utf8'));
                    console.info('SIN DESARROLLAR AUN. Falta indicar proceso')
                    // Procesar JSON según lo especificado (input/process/output)
                    // Agrega lógica para manejar 'input', 'process', 'output' aquí
                }
            };

            for (const [ext, handler] of Object.entries(handlers)) {
                console.log('chk',files.join(', '),`${segment}.${ext}`)
                if (files.includes(`${segment}.${ext}`)) {
                    console.log('chkin')
                    return handler();
                }
            }

            // Manejo de archivo `post.mjs` si el método es POST
            const fmethod= `${req.method.toLowerCase()}.mjs`
            console.log('checkmethod',fmethod);
            if (files.includes(fmethod)) {
                console.log('post',path.join(currentDir, fmethod))
                const module = await getCachedModule(path.join(currentDir, fmethod));
                return module.default(req, res);
            }
        } catch (err) {
            console.error('ERROR!',err);
        }
}

    // Si no encuentra nada, enviar 404
    res.statusCode = 404;
    const html= await renderETA( './notfound.eta', req )
    res.end(html);
    return
    //res.end('Not Found');    
    // Mostrar tiempo transcurrido desde que comenzó la sesión
    /*
    res.setHeader('Content-Type', 'text/html');
    let html= `<style>@import url(https://alzira.alapont.com/labs/componentesweb/weblin/css/metro.css);</style>`;
    if (req.session?.user) html+=`<pre>
        Session started by <b>${req.session.user}</b> ${(req.session.demoLastHit - req.session.demoFirstHit) / 1000}s ago. 
        <a href="/logout" role="button">logout</a>
    `; else html+=`
        <form method="post" action="/login">
            <input name="user" value="al">
            <input name="password" value="clau" type="hidden">
            <button>login</button>
        </form>
    `;
    send(res, 200, html);
    */
};


const server = http.createServer(serverHandler);

try {
    // Crear el servidor usando http.createServer y el handler de micro
    server.listen(3000, () => {
        console.info('Server running at http://localhost:3000');
    });
} catch(err) {
    console.error("Error atrapado:", err.message);
    process.exit(1); // Finaliza el proceso con código de error
}

/*
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    if (server) server.close(() => {
        process.exitCode = 1;
        setImmediate(() => process.exit(1)); // Salida inmediata
    });
    else {
        process.exitCode = 1;
        setImmediate(() => process.exit(1)); // Salida inmediata
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1); // Finaliza el proceso si hay un error
});

process.on('exit', (code) => {
    console.log(`Process exiting with code ${code}`);
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    server.close(() => {
        process.exitCode = 0;
        process.exit();
    });
});
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        process.exitCode = 0;
        process.exit();
    });
});*/