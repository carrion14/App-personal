(() => {
  const app = document.getElementById('app');

  const TOC_TYPES = [
    {
      key: 'relacional',
      label: 'TOC relacional (dudas sobre chicas, atracción, conexión emocional)',
      examples: [
        '¿Y si no la quiero de verdad?',
        '¿Y si no siento lo suficiente?',
        '¿Y si me estoy engañando?'
      ]
    },
    {
      key: 'homosexual',
      label: 'HOCD',
      examples: [
        '¿Y si no me gusta lo que creo que me gusta?',
        '¿Y si siempre he vivido una mentira?'
      ]
    },
    {
      key: 'certeza',
      label: 'TOC de certeza / aceptación (dudas como “¿y si no lo he aceptado del todo?”)',
      examples: [
        '¿Y si no he aceptado del todo?',
        '¿Y si estoy evitando la verdad?'
      ]
    },
    {
      key: 'existencial',
      label: 'TOC existencial (dudas como “¿y si no puedo enamorarme?”)',
      examples: [
        '¿Y si nunca me vuelvo a enamorar?',
        '¿Y si me he roto emocionalmente?'
      ]
    },
    {
      key: 'sexual',
      label: 'TOC sexual / disfrute (dudas sobre si has disfrutado sexualmente o no)',
      examples: [
        '¿Y si no lo disfruté de verdad?',
        '¿Y si lo hice por presión?',
        '¿Y si no era lo que esperaba?'
      ]
    }
  ];

  const RITUALS = [
    'Analizar si lo he sentido o no',
    'Comparar con experiencias pasadas',
    'Buscar certeza',
    'Repetirme que fue real',
    'Visualizar o imaginar para probarme',
    'Pensar en cómo debería haber sido',
    'Releer mensajes, ideas o recuerdos',
    'Preguntar mentalmente: “¿Y si…?”',
    'No lo sé, solo estoy incómodo'
  ];

  const MAIN_OPTIONS = ['TOC', 'Ansiedad', 'Malestar', 'No lo sé'];

  let state = {
    step: 0,
    mainFeeling: null,
    tocType: null,
    otherTocType: '',
    exactDoubt: '',
    selectedRituals: [],
    ansiedadSelections: [],
    malestarSelection: null,
    noLoSeSelection: null
  };

  function render() {
    app.innerHTML = '';
    switch(state.step) {
      case 0: renderStep0(); break;
      case 1: renderStep1(); break;
      case 2: renderStep2(); break;
      case 3: renderStep3(); break;
      case 4: renderStep4(); break;
      default: app.textContent = 'Error: paso desconocido'; break;
    }
  }

  // Paso 0: Pantalla de inicio
  function renderStep0() {
    const container = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = '¿Qué estás sintiendo ahora mismo?';
    container.appendChild(title);

    MAIN_OPTIONS.forEach(option => {
      const btn = document.createElement('button');
      btn.textContent = option;
      btn.onclick = () => {
        state.mainFeeling = option;
        state.step = 1;
        render();
      };
      container.appendChild(btn);
    });

    app.appendChild(container);
  }

  // Paso 1: Según mainFeeling
  function renderStep1() {
    const container = document.createElement('div');

    if(state.mainFeeling === 'TOC') {
      const title = document.createElement('h2');
      title.textContent = '¿Qué tipo de TOC estás sintiendo?';
      container.appendChild(title);

      TOC_TYPES.forEach(t => {
        const btn = document.createElement('button');
        btn.textContent = t.label;
        btn.onclick = () => {
          state.tocType = t.key;
          state.step = 2;
          render();
        };
        container.appendChild(btn);
      });

      // Otro tipo
      const label = document.createElement('label');
      label.textContent = 'Otro:';
      label.style.display = 'block';
      label.style.marginTop = '12px';

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Escribe otro tipo de TOC';
      input.value = state.otherTocType;
      input.style.width = '100%';
      input.style.padding = '8px';
      input.style.marginTop = '6px';
      input.style.borderRadius = '6px';
      input.style.border = '1px solid #ccc';

      input.oninput = e => {
        state.otherTocType = e.target.value;
        render(); // para actualizar botón habilitado
      };

      label.appendChild(input);
      container.appendChild(label);

      const contBtn = document.createElement('button');
      contBtn.textContent = 'Continuar';
      contBtn.disabled = !state.otherTocType.trim();
      contBtn.style.marginTop = '8px';
      contBtn.onclick = () => {
        state.tocType = 'otro';
        state.step = 2;
        render();
      };
      container.appendChild(contBtn);

      const backBtn = createBackButton();
      container.appendChild(backBtn);

      app.appendChild(container);
      return;
    }

    if(state.mainFeeling === 'Ansiedad') {
      const title = document.createElement('h2');
      title.textContent = '¿Qué notas ahora mismo? (elige una o varias)';
      container.appendChild(title);

      const options = [
        'Palpitaciones',
        'Presión en el pecho',
        'Pensamientos en bucle',
        'Sensación de peligro',
        'Miedo a perder el control',
        'No me pasa nada físico, solo estoy intranquilo'
      ];

      options.forEach(opt => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '8px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = opt;
        checkbox.checked = state.ansiedadSelections.includes(opt);
        checkbox.onchange = () => {
          if(checkbox.checked) {
            state.ansiedadSelections.push(opt);
          } else {
            state.ansiedadSelections = state.ansiedadSelections.filter(i => i !== opt);
          }
        };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + opt));
        container.appendChild(label);
      });

      const h3 = document.createElement('h3');
      h3.textContent = '¿Qué hago ahora?';
      container.appendChild(h3);

      const p1 = document.createElement('p');
      p1.textContent = 'No analices por qué te sientes así. La ansiedad no tiene lógica.';
      container.appendChild(p1);

      const p2 = document.createElement('p');
      p2.textContent = 'Haz algo físico suave: estirarte, andar despacio, ponerte música relajante.';
      container.appendChild(p2);

      const p3 = document.createElement('p');
      p3.textContent = 'Respira 3 veces lentamente: Inhala 4 seg → retén 4 seg → exhala 6 seg';
      container.appendChild(p3);

      const p4 = document.createElement('p');
      p4.textContent = 'Recuerda:';
      container.appendChild(p4);

      const ul = document.createElement('ul');
      ['Esto no va a más.', 'No tengo que luchar contra esto.', 'Pasará si no la alimento con pensamientos.'].forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
      });
      container.appendChild(ul);

      const backBtn = createBackButton();
      container.appendChild(backBtn);

      app.appendChild(container);
      return;
    }

    if(state.mainFeeling === 'Malestar') {
      const title = document.createElement('h2');
      title.textContent = '¿Qué tipo de malestar notas?';
      container.appendChild(title);

      const options = [
        'Me siento bajo de ánimo',
        'Estoy frustrado conmigo mismo',
        'Me siento vacío',
        'Siento culpa',
        'Me siento solo',
        'No sé bien qué siento'
      ];

      options.forEach(opt => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '8px';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'malestar';
        radio.value = opt;
        radio.checked = state.malestarSelection === opt;
        radio.onchange = () => {
          state.malestarSelection = opt;
        };

        label.appendChild(radio);
        label.appendChild(document.createTextNode(' ' + opt));
        container.appendChild(label);
      });

      const h3 = document.createElement('h3');
      h3.textContent = '¿Qué hago ahora?';
      container.appendChild(h3);

      const p1 = document.createElement('p');
      p1.textContent = 'No intentes arreglarlo con lógica. Dale espacio.';
      container.appendChild(p1);

      const p2 = document.createElement('p');
      p2.textContent = 'Haz algo que te conecte contigo:';
      container.appendChild(p2);

      const ul = document.createElement('ul');
      ['Escribir lo que sientes sin filtro', 'Escuchar una canción que te consuele', 'Hablar con alguien de confianza', 'centrate de nuevo en ti', 'organizate el horario'].forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
      });
      container.appendChild(ul);

      const p3 = document.createElement('p');
      p3.textContent = 'Recuerda:';
      container.appendChild(p3);

      const ul2 = document.createElement('ul');
      ['Los días malos no definen tu progreso.', 'Puedo sentir malestar sin que sea una señal de alarma.'].forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul2.appendChild(li);
      });
      container.appendChild(ul2);

      const backBtn = createBackButton();
      container.appendChild(backBtn);

      app.appendChild(container);
      return;
    }

    if(state.mainFeeling === 'No lo sé') {
      const title = document.createElement('h2');
      title.textContent = '¿Qué te ha llevado a abrir la app?';
      container.appendChild(title);

      const options = [
        'Me siento raro pero no sé por qué',
        'Estoy incómodo sin motivo',
        'Me he despertado mal',
        'Solo quiero saber qué hacer'
      ];

      options.forEach(opt => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '8px';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'nolose';
        radio.value = opt;
        radio.checked = state.noLoSeSelection === opt;
        radio.onchange = () => {
          state.noLoSeSelection = opt;
        };

        label.appendChild(radio);
        label.appendChild(document.createTextNode(' ' + opt));
        container.appendChild(label);
      });

      const h3 = document.createElement('h3');
      h3.textContent = '¿Qué hago ahora?';
      container.appendChild(h3);

      const p1 = document.createElement('p');
      p1.textContent = 'Acepta no saber. No todo tiene una causa clara.';
      container.appendChild(p1);

      const p2 = document.createElement('p');
      p2.textContent = 'Haz algo sencillo y neutro:';
      container.appendChild(p2);

      const ul = document.createElement('ul');
      ['Hacerte un café o té', 'Ponerte música que no sea intensa', 'Estar en silencio 2 minutos y observar sin juzgar'].forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
      });
      container.appendChild(ul);

      const p3 = document.createElement('p');
      p3.textContent = 'Después:';
      container.appendChild(p3);

      const ul2 = document.createElement('ul');
      ['Revisa si estás empezando a sobrepensar', 'Si te calma algo de otro apartado, ve allí'].forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul2.appendChild(li);
      });
      container.appendChild(ul2);

      const backBtn = createBackButton();
      container.appendChild(backBtn);

      app.appendChild(container);
      return;
    }
  }

  // Paso 2: Duda exacta para TOC (sin campo de texto, solo ejemplos y continuar)
