from pathlib import Path
import sys
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# =========================================================
# PROJECT PATHS
# =========================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

FINANCIAL_MODEL_DIR = PROJECT_ROOT / "Financial model"

sys.path.insert(0, str(FINANCIAL_MODEL_DIR))


# =========================================================
# IMPORT EXISTING FINANCIAL MODEL
# =========================================================

try:

    from financial_model import (
        run_simulation,
        format_simulation_result
    )

except ImportError as error:

    raise RuntimeError(
        f"Could not import the existing financial model "
        f"from: {FINANCIAL_MODEL_DIR}"
    ) from error


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="FinSim API",
    description="Backend API for the FinSim What-If Financial Simulator",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5501",
    "http://127.0.0.1:5501",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class ScenarioRequest(BaseModel):

    scenario: str

    monthly_income: float = Field(
        ge=0
    )

    other_income: float = Field(
        default=0,
        ge=0
    )

    rent: float = Field(
        default=0,
        ge=0
    )

    food: float = Field(
        default=0,
        ge=0
    )

    transport: float = Field(
        default=0,
        ge=0
    )

    utilities: float = Field(
        default=0,
        ge=0
    )

    other_expenses: float = Field(
        default=0,
        ge=0
    )

    existing_emi: float = Field(
        default=0,
        ge=0
    )

    current_savings: float = Field(
        default=0
    )

    simulation_months: int = Field(
        default=36,
        ge=1,
        le=120
    )

    goal_amount: float = Field(
        ge=0
    )

    goal_deadline_month: int = Field(
        ge=1
    )

    scenario_inputs: dict[str, Any] = {}


# =========================================================
# SUPPORTED SCENARIOS
# =========================================================

SUPPORTED_SCENARIOS = {
    "purchase",
    "recurring_expense",
    "income_change",
    "emergency",
    "loan",
    "vacation",
    "savings_rate"
}

# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/")
def root():

    return {
        "message": "FinSim API is running",
        "status": "ok"
    }


@app.get("/api/health")
def health():

    return {
        "status": "healthy",
        "service": "FinSim API"
    }


# =========================================================
# SIMULATION ENDPOINT
# =========================================================

@app.post("/api/simulate")
def simulate(request: ScenarioRequest):

    scenario = request.scenario


    # -----------------------------------------------------
    # Check scenario
    # -----------------------------------------------------

    if scenario not in SUPPORTED_SCENARIOS:

        raise HTTPException(
            status_code=400,

            detail={
                "message": (
                    f"Scenario '{scenario}' is not currently "
                    f"supported by the financial model."
                ),

                "supported_scenarios":
                    sorted(SUPPORTED_SCENARIOS)
            }
        )


    # -----------------------------------------------------
    # Copy scenario inputs
    # -----------------------------------------------------

    scenario_inputs = dict(
        request.scenario_inputs
    )


    # -----------------------------------------------------
    # Frontend → Financial Model adapter
    # -----------------------------------------------------

    if scenario == "purchase":

        required = [
            "purchase_amount",
            "purchase_month"
        ]

        validate_scenario_inputs(
            scenario_inputs,
            required
        )


    elif scenario == "recurring_expense":

        required = [
            "additional_expense",
            "start_month"
        ]

        validate_scenario_inputs(
            scenario_inputs,
            required
        )


    elif scenario == "income_change":

        # Frontend sends income_change.
        #
        # Financial model expects:
        # income_change_percentage

        if "income_change_percentage" not in scenario_inputs:

            if "income_change" in scenario_inputs:

                scenario_inputs[
                    "income_change_percentage"
                ] = scenario_inputs[
                    "income_change"
                ]

            else:

                raise HTTPException(
                    status_code=422,

                    detail=(
                        "Income change percentage is required."
                    )
                )


        if "start_month" not in scenario_inputs:

            raise HTTPException(
                status_code=422,

                detail=(
                    "Income change start month is required."
                )
            )


    elif scenario == "emergency":

        required = [
            "emergency_amount",
            "emergency_month"
        ]

        validate_scenario_inputs(
            scenario_inputs,
            required
        )


    elif scenario == "loan":
        required = [
        "loan_amount",
        "annual_interest_rate",
        "loan_tenure_months",
        "loan_start_month"
    ]
        validate_scenario_inputs(scenario_inputs, required)

    elif scenario == "vacation":
        required = [
        "vacation_amount",
        "vacation_month"
    ]
        validate_scenario_inputs(scenario_inputs, required)

    elif scenario == "savings_rate":
        required = [
        "savings_rate_change",
        "start_month"
    ]
        validate_scenario_inputs(scenario_inputs, required)
    
    # -----------------------------------------------------
    # Run EXISTING financial model
    # -----------------------------------------------------

    try:

        result = run_simulation(

            scenario=scenario,

            monthly_income=request.monthly_income,

            other_income=request.other_income,

            rent=request.rent,

            food=request.food,

            transport=request.transport,

            utilities=request.utilities,

            other_expenses=request.other_expenses,

            existing_emi=request.existing_emi,

            current_savings=request.current_savings,

            simulation_months=request.simulation_months,

            goal_amount=request.goal_amount,

            goal_deadline_month=request.goal_deadline_month,

            scenario_inputs=scenario_inputs
        )


    except KeyError as error:

        raise HTTPException(
            status_code=422,

            detail=(
                f"Missing scenario input: {error}"
            )
        )


    except ValueError as error:

        raise HTTPException(
            status_code=400,

            detail=str(error)
        )


    except Exception as error:

        raise HTTPException(
            status_code=500,

            detail=(
                "The financial model could not "
                f"complete the simulation: {error}"
            )
        )


    # -----------------------------------------------------
    # Human-readable formatted result
    # -----------------------------------------------------

    try:

        formatted_result = (
            format_simulation_result(result)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,

            detail=(
                "Simulation completed, but the result "
                f"could not be formatted: {error}"
            )
        )


    # -----------------------------------------------------
    # API RESPONSE
    # -----------------------------------------------------

    return {

        "success": True,

        "scenario": scenario,

        "formatted": formatted_result,

        "cash_flow":
            result["cash_flow"],

        "baseline_projection":
            result["baseline_projection"],

        "scenario_projection":
            result["scenario_projection"],

        "comparison":
            result["comparison"],

        "goal_impact":
            result["goal_impact"]

    }


# =========================================================
# VALIDATION HELPER
# =========================================================

def validate_scenario_inputs(
    inputs: dict[str, Any],
    required: list[str]
):

    missing = [
        key
        for key in required
        if key not in inputs
    ]


    if missing:

        raise HTTPException(

            status_code=422,

            detail={
                "message":
                    "Missing scenario inputs.",

                "missing":
                    missing
            }
        )


# =========================================================
# RUN LOCALLY
# =========================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )