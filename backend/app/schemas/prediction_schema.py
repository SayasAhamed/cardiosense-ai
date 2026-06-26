from pydantic import BaseModel


class PredictionCreate(BaseModel):

    patient_id: int

    age: int

    sex: str

    cp: str

    trestbps: int

    chol: int

    fbs: bool

    restecg: str

    thalch: int

    exang: bool

    oldpeak: float

    slope: str

    ca: int

    thal: str