/* assets/js/custom.js */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // LD11: Kontaktų Formos Validacija ir Apdorojimas (Papildoma Užduotis)
    // ----------------------------------------------------------------------
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('form-submit-btn');
    const formResults = document.getElementById('form-results');
    const formFields = form ? Array.from(form.querySelectorAll('input[required]')) : [];

    // Regex validacijos taisyklės
    const validationRules = {
        // Leidžiamos raidės, tarpai ir brūkšneliai
        name: { regex: /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s\-]+$/, message: 'Vardas gali būti sudarytas tik iš raidžių, tarpų ir brūkšnelių.' },
        surname: { regex: /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s\-]+$/, message: 'Pavardė gali būti sudaryta tik iš raidžių, tarpų ir brūkšnelių.' },
        email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Neteisingas el. pašto formatas.' },
        address: { regex: /^.+$/, message: 'Adresas negali būti tuščias.' },
    };

    /**
     * Rodo klaidos pranešimą po lauku ir raudoną rėmelį.
     */
    function displayError(inputElement, message) {
        let error = inputElement.nextElementSibling;
        if (!error || !error.classList.contains('error-message')) {
            error = document.createElement('span');
            error.classList.add('error-message');
            inputElement.parentNode.insertBefore(error, inputElement.nextSibling);
        }
        inputElement.classList.add('error');
        error.textContent = message;
    }

    /**
     * Pašalina klaidos pranešimą ir stilių.
     */
    function clearError(inputElement) {
        inputElement.classList.remove('error');
        const error = inputElement.nextElementSibling;
        if (error && error.classList.contains('error-message')) {
            error.remove();
        }
    }

    /**
     * Real-time telefono numerio formatavimas (+370 6xx xxxxx) ir patikra.
     */
    function formatPhoneNumber(phoneInput) {
        let value = phoneInput.value.replace(/\D/g, ''); 

        // Prideda Lietuvos kodo pradžią (+370)
        if (value.length > 0) {
            if (value.startsWith('8')) {
                value = '370' + value.substring(1); 
            } else if (!value.startsWith('370')) {
                value = '370' + value;
            }
        }

        // Apribojimas ir formatavimas
        if (value.startsWith('370')) {
            if (value.length > 12) { 
                value = value.substring(0, 12);
            }

            let formatted = '+' + value.substring(0, 3);
            if (value.length > 3) {
                formatted += ' ' + value.substring(3, 6);
            }
            if (value.length > 6) {
                formatted += ' ' + value.substring(6, 12);
            }
            phoneInput.value = formatted;
        } else {
             phoneInput.value = value.substring(0, 15); 
        }

        // Tikrinimas pagal galutinį Lietuvos šabloną (naudojama tik formos validacijai)
        const finalPattern = /^\+370\s\d{3}\s\d{5}$/;
        if (!finalPattern.test(phoneInput.value)) {
            displayError(phoneInput, 'Numeris turi atitikti šabloną: +370 6xx xxxxx');
            return false;
        } else {
            clearError(phoneInput);
            return true;
        }
    }

    /**
     * Bendras lauko validavimas.
     */
    function validateField(inputElement) {
        const value = inputElement.value.trim();
        const fieldName = inputElement.id;
        const rules = validationRules[fieldName];

        // 1. Tuščio lauko patikra
        if (value === '') {
            displayError(inputElement, `${inputElement.placeholder} negali būti tuščias.`);
            return false;
        }

        // 2. Regex patikra
        if (rules && !rules.regex.test(value)) {
            displayError(inputElement, rules.message);
            return false;
        }

        // Specialus atvejis telefono numeriui
        if (fieldName === 'phone') {
            return formatPhoneNumber(inputElement);
        }
        
        clearError(inputElement);
        return true;
    }

    /**
     * Patikrina visus formos laukus ir aktyvuoja/deaktyvuoja mygtuką.
     */
    function checkFormValidity() {
        if (!submitBtn) return;

        const isFormValid = formFields.every(field => {
            const fieldName = field.id;
            const value = field.value.trim();
            const rules = validationRules[fieldName];

            // Patikra, ar laukas nėra tuščias
            if (value === '') return false; 
            
            // Patikra pagal Regex
            if (rules && !rules.regex.test(value)) return false; 

            // Telefono numerio patikra
            if (fieldName === 'phone') {
                 const finalPattern = /^\+370\s\d{3}\s\d{5}$/;
                 return finalPattern.test(field.value); // Naudojame finalinį formatą
            }
            return true;
        });

        submitBtn.disabled = !isFormValid;
    }

    // Pridedame event listenerius visiems laukams
    formFields.forEach(field => {
        if (field.id === 'phone') {
            // Telefono numerio formatavimas/validacija realiu laiku
            field.addEventListener('input', () => {
                formatPhoneNumber(field); // Formatavimas ir klaidos rodymas
                checkFormValidity();
            });
            // Telefono numerio laukui patikriname tik po fokusavimo praradimo (blur) ir įvedimo (input)
            field.addEventListener('blur', () => {
                validateField(field);
                checkFormValidity();
            });
        } else {
            // Kitiems laukams validacija po įvedimo (input) ir fokusavimo praradimo (blur)
            field.addEventListener('input', () => {
                validateField(field);
                checkFormValidity();
            });
            field.addEventListener('blur', () => {
                validateField(field);
                checkFormValidity();
            });
        }
    });

    // Rating sliders display value
    const ratingSliders = form ? form.querySelectorAll('input[type="range"]') : [];
    ratingSliders.forEach(slider => {
        const output = document.getElementById(slider.id + '_value');
        slider.addEventListener('input', () => {
            output.textContent = slider.value;
        });
    });

    // Formos pateikimo apdorojimas (Apskaičiavimas ir išvedimas)
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const isValid = formFields.every(validateField);

            if (isValid) {
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => data[key] = value);

                const name = data.name;
                const surname = data.surname;
                const rating1 = parseFloat(data.rating1);
                const rating2 = parseFloat(data.rating2);
                const rating3 = parseFloat(data.rating3);

                // Apskaičiuojamas vidurkis
                const average = ((rating1 + rating2 + rating3) / 3).toFixed(1);

                // 1. Išvestis į Konsolę
                console.group('Formos Duomenys (JavaScript Objektas)');
                console.log(data);
                console.groupEnd();
                
                // 2. Išvestis į Svetainės Apačią (form-results)
                formResults.innerHTML = `
                    <div class="alert alert-success">
                        <strong>Duomenys pateikti sėkmingai!</strong>
                    </div>
                    <h4>Išvestis:</h4>
                    <p><strong>Vardas:</strong> ${name}</p>
                    <p><strong>Pavardė:</strong> ${surname}</p>
                    <p><strong>El. paštas:</strong> ${data.email}</p>
                    <p><strong>Tel. Numeris:</strong> ${data.phone}</p>
                    <p><strong>Adresas:</strong> ${data.address}</p>
                    <hr>
                    <p><strong>${name} ${surname} vidurkis:</strong> ${average}</p>
                `;

                // Išvalyti formą ir išjungti mygtuką
                form.reset();
                submitBtn.disabled = true;
                
                // Nustatyti range sliderių atvaizdavimą iš naujo po reset
                ratingSliders.forEach(slider => {
                    document.getElementById(slider.id + '_value').textContent = slider.value;
                });

            } else {
                formFields.forEach(validateField);
            }
        });
        // Pradžioje patikriname, kad mygtukas būtų disabled, jei laukai tušti
        checkFormValidity();
    }
    
    // ----------------------------------------------------------------------
    // LD12: Atminties Kortelių Žaidimas (Flip Card Memory)
    // ----------------------------------------------------------------------

    const board = document.getElementById('game-board');
    const startBtn = document.getElementById('start-game-btn');
    const resetBtn = document.getElementById('reset-game-btn');
    const difficultySelect = document.getElementById('difficulty-select');
    const movesDisplay = document.getElementById('moves-count');
    const matchedPairsDisplay = document.getElementById('matched-pairs-count');
    const winMessage = document.getElementById('win-message');
    const finalStats = document.getElementById('final-stats');
    const timerDisplay = document.getElementById('game-timer');
    const bestScoreEasyDisplay = document.getElementById('best-score-easy');
    const bestScoreHardDisplay = document.getElementById('best-score-hard');

    let cardData = [
        '😀', '😎', '🐶', '🍕', '🚗', '🚀', '⭐', '🔥', '💡', '🎸', '⚽', '👑'
        // 12 unikalių ikonų (maksimaliai 24 kortelės 6x4 lygiui)
    ];

    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matchedPairs = 0;
    let timerInterval;
    let seconds = 0;
    let isGameRunning = false;

    // Sunkumo lygiai
    const difficulties = {
        easy: { gridSize: '4x3', pairs: 6, cols: 4, rows: 3 }, // 12 kortelių
        hard: { gridSize: '6x4', pairs: 12, cols: 6, rows: 4 } // 24 kortelės
    };

    /**
     * Nuskaito geriausius rezultatus iš localStorage.
     */
    function loadBestScores() {
        const bestEasy = localStorage.getItem('bestScoreEasy');
        const bestHard = localStorage.getItem('bestScoreHard');

        bestScoreEasyDisplay.textContent = bestEasy || 'N/A';
        bestScoreHardDisplay.textContent = bestHard || 'N/A';
    }

    /**
     * Paleidžia laikmatį.
     */
    function startTimer() {
        stopTimer();
        seconds = 0;
        timerDisplay.textContent = '00:00';
        timerInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    /**
     * Sustabdo laikmatį.
     */
    function stopTimer() {
        clearInterval(timerInterval);
    }

    /**
     * Sugeneruoja kortelių masyvą pagal sudėtingumo lygį ir sumaišo.
     */
    function generateCards(difficulty) {
        const config = difficulties[difficulty];
        const selectedData = cardData.slice(0, config.pairs);
        
        let tempCards = [...selectedData, ...selectedData];

        // Sumaišome (Fisher-Yates algoritmas)
        for (let i = tempCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tempCards[i], tempCards[j]] = [tempCards[j], tempCards[i]];
        }
        return tempCards;
    }

    /**
     * Dinamiškai sugeneruoja žaidimo lentą.
     */
    function drawBoard(cardArray, config) {
        board.innerHTML = ''; 
        board.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
        
        cardArray.forEach(icon => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.icon = icon;
            cardElement.innerHTML = `
                <div class="front-face">?</div>
                <div class="back-face">${icon}</div>
            `;
            cardElement.addEventListener('click', flipCard);
            board.appendChild(cardElement);
        });

        cards = board.querySelectorAll('.memory-card'); 
        matchedPairsDisplay.textContent = `0 / ${config.pairs}`;
    }

    /**
     * Apverčia kortelę (Flip Card Logic).
     */
    function flipCard() {
        if (!isGameRunning) return; 
        if (lockBoard) return;
        if (this === firstCard) return; 

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;

        checkForMatch();
    }

    /**
     * Patikrina, ar kortelės sutampa.
     */
    function checkForMatch() {
        let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

        isMatch ? disableCards() : unflipCards();
    }

    /**
     * Kortelės sutampa: paliekamos apverstos ir tampa neaktyvios.
     */
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        firstCard.classList.add('match');
        secondCard.classList.add('match');

        matchedPairs++;
        const totalPairs = difficulties[difficultySelect.value].pairs;
        matchedPairsDisplay.textContent = `${matchedPairs} / ${totalPairs}`;

        resetBoard();
        
        if (matchedPairs === totalPairs) {
            winGame();
        }
    }

    /**
     * Kortelės nesutampa: atverčiamos atgal po 1s.
     */
    function unflipCards() {
        lockBoard = true; 
        
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');

            resetBoard();
        }, 1000);
    }

    /**
     * Atstato lentos būseną po ėjimo.
     */
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    /**
     * Nustato žaidimą į pradinę būseną.
     * @param {boolean} shouldShuffle - Ar permaišyti korteles (true for Start/Reset, false for initial load)
     */
    function resetGame(shouldShuffle = true) {
        stopTimer();
        isGameRunning = false;
        moves = 0;
        matchedPairs = 0;
        movesDisplay.textContent = '0';
        winMessage.classList.add('d-none');
        startBtn.textContent = 'Start';
        
        const difficulty = difficultySelect.value;
        const totalPairs = difficulties[difficulty].pairs;
        matchedPairsDisplay.textContent = `0 / ${totalPairs}`;

        if (shouldShuffle) {
            cards = generateCards(difficulty);
        } else {
             // Jei nereikia maišyti, tiesiog generuojame korteles pagal lygį
             cards = generateCards(difficulty);
        }

        drawBoard(cards, difficulties[difficulty]);
    }

    /**
     * Pradeda naują žaidimą.
     */
    function startGame() {
        if (isGameRunning) return; 

        const difficulty = difficultySelect.value;
        const config = difficulties[difficulty];

        // Visiškas atnaujinimas
        resetGame(true);

        // Nustatome naują starto būseną
        moves = 0;
        matchedPairs = 0;
        movesDisplay.textContent = '0';
        
        startTimer();
        isGameRunning = true;
        startBtn.textContent = 'Žaidimas Veikia...';
    }

    /**
     * Žaidimas laimėtas: sustabdomas laikmatis, rodomas pranešimas.
     */
    function winGame() {
        stopTimer();
        isGameRunning = false;
        startBtn.textContent = 'Start'; 

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const finalTime = `${minutes} min. ${remainingSeconds} sek.`;

        finalStats.innerHTML = `Jūsų rezultatas: ${moves} ėjimai per ${finalTime}.`;
        winMessage.classList.remove('d-none');

        checkAndUpdateBestScore(difficultySelect.value);
    }

    /**
     * Tikrina ir atnaujina geriausią rezultatą localStorage.
     */
    function checkAndUpdateBestScore(difficulty) {
        const bestScoreKey = `bestScore${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
        const currentBest = localStorage.getItem(bestScoreKey);

        if (!currentBest || moves < parseInt(currentBest)) {
            localStorage.setItem(bestScoreKey, moves);
            loadBestScores(); 
        }
    }


    // ----------------------------------------------------------------------
    // LD12: Event Listeners
    // ----------------------------------------------------------------------

    if (board) {
        loadBestScores();
        resetGame(false); // Užkrauna pradinę būseną
        
        startBtn.addEventListener('click', startGame);
        resetBtn.addEventListener('click', () => {
             // Atnaujinti mygtukas: atstato ir permaišo, tada paleidžia naują žaidimą
             resetGame(true);
             startGame(); 
        });
        difficultySelect.addEventListener('change', () => {
             // Kai keičiamas lygis, atstatome žaidimą su nauju tinkleliu be starto
             resetGame(false); 
        });
    }
});
