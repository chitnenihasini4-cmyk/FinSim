```javascript
/* =========================================================
   FinSim — What-If Financial Simulator
   Frontend Controller
   ========================================================= */


/* ---------- DOM Elements ---------- */

const scenarioCards = document.querySelectorAll(".scenario-card");

const scenarioInputSection =
    document.getElementById("scenarioInputSection");

const scenarioInputTitle =
    document.getElementById("scenarioInputTitle");

const scenarioInputDescription =
    document.getElementById("scenarioInputDescription");

const scenarioInputs =
    document.getElementById("scenarioInputs");

const simulateButton =
    document.getElementById("simulateButton");

const resetButton =
    document.getElementById("resetButton");

const messageBox =
    document.getElementById("messageBox");

const resultsSection =
    document.getElementById("resultsSection");


/* ---------- Application State ---------- */

let selectedScenario = null;


/* ---------- Scenario Configuration ---------- */

const scenarioConfig = {

    purchase: {
        title: "Big Purchase",
        description:
            "Enter the cost of the purchase and when you plan to make it.",

        fields: [
            {
                id: "purchaseAmount",
                name: "purchase_amount",
                label: "Purchase amount",
                type: "number",
                placeholder: "80,000",
                prefix: "₹",
                min: 0
            },
            {
                id: "purchaseMonth",
                name: "purchase_month",
                label: "Purchase month",
                type: "number",
                placeholder: "3",
                suffix: "month",
                min: 1
            }
        ]
    },


    loan: {
        title: "New Loan",
        description:
            "Enter the loan details to see how the new EMI could affect your finances.",

        fields: [
            {
                id: "loanAmount",
                name: "loan_amount",
                label: "Loan amount",
                type: "number",
                placeholder: "5,00,000",
                prefix: "₹",
                min: 0
            },
            {
                id: "annualInterestRate",
                name: "annual_interest_rate",
                label: "Annual interest rate",
                type: "number",
                placeholder: "8.5",
                suffix: "%",
                min: 0,
                step: "0.01"
            },
            {
                id: "loanTenure",
                name: "loan_tenure_months",
                label: "Loan tenure",
                type: "number",
                placeholder: "60",
                suffix: "months",
                min: 1
            },
            {
                id: "loanStartMonth",
                name: "loan_start_month",
                label: "Loan start month",
                type: "number",
                placeholder: "1",
                suffix: "month",
                min: 1
            }
        ]
    },


    income_change: {
        title: "Income Change",
        description:
            "Explore what happens if your monthly income increases or decreases.",

        fields: [
            {
                id: "incomeChange",
                name: "income_change",
                label: "Monthly income change",
                type: "number",
                placeholder: "10,000",
                prefix: "₹",
                step: "0.01"
            },
            {
                id: "incomeChangeStartMonth",
                name: "start_month",
                label: "Change starts in",
                type: "number",
                placeholder: "1",
                suffix: "month",
                min: 1
            }
        ]
    },


    recurring_expense: {
        title: "Recurring Expense",
        description:
            "See how adding or reducing a monthly expense affects your future savings.",

        fields: [
            {
                id: "additionalExpense",
                name: "additional_expense",
                label: "Monthly expense change",
                type: "number",
                placeholder: "5,000",
                prefix: "₹"
            },
            {
                id: "recurringStartMonth",
                name: "start_month",
                label: "Change starts in",
                type: "number",
                placeholder: "1",
                suffix: "month",
                min: 1
            }
        ]
    },


    emergency: {
        title: "Emergency Expense",
        description:
            "Simulate an unexpected expense and see how it could affect your goal.",

        fields: [
            {
                id: "emergencyAmount",
                name: "emergency_amount",
                label: "Emergency expense",
                type: "number",
                placeholder: "50,000",
                prefix: "₹",
                min: 0
            },
            {
                id: "emergencyMonth",
                name: "emergency_month",
                label: "Emergency occurs in",
                type: "number",
                placeholder: "6",
                suffix: "month",
                min: 1
            }
        ]
    },


    vacation: {
        title: "Vacation",
        description:
            "Enter your vacation cost and timing to see how it affects your savings goal.",

        fields: [
            {
                id: "vacationAmount",
                name: "vacation_amount",
                label: "Vacation expense",
                type: "number",
                placeholder: "40,000",
                prefix: "₹",
                min: 0
            },
            {
                id: "vacationMonth",
                name: "vacation_month",
                label: "Vacation month",
                type: "number",
                placeholder: "6",
                suffix: "month",
                min: 1
            }
        ]
    },


    savings_rate: {
        title: "Savings Rate",
        description:
            "Explore what happens when you change the amount you save every month.",

        fields: [
            {
                id: "savingsRateChange",
                name: "savings_rate_change",
                label: "Savings rate change",
                type: "number",
                placeholder: "10",
                suffix: "%",
                step: "0.1"
            },
            {
                id: "savingsRateStartMonth",
                name: "start_month",
                label: "Change starts in",
                type: "number",
                placeholder: "1",
                suffix: "month",
                min: 1
            }
        ]
    }

};


/* =========================================================
   SCENARIO SELECTION
   ========================================================= */

scenarioCards.forEach((card) => {

    card.addEventListener("click", () => {

        const scenario = card.dataset.scenario;

        selectScenario(scenario);

    });

});


function selectScenario(scenario) {

    if (!scenarioConfig[scenario]) {
        return;
    }

    selectedScenario = scenario;

    /* Remove selection from all cards */

    scenarioCards.forEach((card) => {

        card.classList.remove("selected");

    });


    /* Highlight selected card */

    const selectedCard =
        document.querySelector(
            `.scenario-card[data-scenario="${scenario}"]`
        );

    if (selectedCard) {
        selectedCard.classList.add("selected");
    }


    /* Update heading */

    scenarioInputTitle.textContent =
        scenarioConfig[scenario].title;

    scenarioInputDescription.textContent =
        scenarioConfig[scenario].description;


    /* Generate fields */

    renderScenarioFields(
        scenarioConfig[scenario].fields
    );


    /* Show section */

    scenarioInputSection.classList.remove("hidden");


    /* Scroll gently to inputs */

    setTimeout(() => {

        scenarioInputSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);

}


/* =========================================================
   DYNAMIC SCENARIO FIELDS
   ========================================================= */

function renderScenarioFields(fields) {

    scenarioInputs.innerHTML = "";

    fields.forEach((field) => {

        const group = document.createElement("div");

        group.className = "input-group";


        const label = document.createElement("label");

        label.setAttribute("for", field.id);

        label.textContent = field.label;


        const wrapper = document.createElement("div");

        wrapper.className = "input-wrapper";


        /* Currency prefix */

        if (field.prefix) {

            const prefix =
                document.createElement("span");

            prefix.className = "input-prefix";

            prefix.textContent = field.prefix;

            wrapper.appendChild(prefix);

        }


        /* Input */

        const input =
            document.createElement("input");

        input.type = field.type;

        input.id = field.id;

        input.name = field.name;

        input.placeholder = field.placeholder || "";

        input.required = true;


        if (field.min !== undefined) {
            input.min = field.min;
        }

        if (field.step !== undefined) {
            input.step = field.step;
        }


        wrapper.appendChild(input);


        /* Suffix */

        if (field.suffix) {

            const suffix =
                document.createElement("span");

            suffix.className = "input-suffix";

            suffix.textContent = field.suffix;

            wrapper.appendChild(suffix);

        }


        group.appendChild(label);

        group.appendChild(wrapper);

        scenarioInputs.appendChild(group);

    });

}


/* =========================================================
   VALIDATION
   ========================================================= */

function validateBaseInputs() {

    const requiredBaseInputs = [

        "monthlyIncome",
        "currentSavings",
        "goalAmount",
        "goalDeadline",
        "simulationMonths"

    ];


    for (const id of requiredBaseInputs) {

        const input = document.getElementById(id);

        if (!input || input.value === "") {

            showMessage(
                "Please fill in all the required financial and goal details.",
                "error"
            );

            if (input) {
                input.focus();
            }

            return false;
        }


        if (Number(input.value) < 0) {

            showMessage(
                "Financial values cannot be negative.",
                "error"
            );

            input.focus();

            return false;
        }

    }


    return true;

}


function validateScenarioInputs() {

    if (!selectedScenario) {

        showMessage(
            "Please choose a What-If scenario first.",
            "error"
        );

        return false;

    }


    const fields =
        scenarioConfig[selectedScenario].fields;


    for (const field of fields) {

        const input =
            document.getElementById(field.id);


        if (!input || input.value === "") {

            showMessage(
                `Please enter ${field.label.toLowerCase()}.`,
                "error"
            );

            if (input) {
                input.focus();
            }

            return false;

        }


        if (
            field.min !== undefined &&
            Number(input.value) < Number(field.min)
        ) {

            showMessage(
                `${field.label} must be at least ${field.min}.`,
                "error"
            );

            input.focus();

            return false;

        }

    }


    return true;

}


/* =========================================================
   COLLECT FINANCIAL DATA
   ========================================================= */

function getNumber(id, defaultValue = 0) {

    const input =
        document.getElementById(id);

    if (!input || input.value === "") {
        return defaultValue;
    }

    return Number(input.value);

}


function collectFinancialData() {

    return {

        current_saved:
            getNumber("currentSavings"),

        monthly_income:
            getNumber("monthlyIncome"),

        other_income:
            getNumber("otherIncome"),

        rent:
            getNumber("rent"),

        food:
            getNumber("food"),

        transport:
            getNumber("transport"),

        utilities:
            getNumber("utilities"),

        other_expenses:
            getNumber("otherExpenses"),

        existing_emi:
            getNumber("existingEmi"),

        goal_amount:
            getNumber("goalAmount"),

        goal_deadline_month:
            getNumber("goalDeadline"),

        simulation_months:
            getNumber("simulationMonths")

    };

}


/* =========================================================
   COLLECT SCENARIO DATA
   ========================================================= */

function collectScenarioInputs() {

    const scenario =
        scenarioConfig[selectedScenario];


    const scenarioInputsObject = {};


    scenario.fields.forEach((field) => {

        const input =
            document.getElementById(field.id);


        if (!input) {
            return;
        }


        scenarioInputsObject[field.name] =
            Number(input.value);

    });


    return scenarioInputsObject;

}


/* =========================================================
   BUILD SIMULATION REQUEST
   ========================================================= */

function buildSimulationRequest() {

    const financialData =
        collectFinancialData();

    const scenarioInputsObject =
        collectScenarioInputs();


    return {

        scenario: selectedScenario,

        monthly_income:
            financialData.monthly_income,

        other_income:
            financialData.other_income,

        rent:
            financialData.rent,

        food:
            financialData.food,

        transport:
            financialData.transport,

        utilities:
            financialData.utilities,

        other_expenses:
            financialData.other_expenses,

        existing_emi:
            financialData.existing_emi,

        current_savings:
            financialData.current_saved,

        simulation_months:
            financialData.simulation_months,

        goal_amount:
            financialData.goal_amount,

        goal_deadline_month:
            financialData.goal_deadline_month,

        scenario_inputs:
            scenarioInputsObject

    };

}


/* =========================================================
   SIMULATE
   ========================================================= */

simulateButton.addEventListener(
    "click",
    async () => {

        clearMessage();


        /* Validate */

        if (!validateBaseInputs()) {
            return;
        }

        if (!validateScenarioInputs()) {
            return;
        }


        /* Build request */

        const simulationRequest =
            buildSimulationRequest();


        /*
         * IMPORTANT:
         *
         * This object is what we will eventually
         * send to FastAPI.
         *
         * For now we display a prototype result.
         */

        console.log(
            "FinSim simulation request:",
            simulationRequest
        );


        showMessage(
            "Simulation inputs are ready. Backend connection will be added next.",
            "success"
        );


        /*
         * Temporary frontend-only result.
         *
         * This is NOT the real financial model.
         * It only allows us to test the UI before
         * connecting FastAPI.
         */

        displayPrototypeResult(
            simulationRequest
        );

    }
);


/* =========================================================
   PROTOTYPE RESULT
   ========================================================= */

function displayPrototypeResult(request) {

    const income =
        request.monthly_income +
        request.other_income;


    const expenses =
        request.rent +
        request.food +
        request.transport +
        request.utilities +
        request.other_expenses +
        request.existing_emi;


    const monthlySurplus =
        income - expenses;


    const months =
        request.simulation_months;


    let projectedSavings =
        request.current_savings +
        (monthlySurplus * months);


    /*
     * Apply a very simple scenario adjustment
     * ONLY for visual testing.
     *
     * This will be removed when the real
     * financial model is connected.
     */

    if (request.scenario === "purchase") {

        projectedSavings -=
            request.scenario_inputs.purchase_amount;

    }


    if (request.scenario === "emergency") {

        projectedSavings -=
            request.scenario_inputs.emergency_amount;

    }


    if (request.scenario === "vacation") {

        projectedSavings -=
            request.scenario_inputs.vacation_amount;

    }


    if (request.scenario === "recurring_expense") {

        projectedSavings -=
            request.scenario_inputs.additional_expense *
            months;

    }


    if (request.scenario === "income_change") {

        projectedSavings +=
            request.scenario_inputs.income_change *
            months;

    }


    if (request.scenario === "loan") {

        /*
         * This is deliberately NOT calculating EMI.
         * The actual loan calculation belongs to
         * your existing financial model.
         */

        projectedSavings -= 0;

    }


    if (request.scenario === "savings_rate") {

        const rateChange =
            request.scenario_inputs.savings_rate_change;

        projectedSavings +=
            monthlySurplus *
            (rateChange / 100) *
            months;

    }


    const goalReached =
        projectedSavings >= request.goal_amount;


    /* Update results */

    const goalStatus =
        document.getElementById("goalStatus");

    const goalStatusDescription =
        document.getElementById(
            "goalStatusDescription"
        );

    const projectedSavingsElement =
        document.getElementById(
            "projectedSavings"
        );

    const goalImpact =
        document.getElementById(
            "goalImpact"
        );

    const goalImpactDescription =
        document.getElementById(
            "goalImpactDescription"
        );


    goalStatus.textContent =
        goalReached
            ? "On track"
            : "Needs attention";


    goalStatusDescription.textContent =
        goalReached
            ? "Your projected savings reach the selected goal."
            : "Your projected savings do not reach the selected goal within the current simulation period.";


    projectedSavingsElement.textContent =
        formatCurrency(projectedSavings);


    goalImpact.textContent =
        goalReached
            ? "Goal reachable"
            : "Goal at risk";


    goalImpactDescription.textContent =
        goalReached
            ? "Based on the temporary frontend preview."
            : "Try adjusting your scenario or financial inputs.";


    resultsSection.classList.remove("hidden");


    setTimeout(() => {

        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* =========================================================
   CURRENCY FORMAT
   ========================================================= */

function formatCurrency(value) {

    if (!Number.isFinite(value)) {
        return "₹0";
    }


    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(value);

}


/* =========================================================
   MESSAGES
   ========================================================= */

function showMessage(message, type) {

    messageBox.textContent = message;

    messageBox.className =
        `message-box ${type}`;

}


function clearMessage() {

    messageBox.textContent = "";

    messageBox.className =
        "message-box hidden";

}


/* =========================================================
   RESET
   ========================================================= */

resetButton.addEventListener(
    "click",
    () => {

        /* Clear every input */

        const inputs =
            document.querySelectorAll("input");


        inputs.forEach((input) => {

            if (input.id === "simulationMonths") {

                input.value = 36;

            } else {

                input.value = "";

            }

        });


        /* Clear selected scenario */

        selectedScenario = null;


        scenarioCards.forEach((card) => {

            card.classList.remove("selected");

        });


        /* Hide scenario inputs */

        scenarioInputSection.classList.add("hidden");


        /* Hide results */

        resultsSection.classList.add("hidden");


        /* Clear messages */

        clearMessage();


        /* Scroll to top */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

console.log(
    "FinSim frontend loaded successfully."
);
```
