document.addEventListener('DOMContentLoaded', () => {
    // 1. Gauname nuorodas į formą ir rezultatų vietą pagal ID
    const contactForm = document.getElementById('contactForm');
    const formResultsDiv = document.getElementById('form-results');

    // 2. Patikriname, ar forma egzistuoja
    if (contactForm) {
        
        // 3. Priskiriame įvykių klausiklį (event listener) mygtuko paspaudimui
        contactForm.addEventListener('submit', (event) => {
            // A. UŽDUOTIS 4.i: Sustabdome numatytąjį formos persikrovimą
            event.preventDefault(); 
            
            // Naudojame FormData, kad lengvai surinktume visus laukų duomenis
            const formData = new FormData(contactForm);
            
            // B. Surinktų duomenų objektas ir vidurkio skaičiavimas
            const submissionData = {};
            let totalRating = 0;
            let ratingCount = 0;

            // Iteruojame per surinktus duomenis
            for (const [key, value] of formData.entries()) {
                submissionData[key] = value;
                
                // C. UŽDUOTIS 5: Apskaičiuojame vertinimų vidurkį
                if (key.startsWith('rating')) {
                    const rating = parseFloat(value);
                    totalRating += rating;
                    ratingCount++;
                }
            }
            
            // Apskaičiuojame galutinį vidurkį
            const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;
            
            // Pridedame vidurkį į duomenų objektą
            submissionData.averageRating = averageRating;

            // D. UŽDUOTIS 4.ii: Išvedame surinktą objektą į konsolę
            console.log('Surinkti formos duomenys:', submissionData);

            // E. UŽDUOTIS 4.iii IR 5: Atvaizduojame duomenis svetainėje
            displayResults(submissionData, formResultsDiv);
            
            // F. UŽDUOTIS 6: Parodome sėkmės pranešimą
            showSuccessMessage(submissionData.name, submissionData.surname);
            
            // Išvalome formą
            contactForm.reset();
        });
    }

    // Pagalbinė funkcija (Helper function): Duomenų atvaizdavimas svetainėje
    function displayResults(data, outputElement) {
        if (!outputElement) return;

        // 5 UŽDUOTIS: Vertinimo vidurkio eilutė
        const averageResult = `
            <p><strong>Vidurkis:</strong> ${data.name} ${data.surname}: ${data.averageRating}</p>
        `;

        // 4.iii UŽDUOTIS: Visų duomenų atvaizdavimas
        const allDataHtml = `
            <div class="card p-3 mb-4">
                <h4>Pateikti duomenys (JavaScript)</h4>
                ${averageResult}
                <hr>
                <p><strong>Vardas:</strong> ${data.name}</p>
                <p><strong>Pavardė:</strong> ${data.surname}</p>
                <p><strong>El. paštas:</strong> ${data.email}</p>
                <p><strong>Tel. numeris:</strong> ${data.phone}</p>
                <p><strong>Adresas:</strong> ${data.address}</p>
                <p><strong>Paslaugos greitis (1):</strong> ${data.rating1}</p>
                <p><strong>Komunikacija (2):</strong> ${data.rating2}</p>
                <p><strong>Darbo kokybė (3):</strong> ${data.rating3}</p>
            </div>
        `;

        outputElement.innerHTML = allDataHtml;
    }

    // Pagalbinė funkcija (Helper function): Pop-up pranešimas (6 UŽDUOTIS)
    function showSuccessMessage(name, surname) {
        alert(`Duomenys pateikti sėkmingai!\nAčiū, ${name} ${surname}.`);
    }


    // ********************************************
    // PAPILDYMAS: Slankiklių (Range) reikšmių rodymas (Vizualumas)
    // ********************************************
    
    function updateRatingValue(input, span) {
        if (input && span) {
            span.textContent = input.value;
            input.oninput = () => {
                span.textContent = input.value;
            };
        }
    }

    // Ieškome slankiklių ir jų rodmenų (span elementų)
    updateRatingValue(document.getElementById('rating1'), document.getElementById('rating1_value'));
    updateRatingValue(document.getElementById('rating2'), document.getElementById('rating2_value'));
    updateRatingValue(document.getElementById('rating3'), document.getElementById('rating3_value'));
});

// Pastaba: Įsitikinkite, kad jūsų index.html turi <div id="form-results"> vietoje rezultatams.