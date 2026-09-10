from pydantic import BaseModel

class DashboardStats(BaseModel):
    total_patients: int
    total_predictions: int
    no_risk: int
    moderate_risk: int
    high_risk: int