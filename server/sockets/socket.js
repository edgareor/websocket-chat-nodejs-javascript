const { io } = require('../server');
const { Usuarios } = require('../clases/usuarios');

let usuario = new Usuarios();

io.on('connection', (client) => {

    console.log('Conectado Server');

    client.on('entrarChat', (payload, callback) => {
        if (payload.nombre && payload.sala) {
            usuario.agregarPersona(client.id, payload.nombre, payload.sala);
            client.join(payload.sala);
            let personas = usuario.getPersonasPorSala(payload.sala);
            client.broadcast.to(payload.sala).emit('crearMensaje', { usuario: 'Admin', mensaje: `El usuario: ${payload.nombre}, ingreso a la sala: ${payload.sala}.`, fecha: new Date().toISOString() })
            callback(personas);
        } else {
            callback({
                error: true,
                msg: 'El nombre y la sala son obligatorios'
            })
        }
        client.broadcast.to(payload.sala).emit('listarPersonas', usuario.getPersonasPorSala(payload.sala));
    })

    client.on('disconnect', () => {
        let personaBorrada = usuario.borrarPersona(client.id);

        if (personaBorrada) {
            client.broadcast.to(personaBorrada.sala).emit('crearMensaje', { usuario: 'Admin', mensaje: `El usuario: ${personaBorrada.nombre}, abandonó el chat.`, fecha: new Date().toISOString() })
            client.broadcast.to(personaBorrada.sala).emit('listarPersonas', usuario.getPersonasPorSala(personaBorrada.sala));
        }
        console.log('Usuario desconectado');
    })

    client.on('enviarMensaje', (data, callback) => {
        let persona = usuario.getPersona(client.id);
        let mensaje = {
            usuario: persona.nombre,
            mensaje: data.mensaje,
            fecha: new Date().toISOString()
        }
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    })

    client.on('mensajePrivado', (mensaje) => {
        let persona = usuario.getPersona(client.id);
        client.broadcast.to(mensaje.para).emit('mensajePrivado', { usuario: persona.nombre, mensaje: mensaje.msg, fecha: new Date().toISOString() })
    });
});