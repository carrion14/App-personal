const mainButtons = document.getElementById('mainButtons');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const optionsContainer = document.getElementById('optionsContainer');
const backToMainBtn = document.getElementById('backToMain');

// Datos para cada sección con sus opciones y pasos
const data = {
  toc: {
    title: 'Selecciona el foco de tu TOC:',
    options: [
      "HOCD",
      "Pensamientos intrusivos generales",
      "Ritual o compulsión (ej. revisión, comprobación)",
      "Tics o rituales físicos/mentales",
      "Otros"
    ],
    steps: {
      "HOCD": [
        "Paso 1: Identifica el pensamiento como TOC.",
        "Paso 1: simplificalo, no lo conviertas en algo dificil siendo algo tan facil como saber lo que te gusta",
        "Paso 1: Recuerda tu frase racional: “Me gustan las mujeres, no me gustan los hombres.”",
        "Paso 2: Reconoce que es TOC, no tu verdad.",
        "Paso 3: No busques pruebas ni analices más.",
        "Paso 4: Redirige tu atención a una actividad que disfrutes.",
        "Paso 5: Practica respiración consciente (opción para guía rápida)."
      ],
      "Pensamientos intrusivos generales": [
        "Paso 1: Identifica el pensamiento como TOC.",
        "Paso 2: No luches contra él, obsérvalo sin juzgar.",
        "Paso 3: Usa frases racionales para desactivarlo.",
        "Paso 4: Distráete con una actividad concreta."
      ],
      "Ritual o compulsión (ej. revisión, comprobación)": [
        "Paso 1: Reconoce el ritual.",
        "Paso 2: Practica prevención de respuesta (no realizar el ritual).",
        "Paso 3: Usa frases racionales para resistir la compulsión.",
        "Paso 4: Respira y redirige la atención."
      ],
      "Tics o rituales físicos/mentales": [
        "Paso 1: Observa el tic sin juzgar.",
        "Paso 2: Intenta pausarlo conscientemente.",
        "Paso 3: Sustituye por una acción neutra (ej. apretar la mano suavemente).",
        "Paso 4: Respira y relaja el cuerpo."
      ],
      "Otros": [
        "Paso 1: Reconoce tu experiencia sin juzgar.",
        "Paso 2: Busca apoyo si lo necesitas.",
        "Paso 3: Practica técnicas de relajación y mindfulness."
      ]
    }
  },
  ansiedad: {
    title: 'Selecciona el tipo o causa de ansiedad:',
    options: [
      "Ansiedad general",
      "Ansiedad por TOC",
      "Ansiedad social",
      "Ansiedad por estrés o cambios",
      "Otros"
    ],
    steps: {
      "Ansiedad general": [
        "Paso 1: Reconoce la ansiedad sin juzgar.",
        "Paso 2: Practica respiración consciente (guía rápida).",
        "Paso 3: Usa frases de autocompasión (“Está bien sentir ansiedad, puedo manejarlo”).",
        "Paso 4: Redirige la atención a una actividad que te guste.",
        "Paso 5: Si es posible, habla con alguien de confianza."
      ],
      "Ansiedad por TOC": [
        "Paso 1: Reconoce que la ansiedad está relacionada con TOC.",
        "Paso 2: Practica técnicas de exposición y prevención de respuesta.",
        "Paso 3: Usa frases racionales para calmarte.",
        "Paso 4: Distráete con actividades placenteras."
      ],
      "Ansiedad social": [
        "Paso 1: Reconoce tus miedos sociales sin juzgar.",
        "Paso 2: Practica respiración y relajación antes de situaciones sociales.",
        "Paso 3: Usa afirmaciones positivas.",
        "Paso 4: Enfrenta poco a poco las situaciones temidas."
      ],
      "Ansiedad por estrés o cambios": [
        "Paso 1: Acepta que el cambio genera estrés.",
        "Paso 2: Practica mindfulness y respiración.",
        "Paso 3: Organiza tu rutina para reducir incertidumbre.",
        "Paso 4: Busca apoyo si lo necesitas."
      ],
      "Otros": [
        "Paso 1: Observa tus sensaciones sin juzgar.",
        "Paso 2: Practica técnicas de relajación.",
        "Paso 3: Busca ayuda profesional si es necesario."
      ]
    }
  },
  malestar: {
    title: 'Selecciona el tipo de malestar:',
    options: [
      "Cansancio o agotamiento",
      "Tristeza o bajón emocional",
      "Estrés por cambios (trabajo, rutina)",
      "Sensación de desconexión o vacío",
      "Otros"
    ],
    steps: {
      "Cansancio o agotamiento": [
        "Paso 1: Acepta tu cansancio sin juzgar.",
        "Paso 2: Descansa y cuida tu cuerpo.",
        "Paso 3: Ajusta tu rutina para recuperar energía.",
        "Paso 4: Considera actividades relajantes."
      ],
      "Tristeza o bajón emocional": [
        "Paso 1: Permítete sentir tristeza.",
        "Paso 2: Habla con alguien de confianza.",
        "Paso 3: Practica actividades que te reconforten.",
        "Paso 4: Considera escribir tus emociones."
      ],
      "Estrés por cambios (trabajo, rutina)": [
        "Paso 1: Reconoce el estrés sin juzgar.",
        "Paso 2: Organiza y planifica tus tareas.",
        "Paso 3: Practica respiración y mindfulness.",
        "Paso 4: Busca apoyo si lo necesitas."
      ],
      "Sensación de desconexión o vacío": [
        "Paso 1: Observa tus sensaciones sin juzgar.",
        "Paso 2: Practica actividades que te conecten con el presente.",
        "Paso 3: Busca apoyo emocional.",
        "Paso 4: Considera ayuda profesional si persiste."
      ],
      "Otros": [
        "Paso 1: Reconoce tu malestar sin juzgar.",
        "Paso 2: Practica técnicas de autocuidado.",
        "Paso 3: Busca apoyo si lo necesitas."
      ]
    }
  },
  noloose: {
    title: 'Selecciona una opción:',
    options: [
      "Explorar sensaciones",
      "Ejercicio rápido de grounding",
      "Frases racionales para cualquier momento",
      "Contacto de emergencia"
    ],
    steps: {
      "Explorar sensaciones": [
        "¿Qué sientes ahora? Ansiedad, tristeza, confusión, etc.",
        "Observa tus sensaciones sin juzgar.",
        "Anota o habla sobre lo que sientes."
      ],
      "Ejercicio rápido de grounding": [
        "Paso 1: Mira a tu alrededor y nombra 5 cosas que ves.",
        "Paso 2: Escucha y nombra 4 sonidos que oyes.",
        "Paso 3: Siente 3 texturas diferentes con tus manos.",
        "Paso 4: Respira profundamente 2 veces.",
        "Paso 5: Recuerda que estás en el presente."
      ],
      "Frases racionales para cualquier momento": [
        "“Esto también pasará.”",
        "“Puedo manejar lo que siento.”",
        "“No soy mis pensamientos.”",
        "“Estoy haciendo lo mejor que puedo.”"
      ],
      "Contacto de emergencia": [
        "Si necesitas ayuda inmediata, contacta con tu persona de confianza o profesional.",
        "Teléfono de emergencia: 112 (o el que corresponda en tu país)."
      ]
    }
  }
};

