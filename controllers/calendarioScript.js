// Función para generar los días del mes en el calendario
function generarDias() {
    const containerDays = document.querySelector('.container_days');
    const fechaActual = new Date();
    const mes = fechaActual.getMonth(); // Mes actual
    const año = fechaActual.getFullYear(); // Año actual

    // Obtener el primer día del mes y el último
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0); // Último día del mes
    const diasDelMes = ultimoDia.getDate(); // Número total de días del mes

    // Limpiar el contenedor de días
    containerDays.innerHTML = '';

    // Generar los días del mes
    for (let i = 1; i <= diasDelMes; i++) {
        const dia = new Date(año, mes, i);
        const diaElemento = document.createElement('span');
        diaElemento.textContent = i;
        diaElemento.classList.add('week_days_item', 'item_day');
        diaElemento.setAttribute('data-fecha', dia.toISOString().split('T')[0]); // Formato YYYY-MM-DD

        // Agregar el día al contenedor
        containerDays.appendChild(diaElemento);
    }

    // Llamar a la función para cargar los eventos después de generar los días
    cargarEventos();
}

// Función para agregar un evento a localStorage
function agregarEvento(fecha, evento) {
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    console.log('Eventos antes de agregar:', eventos);

    const nuevoEvento = {
        fecha: fecha,
        evento: evento
    };

    eventos.push(nuevoEvento);
    localStorage.setItem('eventos', JSON.stringify(eventos));

    console.log('Eventos después de agregar:', eventos);
}

// Función para cargar los eventos desde localStorage
function cargarEventos() {
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

    eventos.forEach(evento => {
        const dia = document.querySelector(`[data-fecha="${evento.fecha}"]`);
        if (dia) {
            const eventoDiv = document.createElement('div');
            eventoDiv.textContent = evento.evento;
            eventoDiv.classList.add('evento');
            dia.appendChild(eventoDiv);
        }
    });
}

// Función para manejar el clic en los días y agregar un evento
function manejarClickDias() {
    document.querySelectorAll('.item_day').forEach(dia => {
        dia.addEventListener('click', function () {
            const fecha = this.getAttribute('data-fecha');
            const evento = prompt('Ingrese el nombre del evento:');
            if (evento) {
                agregarEvento(fecha, evento);
                cargarEventos(); // Recargar los eventos para mostrar el nuevo
            }
        });
    });
}

// Inicialización: generar días y configurar eventos
document.addEventListener('DOMContentLoaded', function () {
    generarDias();
    manejarClickDias();
});
