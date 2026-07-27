// ===== Backend connection check =====
// Change this if your Flask server runs on a different port
const BACKEND_URL = 'http://127.0.0.1:5000';

const backendStatus = document.getElementById('backendStatus');

fetch(BACKEND_URL + '/')
  .then((res) => res.json())
  .then((data) => {
    backendStatus.textContent = '● Backend connected: ' + data.status;
    backendStatus.style.color = '#4FD1B5';
    backendStatus.style.background = 'rgba(79, 209, 181, 0.1)';
  })
  .catch(() => {
    backendStatus.textContent = '● Backend not reachable — is app.py running?';
    backendStatus.style.color = '#E24B4A';
    backendStatus.style.background = 'rgba(226, 75, 74, 0.1)';
  });

// ===== Element references =====
const processBtn   = document.getElementById('processBtn');
const toQuizBtn     = document.getElementById('toQuizBtn');
const submitQuizBtn = document.getElementById('submitQuizBtn');

const panelUpload   = document.getElementById('panel-upload');
const panelLoading  = document.getElementById('panel-loading');
const panelResult   = document.getElementById('panel-result');
const panelQuiz     = document.getElementById('panel-quiz');
const panelScore    = document.getElementById('panel-score');

const loaderText    = document.getElementById('loaderText');
const scoreText     = document.getElementById('scoreText');

// ===== Update pipeline rail (step 1 to 4) =====
function setStep(activeStep) {
  document.querySelectorAll('.rail-step').forEach((el) => {
    const step = parseInt(el.dataset.step);
    const dot = el.querySelector('.rail-dot');
    const label = el.querySelector('.rail-label');

    dot.classList.remove('active', 'done');
    label.classList.remove('active');

    if (step < activeStep) {
      dot.classList.add('done');
      dot.innerHTML = '<i class="ti ti-check"></i>';
      label.classList.add('active');
    } else if (step === activeStep) {
      dot.classList.add('active');
      dot.textContent = step;
      label.classList.add('active');
    } else {
      dot.textContent = step;
    }
  });
}

// ===== Step 1 -> Step 2: Process video (mock) =====
processBtn.addEventListener('click', () => {
  // TODO: replace this whole block with a real fetch() call to your backend
  // Example:
  // const response = await fetch('/api/process', {
  //   method: 'POST',
  //   body: JSON.stringify({ url: document.getElementById('ytLink').value })
  // });
  // const data = await response.json();

  panelUpload.classList.add('hidden');
  panelLoading.classList.remove('hidden');

  const messages = [
    'Extracting audio track...',
    'Transcribing with Whisper...',
    'Summarizing with the AI model...'
  ];
  let i = 0;
  const interval = setInterval(() => {
    i++;
    if (i < messages.length) loaderText.textContent = messages[i];
  }, 700);

  setTimeout(() => {
    clearInterval(interval);
    panelLoading.classList.add('hidden');
    panelResult.classList.remove('hidden');
    setStep(2);
  }, 2200);
});

// ===== Step 2 -> Step 3: Generate quiz =====
toQuizBtn.addEventListener('click', () => {
  // TODO: replace with a real fetch() call to your quiz-generation endpoint
  panelResult.classList.add('hidden');
  panelQuiz.classList.remove('hidden');
  setStep(4);
});

// ===== Step 3: Submit quiz and calculate score =====
submitQuizBtn.addEventListener('click', () => {
  let score = 0;
  const totalQuestions = document.querySelectorAll('.q-card').length;

  document.querySelectorAll('.q-card').forEach((card) => {
    const name = card.querySelector('input').name;
    const picked = card.querySelector(`input[name="${name}"]:checked`);

    if (picked && picked.value === 'right') score++;

    card.querySelectorAll('.quiz-option').forEach((label) => {
      const input = label.querySelector('input');
      if (input.value === 'right') label.classList.add('correct');
      if (picked && input === picked && input.value !== 'right') {
        label.classList.add('incorrect');
      }
    });
  });

  submitQuizBtn.disabled = true;
  scoreText.textContent = `${score} / ${totalQuestions}`;
  panelScore.classList.remove('hidden');
});