// Estado actual para navegación
let currentSection = null;
let currentStepOptions = null;

// Limpiar chat y opciones
function resetChat() {
  chatMessages.innerHTML = '';
  optionsContainer.innerHTML = '';
}

// Mostrar mensajes en el chat
function showMessages(messages) {
  resetChat();
  messages.forEach(text => {
    const div = document.createElement('div');
    div.classList.add('message', 'step');
    div.textContent = text;
    chatMessages.appendChild(div);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mostrar opciones como botones
function showOptions(options) {
  optionsContainer.innerHTML = '';
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.addEventListener('click', () => {
      // Mostrar pasos para la opción seleccionada
      const steps = data[currentSection].steps[option];
      if (steps) {
        showMessages(steps);
        optionsContainer.innerHTML = ''; // quitar opciones tras selección
      }
    });
    optionsContainer.appendChild(btn);
  });
}

// Mostrar pantalla de selección de sub-opciones para sección
function showSection(sectionKey) {
  currentSection = sectionKey;
  mainButtons.classList.add('hidden');
  chatContainer.classList.remove('hidden');
  resetChat();
  chatMessages.textContent = data[sectionKey].title;
  showOptions(data[sectionKey].options);
}

// Volver a pantalla principal
function backToMain() {
  currentSection = null;
  resetChat();
  optionsContainer.innerHTML = '';
  chatContainer.classList.add('hidden');
  mainButtons.classList.remove('hidden');
}

// Eventos
mainButtons.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const section = e.target.getAttribute('data-section');
    if (section && data[section]) {
      showSection(section);
    }
  }
});

backToMainBtn.addEventListener('click', backToMain);

// Inicialización
window.onload = () => {
  resetChat();
  chatContainer.classList.add('hidden');
  mainButtons.classList.remove('hidden');
};