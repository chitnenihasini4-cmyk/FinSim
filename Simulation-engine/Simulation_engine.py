import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import sys
import os
from pathlib import Path

financial_model_dir = Path(__file__).resolve().parent / 'Financial model'
sys.path.insert(0, str(financial_model_dir))

try:
    import financial_model
    import Assumptions
    from financial_model import calculate_cash_flow, calculate_projection
except ImportError:
    print(f"Warning: Could not import financial_model/Assumptions from {financial_model_dir}.")

def run_monte_carlo_simulation(user_data, scenario_deltas=None, n_simulations=1000, max_months=60):
    """
    Runs a vectorized Monte Carlo simulation for financial trajectories.
    """
    current_saved = user_data.get('current_saved', 0)
    monthly_income = user_data.get('monthly_income', 50000)

    # Category spending averages and standard deviations
    cat_means = user_data.get('category_means', {'food': 8000, 'rent': 15000, 'other': 7000})
    cat_stds = user_data.get('category_stds', {'food': 1000, 'rent': 0, 'other': 1500})

    category_spend = {
        category: np.random.normal(
            cat_means.get(category, 0),
            cat_stds.get(category, 0),
            size=(n_simulations, max_months)
        )
        for category in cat_means
    }

    recurring_spend_change = (scenario_deltas or {}).get('recurring_spend_change', 0)
    trajectories = np.empty((n_simulations, max_months))

    for simulation_index in range(n_simulations):
        savings = current_saved

        for month_index in range(max_months):
            spending = {
                category: values[simulation_index, month_index]
                for category, values in category_spend.items()
            }
            cash_flow = calculate_cash_flow(
                monthly_income=monthly_income,
                other_income=user_data.get('other_income', 0),
                rent=spending.get('rent', 0),
                food=spending.get('food', 0),
                transport=spending.get('transport', 0),
                utilities=spending.get('utilities', 0),
                other_expenses=(
                    spending.get('other', 0)
                    + spending.get('discretionary', 0)
                    + recurring_spend_change
                ),
                existing_emi=user_data.get('existing_emi', 0),
                current_savings=savings
            )
            projection = calculate_projection(
                current_savings=savings,
                monthly_cash_flow=cash_flow['monthly_cash_flow'],
                months=1
            )
            savings = projection[-1]['savings']
            trajectories[simulation_index, month_index] = savings
    
    # Extract percentiles across paths per month
    p10_path = np.percentile(trajectories, 10, axis=0)
    p50_path = np.percentile(trajectories, 50, axis=0)
    p90_path = np.percentile(trajectories, 90, axis=0)
    
    return {
        "p10_trajectory": p10_path.tolist(),
        "p50_trajectory": p50_path.tolist(),
        "p90_trajectory": p90_path.tolist()
    }

if __name__ == "__main__":
    sample_user = {
        'current_saved': 10000,
        'target_amount': 100000,
        'monthly_income': 40000,
        'category_means': {'food': 6000, 'rent': 10000, 'discretionary': 5000},
        'category_stds': {'food': 800, 'rent': 0, 'discretionary': 1200}
    }
    sample_scenario = {'recurring_spend_change': 100}
    
    results = run_monte_carlo_simulation(sample_user, sample_scenario)
    print("Simulation completed successfully!")
    print("p50 (Expected) Month 12 Balance:", round(results['p50_trajectory'][11], 2))

    months = range(1, len(results['p50_trajectory']) + 1)
    plt.figure(figsize=(10, 6))
    plt.plot(months, results['p10_trajectory'], label='P10', color='tab:red')
    plt.plot(months, results['p50_trajectory'], label='P50', color='tab:blue')
    plt.plot(months, results['p90_trajectory'], label='P90', color='tab:green')
    plt.xlabel('Month')
    plt.ylabel('Cumulative Savings')
    plt.title('Monte Carlo Savings Trajectories')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(os.path.dirname(__file__), 'simulation_trajectories.png'))
    plt.close()