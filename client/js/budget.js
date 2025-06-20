function initBudgetCalculators() {
    console.log('=== INITIALIZING BUDGET CALCULATORS ===');

    // Check for elements
    const projectCalc = document.getElementById('calculate-project');
    const financeCalc = document.getElementById('calculate-finance');
    const budgetPage = document.querySelector('.budget-page');

    console.log('Project calc button:', projectCalc ? 'FOUND' : 'NOT FOUND');
    console.log('Finance calc button:', financeCalc ? 'FOUND' : 'NOT FOUND');
    console.log('Budget page:', budgetPage ? 'FOUND' : 'NOT FOUND');

    // If no elements found - exit
    if (!projectCalc && !financeCalc && !budgetPage) {
        console.log('No budget elements found, skipping initialization');
        return;
    }

    console.log('Budget elements found, setting up calculators...');
    setupCalculators();
}

function setupCalculators() {
    setupProjectCalculator();
    setupFinanceCalculator();
    setupResetButton();
    console.log('All calculators set up');
}

function setupProjectCalculator() {
    console.log('Setting up project calculator...');

    const projectTypeSelect = document.getElementById('project-type');
    const hourlyRateInput = document.getElementById('hourly-rate');
    const calculateBtn = document.getElementById('calculate-project');

    if (!calculateBtn) {
        console.log('Calculate project button not found');
        return;
    }

    // Autofill rate when project type changes
    if (projectTypeSelect) {
        projectTypeSelect.addEventListener('change', function() {
            console.log('Project type changed:', this.value);
            const selectedOption = this.options[this.selectedIndex];
            const rate = selectedOption.getAttribute('data-rate');

            if (rate && rate !== '0' && hourlyRateInput) {
                hourlyRateInput.value = rate;
                console.log('Rate auto-filled:', rate);
            }
        });
    }

    // Calculate button click
    calculateBtn.addEventListener('click', function() {
        console.log('Calculate project clicked');
        calculateProjectCost();
    });

    console.log('Project calculator ready');
}

function calculateProjectCost() {
    console.log('Calculating project cost...');

    const projectType = document.getElementById('project-type').value;
    const hourlyRate = parseFloat(document.getElementById('hourly-rate').value) || 0;
    const projectHours = parseFloat(document.getElementById('project-hours').value) || 0;
    const complexityMultiplier = parseFloat(document.getElementById('complexity-multiplier').value) || 1;

    console.log('Project data:', { projectType, hourlyRate, projectHours, complexityMultiplier });

    if (!projectType || hourlyRate <= 0 || projectHours <= 0) {
        console.log('Invalid project data');
        alert('Please fill in all project fields with valid values');
        return;
    }

    const baseCost = hourlyRate * projectHours;
    const complexityAdjustment = baseCost * (complexityMultiplier - 1);
    const totalCost = baseCost + complexityAdjustment;

    console.log('Calculated:', { baseCost, complexityAdjustment, totalCost });

    // Display results
    const baseCostElement = document.getElementById('base-cost');
    const complexityElement = document.getElementById('complexity-adjustment');
    const totalElement = document.getElementById('total-project-cost');

    if (baseCostElement) baseCostElement.textContent = formatCurrency(baseCost);
    if (complexityElement) complexityElement.textContent = formatCurrency(complexityAdjustment);
    if (totalElement) totalElement.textContent = formatCurrency(totalCost);

    console.log('Project results displayed');
}

function setupFinanceCalculator() {
    console.log('Setting up finance calculator...');

    const calculateBtn = document.getElementById('calculate-finance');

    if (!calculateBtn) {
        console.log('Calculate finance button not found');
        return;
    }

    calculateBtn.addEventListener('click', function() {
        console.log('Calculate finance clicked');
        calculateFinanceBudget();
    });

    console.log('Finance calculator ready');
}

