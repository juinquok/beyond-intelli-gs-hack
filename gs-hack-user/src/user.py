from pydantic import BaseModel
from typing import Optional, List, Any, Dict


class UserOptionalForm(BaseModel):
    cognito_id: str
    firstname: str
    lastname: str
    occupation: str
    citizenship: str
    age: str
    address: str
    monthly_income: str
    questionnaire: Dict[str, Any]
    recommendations: Optional[Dict[str, List[Dict[str, Any]]]]
