document.addEventListener('DOMContentLoaded', () => {
    const financialForm = document.getElementById('financial-form');
    const newExpenseForm = document.getElementById('new-expense-form');
    const expenseList = document.getElementById('expense-list');
    const savingsForm = document.getElementById('savings-form');
    const savingsResult = document.getElementById('savings-result');
    const savingsAlert = document.getElementById('savings-alert');
    const currentDateElement = document.getElementById('current-date');
    const summaryCards = document.querySelector('.summary-cards');

    let totalIncome = 5000;
    let totalExpenses = 2345;
    let totalSaved = 2655;
    let savingsGoal = 0;
    let savingsPeriod = 0;

    function updateCurrentDate() {
        const currentDate = new Date();
        currentDateElement.textContent = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    }

    // Update date every second
    setInterval(updateCurrentDate, 1000);

    // Financial calculation
    financialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        totalIncome = parseFloat(document.getElementById('monthly-income').value) || totalIncome;
        totalExpenses = ['rent', 'utility', 'insurance', 'transportation', 'groceries', 'internet', 'phone', 'council-tax']
            .reduce((sum, id) => sum + (parseFloat(document.getElementById(id).value) || 0), 0);

        totalSaved = totalIncome - totalExpenses;

        updateFinancialSummary();
        checkSavingsGoal();

        // Scroll to summary cards
        summaryCards.scrollIntoView({ behavior: 'smooth' });
    });

    // Add new expense
    newExpenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const expenseName = document.getElementById('expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('expense-amount').value);

        if (expenseName && expenseAmount) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${expenseName}</span>
                <span>£${expenseAmount.toFixed(2)}</span>
            `;
            expenseList.appendChild(li);

            totalExpenses += expenseAmount;
            totalSaved = totalIncome - totalExpenses;

            updateFinancialSummary();
            checkSavingsGoal();

            newExpenseForm.reset();
        }
    });

    // Set savings goal
    savingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        savingsGoal = parseFloat(document.getElementById('savings-goal').value);
        savingsPeriod = parseInt(document.getElementById('savings-period').value);

        if (savingsGoal && savingsPeriod) {
            const monthlySavingsGoal = savingsGoal / savingsPeriod;
            savingsResult.textContent = `To reach your goal of £${savingsGoal} in ${savingsPeriod} months, you need to save £${monthlySavingsGoal.toFixed(2)} per month.`;

            updateFinancialSummary();
            checkSavingsGoal();
        }
    });

    function updateFinancialSummary() {
        document.querySelector('.income-card .amount').textContent = `£${totalIncome.toFixed(2)}`;
        document.querySelector('.expenses-card .amount').textContent = `£${totalExpenses.toFixed(2)}`;
        document.querySelector('.savings-card .amount').textContent = `£${totalSaved.toFixed(2)}`;
        document.querySelector('.savings-card .savings-goal').textContent = savingsGoal ? `Goal: £${savingsGoal} in ${savingsPeriod} months` : '';
        
        // Update the savings plan card
        const goalCard = document.querySelector('.goal-card');
        if (goalCard) {
            goalCard.querySelector('.amount').textContent = `£${savingsGoal.toFixed(2)}`;
            goalCard.querySelector('.plan').textContent = `${savingsPeriod} MONTHS PLAN`;
            const monthlyGoal = savingsGoal / savingsPeriod;
            goalCard.querySelector('.monthly-goal').textContent = `£${monthlyGoal.toFixed(2)} per month to achieve goal`;
        }
    }

    function checkSavingsGoal() {
        if (savingsGoal > 0 && savingsPeriod > 0) {
            const monthlySavingsGoal = savingsGoal / savingsPeriod;
            if (totalSaved >= monthlySavingsGoal) {
                savingsAlert.textContent = "You're currently meeting your savings goal. Great job!";
                savingsAlert.style.backgroundColor = "#4caf50";
            } else {
                savingsAlert.textContent = "You're currently not meeting your savings goal. Try to reduce expenses or increase income.";
                savingsAlert.style.backgroundColor = "#f44336";
            }
            savingsAlert.style.display = "block";
        }
    }

    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const mainPage = document.getElementById('main-page');
    const savingsPage = document.getElementById('savings-page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const page = link.getAttribute('data-page');
            if (page === 'main') {
                mainPage.style.display = 'block';
                savingsPage.style.display = 'none';
            } else {
                mainPage.style.display = 'none';
                savingsPage.style.display = 'block';
            }
        });
    });

    // Initialize financial summary
    updateFinancialSummary();

    // Animate scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    setInterval(() => {
        scrollIndicator.style.transform = 'translateY(10px)';
        setTimeout(() => {
            scrollIndicator.style.transform = 'translateY(0)';
        }, 500);
    }, 1000);

    // Add smooth scrolling for start planning button
    document.querySelector('.start-planning-btn').addEventListener('click', () => {
        document.querySelector('.financial-input').scrollIntoView({ behavior: 'smooth' });
    });

    // Add responsiveness to cards
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.contentBoxSize) {
                const cards = entry.target.querySelectorAll('.card');
                if (entry.contentBoxSize[0].inlineSize < 600) {
                    cards.forEach(card => card.style.flex = '1 0 100%');
                } else {
                    cards.forEach(card => card.style.flex = '1');
                }
            }
        }
    });

    resizeObserver.observe(document.querySelector('.summary-cards'));
});