function renderStep2() {
  if(state.mainFeeling !== 'TOC') {
    state.step = 0;
    render();
    return;
  }

  const container = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = '¿Cuál es la duda exacta que te viene?';
  container.appendChild(title);

  const toc = TOC_TYPES.find(t => t.key === state.tocType);
  const examples = toc ? toc.examples : [];

  if (examples.length > 0) {
    const p = document.createElement('p');
    p.style.whiteSpace = 'pre-line';
    p.style.backgroundColor = '#f0f8ff';
    p.style.padding = '12px';
    p.style.borderRadius = '8px';
    p.style.border = '1px solid #ccc';
    p.textContent = 'Ejemplos:\n' + examples.join('\n');
    container.appendChild(p);
  } else {
    const p = document.createElement('p');
    p.textContent = 'No hay ejemplos disponibles para este tipo.';
    container.appendChild(p);
  }

  const contBtn = document.createElement('button');
  contBtn.textContent = 'Continuar';
  contBtn.disabled = false; // Siempre habilitado
  contBtn.onclick = () => {
    state.step = 3;
    render();
  };
  container.appendChild(contBtn);

  const backBtn = createBackButton();
  container.appendChild(backBtn);

  app.appendChild(container);
}

  // Paso 3: Rituals para TOC
  function renderStep3() {
    if(state.mainFeeling !== 'TOC') {
      state.step = 0;
      render();
      return;
    }

    const container = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = '¿Estás haciendo rituales mentales ahora?';
    container.appendChild(title);

    const group = document.createElement('div');
    group.className = 'checkbox-group';

    RITUALS.forEach(r => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = state.selectedRituals.includes(r);
      checkbox.onchange = () => {
        if(checkbox.checked) {
          state.selectedRituals.push(r);
        } else {
          state.selectedRituals = state.selectedRituals.filter(x => x !== r);
        }
        render();
      };
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + r));
      group.appendChild(label);
    });

    container.appendChild(group);

    if(state.selectedRituals.length > 0) {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.textContent = '🚨 Estás atrapado en un ritual. El TOC no se resuelve con más pensamiento. Se suelta, no se responde.';
      container.appendChild(alert);
    }

    const contBtn = document.createElement('button');
    contBtn.textContent = 'Continuar';
    contBtn.onclick = () => {
      state.step = 4;
      render();
    };
    container.appendChild(contBtn);

    const backBtn = createBackButton();
    container.appendChild(backBtn);

    app.appendChild(container);
  }

  // Paso 4: Qué hacer ahora para TOC
  function renderStep4() {
    if(state.mainFeeling !== 'TOC') {
      state.step = 0;
      render();
      return;
    }

    const container = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = '¿Qué tengo que hacer ahora?';
    container.appendChild(title);

    const p1 = document.createElement('p');
    p1.textContent = '✅ Pasos para salir del ciclo:';
    container.appendChild(p1);

    const ul1 = document.createElement('ul');
    ['Corta el análisis. No necesitas resolver la duda.',
     'Permite la incomodidad. No la tapes. Tolérala como si fuera un resfriado.',
     'Piensa solo en cosas que ves, escuchas o hueles. No en pensamientos.',
     'recuerda que la vida es una interpretacion. puede ser buena y estar bien si lo interpretas así.',
     'Si los pensamientos te hacen dudar, es porque es lo contrario',
     'Tu identidad y tus gustos no cambia, son solo pensamientos',
     'Desvía la atención. Haz una acción real (paseo, ducha, música, escribir sin pensar en el tema).'].forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      ul1.appendChild(li);
    });
    container.appendChild(ul1);

    const p2 = document.createElement('p');
    p2.textContent = 'Recuérdalo:';
    container.appendChild(p2);

    const ul2 = document.createElement('ul');
    ['Esto no es una crisis real, es un pensamiento disfrazado.',
     'El TOC busca certeza, pero yo puedo convivir con la duda.',
     'No me define lo que pienso cuando estoy activado.'].forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      ul2.appendChild(li);
    });
    container.appendChild(ul2);

    const backBtn = document.createElement('button');
    backBtn.textContent = 'Volver al inicio';
    backBtn.onclick = () => {
      state = {
        step: 0,
        mainFeeling: null,
        tocType: null,
        otherTocType: '',
        exactDoubt: '',
        selectedRituals: [],
        ansiedadSelections: [],
        malestarSelection: null,
        noLoSeSelection: null
      };
      render();
    };
    backBtn.style.marginTop = '20px';
    backBtn.style.backgroundColor = '#007aff';
    backBtn.style.color = 'white';
    backBtn.style.border = 'none';
    backBtn.style.borderRadius = '8px';
    backBtn.style.padding = '12px 20px';
    backBtn.style.cursor = 'pointer';

    container.appendChild(backBtn);

    app.appendChild(container);
  }

  function createBackButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Volver';
    btn.className = 'back-button';
    btn.onclick = () => {
      if(state.step > 0) {
        state.step--;
        render();
      }
    };
    return btn;
  }

  render();
})();