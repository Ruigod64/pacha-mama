/**
 * reservation.js — WhatsApp / Phone reservation form
 */
(function () {
  'use strict';

  var form      = document.getElementById('reservationForm');
  var submitBtn = document.getElementById('reserveSubmit');
  // Número por sucursal
  var PHONES = {
    marina: '526692662545',
    parque: '526693269424'
  };
  var PHONE = PHONES.marina; // default

  if (!form) return;

  // Method toggle display
  var methodRadios = form.querySelectorAll('input[name="method"]');
  var waNote  = document.getElementById('methodNoteWa');
  var telNote = document.getElementById('methodNoteTel');

  methodRadios.forEach(function (r) {
    r.addEventListener('change', function () {
      if (waNote)  waNote.hidden  = (r.value !== 'whatsapp');
      if (telNote) telNote.hidden = (r.value !== 'phone');
      updateSubmitLabel(r.value);
    });
  });

  function updateSubmitLabel(method) {
    if (!submitBtn) return;
    if (method === 'whatsapp') {
      submitBtn.textContent = 'Reservar por WhatsApp';
    } else {
      submitBtn.textContent = 'Ver número de teléfono';
    }
  }

  // Actualiza el número según sucursal seleccionada
  var branchSelect = form.querySelector('#resBranch');
  if (branchSelect) {
    branchSelect.addEventListener('change', function () {
      PHONE = PHONES[this.value] || PHONES.marina;
    });
  }

  // ── Form submission ──
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    var method = getMethod();
    var data   = getFormData();
    // Asegura usar el número correcto al momento de enviar
    PHONE = PHONES[data.branch] || PHONES.marina;

    if (method === 'whatsapp') {
      openWhatsApp(data);
    } else {
      showPhone();
    }
  });

  function getMethod() {
    var checked = form.querySelector('input[name="method"]:checked');
    return checked ? checked.value : 'whatsapp';
  }

  function getFormData() {
    return {
      name:    (form.querySelector('#guestName')    || {}).value || '',
      date:    (form.querySelector('#resDate')      || {}).value || '',
      time:    (form.querySelector('#resTime')      || {}).value || '',
      guests:  (form.querySelector('#resGuests')    || {}).value || '',
      branch:  (form.querySelector('#resBranch')    || {}).value || '',
      notes:   (form.querySelector('#resNotes')     || {}).value || ''
    };
  }

  function buildMessage(data) {
    var branchMap = {
      marina:  'Marina Universidad (Av. Óscar Pérez Escobosa 3204)',
      parque:  'Parque Central (Isla azada #105, Tellerias)'
    };
    var branch = branchMap[data.branch] || data.branch;

    var lines = [
      '¡Hola Pacha Mama! Me gustaría hacer una reservación:',
      '',
      '• Nombre: '       + data.name,
      '• Fecha: '        + formatDate(data.date),
      '• Hora: '         + data.time,
      '• Personas: '     + data.guests,
      '• Sucursal: '     + branch
    ];
    if (data.notes) lines.push('• Notas: ' + data.notes);
    lines.push('', '¡Muchas gracias!');
    return lines.join('\n');
  }

  function openWhatsApp(data) {
    var msg = encodeURIComponent(buildMessage(data));
    window.open('https://wa.me/' + PHONE + '?text=' + msg, '_blank', 'noopener');
  }

  function showPhone() {
    var phoneSection = document.getElementById('phoneReveal');
    if (phoneSection) {
      phoneSection.hidden = false;
      phoneSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      phoneSection.focus();
    }
    // Also try tel: link
    setTimeout(function () {
      window.location.href = 'tel:+' + PHONE;
    }, 400);
  }

  // ── Validation ──
  function validateForm() {
    var valid = true;
    var required = form.querySelectorAll('[required]');

    required.forEach(function (field) {
      clearError(field);
      if (!field.value.trim()) {
        showError(field, 'Este campo es obligatorio');
        valid = false;
      }
    });

    // Date must be >= today
    var dateInput = form.querySelector('#resDate');
    if (dateInput && dateInput.value) {
      var chosen = new Date(dateInput.value + 'T00:00:00');
      var today  = new Date(); today.setHours(0,0,0,0);
      if (chosen < today) {
        showError(dateInput, 'La fecha debe ser hoy o futura');
        valid = false;
      }
    }

    return valid;
  }

  function showError(field, msg) {
    field.setAttribute('aria-invalid', 'true');
    var err = field.parentElement.querySelector('.form-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'form-error';
      err.style.cssText = 'color:#F87171;font-size:0.75rem;margin-top:4px;display:block;';
      field.parentElement.appendChild(err);
    }
    err.textContent = msg;
    err.setAttribute('role', 'alert');
  }

  function clearError(field) {
    field.removeAttribute('aria-invalid');
    var err = field.parentElement && field.parentElement.querySelector('.form-error');
    if (err) err.remove();
  }

  // Clear error on user input
  form.addEventListener('input', function (e) {
    if (e.target.hasAttribute('required')) clearError(e.target);
  });

  // Set min date on date input to today
  var dateInput = form.querySelector('#resDate');
  if (dateInput) {
    var now = new Date();
    var y   = now.getFullYear();
    var m   = String(now.getMonth() + 1).padStart(2, '0');
    var d   = String(now.getDate()).padStart(2, '0');
    dateInput.min = y + '-' + m + '-' + d;
  }

  function formatDate(dateStr) {
    if (!dateStr) return dateStr;
    try {
      var parts = dateStr.split('-');
      var months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
      return parseInt(parts[2]) + ' de ' + months[parseInt(parts[1])-1] + ' de ' + parts[0];
    } catch(e) { return dateStr; }
  }

})();
