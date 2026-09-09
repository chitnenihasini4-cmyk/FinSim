def calculate_cash_flow(
    monthly_income,
    other_income,
    rent,
    food,
    transport,
    utilities,
    other_expenses,
    existing_emi,
    current_savings
):
    total_income = monthly_income + other_income

    total_expenses = (
        rent
        + food
        + transport
        + utilities
        + other_expenses
    )

    monthly_cash_flow = (
        total_income
        - total_expenses
        - existing_emi
    )

    return {
    "total_income": total_income,
    "monthly_income": monthly_income,
    "other_income": other_income,
    "total_expenses": total_expenses,
    "existing_emi": existing_emi,
    "monthly_cash_flow": monthly_cash_flow,
    "current_savings": current_savings
}


def calculate_projection(
    current_savings,
    monthly_cash_flow,
    months
):
    projection = []

    savings = current_savings

    projection.append({
        "month": 0,
        "savings": savings
    })

    for month in range(1, months + 1):
        savings = savings + monthly_cash_flow

        projection.append({
            "month": month,
            "savings": savings
        })

    return projection

#BIG PURCHASE SCENARIO

def calculate_purchase_scenario(
    current_savings,
    monthly_cash_flow,
    months,
    purchase_amount,
    purchase_month
):
    projection = []

    savings = current_savings

    projection.append({
        "month": 0,
        "savings": savings
    })

    for month in range(1, months + 1):

        if month == purchase_month:
            savings = savings - purchase_amount

        savings = savings + monthly_cash_flow

        projection.append({
            "month": month,
            "savings": savings
        })

    return projection

#RECURRING EXPENSE SCENARIO

def calculate_recurring_expense_scenario(
    current_savings,
    monthly_cash_flow,
    months,
    additional_expense,
    start_month
):
    projection = []

    savings = current_savings

    projection.append({
        "month": 0,
        "savings": savings
    })

    for month in range(1, months + 1):

        if month >= start_month:
            current_cash_flow = monthly_cash_flow - additional_expense
        else:
            current_cash_flow = monthly_cash_flow

        savings = savings + current_cash_flow

        projection.append({
            "month": month,
            "savings": savings
        })

    return projection

#INCOME CHANGE SCENARIO

def calculate_income_change_scenario(
    current_savings,
    monthly_income,
    other_income,
    total_expenses,
    existing_emi,
    months,
    income_change_percentage,
    start_month
):
    projection = []

    savings = current_savings

    normal_cash_flow = (
        monthly_income
        + other_income
        - total_expenses
        - existing_emi
    )

    changed_income = monthly_income * (
        1 + income_change_percentage / 100
    )

    changed_cash_flow = (
        changed_income
        + other_income
        - total_expenses
        - existing_emi
    )

    projection.append({
        "month": 0,
        "savings": savings
    })

    for month in range(1, months + 1):

        if month >= start_month:
            current_cash_flow = changed_cash_flow
        else:
            current_cash_flow = normal_cash_flow

        savings = savings + current_cash_flow

        projection.append({
            "month": month,
            "savings": savings
        })

    return projection

#EMERGENCY EXPENSE SCENARIO

def calculate_emergency_scenario(
    current_savings,
    monthly_cash_flow,
    months,
    emergency_amount,
    emergency_month
):
    projection = []

    savings = current_savings

    projection.append({
        "month": 0,
        "savings": savings
    })

    for month in range(1, months + 1):

        if month == emergency_month:
            savings = savings - emergency_amount

        savings = savings + monthly_cash_flow

        projection.append({
            "month": month,
        "savings": savings
        })

    return projection

#EMI

def calculate_emi(loan_amount, annual_interest_rate, loan_tenure_months):
    monthly_interest_rate = annual_interest_rate / (12 * 100)

    if monthly_interest_rate == 0:
        emi = loan_amount / loan_tenure_months
    else:
        emi = (
            loan_amount
            * monthly_interest_rate
            * (1 + monthly_interest_rate) ** loan_tenure_months
        ) / (
            (1 + monthly_interest_rate) ** loan_tenure_months - 1
        )

    return emi

#LOAN

def calculate_loan_amortization(
    loan_amount,
    annual_interest_rate,
    loan_tenure_months
):
    monthly_interest_rate = annual_interest_rate / (12 * 100)

    emi = calculate_emi(
        loan_amount,
        annual_interest_rate,
        loan_tenure_months
    )

    balance = loan_amount
    schedule = []

    for month in range(1, loan_tenure_months + 1):

        interest = balance * monthly_interest_rate
        principal = emi - interest

        balance = balance - principal

        if abs(balance) < 0.01:
            balance = 0

        schedule.append({
            "month": month,
            "emi": emi,
            "interest": interest,
            "principal": principal,
            "remaining_balance": balance
        })

    return schedule

