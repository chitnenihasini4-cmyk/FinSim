from financial_model import calculate_cash_flow
from financial_model import calculate_projection
from financial_model import calculate_purchase_scenario
from financial_model import calculate_recurring_expense_scenario
from financial_model import calculate_income_change_scenario
from financial_model import calculate_emergency_scenario
from financial_model import calculate_emi
from financial_model import calculate_loan_amortization
from financial_model import calculate_loan_scenario
from financial_model import compare_projections
from financial_model import calculate_goal_status
from financial_model import calculate_goal_delay
from financial_model import calculate_goal_impact

from financial_model import run_purchase_simulation

from financial_model import run_simulation

from financial_model import format_simulation_result

print("### NEW TEST FILE IS RUNNING ###")

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

print("CASH FLOW")
print(result)


projection = calculate_projection(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=12
)

print("\nPROJECTION")

for month in projection:
    print(month)

print("\nPURCHASE SCENARIO")

purchase_projection = calculate_purchase_scenario(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=12,
    purchase_amount=80000,
    purchase_month=3
)

for month in purchase_projection:
    print(month)


print("\nRECURRING EXPENSE SCENARIO")

recurring_projection = calculate_recurring_expense_scenario(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=12,
    additional_expense=5000,
    start_month=3
)

for month in recurring_projection:
    print(month)


print("\nINCOME CHANGE SCENARIO")

income_projection = calculate_income_change_scenario(
    current_savings=200000,
    monthly_income=60000,
    other_income=5000,
    total_expenses=35000,
    existing_emi=5000,
    months=12,
    income_change_percentage=10,
    start_month=3
)

for month in income_projection:
    print(month)


print("\nEMERGENCY SCENARIO")

emergency_projection = calculate_emergency_scenario(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=12,
    emergency_amount=100000,
    emergency_month=3
)

for month in emergency_projection:
    print(month)

print("\nLOAN EMI")

emi = calculate_emi(
    loan_amount=500000,
    annual_interest_rate=12,
    loan_tenure_months=36
)

print("Monthly EMI:", round(emi, 2))

print("\nLOAN AMORTIZATION")

loan_schedule = calculate_loan_amortization(
    loan_amount=500000,
    annual_interest_rate=12,
    loan_tenure_months=36
)

for month in loan_schedule:
    print(month)

print("\nLOAN SCENARIO")

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
    months=36
)

purchase_projection = calculate_purchase_scenario(
    current_savings=200000,
    monthly_cash_flow=25000,
    months=36,
    purchase_amount=80000,
    purchase_month=3
)
print("\nCOMPARISON")

comparison = compare_projections(
    baseline_projection,
    purchase_projection
)

for month in comparison:
    print(month)

print("\nGOAL STATUS")

baseline_goal_status = calculate_goal_status(
    baseline_projection,
    goal_amount=800000,
    goal_months=36
)

purchase_goal_status = calculate_goal_status(
    purchase_projection,
    goal_amount=800000,
    goal_months=36
)

print("Baseline:", baseline_goal_status)
print("What-If:", purchase_goal_status)

print("\nGOAL DELAY")

goal_delay = calculate_goal_delay(
    baseline_projection,
    purchase_projection,
    goal_amount=800000
)

print(goal_delay)

print("\nGOAL IMPACT")

goal_impact = calculate_goal_impact(
    baseline_projection,
    purchase_projection,
    goal_amount=800000,
    goal_deadline_month=24
)

print(goal_impact)





print("\nMASTER PURCHASE SIMULATION")

result = run_purchase_simulation(
    monthly_income=60000,
    other_income=5000,
    rent=15000,
    food=6000,
    transport=3000,
    utilities=3000,
    other_expenses=8000,
    existing_emi=5000,
    current_savings=200000,
    simulation_months=36,
    purchase_amount=80000,
    purchase_month=3,
    goal_amount=800000,
    goal_deadline_month=36
)

print(result)






print("\nMASTER SIMULATION")

