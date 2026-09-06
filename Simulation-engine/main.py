from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from Simulation_engine import run_monte_carlo_simulation


app = FastAPI(title="Simulation Engine API")
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


class SimulationRequest(BaseModel):
	user_data: dict[str, Any]
	scenario_deltas: dict[str, Any] | None = None
	n_simulations: int = Field(default=1000, gt=0)


@app.get("/")
def root() -> dict[str, str]:
	return {"status": "Simulation Engine API is live"}


@app.post("/api/simulate")
def simulate(request: SimulationRequest) -> dict[str, list[float]]:
	return run_monte_carlo_simulation(
		user_data=request.user_data,
		scenario_deltas=request.scenario_deltas,
		n_simulations=request.n_simulations,
	)
