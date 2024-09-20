import path from 'path';
import { default as promises } from 'fs/promises';

const cache= new Map();
const timestamps = new Map();

// Función para obtener un módulo de la caché
export async function getCachedModule(modulePath) {
    const absolutePath = path.resolve(modulePath);
    const cacheKey = absolutePath.toLowerCase().replace(/\\/g,'_');
    const currentTimestamp = await promises.stat(absolutePath).then(stats => stats.mtimeMs).catch(() => null);

    // Verificar si el módulo está en la caché y si la clave es válida
    if (cache.has(cacheKey)) {
        const cachedTimestamp = timestamps.get(cacheKey);
        if (cachedTimestamp === currentTimestamp) {
            // Módulo en caché y sin cambios, devolver el módulo
            return cache.get(cacheKey);
        } else {
            // Módulo ha cambiado, eliminar de la caché
            cache.delete(cacheKey);
            timestamps.delete(cacheKey);
        }
    }

    // Cargar el módulo y actualizar la caché
    const moduleUrl = new URL(`file://${absolutePath}?v=${currentTimestamp}`);
    const module = await import(moduleUrl.href);
    cache.set(cacheKey, module);
    timestamps.set(cacheKey, currentTimestamp);
    return module;
}

// Función para invalidar un módulo en la caché
export function invalidateModule(modulePath) {
    const absolutePath = path.resolve(modulePath);
    const cacheKey = absolutePath.toLowerCase().replace(/\\/g,'_');
    const isInCache = cache.has(cacheKey);
    const isInTimestamps = timestamps.has(cacheKey);    
    console.log('\n_cache',cache.size, cacheKey,'\n',cache,'\n',timestamps,'\n',isInCache,isInTimestamps)
    cache.delete(cacheKey);
    timestamps.delete(cacheKey);
    console.log('_after',cache.size, cache,'\n',timestamps)
}