#LOAN SAVING SCENARIO

def calculate_loan_scenario(
    current_savings,
    monthly_cash_flow,
    months,
    loan_amount,
    annual_interest_rate,
    loan_tenure_months,
    loan_start_month
):
    projection = []

    savings = current_savings

    emi = calculate_emi(
        loan_amount,
        annual_interest_rate,
        loan_tenure_months
    )

    projection.append({
        "month": 0,
        "savings": savings
    })

    for month in range(1, months + 1):

        loan_month = month - loan_start_month + 1

        if 1 <= loan_month <= loan_tenure_months:
            current_cash_flow = monthly_cash_flow - emi
        else:
            current_cash_flow = monthly_cash_flow

        savings = savings + current_cash_flow

        projection.append({
            "month": month,
            "savings": savings
        })

    return projection

#COMPARISONS

def compare_projections(baseline, scenario):
    comparison = []

    for i in range(len(baseline)):
        baseline_savings = baseline[i]["savings"]
        scenario_savings = scenario[i]["savings"]

        difference = scenario_savings - baseline_savings

        comparison.append({
            "month": baseline[i]["month"],
            "baseline_savings": baseline_savings,
            "scenario_savings": scenario_savings,
            "difference": difference
        })

    return comparison

#GOAL STATUS

def calculate_goal_status(
    projection,
    goal_amount,
    goal_months
):
    goal_reached_month = None

    for month_data in projection:
        month = month_data["month"]
        savings = month_data["savings"]

        if month <= goal_months and savings >= goal_amount:
            goal_reached_month = month
            break

    if goal_reached_month is not None:
        goal_achievable = True
    else:
        goal_achievable = False

    return {
        "goal_amount": goal_amount,
        "goal_deadline_month": goal_months,
        "goal_reached_month": goal_reached_month,
        "goal_achievable": goal_achievable
    }

#GOAL DELAY

def calculate_goal_delay(
    baseline_projection,
    scenario_projection,
    goal_amount
):
    baseline_month = None
    scenario_month = None

    for data in baseline_projection:
        if data["savings"] >= goal_amount:
            baseline_month = data["month"]
            break

    for data in scenario_projection:
        if data["savings"] >= goal_amount:
            scenario_month = data["month"]
            break

    if baseline_month is None:
        return {
            "baseline_goal_month": None,
            "scenario_goal_month": scenario_month,
            "goal_delay": None,
            "message": "Baseline does not reach the goal in the simulation period."
        }

    if scenario_month is None:
        return {
            "baseline_goal_month": baseline_month,
            "scenario_goal_month": None,
            "goal_delay": None,
            "message": "What-If scenario does not reach the goal in the simulation period."
        }

    delay = scenario_month - baseline_month

    return {
        "baseline_goal_month": baseline_month,
        "scenario_goal_month": scenario_month,
        "goal_delay": delay,
        "message": "Goal delay calculated successfully."
    }

#GOAL IMPACT

def calculate_goal_impact(
    baseline_projection,
    scenario_projection,
    goal_amount,
    goal_deadline_month
):
    baseline_goal_month = None
    scenario_goal_month = None

    for data in baseline_projection:
        if data["month"] <= goal_deadline_month and data["savings"] >= goal_amount:
            baseline_goal_month = data["month"]
            break

    for data in scenario_projection:
        if data["month"] <= goal_deadline_month and data["savings"] >= goal_amount:
            scenario_goal_month = data["month"]
            break

    baseline_final_savings = baseline_projection[-1]["savings"]
    scenario_final_savings = scenario_projection[-1]["savings"]

    savings_difference = (
        scenario_final_savings - baseline_final_savings
    )

    if (
        baseline_goal_month is not None
        and scenario_goal_month is not None
    ):
        goal_delay = scenario_goal_month - baseline_goal_month
    else:
        goal_delay = None

    return {
        "goal_amount": goal_amount,
        "baseline_goal_month": baseline_goal_month,
        "scenario_goal_month": scenario_goal_month,
        "goal_delay_months": goal_delay,
        "baseline_final_savings": baseline_final_savings,
        "scenario_final_savings": scenario_final_savings,
        "savings_difference": savings_difference
    }





