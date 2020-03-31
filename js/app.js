const formularioContactos = document.querySelector('#contacto'),
      listadoContatos = document.querySelector('#listado-contactos tbody'),
      inputBuscador = document.querySelector('#buscar');

    

      
eventListeners();

function eventListeners(){
    // Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    // Listener para eliminar el boton
    if (listadoContatos){
        listadoContatos.addEventListener('click', eliminarContacto);
    }

    // buscador
    if(inputBuscador){
        inputBuscador.addEventListener('input', buscarContactos);
    }
    
    const valor2 = document.querySelector('#accion', 'value["crear"]');    
    if(valor2.value == 'crear'){
    numeroContactos();
    }
    
    
}

function leerFormulario(e){
    // prevenir la accion por default del navegador
    e.preventDefault();

    // Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion = document.querySelector('#accion').value;

    if (nombre, empresa, telefono === ''){
        // 2 parametros: texto y clase 
        mostrarNotificacion('Todos los Campos son Obligatorios', 'error');
        
    }else {
        // Pasa la validacion, crear llamado a Ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        

        if(accion === 'crear'){
            // crearemos un nuevo contacto
            insertarBD(infoContacto);
        } else {
            // editar el contacto
            // leer el id
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }

    }
}
/** Inserta en la base de datos via Ajax */
function insertarBD(datos) {
    // llamado a ajax

    // crear el objeto
    const xhr = new XMLHttpRequest();

    // abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    // pasar los datos 
    xhr.onload = function(){
        if (this.status === 200) {
            //console.log(JSON.parse(xhr.responseText));
            // leemos la respuesta de PHP
            const respuesta = JSON.parse(xhr.responseText);
                
            // Inserta un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            // crear contenedor para los botones 
            const contenedorAcciones = document.createElement('td');

            // crear el icono de Editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');

            // crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn-editar', 'btn');

            // agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);
            
            // crear el icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');

            // crear el boton eliminar 
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn-borrar', 'btn');
            
            // Agregarlo al padre 
            contenedorAcciones.appendChild(btnEliminar);

            // Agregarlo al tr

            nuevoContacto.appendChild(contenedorAcciones);

            // Agregarlo con los contactos
            listadoContatos.appendChild(nuevoContacto);

            // Resetear el formulario
            document.querySelector('form').reset();

            // Mostrar la notificacion
            mostrarNotificacion('Contacto Creado Correctamente', 'correcto');   

            // Actualizar el numero
            numeroContactos();
                        
        }
    }

    // enviar los datos
    xhr.send(datos);

}

// editar registro
function actualizarRegistro(datos){    
    
    // crear el objeto
    const xhr = new XMLHttpRequest();

    // abrir la conexion
    xhr.open('POST', `inc/modelos/modelo-contactos.php`, true);

    // leer la respuesta
    xhr.onload = function () {
        if(this.status === 200){
            const respuesta = JSON.parse(xhr.responseText);
            // console.log(respuesta);

            if(respuesta.respuesta === 'correcto'){
                // mostrar notificacion de correo
                mostrarNotificacion('Contacto Editado Correctamente', 'correcto');
                // Despues de 3 segundos redireccionar
                setTimeout(() => {
                    window.location.href = 'index.php';
                }, 4000);
            }else {
                mostrarNotificacion('Hubo un error...', 'error');
            }
            
            
        }
    }
    // enviar la peticion
    xhr.send(datos);
}

//Eliminar el Contacto
function eliminarContacto(e){
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        //tomar el ID
        const id = e.target.parentElement.getAttribute('data-id');
 
       // console.log(id);
       // preguntar al usuario
 
       const respuesta = confirm('¿Estas Seguro (a) ?');
 
       if (respuesta) {
        //llamado a ajax
        //crear el objeto
        const xhr = new XMLHttpRequest();
 
        // abrir la conexión
        xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);
 
        // leer la respuesta
        xhr.onload = function () {
            if (this.status == 200) {     
                const resultado = JSON.parse(xhr.responseText);
                //console.log(resultado);
                
                if (resultado.respuesta == 'correcto') {
                    //Eliminar el registro del DOM
                    //console.log(e.target.parentElement.parentElement.parentElement);
                    e.target.parentElement.parentElement.parentElement.remove();
                    //mostrar Notificacion
                    mostrarNotificacion('Contacto eliminado', 'correcto');

                    // Actualizar el numero
                    numeroContactos();
                } else {
                    // Mostramos una notificacion
                    mostrarNotificacion('Hubo un error...', 'error');
                }
                
            }
        }
 
 
         //enviar la peticion
         xhr.send();
 
       }
    }
}
/*
// Eliminar el Contacto
// (e) reporta a que elemento se le da click
function eliminarContacto(e){
    if(e.target.parentElement.classList.contains('btn-borrar') == true){
        // Tomar el ID
        const id = e.target.parentElement.getAttribute('data-id');

        // console.log(id);
        // preguntar al usuario
        const respuesta = confirm('Are you sure ?');

        if(respuesta){
            // llamado a ajax
            // crear el objeto
            const xhr = new XMLHttpRequest();
            // abrir la conexion
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);
            // leer la respuesta 
            xhr.onload = function(){
                if(this.status === 200){
                    const resultado = JSON.parse(xhr.responseText);

                    if(resultado.respuesta === 'correcto'){
                        // Eliminar el registro del DOM
                        //console.log(resultado.respuesta);
                        e.target.parentElement.parentElement.parentElement.remove();
                        // Mostrar Notificacion
                        mostrarNotificacion('Contacto eliminado', 'correcto');
                    } else{
                        // Mostramos una notification
                        mostrarNotificacion('Hubo un error...', 'error' );
                    }
                }
            }
            // enviar la peticion
            xhr.send();
        }else {
            console.log('naaa');
        }
    }
}
*/

// Notificacio en pantalla 
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    // formulario 
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    // Ocultar y Mostrar la notificacion 
    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
            notificacion.classList.remove('visible');            
            setTimeout(() => {
                notificacion.remove();
            }, 500);            
        }, 3000);
    }, 100);
}

// buscador de registros
function buscarContactos(e){
    const expresion = new RegExp(e.target.value, "i");
          registros = document.querySelectorAll('tbody tr');

          registros.forEach(registro =>{
              registro.style.display = 'none';
              
              //console.log(registro.childNodes);
              if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1 || 
              registro.childNodes[2].textContent.replace(/\s/g, " ").search(expresion) != -1 || 
              registro.childNodes[5].textContent.replace(/\s/g, " ").search(expresion) != -1){
                registro.style.display = 'table-row';
              }
              numeroContactos();
          });
}

// nuestra el numero de contactos
function numeroContactos(){
    
    const totalContactos = document.querySelectorAll('tbody tr'),
          contenedorNumero = document.querySelector('.total-contactos span');
    
        let total = 0;

    totalContactos.forEach(contacto => {
        if(contacto.style.display === '' || contacto.style.display === 'table-row'){
            total++;
        }
    });
    
    
    
    //console.log(total);
    contenedorNumero.textContent = total;
    
    
}