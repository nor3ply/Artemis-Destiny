// Логіка вікторини Artemis
document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: "Which heavy-lift launch vehicle is used for both Artemis I and Artemis II?",
            answers: ["Starship", "Falcon Heavy", "Space Launch System", "Delta IV Heavy"],
            correct: 2
        },
        {
            question: "What was the main objective of the Artemis I mission?",
            answers: ["To land astronauts on the Moon.", "To test the SLS rocket and Orion spacecraft unmanned.", "To build a lunar base.", "To deliver cargo to the Lunar Gateway."],
            correct: 1
        },
        {
            question: "How many astronauts are planned for Artemis II?",
            answers: ["Two", "Three", "Four", "Six"],
            correct: 2
        },
        {
            question: "What is the planned flight path for Artemis II?",
            answers: ["Direct lunar landing.", "Lunar orbit and docking.", "Lunar flyby and return to Earth.", "Mars transfer orbit."],
            correct: 2
        },
        {
            question: "What is the name of the crew capsule used on Artemis missions?",
            answers: ["Dragon", "Orion", "Starliner", "Crew Dragon"],
            correct: 1
        },
        {
            question: "What role does the Artemis program play in NASA's lunar strategy?",
            answers: ["A one-time Moon landing only.", "The first stage toward a sustained lunar presence.", "A cargo resupply project.", "A mission focused on Mars exploration."],
            correct: 1
        }
    ];

    // Отримання елементів DOM для екранів
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    // Кнопки управління
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');

    // Елементи відображення питань та результатів
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score-display');
    const resultText = document.getElementById('result-text');

    // Змінні стану гри
    let questionIndex = 0;
    let score = 0;
    let timer = 15;
    let interval;

    // Функція показу питання
    function showQuestion() {
        clearInterval(interval);
        startTimer();

        const currentQuestion = questions[questionIndex];
        questionText.textContent = currentQuestion.question;
        answersContainer.innerHTML = '';

        currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer;
            button.addEventListener('click', () => checkAnswer(button, index));
            answersContainer.appendChild(button);
        });
    }

    // Функція перевірки відповіді
    function checkAnswer(button, answerIndex) {
        const isCorrect = answerIndex === questions[questionIndex].correct;
        button.classList.add(isCorrect ? 'correct' : 'wrong');
        if (isCorrect) score++;

        document.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);
        scoreDisplay.textContent = `Score: ${score}`;

        clearInterval(interval);
        setTimeout(nextQuestion, 900);
    }

    // Функція переходу до наступного питання
    function nextQuestion() {
        questionIndex++;
        if (questionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }

    // Функція початку гри
    function startGame() {
        questionIndex = 0;
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
        startScreen.classList.add('hide');
        resultScreen.classList.add('hide');
        quizScreen.classList.remove('hide');
        showQuestion();
    }

    // Функція показу результатів
    function showResult() {
        const accuracy = Math.round((score / questions.length) * 100);
        resultText.textContent = `Mission complete: ${score}/${questions.length} correct answers (${accuracy}%).`;
        quizScreen.classList.add('hide');
        resultScreen.classList.remove('hide');
    }

    // Функція запуску таймера
    function startTimer() {
        timer = 15;
        timerDisplay.textContent = `Time: ${timer}`;
        interval = setInterval(() => {
            timer--;
            timerDisplay.textContent = `Time: ${timer}`;
            if (timer <= 0) {
                clearInterval(interval);
                nextQuestion();
            }
        }, 1000);
    }

    // Прив'язка обробників подій
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
});