def run_purchase_simulation(
    monthly_income,
    other_income,
    rent,
    food,
    transport,
    utilities,
    other_expenses,
    existing_emi,
    current_savings,
    simulation_months,
    purchase_amount,
    purchase_month,
    goal_amount,
    goal_deadline_month
):
    # Step 1: Calculate cash flow

    cash_flow = calculate_cash_flow(
        monthly_income=monthly_income,
        other_income=other_income,
        rent=rent,
        food=food,
        transport=transport,
        utilities=utilities,
        other_expenses=other_expenses,
        existing_emi=existing_emi,
        current_savings=current_savings
    )

    monthly_cash_flow = cash_flow["monthly_cash_flow"]


    # Step 2: Baseline

    baseline_projection = calculate_projection(
        current_savings=current_savings,
        monthly_cash_flow=monthly_cash_flow,
        months=simulation_months
    )


    # Step 3: What-If

    scenario_projection = calculate_purchase_scenario(
        current_savings=current_savings,
        monthly_cash_flow=monthly_cash_flow,
        months=simulation_months,
        purchase_amount=purchase_amount,
        purchase_month=purchase_month
    )


    # Step 4: Compare

    comparison = compare_projections(
        baseline_projection,
        scenario_projection
    )


    # Step 5: Goal impact

    goal_impact = calculate_goal_impact(
        baseline_projection,
        scenario_projection,
        goal_amount,
        goal_deadline_month
    )


    # Final result

    return {
        "cash_flow": cash_flow,
        "baseline_projection": baseline_projection,
        "scenario_projection": scenario_projection,
        "comparison": comparison,
        "goal_impact": goal_impact
    }





def run_simulation(
    scenario,
    monthly_income,
    other_income,
    rent,
    food,
    transport,
    utilities,
    other_expenses,
    existing_emi,
    current_savings,
    simulation_months,
    goal_amount,
    goal_deadline_month,
    scenario_inputs
):

    # 1. Calculate current cash flow

    cash_flow = calculate_cash_flow(
        monthly_income=monthly_income,
        other_income=other_income,
        rent=rent,
        food=food,
        transport=transport,
        utilities=utilities,
        other_expenses=other_expenses,
        existing_emi=existing_emi,
        current_savings=current_savings
    )

    monthly_cash_flow = cash_flow["monthly_cash_flow"]


    # 2. Baseline projection

    baseline_projection = calculate_projection(
        current_savings=current_savings,
        monthly_cash_flow=monthly_cash_flow,
        months=simulation_months
    )


    # 3. Select scenario

    if scenario == "purchase":

        scenario_projection = calculate_purchase_scenario(
            current_savings=current_savings,
            monthly_cash_flow=monthly_cash_flow,
            months=simulation_months,
            purchase_amount=scenario_inputs["purchase_amount"],
            purchase_month=scenario_inputs["purchase_month"]
        )


    elif scenario == "recurring_expense":

        scenario_projection = calculate_recurring_expense_scenario(
            current_savings=current_savings,
            monthly_cash_flow=monthly_cash_flow,
            months=simulation_months,
            additional_expense=scenario_inputs["additional_expense"],
            start_month=scenario_inputs["start_month"]
        )


    elif scenario == "income_change":

        scenario_projection = calculate_income_change_scenario(
            current_savings=current_savings,
            monthly_income=monthly_income,
            other_income=other_income,
            total_expenses=cash_flow["total_expenses"],
            existing_emi=existing_emi,
            months=simulation_months,
            income_change_percentage=scenario_inputs["income_change_percentage"],
            start_month=scenario_inputs["start_month"]
        )


    elif scenario == "emergency":

        scenario_projection = calculate_emergency_scenario(
            current_savings=current_savings,
            monthly_cash_flow=monthly_cash_flow,
            months=simulation_months,
            emergency_amount=scenario_inputs["emergency_amount"],
            emergency_month=scenario_inputs["emergency_month"]
        )


    elif scenario == "loan":

        scenario_projection = calculate_loan_scenario(
            current_savings=current_savings,
            monthly_cash_flow=monthly_cash_flow,
            months=simulation_months,
            loan_amount=scenario_inputs["loan_amount"],
            annual_interest_rate=scenario_inputs["annual_interest_rate"],
            loan_tenure_months=scenario_inputs["loan_tenure_months"],
            loan_start_month=scenario_inputs["loan_start_month"]
        )


    else:

        raise ValueError(
            f"Unknown scenario: {scenario}"
        )


    # 4. Compare baseline and scenario

    comparison = compare_projections(
        baseline_projection,
        scenario_projection
    )


    # 5. Goal impact

    goal_impact = calculate_goal_impact(
        baseline_projection,
        scenario_projection,
        goal_amount,
        goal_deadline_month
    )


    # 6. Return complete result

    return {
    "scenario": scenario,

    "scenario_inputs": scenario_inputs,

    "cash_flow": cash_flow,

    "baseline_projection": baseline_projection,

    "scenario_projection": scenario_projection,

    "comparison": comparison,

    "goal_impact": goal_impact
}


