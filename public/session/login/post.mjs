// 
import microBody from 'micro-body';  // Importar el parser de JSON de micro-body
import session from '../../../sessions.mjs';


// Función para manejar la autenticación y gestión de sesiones
export default async function handler(req, res) {
    // Usa el middleware de sesiones
    await session(req, res);
    
    // Parsear el cuerpo de la petición
    const { user, password } = await microBody(req); 

    console.log(user, password);

    // Comprobación de autenticación simple
    if (password === 'clau') {
        // Establecer la sesión del usuario y marcarlo como autenticado
        req.session.user = { name: 'acarajaiso' };
        req.session.authenticated = true;
        
        // Redirigir a la ruta de sesión iniciada
        res.writeHead(302, { Location: '/session/logged' });
        res.end();
    } else {
        console.log('denied');
        res.writeHead(401, { Location: '/session/denied' });
        res.end();
    }

    console.log('Autenticación procesada');
}

/*
// Función para manejar la autenticación y gestión de sesiones
export default async function handler(req, res) {
    
	const secretKey = 'mySecretKey';

    const { user, password } = await microBody(req); // Asegúrate de que req.body esté disponible con algún parser

    console.log(user, password);

    // Comprobación de autenticación simple
    if (password === 'clau') {
        // Establecer la sesión del usuario y marcarlo como autenticado
        await setSessionUser(req, { name: 'acarajaiso' });
        await setSessionAuthenticated(req, true);
        
        // Redirigir a la ruta de sesión iniciada
        res.writeHead(302, { Location: '/session/logged' });
        res.end();
    } else {
		console.log('denied')
        res.writeHead(401, { Location: '/session/denied' });
		res.end();
        //res.writeHead(401, { 'Content-Type': 'text/html' });
        //res.end('Acceso denegado');
    }

    console.log('Autenticación procesada');
}

/*

async function setSessionUser(req, user) {
    // Esperar la actualización simulada de la sesión
    req.session.user = user;
    await new Promise((resolve) => setImmediate(resolve)); // Simula el comportamiento asincrónico
}

async function setSessionAuthenticated(req, isAuthenticated) {
    // Esperar la actualización simulada de la sesión
    req.session.authenticated = isAuthenticated;
    await new Promise((resolve) => setImmediate(resolve)); // Simula el comportamiento asincrónico
}

export default async function handler(req, res) {
	const secretKey = 'mySecretKey';
    const { user, password } = req.body;
	console.log(user,password)
	// Aquí deberías agregar lógica para verificar el usuario en la base de datos
    // Por simplicidad, se acepta cualquier usuario/contraseña en esta demostración
    // Configurar la sesión del usuario
	console.log('!!!AUTH',req.session?.user)
	if (password === 'clau') {
	//if(req.session?.user && req.session.user?.name==user) {
		//const token = jwt.sign({ user }, secretKey);
		//req.sessions[username] = token;
		//req.body = {"token":token};
		//req.type = 'application/json';
		//req.session.user = { name:'acarajaiso' };
		//req.session.authenticated = true	
		//await setSessionUser(req, { name:'acarajaiso' })
		//await setSessionAuthenticated(req,true)
		setTimeout(()=>{
			setSessionUser(req, { name:'acarajaiso' })
			setSessionAuthenticated(req,true)
		},0)
		res.redirect('/session/logged')
		//await res.type('text/html')
		//await res.send('Login successful ');
		console.log('!!!AUTH2')
	} else {
		res.type('text/html')
		res.status(401).send('Credenciales incorrectas');
	}
	console.log('!!!AUTH3')

}*/