function calculateFinanceBudget() {
    console.log('Calculating finance budget...');

    // Get income
    const monthlySalary = parseFloat(document.getElementById('monthly-salary').value) || 0;
    const additionalIncome = parseFloat(document.getElementById('additional-income').value) || 0;
    const totalIncome = monthlySalary + additionalIncome;

    // Get expenses
    const housingCost = parseFloat(document.getElementById('housing-cost').value) || 0;
    const foodCost = parseFloat(document.getElementById('food-cost').value) || 0;
    const transportCost = parseFloat(document.getElementById('transport-cost').value) || 0;
    const utilitiesCost = parseFloat(document.getElementById('utilities-cost').value) || 0;
    const otherExpenses = parseFloat(document.getElementById('other-expenses').value) || 0;

    const totalExpenses = housingCost + foodCost + transportCost + utilitiesCost + otherExpenses;

    // Get savings
    const savingsPercentage = parseFloat(document.getElementById('savings-percentage').value) || 20;
    const targetSavings = totalIncome * (savingsPercentage / 100);

    const remainingAmount = totalIncome - totalExpenses - targetSavings;

    console.log('Finance data:', { totalIncome, totalExpenses, targetSavings, remainingAmount });

    if (totalIncome <= 0) {
        console.log('No income entered');
        alert('Please enter your monthly salary');
        return;
    }

    // Display summary
    const totalIncomeElement = document.getElementById('total-income');
    const totalExpensesElement = document.getElementById('total-expenses');
    const targetSavingsElement = document.getElementById('target-savings');
    const remainingElement = document.getElementById('remaining-amount');

    if (totalIncomeElement) totalIncomeElement.textContent = formatCurrency(totalIncome);
    if (totalExpensesElement) totalExpensesElement.textContent = formatCurrency(totalExpenses);
    if (targetSavingsElement) targetSavingsElement.textContent = formatCurrency(targetSavings);
    if (remainingElement) {
        remainingElement.textContent = formatCurrency(remainingAmount);

        if (remainingAmount < 0) {
            remainingElement.style.color = '#f56565';
        } else if (remainingAmount > totalIncome * 0.1) {
            remainingElement.style.color = '#48bb78';
        } else {
            remainingElement.style.color = '#ed8936';
        }
    }

    // Calculate and display percentages
    if (totalIncome > 0) {
        const housingPercent = ((housingCost / totalIncome) * 100).toFixed(1);
        const foodPercent = ((foodCost / totalIncome) * 100).toFixed(1);
        const transportPercent = ((transportCost / totalIncome) * 100).toFixed(1);
        const utilitiesPercent = ((utilitiesCost / totalIncome) * 100).toFixed(1);
        const otherPercent = ((otherExpenses / totalIncome) * 100).toFixed(1);

        const housingPercentElement = document.getElementById('housing-percentage');
        const foodPercentElement = document.getElementById('food-percentage');
        const transportPercentElement = document.getElementById('transport-percentage');
        const utilitiesPercentElement = document.getElementById('utilities-percentage');
        const otherPercentElement = document.getElementById('other-percentage');

        if (housingPercentElement) housingPercentElement.textContent = housingPercent + '%';
        if (foodPercentElement) foodPercentElement.textContent = foodPercent + '%';
        if (transportPercentElement) transportPercentElement.textContent = transportPercent + '%';
        if (utilitiesPercentElement) utilitiesPercentElement.textContent = utilitiesPercent + '%';
        if (otherPercentElement) otherPercentElement.textContent = otherPercent + '%';
    }

    // Generate advice
    generateAdvice(totalIncome, totalExpenses, targetSavings, remainingAmount, housingCost);

    console.log('Finance results displayed');
}

function generateAdvice(totalIncome, totalExpenses, targetSavings, remainingAmount, housingCost) {
    const adviceContainer = document.getElementById('financial-advice');
    if (!adviceContainer) return;

    let advice = '<h4><i class="fas fa-lightbulb"></i> Financial Advice</h4>';

    const housingPercentage = (housingCost / totalIncome) * 100;
    const expenseRatio = (totalExpenses / totalIncome) * 100;

    // Housing advice
    if (housingPercentage > 30) {
        advice += '<div class="advice-item" style="color: #ed8936;">Housing costs are high (>30% of income). Consider reducing housing expenses.</div>';
    } else {
        advice += '<div class="advice-item" style="color: #48bb78;">Good housing cost management!</div>';
    }

    // Overall expense advice
    if (expenseRatio > 80) {
        advice += '<div class="advice-item" style="color: #f56565;">Expenses are very high (>80% of income). Review your spending.</div>';
    } else if (expenseRatio < 60) {
        advice += '<div class="advice-item" style="color: #48bb78;">Excellent expense control!</div>';
    }

    // Remaining money advice
    if (remainingAmount < 0) {
        advice += '<div class="advice-item" style="color: #f56565;">You are spending more than you earn!</div>';
    } else if (remainingAmount > totalIncome * 0.1) {
        advice += '<div class="advice-item" style="color: #48bb78;">You have good financial breathing room.</div>';
    }

    // Emergency fund advice
    const emergencyFund = totalExpenses * 6;
    advice += '<div class="advice-item">Recommended emergency fund: ' + formatCurrency(emergencyFund) + ' (6 months expenses).</div>';

    adviceContainer.innerHTML = advice;
}