#FORMAT SIMULATION RESULTS

def format_simulation_result(result):

    goal_impact = result["goal_impact"]
    scenario = result["scenario"]
    scenario_inputs = result["scenario_inputs"]

    baseline_final = goal_impact["baseline_final_savings"]
    scenario_final = goal_impact["scenario_final_savings"]

    savings_difference = goal_impact["savings_difference"]
    goal_delay = goal_impact["goal_delay_months"]

    normal_cash_flow = result["cash_flow"]["monthly_cash_flow"]


    # -------------------------
    # Goal message
    # -------------------------

    if goal_delay is None:
        goal_message = "Goal achievement could not be determined."

    elif goal_delay > 0:
        goal_message = f"Goal delayed by {goal_delay} months."

    elif goal_delay < 0:
        goal_message = f"Goal reached {-goal_delay} months earlier."

    else:
        goal_message = "No change in goal achievement time."


    # -------------------------
    # Savings message
    # -------------------------

    if savings_difference > 0:
        savings_message = (
            f"Savings increase by ₹{savings_difference:,.2f}"
        )

    elif savings_difference < 0:
        savings_message = (
            f"Savings decrease by ₹{abs(savings_difference):,.2f}"
        )

    else:
        savings_message = "No change in final savings."


    # -------------------------
    # Basic result
    # -------------------------

    formatted_result = {

        "scenario": scenario,

        "normal_monthly_cash_flow": normal_cash_flow,

        "baseline_final_savings": baseline_final,

        "scenario_final_savings": scenario_final,

        "savings_difference": savings_difference,

        "savings_message": savings_message,

        "goal_amount": goal_impact["goal_amount"],

        "baseline_goal_month":
            goal_impact["baseline_goal_month"],

        "scenario_goal_month":
            goal_impact["scenario_goal_month"],

        "goal_delay_months": goal_delay,

        "goal_message": goal_message
    }


    # -------------------------
    # Purchase
    # -------------------------

    if scenario == "purchase":

        formatted_result["purchase_amount"] = (
            scenario_inputs["purchase_amount"]
        )

        formatted_result["purchase_month"] = (
            scenario_inputs["purchase_month"]
        )


    # -------------------------
    # Recurring expense
    # -------------------------

    elif scenario == "recurring_expense":

        additional_expense = (
            scenario_inputs["additional_expense"]
        )

        formatted_result["additional_monthly_expense"] = (
            additional_expense
        )

        formatted_result["expense_start_month"] = (
            scenario_inputs["start_month"]
        )

        formatted_result["scenario_monthly_cash_flow"] = (
            normal_cash_flow - additional_expense
        )


    # -------------------------
    # Income change
    # -------------------------

    elif scenario == "income_change":

        percentage = (
            scenario_inputs["income_change_percentage"]
        )

        formatted_result["income_change_percentage"] = percentage

        formatted_result["income_change_start_month"] = (
            scenario_inputs["start_month"]
        )

        monthly_income = result["cash_flow"]["monthly_income"]
        other_income = result["cash_flow"]["other_income"]

        new_monthly_income = (
            monthly_income * (1 + percentage / 100)
)

        new_total_income = (
            new_monthly_income + other_income
)

        formatted_result["new_monthly_income"] = new_monthly_income

        formatted_result["new_total_income"] = new_total_income

        formatted_result["scenario_monthly_cash_flow"] = (
            normal_cash_flow
            + (new_monthly_income - monthly_income)
)


    # -------------------------
    # Emergency
    # -------------------------

    elif scenario == "emergency":

        formatted_result["emergency_amount"] = (
            scenario_inputs["emergency_amount"]
        )

        formatted_result["emergency_month"] = (
            scenario_inputs["emergency_month"]
        )


    # -------------------------
    # Loan
    # -------------------------

    elif scenario == "loan":

        loan_amount = scenario_inputs["loan_amount"]
        interest_rate = scenario_inputs["annual_interest_rate"]
        tenure = scenario_inputs["loan_tenure_months"]

        emi = calculate_emi(
            loan_amount,
            interest_rate,
            tenure
        )

        formatted_result["loan_amount"] = loan_amount

        formatted_result["annual_interest_rate"] = (
            interest_rate
        )

        formatted_result["loan_tenure_months"] = tenure

        formatted_result["loan_start_month"] = (
            scenario_inputs["loan_start_month"]
        )

        formatted_result["monthly_emi"] = emi

        formatted_result["loan_period_cash_flow"] = (
            normal_cash_flow - emi
        )


    return formatted_result