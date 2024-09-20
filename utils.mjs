import fs from 'fs';
import path from 'path';
import { Eta } from 'eta';
import { createRequire } from 'module';
import util from 'util';

export async function fileExists(filePath) {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export async function renderETA(filePath, request) {
    // https://eta.js.org/docs/api
    const eta = new Eta({ 
        views: path.dirname(filePath), 
        autoEscape: true, 
        useWith: true,
        tags: ["{{", "}}"],
        parse: { interpolate:"~", exec:"{", raw:"" } // carácter para interpretar expresión o ejecución sin resultado
    });
    const it = {
        errormessage: request.errormessage,
        errorcontext: request.errorcontext,
        context: request.routeOptions?.config,
        formattedStack: request.formattedStack,
        server: request.server,
        params: request.params,
        url: request.url,
        query: request.query,
        method: request.method,
        headers: request.headers,
        session: request.session,
        mssql: global.mssql,
    };
    return await eta.renderAsync(path.basename(filePath), it);
}