result = run_simulation(
    scenario="purchase",

    monthly_income=60000,
    other_income=5000,

    rent=15000,
    food=6000,
    transport=3000,
    utilities=3000,
    other_expenses=8000,

    existing_emi=5000,
    current_savings=200000,

    simulation_months=36,

    goal_amount=800000,
    goal_deadline_month=36,

    scenario_inputs={
        "purchase_amount": 80000,
        "purchase_month": 3
    }
)

print(result)

print("\nMASTER RECURRING EXPENSE SIMULATION")

result = run_simulation(
    scenario="recurring_expense",

    monthly_income=60000,
    other_income=5000,

    rent=15000,
    food=6000,
    transport=3000,
    utilities=3000,
    other_expenses=8000,

    existing_emi=5000,
    current_savings=200000,

    simulation_months=36,

    goal_amount=800000,
    goal_deadline_month=36,

    scenario_inputs={
        "additional_expense": 5000,
        "start_month": 3
    }
)

print(result)

print("\nMASTER INCOME CHANGE SIMULATION")

result = run_simulation(
    scenario="income_change",

    monthly_income=60000,
    other_income=5000,

    rent=15000,
    food=6000,
    transport=3000,
    utilities=3000,
    other_expenses=8000,

    existing_emi=5000,
    current_savings=200000,

    simulation_months=36,

    goal_amount=800000,
    goal_deadline_month=36,

    scenario_inputs={
        "income_change_percentage": 10,
        "start_month": 3
    }
)

print(result)

formatted_result = format_simulation_result(result)

print("\nFORMATTED INCOME CHANGE RESULT")

print(formatted_result)

print("\nMASTER EMERGENCY SIMULATION")

result = run_simulation(
    scenario="emergency",

    monthly_income=60000,
    other_income=5000,

    rent=15000,
    food=6000,
    transport=3000,
    utilities=3000,
    other_expenses=8000,

    existing_emi=5000,
    current_savings=200000,

    simulation_months=36,

    goal_amount=800000,
    goal_deadline_month=36,

    scenario_inputs={
        "emergency_amount": 100000,
        "emergency_month": 3
    }
)

print(result)

print("\nMASTER LOAN SIMULATION")

result = run_simulation(
    scenario="loan",

    monthly_income=60000,
    other_income=5000,

    rent=15000,
    food=6000,
    transport=3000,
    utilities=3000,
    other_expenses=8000,

    existing_emi=5000,
    current_savings=200000,

    simulation_months=48,

    goal_amount=800000,
    goal_deadline_month=48,

    scenario_inputs={
        "loan_amount": 500000,
        "annual_interest_rate": 12,
        "loan_tenure_months": 36,
        "loan_start_month": 3
    }
)

print(result)

print("\nFORMATTED FINSIM RESULT")

formatted_result = format_simulation_result(result)

print(formatted_result)

# ==========================================
# EDGE CASE: NEGATIVE MONTHLY CASH FLOW
# ==========================================

print("\nNEGATIVE CASH FLOW TEST")

cash_flow = calculate_cash_flow(
    monthly_income=30000,
    other_income=0,
    rent=10000,
    food=10000,
    transport=5000,
    utilities=5000,
    other_expenses=5000,
    existing_emi=5000,
    current_savings=200000
)

print("Monthly cash flow:", cash_flow["monthly_cash_flow"])

# ==========================================
# EDGE CASE: ZERO MONTHLY CASH FLOW
# ==========================================

print("\nZERO CASH FLOW TEST")

cash_flow = calculate_cash_flow(
    monthly_income=40000,
    other_income=0,
    rent=10000,
    food=10000,
    transport=5000,
    utilities=5000,
    other_expenses=5000,
    existing_emi=5000,
    current_savings=200000
)

print("Monthly cash flow:", cash_flow["monthly_cash_flow"])

# ==========================================
# EDGE CASE: SAVINGS DEPLETION
# ==========================================

print("\nSAVINGS DEPLETION TEST")

projection = calculate_projection(
    current_savings=50000,
    monthly_cash_flow=-10000,
    months=8
)

print("Savings projection:", projection)

print("\nGOAL REACHED TEST")

