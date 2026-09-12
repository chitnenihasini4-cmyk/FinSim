/* =========================================================
   FinSim — What-If Financial Simulator
   Frontend Controller
   Connected to FastAPI + Financial Model
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const API_URL = "http://127.0.0.1:8000/api/simulate";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const scenarioCards =
    document.querySelectorAll(".scenario-card");

const scenarioInputSection =
    document.getElementById("scenarioInputSection");

const scenarioInputTitle =
    document.getElementById("scenarioInputTitle");

const scenarioInputDescription =
    document.getElementById("scenarioInputDescription");

const scenarioInputs =
    document.getElementById("scenarioInputs");

const selectedScenarioIcon =
    document.getElementById("selectedScenarioIcon");

const simulateButton =
    document.getElementById("simulateButton");

const resetButton =
    document.getElementById("resetButton");

const messageBox =
    document.getElementById("messageBox");

const resultsSection =
    document.getElementById("resultsSection");

const simulationForm =
    document.getElementById("simulationForm");


/* =========================================================
   APPLICATION STATE
   ========================================================= */

let selectedScenario = "purchase";


/* =========================================================
   SCENARIO CONFIGURATION
   ========================================================= */

const scenarioConfig = {

    purchase: {
        title: "Big Purchase",

        description:
            "Enter the cost of the purchase and when you plan to make it.",

        icon: "🛍️",

        fields: [
            {
                id: "purchaseAmount",
                name: "purchase_amount",
                label: "Purchase amount",
                type: "number",
                placeholder: "80000",
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

        icon: "🏦",

        fields: [
            {
                id: "loanAmount",
                name: "loan_amount",
                label: "Loan amount",
                type: "number",
                placeholder: "500000",
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

        icon: "💼",

        fields: [
            {
                id: "incomeChange",
                name: "income_change",
                label: "Income change",
                type: "number",
                placeholder: "10",
                suffix: "%",
                step: "0.1"
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

        icon: "🔄",

        fields: [
            {
                id: "additionalExpense",
                name: "additional_expense",
                label: "Monthly expense change",
                type: "number",
                placeholder: "5000",
                prefix: "₹",
                step: "0.01"
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

        icon: "🚨",

        fields: [
            {
                id: "emergencyAmount",
                name: "emergency_amount",
                label: "Emergency expense",
                type: "number",
                placeholder: "50000",
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


    /*
 * Vacation and Savings Rate are now connected
 * to the backend financial model.
 */

    vacation: {
        title: "Vacation",

       description:
        "Enter the vacation cost and when you plan to take it.", 

        fields: [
            {
                id: "vacationAmount",
                name: "vacation_amount",
                label: "Vacation expense",
                type: "number",
                placeholder: "40000",
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
        ],

    },


    savings_rate: {
        title: "Savings Rate",

        description:
        "Explore how changing the portion of your income you save could affect your future savings.",

        icon: "📈",

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
        ],

    }
};


/* =========================================================
   SCENARIO SELECTION
   ========================================================= */

scenarioCards.forEach((card) => {

    card.addEventListener("click", () => {

        const scenario =
            card.dataset.scenario;

        selectScenario(scenario);

    });

});


function selectScenario(scenario) {

    if (!scenarioConfig[scenario]) {
        return;
    }

    selectedScenario = scenario;


    /* Remove selection */

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


    /* Update icon */

    if (selectedScenarioIcon) {

        selectedScenarioIcon.textContent =
            scenarioConfig[scenario].icon;

    }


    /* Update heading */

    scenarioInputTitle.textContent =
        scenarioConfig[scenario].title;

    scenarioInputDescription.textContent =
        scenarioConfig[scenario].description;


    /* Generate inputs */

    renderScenarioFields(
        scenarioConfig[scenario].fields
    );


    /* Show panel */

    scenarioInputSection.classList.remove("hidden");


    /* Hide old results */

    resultsSection.classList.add("hidden");

    clearMessage();

}


/* =========================================================
   DYNAMIC SCENARIO FIELDS
   ========================================================= */

function renderScenarioFields(fields) {

    scenarioInputs.innerHTML = "";

    fields.forEach((field) => {

        const group =
            document.createElement("div");

        group.className = "input-group";


        const label =
            document.createElement("label");

        label.setAttribute(
            "for",
            field.id
        );

        label.textContent =
            field.label;


        const wrapper =
            document.createElement("div");

        wrapper.className =
            "input-wrapper";


        /* Prefix */

        if (field.prefix) {

            const prefix =
                document.createElement("span");

            prefix.className =
                "input-prefix";

            prefix.textContent =
                field.prefix;

            wrapper.appendChild(prefix);

        }


        /* Input */

        const input =
            document.createElement("input");

        input.type =
            field.type;

        input.id =
            field.id;

        input.name =
            field.name;

        input.placeholder =
            field.placeholder || "";

        input.required =
            true;


        if (field.min !== undefined) {

            input.min =
                field.min;

        }


        if (field.step !== undefined) {

            input.step =
                field.step;

        }


        wrapper.appendChild(input);


        /* Suffix */

        if (field.suffix) {

            const suffix =
                document.createElement("span");

            suffix.className =
                "input-suffix";

            suffix.textContent =
                field.suffix;

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

        const input =
            document.getElementById(id);


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


    const config =
        scenarioConfig[selectedScenario];


    for (const field of config.fields) {

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
   COLLECT DATA
   ========================================================= */

function getNumber(
    id,
    defaultValue = 0
) {

    const input =
        document.getElementById(id);


    if (!input || input.value === "") {

        return defaultValue;

    }


    return Number(input.value);

}


function collectFinancialData() {

    return {

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

        current_savings:
            getNumber("currentSavings"),

        simulation_months:
            getNumber("simulationMonths"),

        goal_amount:
            getNumber("goalAmount"),

        goal_deadline_month:
            getNumber("goalDeadline")

    };

}


function collectScenarioInputs() {

    const config =
        scenarioConfig[selectedScenario];

    const values = {};


    config.fields.forEach((field) => {

        const input =
            document.getElementById(field.id);


        if (!input) {
            return;
        }


        values[field.name] =
            Number(input.value);

    });


    /*
     * IMPORTANT:
     *
     * The frontend uses income_change,
     * while the original financial model expects
     * income_change_percentage.
     *
     * We translate it here.
     */

    if (
        selectedScenario === "income_change"
    ) {

        values.income_change_percentage =
            values.income_change;

        delete values.income_change;

    }


    return values;

}


/* =========================================================
   BUILD API REQUEST
   ========================================================= */

function buildSimulationRequest() {

    const financial =
        collectFinancialData();

    const scenarioInputs =
        collectScenarioInputs();


    return {

        scenario:
            selectedScenario,

        monthly_income:
            financial.monthly_income,

        other_income:
            financial.other_income,

        rent:
            financial.rent,

        food:
            financial.food,

        transport:
            financial.transport,

        utilities:
            financial.utilities,

        other_expenses:
            financial.other_expenses,

        existing_emi:
            financial.existing_emi,

        current_savings:
            financial.current_savings,

        simulation_months:
            financial.simulation_months,

        goal_amount:
            financial.goal_amount,

        goal_deadline_month:
            financial.goal_deadline_month,

        scenario_inputs:
            scenarioInputs

    };

}


/* =========================================================
   CALL FASTAPI
   ========================================================= */

async function runSimulation() {

    clearMessage();


    /* Validate */

    if (!validateBaseInputs()) {
        return;
    }


    if (!validateScenarioInputs()) {
        return;
    }


    /* Check backend-supported scenario */

    if (
        scenarioConfig[selectedScenario]
            .backendSupported === false
    ) {

        showMessage(
            "This scenario is visible in the prototype, but its financial-model logic is not connected yet. We will add it next.",
            "error"
        );

        return;

    }


    /* Build request */

    const request =
        buildSimulationRequest();


    console.log(
        "Sending simulation request:",
        request
    );


    /* Loading state */

    const originalButtonHTML =
        simulateButton.innerHTML;

    simulateButton.disabled =
        true;

    simulateButton.innerHTML =
        "Running simulation...";


    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(request)
                }
            );


        const data =
            await response.json();


        /* Backend error */

        if (!response.ok) {

            let errorMessage =
                "The simulation could not be completed.";

            if (data.detail) {

                if (
                    typeof data.detail ===
                    "string"
                ) {

                    errorMessage =
                        data.detail;

                } else if (
                    data.detail.message
                ) {

                    errorMessage =
                        data.detail.message;

                }

            }


            throw new Error(
                errorMessage
            );

        }


        /* Success */

        console.log(
            "FinSim backend response:",
            data
        );


        displayRealResult(data);


        showMessage(
            "Simulation completed successfully using the FinSim financial model.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "FinSim API error:",
            error
        );


        showMessage(
            `Could not connect to FinSim backend. ${error.message}`,
            "error"
        );

    }

    finally {

        simulateButton.disabled =
            false;

        simulateButton.innerHTML =
            originalButtonHTML;

    }

}


/* =========================================================
   FORM SUBMISSION
   ========================================================= */

simulationForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        runSimulation();

    }
);


/* =========================================================
   DISPLAY REAL FINANCIAL MODEL RESULT
   ========================================================= */

function displayRealResult(data) {

    const formatted =
        data.formatted || {};

    const goalImpact =
        data.goal_impact || {};


    /*
     * Final scenario savings
     *
     * This comes directly from the
     * financial model.
     */

    const finalSavings =
        Number(
            formatted.scenario_final_savings ??
            goalImpact.scenario_final_savings ??
            0
        );


    /*
     * Goal status
     */

    const scenarioGoalMonth =
        goalImpact.scenario_goal_month ??
        formatted.scenario_goal_month;


    const goalDeadline =
        getNumber("goalDeadline");


    const goalReached =
        scenarioGoalMonth !== null &&
        scenarioGoalMonth !== undefined &&
        Number(scenarioGoalMonth) <=
            goalDeadline;


    const goalStatus =
        document.getElementById(
            "goalStatus"
        );

    const goalStatusDescription =
        document.getElementById(
            "goalStatusDescription"
        );


    goalStatus.textContent =
        goalReached
            ? "On track"
            : "Needs attention";


    if (goalReached) {

        goalStatusDescription.textContent =
            `Goal reached in month ${scenarioGoalMonth}.`;

    } else {

        goalStatusDescription.textContent =
            "The scenario does not reach your goal within the selected deadline.";

    }


    /*
     * Projected savings
     */

    const projectedSavings =
        document.getElementById(
            "projectedSavings"
        );


    projectedSavings.textContent =
        formatCurrency(
            finalSavings
        );


    /*
     * Goal impact
     */

    const goalImpactElement =
        document.getElementById(
            "goalImpact"
        );

    const goalImpactDescription =
        document.getElementById(
            "goalImpactDescription"
        );


    const savingsDifference =
        Number(
            formatted.savings_difference ??
            goalImpact.savings_difference ??
            0
        );


    const goalDelay =
        formatted.goal_delay_months ??
        goalImpact.goal_delay_months;


    if (
        goalDelay !== null &&
        goalDelay !== undefined
    ) {

        if (goalDelay > 0) {

            goalImpactElement.textContent =
                `${goalDelay} month delay`;

            goalImpactDescription.textContent =
                "Your scenario delays the goal compared with the baseline.";

        }

        else if (goalDelay < 0) {

            goalImpactElement.textContent =
                `${Math.abs(goalDelay)} months earlier`;

            goalImpactDescription.textContent =
                "Your scenario reaches the goal earlier than the baseline.";

        }

        else {

            goalImpactElement.textContent =
                "No delay";

            goalImpactDescription.textContent =
                "The scenario does not change the goal achievement time.";

        }

    }

    else {

        if (savingsDifference < 0) {

            goalImpactElement.textContent =
                "Savings decrease";

            goalImpactDescription.textContent =
                formatCurrency(
                    Math.abs(savingsDifference)
                ) +
                " less than the baseline.";

        }

        else if (savingsDifference > 0) {

            goalImpactElement.textContent =
                "Savings increase";

            goalImpactDescription.textContent =
                formatCurrency(
                    savingsDifference
                ) +
                " more than the baseline.";

        }

        else {

            goalImpactElement.textContent =
                "No change";

            goalImpactDescription.textContent =
                "No difference from the baseline.";

        }

    }


    /*
     * Results heading message
     */

    const resultsMessage =
        document.getElementById(
            "resultsMessage"
        );


    if (
        formatted.goal_message
    ) {

        resultsMessage.textContent =
            formatted.goal_message;

    } else {

        resultsMessage.textContent =
            "Your simulation has been calculated using the FinSim financial model.";

    }


    /*
     * Hero projected savings
     */

    const heroProjectedSavings =
        document.getElementById(
            "heroProjectedSavings"
        );


    if (heroProjectedSavings) {

        heroProjectedSavings.textContent =
            formatCurrency(
                finalSavings
            );

    }


    /*
     * Show results
     */

    resultsSection.classList.remove(
        "hidden"
    );


    /*
     * Update chart placeholder with
     * real projection information.
     *
     * We will turn this into an actual
     * chart in the next step.
     */

    updateChartPlaceholder(
        data
    );

    updateFinancialInsight(data);


    /*
     * Scroll to results
     */

    setTimeout(() => {

        resultsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* =========================================================
   CHART PLACEHOLDER
   ========================================================= */

/* =========================================================
   SAVINGS CHART
   ========================================================= */

let savingsChart = null;


function updateChartPlaceholder(data) {

    const baseline =
        data.baseline_projection || [];

    const scenario =
        data.scenario_projection || [];


    /* Check that projection data exists */

    if (
        baseline.length === 0 ||
        scenario.length === 0
    ) {

        console.warn(
            "Chart data is missing."
        );

        return;

    }


    /* Extract savings values */

    const baselineSavings =
        baseline.map(
            (item) =>
                Number(item.savings) || 0
        );


    const scenarioSavings =
        scenario.map(
            (item) =>
                Number(item.savings) || 0
        );


    /* Extract months */

    const labels =
        scenario.map(
            (item) =>
                `Month ${item.month}`
        );


    /* Final savings */

    const baselineFinal =
        baselineSavings[
            baselineSavings.length - 1
        ] || 0;


    const scenarioFinal =
        scenarioSavings[
            scenarioSavings.length - 1
        ] || 0;


    const difference =
        scenarioFinal - baselineFinal;


    /* =====================================================
       UPDATE SUMMARY VALUES
       ===================================================== */

    const baselineElement =
        document.getElementById(
            "baselineFinalSavings"
        );


    const scenarioElement =
        document.getElementById(
            "scenarioFinalSavings"
        );


    const differenceElement =
        document.getElementById(
            "savingsDifference"
        );


    if (baselineElement) {

        baselineElement.textContent =
            formatCurrency(
                baselineFinal
            );

    }


    if (scenarioElement) {

        scenarioElement.textContent =
            formatCurrency(
                scenarioFinal
            );

    }


    if (differenceElement) {

        if (difference > 0) {

            differenceElement.textContent =
                "+" +
                formatCurrency(
                    difference
                );

        }

        else {

            differenceElement.textContent =
                formatCurrency(
                    difference
                );

        }

    }


    /* =====================================================
       FIND CANVAS
       ===================================================== */

    const canvas =
        document.getElementById(
            "savingsChart"
        );


    if (!canvas) {

        console.error(
            "Savings chart canvas not found."
        );

        return;

    }


    /* =====================================================
       CHECK CHART.JS
       ===================================================== */

    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js is not loaded."
        );

        return;

    }


    /* =====================================================
       DESTROY PREVIOUS CHART
       ===================================================== */

    const existingChart = Chart.getChart(canvas);

if (existingChart) {
    existingChart.destroy();
}

savingsChart = null;


    /* =====================================================
       CREATE CHART
       ===================================================== */

    savingsChart =
        new Chart(
            canvas,
            {

                type: "line",


                data: {

                    labels:
                        labels,


                    datasets: [

                        /* ================================
                           CURRENT PLAN
                           ================================= */

                        {

                            label:
                                "Current plan",

                            data:
                                baselineSavings,

                            borderColor:
                                "#9c285f",

                            backgroundColor:
                                "rgba(156, 40, 95, 0.05)",

                            borderWidth:
                                3,

                            pointRadius:
                                0,

                            pointHoverRadius:
                                5,

                            tension:
                                0.35,

                            fill:
                                false

                        },


                        /* ================================
                           WHAT-IF SCENARIO
                           ================================= */

                        {

                            label:
                                "What-if scenario",

                            data:
                                scenarioSavings,

                            borderColor:
                                "#ec70a5",

                            backgroundColor:
                                "rgba(236, 112, 165, 0.10)",

                            borderWidth:
                                3,

                            pointRadius:
                                0,

                            pointHoverRadius:
                                5,

                            tension:
                                0.35,

                            fill:
                                true

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    interaction: {

                        mode:
                            "index",

                        intersect:
                            false

                    },


                    plugins: {

                        legend: {

                            display:
                                false

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            context.dataset.label +
                                            ": " +
                                            formatCurrency(
                                                context.parsed.y
                                            )
                                        );

                                    }

                            }

                        }

                    },


                    scales: {

                        x: {

                            grid: {

                                display:
                                    false

                            },

                            ticks: {

                                color:
                                    "#8d7c86",

                                maxTicksLimit:
                                    8

                            }

                        },


                        y: {

                            beginAtZero:
                                false,

                            grid: {

                                color:
                                    "rgba(194, 24, 104, 0.08)"

                            },

                            ticks: {

    color:
        "#8d7c86",

    callback:
        function(value) {

            return formatCurrency(value);

        }

}

                        }

                    }

                }

            }
        );

}

// ================================
// FINANCIAL INSIGHT
// ================================

function updateFinancialInsight(data) {

    const insightTitle =
        document.getElementById("insightTitle");

    const insightMessage =
        document.getElementById("insightMessage");

    if (!insightTitle || !insightMessage) {
        return;
    }

    const scenario = data.scenario;

    const goalImpact = data.goal_impact || {};

    const baselineFinal =
        Number(goalImpact.baseline_final_savings ?? 0);

    const scenarioFinal =
        Number(goalImpact.scenario_final_savings ?? 0);

    const difference =
        scenarioFinal - baselineFinal;

    const goalDelay =
        Number(goalImpact.goal_delay_months ?? 0);

    const absDifference =
        Math.abs(difference);

    const formattedDifference =
        formatCurrency(absDifference);


    // ================================
    // SCENARIO-SPECIFIC NAMES
    // ================================

    const scenarioNames = {

        purchase: "This purchase",

        loan: "This loan",

        income_change: "This income change",

        recurring_expense:
            "This recurring expense change",

        emergency:
            "This emergency expense",

        vacation:
            "This vacation",

        savings_rate:
            "This savings-rate change"
    };

    const scenarioName =
        scenarioNames[scenario] || "This scenario";


    // ================================
    // POSITIVE OUTCOME
    // ================================

    if (difference > 0) {

        switch (scenario) {

            case "savings_rate":

                insightTitle.textContent =
                    "Increasing your savings rate could strengthen your financial future.";

                insightMessage.textContent =
                    `${scenarioName} could increase your projected savings by ${formattedDifference} over the simulation period.`;

                break;


            case "income_change":

                insightTitle.textContent =
                    "This income change could improve your financial position.";

                insightMessage.textContent =
                    `${scenarioName} could increase your projected savings by ${formattedDifference} over the simulation period.`;

                break;


            default:

                insightTitle.textContent =
                    "This scenario improves your projected savings.";

                insightMessage.textContent =
                    `${scenarioName} could increase your projected savings by ${formattedDifference} over the simulation period.`;
        }


        if (goalDelay < 0) {

            const monthsEarlier =
                Math.abs(goalDelay);

            insightMessage.textContent +=
                ` Your goal could also be reached ${monthsEarlier} month${monthsEarlier === 1 ? "" : "s"} earlier.`;
        }

        return;
    }


    // ================================
    // NEGATIVE OUTCOME
    // ================================

    if (difference < 0) {

        switch (scenario) {

            case "purchase":

                insightTitle.textContent =
                    "This purchase would reduce your future savings.";

                insightMessage.textContent =
                    `${scenarioName} could reduce your projected savings by ${formattedDifference} over the simulation period.`;

                break;


            case "loan":

                insightTitle.textContent =
                    "This loan could put pressure on your future savings.";

                insightMessage.textContent =
                    `${scenarioName} could reduce your projected savings by ${formattedDifference}, mainly because of the additional monthly loan payments.`;

                break;


            case "income_change":

                insightTitle.textContent =
                    "This income change could weaken your savings trajectory.";

                insightMessage.textContent =
                    `${scenarioName} could reduce your projected savings by ${formattedDifference} over the simulation period.`;

                break;


            case "recurring_expense":

                insightTitle.textContent =
                    "Higher recurring expenses could slow your savings growth.";

                insightMessage.textContent =
                    `${scenarioName} could reduce your projected savings by ${formattedDifference} over the simulation period because of the additional monthly expense.`;

                break;


            case "emergency":

                insightTitle.textContent =
                    "This emergency expense creates a significant savings impact.";

                insightMessage.textContent =
                    `${scenarioName} could reduce your projected savings by ${formattedDifference} over the simulation period.`;

                break;


            case "vacation":

                insightTitle.textContent =
                    "This vacation would reduce your future savings.";

                insightMessage.textContent =
                    `${scenarioName} could reduce your projected savings by ${formattedDifference} over the simulation period.`;

                break;


            case "savings_rate":

                insightTitle.textContent =
                    "A lower savings rate could slow your financial progress.";

                insightMessage.textContent =
                    `${scenarioName} could reduce your projected savings by ${formattedDifference} over the simulation period.`;

                break;


            default:

                insightTitle.textContent =
                    "This scenario reduces your projected savings.";

                insightMessage.textContent =
                    `${scenarioName} could reduce your projected savings by ${formattedDifference} over the simulation period.`;
        }


        if (goalDelay > 0) {

            insightMessage.textContent +=
                ` Your goal could be delayed by approximately ${goalDelay} month${goalDelay === 1 ? "" : "s"}.`;
        }

        return;
    }


    // ================================
    // NO SIGNIFICANT DIFFERENCE
    // ================================

    insightTitle.textContent =
        "This scenario has little impact on your projected savings.";

    insightMessage.textContent =
        `${scenarioName} produces almost the same projected savings as your current plan.`;
}


/*=====================================
   CURRENCY FORMAT
   ========================================================= */

function formatCurrency(value) {

    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(Number(value))
    ) {

        return "₹0";

    }


    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(
        Number(value)
    );

}


/* =========================================================
   MESSAGES
   ========================================================= */

function showMessage(
    message,
    type
) {

    messageBox.textContent =
        message;

    messageBox.className =
        `message-box ${type}`;

}


function clearMessage() {

    messageBox.textContent =
        "";

    messageBox.className =
        "message-box hidden";

}


/* =========================================================
   RESET
   ========================================================= */

resetButton.addEventListener(
    "click",
    () => {

        const inputs =
            document.querySelectorAll(
                "input"
            );


        inputs.forEach((input) => {

            if (
                input.id ===
                "simulationMonths"
            ) {

                input.value = 36;

            }

            else if (
                input.id ===
                "otherIncome" ||

                input.id ===
                "rent" ||

                input.id ===
                "food" ||

                input.id ===
                "transport" ||

                input.id ===
                "utilities" ||

                input.id ===
                "otherExpenses" ||

                input.id ===
                "existingEmi"
            ) {

                input.value = 0;

            }

            else {

                input.value = "";

            }

        });


        selectedScenario =
            "purchase";


        scenarioCards.forEach(
            (card) => {

                card.classList.remove(
                    "selected"
                );

            }
        );


        const purchaseCard =
            document.querySelector(
                '.scenario-card[data-scenario="purchase"]'
            );


        if (purchaseCard) {

            purchaseCard.classList.add(
                "selected"
            );

        }


        selectScenario(
            "purchase"
        );


        resultsSection.classList.add(
            "hidden"
        );


        clearMessage();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

selectScenario("purchase");


console.log(
    "FinSim frontend connected to FastAPI."
);