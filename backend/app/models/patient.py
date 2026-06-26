from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Patient(Base):

    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String)

    age = Column(Integer)

    gender = Column(String)

    phone = Column(String, nullable=True)

    address = Column(String, nullable=True)