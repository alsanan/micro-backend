export async function handler(req, res) {
    const { username, password } = req.body;
    // Aquí deberías agregar lógica para almacenar el usuario en la base de datos
    // Por simplicidad, no se almacena el usuario en esta demostración
    res.send({ message: 'Signup successful' });
}
	/*
async function handler(ctx) {
	// codigo GET de /session
	console.log(' sess',ctx.sessions)
	const token = ctx.req.headers.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
	const receivedToken= ctx.req.headers['authorization']?.split(' ')[1] || token;
	const users=  Object.entries(ctx.sessions).find(r=>r[1]==receivedToken)
	let user;
	if (users) user= users[0];
	if (user) {
		console.log(' logout user ',user)
		delete ctx.sessions[user];
		console.log(ctx.sessions)
		console.log('Sesion cerrada correctamente');	
		ctx.headers['Content-Type'] = 'text/html';
		ctx.body=('Sesion cerrada correctamente');
		return		
	}
	ctx.headers['Content-Type'] = 'text/html';
	console.log('Usuario sin sesion');
	ctx.body=('Usuario sin sesion');
	return
}

module.exports= handler;*/