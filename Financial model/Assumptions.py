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

    monthly_cash_flow = total_income - total_expenses - existing_emi

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "existing_emi": existing_emi,
        "monthly_cash_flow": monthly_cash_flow,
        "current_savings": current_savings
    }


result = calculate_cash_flow(
    monthly_income=60000,
    other_income=5000,
    rent=15000,
    food=6000,
    transport=3000,
    utilities=3000,
    other_expenses=8000,
    existing_emi=5000,
    current_savings=200000
)

print(result)

#huge purchase scenario

def calculate_projection(current_savings, monthly_cash_flow, months):
    projection = []

    savings = current_savings

    for month in range(months + 1):
        projection.append({
            "month": month,
            "savings": savings
        })

        savings = savings + monthly_cash_flow

    return projection

projection = calculate_projection(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=12
)

for month in projection:
    print(month)


def calculate_purchase_scenario(
    current_savings,
    monthly_cash_flow,
    months,
    purchase_amount,
    purchase_month
):
    projection = []

    savings = current_savings

    for month in range(months + 1):

        if month == purchase_month:
            savings = savings - purchase_amount

        projection.append({
            "month": month,
            "savings": savings
        })

        savings = savings + monthly_cash_flow

    return projection

purchase_projection = calculate_purchase_scenario(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=12,
    purchase_amount=80000,
    purchase_month=3
)

for month in purchase_projection:
    print(month)

#comparison

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
baseline_projection = calculate_projection(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=12
)

purchase_projection = calculate_purchase_scenario(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=12,
    purchase_amount=80000,
    purchase_month=3
)

comparison = compare_projections(
    baseline_projection,
    purchase_projection
)

for month in comparison:
    print(month)

#recurring expenses scenario

def calculate_recurring_expense_scenario(
    current_savings,
    monthly_cash_flow,
    months,
    additional_expense,
    start_month
):
    projection = []

    savings = current_savings

    for month in range(months + 1):

        if month >= start_month:
            current_cash_flow = monthly_cash_flow - additional_expense
        else:
            current_cash_flow = monthly_cash_flow

        projection.append({
            "month": month,
            "savings": savings
        })

        savings = savings + current_cash_flow

    return projection

recurring_expense_projection = calculate_recurring_expense_scenario(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=12,
    additional_expense=5000,
    start_month=3
)

for month in recurring_expense_projection:
    print(month)

#income change

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

    # Month 0 represents the starting position
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

income_change_projection = calculate_income_change_scenario(
    current_savings=200000,
    monthly_income=60000,
    other_income=5000,
    total_expenses=35000,
    existing_emi=5000,
    months=12,
    income_change_percentage=10,
    start_month=3
)

for month in income_change_projection:
    print(month)

#emergency expense scenario

def calculate_emergency_scenario(
    current_savings,
    monthly_cash_flow,
    months,
    emergency_amount,
    emergency_month
):
    projection = []

    savings = current_savings

    for month in range(months + 1):

        if month == emergency_month:
            savings = savings - emergency_amount

        projection.append({
            "month": month,
            "savings": savings
        })

        savings = savings + monthly_cash_flow

    return projection

emergency_projection = calculate_emergency_scenario(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=12,
    emergency_amount=100000,
    emergency_month=3
)

for month in emergency_projection:
    print(month)

#loan & EMI

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

emi = calculate_emi(
    loan_amount=500000,
    annual_interest_rate=12,
    loan_tenure_months=36
)

print("Monthly EMI:", round(emi, 2))

total_payment = emi * 36
total_interest = total_payment - 500000

print("Total payment:", round(total_payment, 2))
print("Total interest:", round(total_interest, 2))

#loan

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

        # Avoid tiny negative values caused by rounding
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

loan_schedule = calculate_loan_amortization(
    loan_amount=500000,
    annual_interest_rate=12,
    loan_tenure_months=36
)

for month in loan_schedule:
    print(month)

#savings projection with loan EMI

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

        # Check whether the loan is active
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

loan_projection = calculate_loan_scenario(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=48,
    loan_amount=500000,
    annual_interest_rate=12,
    loan_tenure_months=36,
    loan_start_month=3
)

for month in loan_projection:
    print(month)

baseline_projection = calculate_projection(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=48
)

loan_projection = calculate_loan_scenario(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=48,
    loan_amount=500000,
    annual_interest_rate=12,
    loan_tenure_months=36,
    loan_start_month=3
)

loan_comparison = compare_projections(
    baseline_projection,
    loan_projection
)

for month in loan_comparison:
    print(month)

baseline_final = baseline_projection[-1]["savings"]
loan_final = loan_projection[-1]["savings"]

savings_difference = loan_final - baseline_final

print("Baseline final savings:", round(baseline_final, 2))
print("Loan scenario final savings:", round(loan_final, 2))
print("Savings impact:", round(savings_difference, 2))

#financial goal 

#goal progress

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

goal_status = calculate_goal_status(
    baseline_projection,
    goal_amount=800000,
    goal_months=24
)

print(goal_status)

#test with what if scenario

purchase_goal_status = calculate_goal_status(
    purchase_projection,
    goal_amount=800000,
    goal_months=24
)

print(purchase_goal_status)

#goal delay

def calculate_goal_delay(baseline_projection, scenario_projection, goal_amount):
    baseline_month = None
    scenario_month = None

    # Find when baseline reaches the goal
    for data in baseline_projection:
        if data["savings"] >= goal_amount:
            baseline_month = data["month"]
            break

    # Find when scenario reaches the goal
    for data in scenario_projection:
        if data["savings"] >= goal_amount:
            scenario_month = data["month"]
            break

    # If baseline never reaches the goal
    if baseline_month is None:
        return {
            "baseline_goal_month": None,
            "scenario_goal_month": scenario_month,
            "goal_delay": None,
            "message": "Baseline does not reach the goal in the simulation period."
        }

    # If scenario never reaches the goal
    if scenario_month is None:
        return {
            "baseline_goal_month": baseline_month,
            "scenario_goal_month": None,
            "goal_delay": None,
            "message": "What-If scenario does not reach the goal in the simulation period."
        }

    # Calculate delay
    delay = scenario_month - baseline_month

    return {
        "baseline_goal_month": baseline_month,
        "scenario_goal_month": scenario_month,
        "goal_delay": delay,
        "message": "Goal delay calculated successfully."
    }

baseline_projection = calculate_projection(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=36
)

purchase_projection = calculate_purchase_scenario(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=36,
    purchase_amount=80000,
    purchase_month=3
)

goal_delay_result = calculate_goal_delay(
    baseline_projection,
    purchase_projection,
    goal_amount=800000
)

print(goal_delay_result)

#goal impact

def calculate_goal_impact(
    baseline_projection,
    scenario_projection,
    goal_amount
):
    baseline_goal_month = None
    scenario_goal_month = None

    for data in baseline_projection:
        if data["savings"] >= goal_amount:
            baseline_goal_month = data["month"]
            break

    for data in scenario_projection:
        if data["savings"] >= goal_amount:
            scenario_goal_month = data["month"]
            break

    baseline_final_savings = baseline_projection[-1]["savings"]
    scenario_final_savings = scenario_projection[-1]["savings"]

    savings_difference = (
        scenario_final_savings - baseline_final_savings
    )

    if baseline_goal_month is not None and scenario_goal_month is not None:
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

