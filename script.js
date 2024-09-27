

// Προσθήκη νέας υπενθύμισης
document.getElementById('reminderForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const bill = document.getElementById('bill').value;
    const dueDate = document.getElementById('date').value;

    if (bill && dueDate) {
        const reminderList = document.getElementById('reminderList');
        const listItem = document.createElement('li');
        listItem.textContent = `${bill} - Ημερομηνία Λήξης: ${new Date(dueDate).toLocaleDateString()}`;

        // Δημιουργία κουμπιού διαγραφής
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Διαγραφή";
        deleteButton.className = "delete";
        deleteButton.onclick = function() {
            reminderList.removeChild(listItem); // Διαγραφή υπενθύμισης
            removeFromLocalStorage(bill, dueDate); // Αφαίρεση από την τοπική αποθήκευση
        };

        listItem.appendChild(deleteButton);
        reminderList.appendChild(listItem);

        // Αποθήκευση στην τοπική αποθήκευση
        saveToLocalStorage(bill, dueDate);

        // Καθαρισμός πεδίων εισαγωγής
        document.getElementById('bill').value = '';
        document.getElementById('date').value = '';
    }
});

// Αποθήκευση των υπενθυμίσεων στην τοπική αποθήκευση του browser
function saveToLocalStorage(bill, dueDate) {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.push({ bill, dueDate });
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

// Αφαίρεση από την τοπική αποθήκευση
function removeFromLocalStorage(bill, dueDate) {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const updatedReminders = reminders.filter(reminder => reminder.bill !== bill || reminder.dueDate !== dueDate);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
}

// Ανάκτηση των υπενθυμίσεων κατά την εκκίνηση
function loadReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    reminders.forEach(reminder => {
        const reminderList = document.getElementById('reminderList');
        const listItem = document.createElement('li');
        listItem.textContent = `${reminder.bill} - Ημερομηνία Λήξης: ${new Date(reminder.dueDate).toLocaleDateString()}`;
        
        // Δημιουργία κουμπιού διαγραφής
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Διαγραφή";
        deleteButton.className = "delete";
        deleteButton.onclick = function() {
            reminderList.removeChild(listItem); // Διαγραφή υπενθύμισης
            removeFromLocalStorage(reminder.bill, reminder.dueDate); // Αφαίρεση από την τοπική αποθήκευση
        };

        listItem.appendChild(deleteButton);
        reminderList.appendChild(listItem);
    });
}

window.onload = loadReminders;

// Έλεγχος υπενθυμίσεων καθημερινά
function checkReminders() {
    const reminderItems = document.querySelectorAll('#reminderList li');
    reminderItems.forEach(item => {
        const dueDateText = item.textContent.split(' - Ημερομηνία Λήξης: ')[1];
        const dueDate = new Date(dueDateText);
        const currentDate = new Date();
        const timeDiff = dueDate - currentDate;

        // Ειδοποίηση αν απομένουν λιγότερες από 3 ημέρες
        if (timeDiff <= 3 * 24 * 60 * 60 * 1000 && timeDiff > 0) {
            alert(`Υπενθύμιση: Η πληρωμή του ${item.textContent.split(' - ')[0]} λήγει σύντομα!`);
        }
    });
}

// Έλεγχος καθημερινά
setInterval(checkReminders, 24 * 60 * 60 * 1000); // Κάθε 24 ώρες