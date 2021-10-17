from ekyc import *
import os
import boto3
import uvicorn
import pprint
import numpy as np

from ekyc import process_kyc
from boto3.dynamodb.conditions import Key
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from util import update_user
from user import UserOptionalForm
from fastapi.responses import HTMLResponse


dynamodb = boto3.resource('dynamodb')
user_table = dynamodb.Table('gs-hack-user_db')
pp = pprint.PrettyPrinter(indent=4)

app = FastAPI(docs_url="/user/swagger")

origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Please raise this exception if there is an error
# raise HTTPException(status_code=500, detail="Stock Service is currently unavailable, please try again later")
# Use os.environ[''] for any secrets!

# USE /user FOR THE STARTING OF ALL REQUESTS FOR ROUTING PURPOSES #


@app.get('/health')
def healthcheck():
    return 200


@app.get('/user/health')
def healthcheck():
    return 200


@app.post('/user/kyc/verify')
async def verify(img: UploadFile = File(...), statement: UploadFile = File(...), nric: str = Form(...),
                 first_name: str = Form(...), last_name: str = Form(...), address: str = Form(...),
                 postal_code: str = Form(...), cognito_username: str = Form(...)):

    nric_contents = await img.read()

    nric_image = np.fromstring(nric_contents, np.uint8)

    statement_contents = await statement.read()

    statement_image = np.fromstring(statement_contents, np.uint8)

    if not nric_validity(nric):
        return {
            'nric_valid': False,
            'name_valid': False,
            'address_valid': False,
            'ekyc_status': False,
            'message': 'NRIC Number is not valid'
        }

    print("KYC Tier 1 Start")
    result = process_kyc(nric_image, nric, first_name, last_name)
    update_user(cognito_username, 'name_valid', result[0], user_table)
    update_user(cognito_username, 'nric_valid', result[1], user_table)
    update_user(cognito_username, 'ekyc_status', 'eKYC Pending', user_table)

    if result[0] and result[1]:
        update_user(cognito_username, 'ekyc_status', 'eKYC Tier 1', user_table)
        update_user(cognito_username, 'ekyc_tier1', True, user_table)

        tier2_result = process_tier_two_kyc(
            statement_image, first_name, last_name, address, postal_code)

        if tier2_result:
            update_user(cognito_username, 'ekyc_status',
                        'eKYC Tier 2', user_table)
            update_user(cognito_username, 'ekyc_tier2', True, user_table)

            return {
                'nric_valid': True,
                'name_valid': True,
                'address_valid': True,
                "ekyc_status": True,
                'message': "eKYC Tier 2"
            }

        else:
            update_user(cognito_username, 'ekyc_status',
                        'eKYC Tier 2 Pending', user_table)
            update_user(cognito_username, 'ekyc_tier2', True, user_table)

            return {
                'nric_valid': True,
                'name_valid': True,
                'address_valid': False,
                "ekyc_status": False,
                'message': "eKYC Tier 1"
            }

    else:
        return {
            'nric_valid': result[1],
            'name_valid': result[0],
            'address_valid': False,
            "ekyc_status": False,
            'message': "eKYC Pending"
        }


@app.get('/user/details/{cognito_id}')
def user(cognito_id: str):
    response = user_table.query(
        KeyConditionExpression=Key('cognitoID').eq(cognito_id)
    )
    return response


@app.post('/user/form')
async def user_optional_form(user_form: UserOptionalForm):
    cognito_id = user_form.cognito_id
    user_form_dict = user_form.dict()
    user_form_dict.pop("cognito_id")
    pp.pprint(user_form.dict())

    response = user_table.update_item(
        Key={
            'cognitoID': cognito_id
        },
        UpdateExpression=f"set onboarding=:onboarding, firstname=:firstname, lastname=:lastname, occupation=:occupation, citizenship=:citizenship, age=:age, address=:address, monthly_income=:monthly_income, questionnaire=:questionnaire, recommendations=:recommendations",
        ExpressionAttributeValues={
            ':firstname': user_form_dict['firstname'],
            ':lastname': user_form_dict['firstname'],
            ':occupation': user_form_dict['occupation'],
            ':citizenship': user_form_dict['citizenship'],
            ':age': user_form_dict['age'],
            ':address': user_form_dict['address'],
            ':monthly_income': user_form_dict['monthly_income'],
            ':questionnaire': user_form_dict['questionnaire'],
            ':recommendations': {},
            ':onboarding': True
        },
        ReturnValues="UPDATED_NEW"
    )
    return response


if __name__ == "__main__":
    print("Service started!")
    uvicorn.run("main:app", host="0.0.0.0", port=8080)
