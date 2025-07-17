// Variables para elementos DOM
const btnIngreso = document.getElementById('btnIngreso');
const btnGasto = document.getElementById('btnGasto');
const btnExportar = document.getElementById('btnExportar');

const formIngreso = document.getElementById('formIngreso');
const formGasto = document.getElementById('formGasto');

const ingresoCantidad = document.getElementById('ingresoCantidad');
const ingresoCuenta = document.getElementById('ingresoCuenta');
const guardarIngreso = document.getElementById('guardarIngreso');

const gastoCantidad = document.getElementById('gastoCantidad');
const gastoCategoria = document.getElementById('gastoCategoria');
const gastoCuenta = document.getElementById('gastoCuenta');
const guardarGasto = document.getElementById('guardarGasto');

const movimientosList = document.getElementById('movimientosList');

const saldoBBVA = document.getElementById('saldo-bbva');
const saldoRevolut = document.getElementById('saldo-revolut');
const saldoTrade = document.getElementById('saldo-trade');

let movimientos = JSON.parse(localStorage.getItem('movimientos')) || [];
let saldos = JSON.parse(localStorage.getItem('saldos')) || {
  BBVA: 0,
  Revolut: 0,
  'Trade Republic': 0
};

// Función para actualizar saldos en la UI
function actualizarSaldos() {
  saldoBBVA.textContent = saldos.BBVA.toFixed(2) + ' €';
  saldoRevolut.textContent = saldos.Revolut.toFixed(2) + ' €';
  saldoTrade.textContent = saldos['Trade Republic'].toFixed(2) + ' €';
}

// Función para mostrar movimientos en la lista
function mostrarMovimientos() {
  movimientosList.innerHTML = '';
  movimientos.forEach((mov, index) => {
    const li = document.createElement('li');
    li.classList.add(mov.tipo);
    li.textContent = `${mov.tipo === 'ingreso' ? '+' : '-'} ${mov.cantidad.toFixed(2)} € | ${mov.cuenta} | ${mov.tipo === 'gasto' ? mov.categoria + ' | ' : ''}${new Date(mov.fecha).toLocaleDateString()}`;
    movimientosList.appendChild(li);
  });
}

// Función para guardar movimientos y actualizar saldos
function guardarMovimiento(mov) {
  movimientos.push(mov);
  localStorage.setItem('movimientos', JSON.stringify(movimientos));

  // Actualizar saldo
  if (mov.tipo === 'ingreso') {
    saldos[mov.cuenta] += mov.cantidad;
  } else if (mov.tipo === 'gasto') {
    saldos[mov.cuenta] -= mov.cantidad;
  }
  localStorage.setItem('saldos', JSON.stringify(saldos));

  actualizarSaldos();
  mostrarMovimientos();
}

// Mostrar/ocultar formularios
btnIngreso.addEventListener('click', () => {
  formIngreso.classList.remove('hidden');
  formGasto.classList.add('hidden');
});

btnGasto.addEventListener('click', () => {
  formGasto.classList.remove('hidden');
  formIngreso.classList.add('hidden');
});

// Guardar ingreso
guardarIngreso.addEventListener('click', () => {
  const cantidad = parseFloat(ingresoCantidad.value);
  const cuenta = ingresoCuenta.value;

  if (isNaN(cantidad) || cantidad <= 0) {
    alert('Introduce una cantidad válida');
    return;
  }

  guardarMovimiento({
    tipo: 'ingreso',
    cantidad,
    cuenta,
    fecha: new Date().toISOString()
  });

  ingresoCantidad.value = '';
  formIngreso.classList.add('hidden');
});

// Guardar gasto
guardarGasto.addEventListener('click', () => {
  const cantidad = parseFloat(gastoCantidad.value);
  const categoria = gastoCategoria.value;
  const cuenta = gastoCuenta.value;

  if (isNaN(cantidad) || cantidad <= 0) {
    alert('Introduce una cantidad válida');
    return;
  }

  guardarMovimiento({
    tipo: 'gasto',
    cantidad,
    categoria,
    cuenta,
    fecha: new Date().toISOString()
  });

  gastoCantidad.value = '';
  formGasto.classList.add('hidden');
});

// Exportar PDF con jsPDF
btnExportar.addEventListener('click', () => {
  exportarPDF();
});

// Función para exportar PDF con movimientos del mes actual
function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();

  const movimientosMes = movimientos.filter(mov => {
    const fechaMov = new Date(mov.fecha);
    return fechaMov.getMonth() === mesActual && fechaMov.getFullYear() === anioActual;
  });

  if (movimientosMes.length === 0) {
    alert('No hay movimientos para el mes actual.');
    return;
  }

  doc.setFontSize(18);
  doc.text('Movimientos Financieros - Mes Actual', 14, 22);

  doc.setFontSize(12);
  let y = 30;

  movimientosMes.forEach(mov => {
    const fechaStr = new Date(mov.fecha).toLocaleDateString();
    const linea = `${mov.tipo === 'ingreso' ? '+' : '-'} ${mov.cantidad.toFixed(2)} € | ${mov.cuenta} | ${mov.tipo === 'gasto' ? mov.categoria + ' | ' : ''}${fechaStr}`;
    doc.text(linea, 14, y);
    y += 10;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save('movimientos_mes_actual.pdf');
}

// Inicializar UI
actualizarSaldos();
mostrarMovimientos();