// Reset button setup - ИСПРАВЛЕННАЯ ВЕРСИЯ
function setupResetButton() {
    const resetBtn = document.getElementById('reset-all');
    if (!resetBtn) {
        console.log('Reset button not found');
        return;
    }

    if (resetBtn.hasAttribute('data-listener-attached')) {
        console.log('Reset button already has listener attached');
        return;
    }

    resetBtn.addEventListener('click', function() {
        console.log('Reset clicked');
        if (confirm('Reset all calculators?')) {
            resetAllCalculators();
        }
    });

    resetBtn.setAttribute('data-listener-attached', 'true');

    console.log('Reset button listener attached');
}

function resetAllCalculators() {
    console.log('Resetting all calculators...');

    // Reset project calculator
    const projectInputs = ['project-type', 'hourly-rate', 'project-hours'];
    projectInputs.forEach(function(id) {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });

    const complexitySelect = document.getElementById('complexity-multiplier');
    if (complexitySelect) complexitySelect.value = '1';

    // Clear project results
    const projectResults = ['base-cost', 'complexity-adjustment', 'total-project-cost'];
    projectResults.forEach(function(id) {
        const element = document.getElementById(id);
        if (element) element.textContent = '$0.00';
    });

    // Reset finance calculator
    const financeInputs = [
        'monthly-salary', 'additional-income', 'housing-cost',
        'food-cost', 'transport-cost', 'utilities-cost', 'other-expenses'
    ];
    financeInputs.forEach(function(id) {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });

    const savingsInput = document.getElementById('savings-percentage');
    if (savingsInput) savingsInput.value = '20';

    // Clear finance results
    const financeResults = ['total-income', 'total-expenses', 'target-savings', 'remaining-amount'];
    financeResults.forEach(function(id) {
        const element = document.getElementById(id);
        if (element) element.textContent = '$0.00';
    });

    const percentages = ['housing-percentage', 'food-percentage', 'transport-percentage', 'utilities-percentage', 'other-percentage'];
    percentages.forEach(function(id) {
        const element = document.getElementById(id);
        if (element) element.textContent = '0%';
    });

    const adviceContainer = document.getElementById('financial-advice');
    if (adviceContainer) adviceContainer.innerHTML = '';

    console.log('All calculators reset');
    alert('All calculators have been reset!');
}

// Utility function
function formatCurrency(amount) {
    return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Multiple initialization points for dynamic content
window.addEventListener('load', function() {
    console.log('Window loaded - checking for budget calculators...');
    initBudgetCalculators();
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready - checking for budget calculators...');
    initBudgetCalculators();
});

document.body.addEventListener('htmx:afterSwap', function(evt) {
    console.log('HTMX afterSwap - checking for budget calculators...');
    setTimeout(function() {
        initBudgetCalculators();
    }, 100);
});

document.body.addEventListener('htmx:afterSettle', function(evt) {
    console.log('HTMX afterSettle - checking for budget calculators...');
    setTimeout(function() {
        initBudgetCalculators();
    }, 200);
});

setTimeout(function() {
    console.log('Delayed check - looking for budget calculators...');
    initBudgetCalculators();
}, 1000);

setTimeout(function() {
    console.log('Final delayed check - looking for budget calculators...');
    initBudgetCalculators();
}, 3000);

window.initBudgetCalculators = initBudgetCalculators;

console.log('Budget Calculator JavaScript loaded successfully!');
