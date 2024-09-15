document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/crypto');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const tableBody = document.getElementById('crypto-table-body');
        data.forEach(crypto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${crypto.name}</td>
                <td>₹${crypto.last}</td>
                <td>₹${crypto.buy}</td>
                <td>₹${crypto.sell}</td>
                <td>${crypto.volume}</td>
                <td>${crypto.baseUnit}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching crypto data:', error);
    }
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const crypto = link.getAttribute('data-crypto');
            dropdownButton.textContent = crypto; 
            dropdownButton.appendChild(document.createTextNode(' '));
        });
    });
    const connectTelegramBtn = document.getElementById('connect-telegram');
    const modal = document.getElementById('telegram-modal');
    const closeModal = document.querySelector('.modal .close');

    connectTelegramBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
