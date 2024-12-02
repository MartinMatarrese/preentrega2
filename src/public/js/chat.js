const socket = io();

const chat = document.getElementById("chat");

const message = document.getElementById("message");

let user


Swal.fire({
    title: "Inicio de Sesion",
    input: "text",
    text: "Por favor ingrese su nombre de usuario para continuar",
    inputValidator: (valor) => {
        return !valor && "Ingrese un valor valido"
    },
    allowOutsideClick: false
  }).then((resultado) => {
    user = resultado.value
    console.log(user);    
});

chat.addEventListener("change", (e) => {
    if(chat.value.trim().length > 0) {
        const hora = new Date().toLocaleTimeString();
        socket.emit("mensaje", {usuario: user, mensaje: chat.value, hora: hora})
    }
})

socket.on("respuesta", info => {
    message.innerHTML= ""
    info.forEach(mensaje => {
        message.innerHTML += `<p>${mensaje.hora}hs. Usuario: ${mensaje.usuario} dice: ${mensaje.mensaje}</p>`
    });
})