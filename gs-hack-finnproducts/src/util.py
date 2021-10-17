import boto3
import pprint
from boto3.dynamodb.conditions import Key
from loans import loans
from credit_cards import student_cards, normal_cards

def calculate_payable(loan_amt: int, loan_tenure: int, interest_rate: float):
    return round((loan_amt / (loan_tenure * 12)) * (1 + interest_rate), 2)

def generate_recommendations(cognito_id: str, user_table):
    user_response = user_table.query(
        KeyConditionExpression=Key('cognitoID').eq(cognito_id)
    )['Items'][0]

    citizenship = user_response['citizenship']
    age = user_response['age']
    occupation = user_response['occupation']
    monthly_income = user_response['monthly_income']

    cards = normal_cards

    if 'Student' in occupation:
        cards = student_cards
    
    recommended_cards = {}
    for key, value in cards.items():
        if 'eligibility' in value and (int(age) < int(value['eligibility']['min_age']) or int(age) > int(value['eligibility']['max_age'])):
            continue
        if 'min_income' in value and int(monthly_income) < int(value['min_income']):
            continue
        if 'eligibility' in value and 'citizenship' in value['eligibility'] and not (value['eligibility']['citizenship'] == "" or citizenship in value['eligibility']['citizenship']):
            continue

        recommended_cards[key] = value
    
    recommended_loans =  {}
    for key, value in loans.items():
        if len(recommended_loans) < 3:
            value['payable_mth'] = str(calculate_payable(int(value['loan_amt']), int(value['loan_tenure']), float(value['interest_rate'])))
            recommended_loans[key] = value

    response = user_table.update_item(
        Key={
            'cognitoID': cognito_id
        },
        UpdateExpression="set recommendations.creditcard=:recommended_cards, recommendations.loans=:recommended_loans",
        ExpressionAttributeValues={
            ':recommended_cards': recommended_cards,
            ':recommended_loans': recommended_loans
        },
        ReturnValues="UPDATED_NEW"
    )

    return 200

def generate_loan_recommendations(cognito_id: str, loan_amt: int, user_table):
    response = user_table.update_item(
        Key={
            'cognitoID': cognito_id
        },
        UpdateExpression="set recommendations.loans=:recommended_loans",
        ExpressionAttributeValues={
            ':recommended_loans': {}
        },
        ReturnValues="UPDATED_NEW"
    )
    user = user_table.query(
        KeyConditionExpression=Key('cognitoID').eq(cognito_id)
    )['Items'][0]

    recommended_loans = {}
    for key, value in loans.items():
        payable_mth = calculate_payable(loan_amt, int(value['loan_tenure']), float(value['interest_rate']))
        if loan_amt <= int(value['loan_amt']) and round(int(user['monthly_income']) * 0.3, 2) >= payable_mth:
            value['payable_mth'] = str(payable_mth)
            recommended_loans[key] = value

    response = user_table.update_item(
        Key={
            'cognitoID': cognito_id
        },
        UpdateExpression="set recommendations.loans=:recommended_loans",
        ExpressionAttributeValues={
            ':recommended_loans': recommended_loans
        },
        ReturnValues="UPDATED_NEW"
    )

    return 200