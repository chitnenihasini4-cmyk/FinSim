/* =========================================================
   FinSim - Frontend Controller
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

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

    const simulationForm =
        document.getElementById("simulationForm");

    const simulateButton =
        document.getElementById("simulateButton");

    const resetButton =
        document.getElementById("resetButton");

    const messageBox =
        document.getElementById("messageBox");

    const resultsSection =
        document.getElementById("resultsSection");

    const heroProjectedSavings =
        document.getElementById("heroProjectedSavings");


    /* =====================================================
       SCENARIO CONFIGURATION
       ===================================================== */

    const scenarios = {

        purchase: {
            icon: "🛍️",
            title: "Big purchase",
            description:
                "Enter the cost of the purchase and when you plan to make it.",

            fields: [
                {
                    id: "purchaseAmount",
                    name: "purchase_amount",
                    label: "Purchase amount",
                    placeholder: "80000",
                    prefix: "₹",
                    min: 0
                },
                {
                    id: "purchaseMonth",
                    name: "purchase_month",
                    label: "Purchase month",
                    placeholder: "3",
                    suffix: "month",
                    min: 1
                }
            ]
        },


        loan: {
            icon: "🏦",
            title: "New loan",
            description:
                "Enter the loan details to see how the new EMI could affect your finances.",

            fields: [
                {
                    id: "loanAmount",
                    name: "loan_amount",
                    label: "Loan amount",
                    placeholder: "500000",
                    prefix: "₹",
                    min: 0
                },
                {
                    id: "annualInterestRate",
                    name: "annual_interest_rate",
                    label: "Annual interest rate",
                    placeholder: "8.5",
                    suffix: "%",
                    min: 0,
                    step: 0.01
                },
                {
                    id: "loanTenure",
                    name: "loan_tenure_months",
                    label: "Loan tenure",
                    placeholder: "60",
                    suffix: "months",
                    min: 1
                },
                {
                    id: "loanStartMonth",
                    name: "loan_start_month",
                    label: "Loan start month",
                    placeholder: "1",
                    suffix: "month",
                    min: 1
                }
            ]
        },


        income_change: {
            icon: "💼",
            title: "Income change",
            description:
                "Explore what happens if your monthly income increases or decreases.",

            fields: [
                {
                    id: "incomeChange",
                    name: "income_change",
                    label: "Monthly income change",
                    placeholder: "10000",
                    prefix: "₹",
                    step: 0.01
                },
                {
                    id: "incomeChangeStartMonth",
                    name: "start_month",
                    label: "Change starts in",
                    placeholder: "1",
                    suffix: "month",
                    min: 1
                }
            ]
        },


        recurring_expense: {
            icon: "🔄",
            title: "Recurring expense",
            description:
                "See how adding or reducing a monthly expense affects your future savings.",

            fields: [
                {
                    id: "additionalExpense",
                    name: "additional_expense",
                    label: "Monthly expense change",
                    placeholder: "5000",
                    prefix: "₹"
                },
                {
                    id: "recurringStartMonth",
                    name: "start_month",
                    label: "Change starts in",
                    placeholder: "1",
                    suffix: "month",
                    min: 1
                }
            ]
        },


        emergency: {
            icon: "🚨",
            title: "Emergency expense",
            description:
                "Simulate an unexpected expense and see how it could affect your goal.",

            fields: [
                {
                    id: "emergencyAmount",
                    name: "emergency_amount",
                    label: "Emergency expense",
                    placeholder: "50000",
                    prefix: "₹",
                    min: 0
                },
                {
                    id: "emergencyMonth",
                    name: "emergency_month",
                    label: "Emergency occurs in",
                    placeholder: "6",
                    suffix: "month",
                    min: 1
                }
            ]
        },


        vacation: {
            icon: "✈️",
            title: "Vacation",
            description:
                "Enter your vacation cost and timing to see how it affects your savings goal.",

            fields: [
                {
                    id: "vacationAmount",
                    name: "vacation_amount",
                    label: "Vacation expense",
                    placeholder: "40000",
                    prefix: "₹",
                    min: 0
                },
                {
                    id: "vacationMonth",
                    name: "vacation_month",
                    label: "Vacation month",
                    placeholder: "6",
                    suffix: "month",
                    min: 1
                }
            ]
        },


        savings_rate: {
            icon: "📈",
            title: "Savings rate",
            description:
                "Explore what happens when you change the amount you save every month.",

            fields: [
                {
                    id: "savingsRateChange",
                    name: "savings_rate_change",
                    label: "Savings rate change",
                    placeholder: "10",
                    suffix: "%",
                    step: 0.1
                },
                {
                    id: "savingsRateStartMonth",
                    name: "start_month",
                    label: "Change starts in",
                    placeholder: "1",
                    suffix: "month",
                    min: 1
                }
            ]
        }

    };


    let selectedScenario = "purchase";


    /* =====================================================
       CREATE SCENARIO INPUTS
       ===================================================== */

    function renderScenario(scenarioName) {

        const scenario =
            scenarios[scenarioName];

        if (!scenario) {
            return;
        }


        selectedScenario = scenarioName;


        /* Highlight selected card */

        scenarioCards.forEach(card => {

            card.classList.toggle(
                "selected",
                card.dataset.scenario === scenarioName
            );

        });


        /* Update heading */

        scenarioInputTitle.textContent =
            scenario.title;

        scenarioInputDescription.textContent =
            scenario.description;

        selectedScenarioIcon.textContent =
            scenario.icon;


        /* Clear previous fields */

        scenarioInputs.innerHTML = "";


        /* Create new fields */

        scenario.fields.forEach(field => {

            const group =
                document.createElement("div");

            group.className =
                "input-group";


            const label =
                document.createElement("label");

            label.htmlFor =
                field.id;

            label.textContent =
                field.label;


            const wrapper =
                document.createElement("div");

            wrapper.className =
                "input-wrapper";


            if (field.prefix) {

                const prefix =
                    document.createElement("span");

                prefix.className =
                    "input-prefix";

                prefix.textContent =
                    field.prefix;

                wrapper.appendChild(prefix);
            }


            const input =
                document.createElement("input");

            input.type = "number";

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


        scenarioInputSection.classList.remove(
            "hidden"
        );

    }


    /* =====================================================
       SCENARIO CLICK
       ===================================================== */

    scenarioCards.forEach(card => {

        card.addEventListener("click", () => {

            renderScenario(
                card.dataset.scenario
            );

        });

    });


    /* =====================================================
       NUMBER HELPER
       ===================================================== */

    function getNumber(id) {

        const element =
            document.getElementById(id);

        if (!element || element.value === "") {
            return 0;
        }

        return Number(element.value);

    }


    /* =====================================================
       VALIDATION
       ===================================================== */

    function validateBaseInputs() {

        const required = [
            "monthlyIncome",
            "currentSavings",
            "goalAmount",
            "goalDeadline",
            "simulationMonths"
        ];


        for (const id of required) {

            const input =
                document.getElementById(id);


            if (!input || input.value === "") {

                showMessage(
                    "Please fill in all required financial and goal details.",
                    "error"
                );

                input?.focus();

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

        const scenario =
            scenarios[selectedScenario];


        for (const field of scenario.fields) {

            const input =
                document.getElementById(field.id);


            if (!input || input.value === "") {

                showMessage(
                    `Please enter ${field.label.toLowerCase()}.`,
                    "error"
                );

                input?.focus();

                return false;
            }


            if (
                field.min !== undefined &&
                Number(input.value) <
                Number(field.min)
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


    /* =====================================================
       BUILD REQUEST
       ===================================================== */

    function buildSimulationRequest() {

        const scenario =
            scenarios[selectedScenario];


        const scenarioInputs = {};


        scenario.fields.forEach(field => {

            scenarioInputs[field.name] =
                getNumber(field.id);

        });


        return {

            scenario:
                selectedScenario,

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
                getNumber("goalDeadline"),

            scenario_inputs:
                scenarioInputs

        };

    }


    /* =====================================================
       FRONTEND PREVIEW
       ===================================================== */

    function calculatePreview(request) {

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


        let monthlySavings =
            income - expenses;


        let projectedSavings =
            request.current_savings +
            monthlySavings *
            request.simulation_months;


        const inputs =
            request.scenario_inputs;


        switch (request.scenario) {

            case "purchase":

                projectedSavings -=
                    inputs.purchase_amount;

                break;


            case "emergency":

                projectedSavings -=
                    inputs.emergency_amount;

                break;


            case "vacation":

                projectedSavings -=
                    inputs.vacation_amount;

                break;


            case "recurring_expense":

                projectedSavings -=
                    inputs.additional_expense *
                    Math.max(
                        0,
                        request.simulation_months -
                        inputs.start_month +
                        1
                    );

                break;


            case "income_change":

                projectedSavings +=
                    inputs.income_change *
                    Math.max(
                        0,
                        request.simulation_months -
                        inputs.start_month +
                        1
                    );

                break;


            case "savings_rate":

                projectedSavings +=
                    monthlySavings *
                    (inputs.savings_rate_change / 100);

                break;


            case "loan":

                /*
                 * Simple frontend preview only.
                 * The actual loan calculation will be
                 * performed by the backend model.
                 */

                if (
                    inputs.loan_amount &&
                    inputs.loan_tenure_months
                ) {

                    const monthlyRate =
                        (inputs.annual_interest_rate / 100) /
                        12;

                    const n =
                        inputs.loan_tenure_months;

                    let emi = 0;

                    if (monthlyRate === 0) {

                        emi =
                            inputs.loan_amount / n;

                    } else {

                        emi =
                            inputs.loan_amount *
                            monthlyRate *
                            Math.pow(
                                1 + monthlyRate,
                                n
                            ) /
                            (
                                Math.pow(
                                    1 + monthlyRate,
                                    n
                                ) - 1
                            );

                    }

                    projectedSavings -=
                        emi *
                        Math.min(
                            request.simulation_months,
                            n
                        );

                }

                break;

        }


        return projectedSavings;

    }


    /* =====================================================
       DISPLAY RESULTS
       ===================================================== */

    function displayResults(request) {

        const projectedSavings =
            calculatePreview(request);


        const goalAmount =
            request.goal_amount;


        const goalReached =
            projectedSavings >= goalAmount;


        document.getElementById(
            "goalStatus"
        ).textContent =
            goalReached
                ? "On track"
                : "Needs attention";


        document.getElementById(
            "goalStatusDescription"
        ).textContent =
            goalReached
                ? "Your projected savings reach your selected goal."
                : "Your projected savings do not reach your selected goal.";


        document.getElementById(
            "projectedSavings"
        ).textContent =
            formatCurrency(
                projectedSavings
            );


        document.getElementById(
            "goalImpact"
        ).textContent =
            goalReached
                ? "Goal reachable"
                : "Goal at risk";


        document.getElementById(
            "goalImpactDescription"
        ).textContent =
            "This is a frontend preview. The real financial model will replace it after backend integration.";


        document.getElementById(
            "resultsMessage"
        ).textContent =
            `Preview for: ${scenarios[selectedScenario].title}`;


        heroProjectedSavings.textContent =
            formatCurrency(
                projectedSavings
            );


        resultsSection.classList.remove(
            "hidden"
        );


        setTimeout(() => {

            resultsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    }


    /* =====================================================
       FORM SUBMIT
       ===================================================== */

    simulationForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            clearMessage();


            if (!validateBaseInputs()) {
                return;
            }


            if (!validateScenarioInputs()) {
                return;
            }


            const request =
                buildSimulationRequest();


            console.log(
                "FinSim request:",
                request
            );


            displayResults(request);


            showMessage(
                "Preview generated successfully. Backend integration is the next step.",
                "success"
            );

        }
    );


    /* =====================================================
       RESET
       ===================================================== */

    resetButton.addEventListener(
        "click",
        () => {

            simulationForm.reset();


            document.getElementById(
                "otherIncome"
            ).value = 0;


            document.getElementById(
                "existingEmi"
            ).value = 0;


            document.getElementById(
                "rent"
            ).value = 0;


            document.getElementById(
                "food"
            ).value = 0;


            document.getElementById(
                "transport"
            ).value = 0;


            document.getElementById(
                "utilities"
            ).value = 0;


            document.getElementById(
                "otherExpenses"
            ).value = 0;


            document.getElementById(
                "simulationMonths"
            ).value = 36;


            renderScenario("purchase");


            resultsSection.classList.add(
                "hidden"
            );


            heroProjectedSavings.textContent =
                "₹2,84,500";


            clearMessage();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    /* =====================================================
       MESSAGES
       ===================================================== */

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

        messageBox.textContent = "";

        messageBox.className =
            "message-box hidden";

    }


    /* =====================================================
       CURRENCY
       ===================================================== */

    function formatCurrency(value) {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(value);

    }


    /* =====================================================
       INITIALISE
       ===================================================== */

    renderScenario("purchase");


    console.log(
        "FinSim frontend loaded successfully."
    );

});