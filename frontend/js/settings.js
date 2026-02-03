document.addEventListener('DOMContentLoaded', () => {
   
/*    const returntomain = document.getElementById('returntomain');

    if (returntomain) {
        returntomain.addEventListener('click', (event) => {
            // Verhindert das "Wegspringen" der Seite
            event.preventDefault(); 
            
            console.log("Navigiere zum Dashboard...");
            window.location.href = 'dashboard.html';
        });
    }
        */
    const returntomain = document.getElementById('returnToMain');
        if (returntomain) returntomain.addEventListener('click', () => { window.history.back(); });


    const openEmailBtn = document.getElementById("openEmailButton");
    const emailArea = document.getElementById("first_extraArea");
    
    // KORREKTUR: Hier stand "openPasswordButton", aber im HTML heißt es "openPwdButton"
    const openPasswordBtn = document.getElementById("openPwdButton"); 
    const passwordArea = document.getElementById("second_extraArea");

    // 3. Email-Bereich umschalten
    if (openEmailBtn && emailArea && passwordArea) {
        openEmailBtn.addEventListener("click", () => {
            const isOpen = emailArea.classList.contains("visible");
            emailArea.classList.remove("visible");
            passwordArea.classList.remove("visible");
            if (!isOpen) emailArea.classList.add("visible");
        });
    }

    // 4. Passwort-Bereich umschalten (Funktioniert jetzt, da ID korrekt)
    if (openPasswordBtn && emailArea && passwordArea) {
        openPasswordBtn.addEventListener("click", () => {
            const isOpen = passwordArea.classList.contains("visible");
            emailArea.classList.remove("visible");
            passwordArea.classList.remove("visible");
            if (!isOpen) passwordArea.classList.add("visible");
        });
    }
});