result = run_simulation(
    scenario="income_change",
    monthly_income=10000,
    other_income=0,
    rent=0,
    food=0,
    transport=0,
    utilities=0,
    other_expenses=0,
    existing_emi=0,
    current_savings=50000,
    simulation_months=10,
    goal_amount=100000,
    goal_deadline_month=10,
    scenario_inputs={
        "income_change_percentage": 0,
        "start_month": 1
    }
)

print("Goal impact:", result["goal_impact"])

print("\nGOAL MISSED TEST")

result = run_simulation(
    scenario="income_change",
    monthly_income=5000,
    other_income=0,
    rent=0,
    food=0,
    transport=0,
    utilities=0,
    other_expenses=0,
    existing_emi=0,
    current_savings=20000,
    simulation_months=10,
    goal_amount=100000,
    goal_deadline_month=10,
    scenario_inputs={
        "income_change_percentage": 0,
        "start_month": 1
    }
)

print("Goal impact:", result["goal_impact"])

print("\nGOAL REACHED ON DEADLINE TEST")

result = run_simulation(
    scenario="income_change",
    monthly_income=5000,
    other_income=0,
    rent=0,
    food=0,
    transport=0,
    utilities=0,
    other_expenses=0,
    existing_emi=0,
    current_savings=50000,
    simulation_months=10,
    goal_amount=100000,
    goal_deadline_month=10,
    scenario_inputs={
        "income_change_percentage": 0,
        "start_month": 1
    }
)

print("Goal impact:", result["goal_impact"])

print("\nINCOME DECREASE TEST")

result = run_simulation(
    scenario="income_change",
    monthly_income=60000,
    other_income=5000,
    rent=15000,
    food=8000,
    transport=3000,
    utilities=2000,
    other_expenses=3000,
    existing_emi=5000,
    current_savings=200000,
    simulation_months=12,
    goal_amount=800000,
    goal_deadline_month=12,
    scenario_inputs={
        "income_change_percentage": -10,
        "start_month": 3
    }
)

print("Income decrease result:", format_simulation_result(result))

print("\nLOAN EMI TEST")

result = run_simulation(
    scenario="loan",
    monthly_income=60000,
    other_income=5000,
    rent=15000,
    food=8000,
    transport=3000,
    utilities=2000,
    other_expenses=3000,
    existing_emi=5000,
    current_savings=200000,
    simulation_months=36,
    goal_amount=800000,
    goal_deadline_month=36,
    scenario_inputs={
        "loan_amount": 500000,
        "annual_interest_rate": 12,
        "loan_tenure_months": 36,
        "loan_start_month": 3
    }
)

formatted_result = format_simulation_result(result)

print("Loan EMI result:", formatted_result)

print("\nZERO INTEREST LOAN TEST")

result = run_simulation(
    scenario="loan",
    monthly_income=60000,
    other_income=5000,
    rent=15000,
    food=8000,
    transport=3000,
    utilities=2000,
    other_expenses=3000,
    existing_emi=5000,
    current_savings=200000,
    simulation_months=12,
    goal_amount=300000,
    goal_deadline_month=12,
    scenario_inputs={
        "loan_amount": 120000,
        "annual_interest_rate": 0,
        "loan_tenure_months": 12,
        "loan_start_month": 1
    }
)

formatted_result = format_simulation_result(result)

print("Zero interest loan result:", formatted_result)

print("\nHIGH INTEREST LOAN TEST")

result = run_simulation(
    scenario="loan",
    monthly_income=60000,
    other_income=5000,
    rent=15000,
    food=8000,
    transport=3000,
    utilities=2000,
    other_expenses=3000,
    existing_emi=5000,
    current_savings=200000,
    simulation_months=12,
    goal_amount=300000,
    goal_deadline_month=12,
    scenario_inputs={
        "loan_amount": 120000,
        "annual_interest_rate": 24,
        "loan_tenure_months": 12,
        "loan_start_month": 1
    }
)

formatted_result = format_simulation_result(result)

print("High interest loan result:", formatted_result)

print("\nLONG TENURE LOAN TEST")

