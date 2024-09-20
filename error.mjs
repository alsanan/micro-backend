import { default as promises } from 'fs/promises';
import * as trace from 'stack-trace';
import { fileURLToPath } from 'url';
import { renderETA, fileExists } from './utils.mjs';

process.on('uncaughtException', (err) => {
    console.error('____Uncaught Exception:', err, '[@error:6]');
    // Decide si quieres terminar el proceso o seguir corriendo
    process.exitCode = 1;
    setImmediate(() => process.exit(1)); // Salida inmediata
    process.exit(1)
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('____Unhandled Rejection at:', promise, 'reason:', reason, '[@error:6]');
    // Decide si quieres terminar el proceso o seguir corriendo
    process.exit(1); // Finaliza el proceso si hay un error
});


Error.stackTraceLimit = 5; // "The Error.stackTraceLimit is the maximum number of stack frames captured by the Error.stack property. The default value is 10, but you can change it to 0 when you don't need the complete stack trace, and this will improve the performance by 600x times!"

export default async function error(error, request, reply) {
    console.log('ON ERROR [@error:41]')
    const stack = trace.parse(error);
    let topFrame = stack[0];
    if (topFrame.fileName==null) topFrame = stack[1];
    if (topFrame.fileName==null) topFrame = stack[2];
    let fname= topFrame.getFileName()
    if (fname.includes('file://')) fname= fname.substring(fname.indexOf('file://'))
    // Convertir el stack trace a un formato de cadena más legible
    const formattedStack = stack.map(frame => {
        return `${frame.getFileName()}:${frame.getLineNumber()}:${frame.getColumnNumber()}`;
    }).join('\n');
    console.log('fname [@error:52]',fname)
    console.log('error [@error:53]',error)
    // si es error interno de Node:
    if (fname?.substring(0,13)=='node:internal' || fname?.indexOf('node_modules')) {
        console.log('interno [@error:56]')
        reply.statusCode = 500;
        reply.setHeader('Content-Type','text/html')
        return reply.end(await renderETA('error.eta',{ errormessage:error.message, errorcontext:error.input, formattedStack }));
    }
    // obtiene contexto de archivo con error:
    console.log('Sigo [@error:61]',fname)
    const filePath = fileURLToPath(fname);
    const lineNumber = topFrame.getLineNumber();
    const fileContent = await promises.readFile(filePath, 'utf-8');
    const fileLines = fileContent.split('\n');
    const contextStart = Math.max(0, lineNumber - 3);
    const contextEnd = Math.min(fileLines.length, lineNumber + 2);
    const contexto = fileLines.slice(contextStart, contextEnd)
        .map((line, index) => {
            const actualLineNumber = contextStart + index + 1;
            const marker = actualLineNumber === lineNumber ? '>> ' : '   ';
            return `${marker}${actualLineNumber}: ${line}`;
        })
        .join('\n');
console.log('------',{errormessage:error.message,errorcontext:contexto,formattedStack})
    reply.statusCode = 500;
    reply.setHeader('Content-Type','text/html')
    return reply.end(await renderETA('error.eta',{errormessage:error.message,errorcontext:contexto,formattedStack}));
}