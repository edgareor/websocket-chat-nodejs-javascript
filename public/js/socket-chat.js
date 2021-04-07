var socket = io();

const urlParams = new URLSearchParams(window.location.search);
let usuario;

socket.on('connect', () => {
    console.log('Conectado Cliente');

    if (urlParams.has('nombre') || urlParams.has('sala') || urlParams.get('nombre').length > 0 || urlParams.get('sala').length > 0) {
        usuario = {
            nombre: urlParams.get('nombre'),
            sala: urlParams.get('sala')
        }
        socket.emit('entrarChat', usuario, (callback) => {
            console.log('Usuarios conectados en sala: ', callback);
        });
    } else {
        window.location = 'index.html';
    }
});

socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

socket.on('crearMensaje', (mensaje) => {
    console.log('Servidor:', mensaje);
});

socket.on('listarPersonas', (personas) => {
    console.log('Personas en sala:', personas);
});

// socket.emit('enviarMensaje', {
//     mensaje: 'Hola Mundo'
// }, (resp) => {
//     console.log('respuesta server: ', resp);
// });

// socket.emit('mensajePrivado', { msg: 'Hola Como Estas?', para: 'VKHsR45eMQARcPWFAAAE' });

socket.on('mensajePrivado', (mensaje) => {
    console.log(mensaje);
});