result = run_simulation(
    scenario="loan",
    monthly_income=60000,
    other_income=5000,
    rent=15000,
    food=8000,
    transport=3000,
    utilities=2000,
    other_expenses=3000,
    existing_emi=5000,
    current_savings=200000,
    simulation_months=60,
    goal_amount=500000,
    goal_deadline_month=60,
    scenario_inputs={
        "loan_amount": 500000,
        "annual_interest_rate": 12,
        "loan_tenure_months": 60,
        "loan_start_month": 1
    }
)

formatted_result = format_simulation_result(result)

print("Long tenure loan result:", formatted_result)

print("\nINCOME INCREASE TEST")

result = run_simulation(
    scenario="income_change",
    monthly_income=60000,
    other_income=5000,
    rent=15000,
    food=8000,
    transport=3000,
    utilities=2000,
    other_expenses=3000,
    existing_emi=5000,
    current_savings=200000,
    simulation_months=12,
    goal_amount=300000,
    goal_deadline_month=12,
    scenario_inputs={
        "income_change_percentage": 10,
        "start_month": 3
    }
)

formatted_result = format_simulation_result(result)

print("Income increase result:", formatted_result)

print("\nGOAL DEADLINE ENFORCEMENT TEST")

result = run_simulation(
    scenario="income_change",
    monthly_income=10000,
    other_income=0,
    rent=0,
    food=0,
    transport=0,
    utilities=0,
    other_expenses=0,
    existing_emi=0,
    current_savings=20000,
    simulation_months=10,
    goal_amount=100000,
    goal_deadline_month=5,
    scenario_inputs={
        "income_change_percentage": 0,
        "start_month": 1
    }
)

print("Goal impact:", result["goal_impact"])

# LOAN AMORTIZATION COMPLETION TEST

loan_amount = 500000
annual_interest_rate = 12
loan_tenure_months = 60

schedule = calculate_loan_amortization(
    loan_amount,
    annual_interest_rate,
    loan_tenure_months
)

final_balance = schedule[-1]["remaining_balance"]

print("LOAN AMORTIZATION COMPLETION TEST")
print("Number of payments:", len(schedule))
print("Final remaining balance:", final_balance)

if len(schedule) == loan_tenure_months and abs(final_balance) < 0.01:
    print("PASS: Loan is fully amortized.")
else:
    print("FAIL: Loan is not fully amortized.")

# NEGATIVE SAVINGS THROUGH SCENARIO TEST

result = run_simulation(
    monthly_income=30000,
    rent=15000,
    food=10000,
    transport=5000,
    utilities=5000,
    other_expenses=5000,
    existing_emi=0,
    current_savings=10000,
    simulation_months=6,
    goal_amount=100000,
    goal_deadline_month=6,
    scenario="income_change",
    other_income=0,
    scenario_inputs={
        "income_change_percentage": -50,
        "start_month": 1
    }
)

final_savings = result["scenario_projection"][-1]["savings"]

print("NEGATIVE SAVINGS SCENARIO TEST")
print("Final scenario savings:", final_savings)

if final_savings < 0:
    print("PASS: Scenario correctly produces negative savings.")
else:
    print("FAIL: Scenario did not produce negative savings.")

# SCENARIO CONSISTENCY TEST

result = run_simulation(
    monthly_income=30000,
    rent=0,
    food=0,
    transport=0,
    utilities=0,
    other_expenses=0,
    existing_emi=0,
    current_savings=20000,
    simulation_months=10,
    goal_amount=100000,
    goal_deadline_month=5,
    scenario="income_change",
    other_income=0,
    scenario_inputs={
        "income_change_percentage": 0,
        "start_month": 1
    }
)

baseline_final = result["baseline_projection"][-1]["savings"]
scenario_final = result["scenario_projection"][-1]["savings"]

print("SCENARIO CONSISTENCY TEST")
print("Baseline final savings:", baseline_final)
print("Scenario final savings:", scenario_final)

if abs(baseline_final - scenario_final) < 0.01:
    print("PASS: Scenario is consistent with baseline when there is no change.")
else:
    print("FAIL: Scenario differs from baseline despite 0% income change.")
