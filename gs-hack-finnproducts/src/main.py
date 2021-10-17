import finnhub as finn
import os
import uvicorn
import random
import boto3
from analytics import *
from util import generate_recommendations, generate_loan_recommendations
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
from urllib.parse import unquote

app = FastAPI(docs_url="/finn/swagger")
dynamodb = boto3.resource('dynamodb')
user_table = dynamodb.Table('gs-hack-user_db')

origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

finn_api_key = os.environ['FINN_API_KEY']
finn_client = finn.Client(api_key=finn_api_key)

# USE /finn FOR THE STARTING OF ALL REQUESTS FOR ROUTING PURPOSES #

all_stocks = {
    'LOW_RISK_TICKERS': ['VOO', 'MA', 'BRK.A', 'DIS', 'VYM',
                         'PG', 'VNQ', 'SBUX', 'MSFT', 'KO', 'BAC', 'JNJ'],
    'MEDIUM_RISK_TICKERS': ['AMZN', 'O', 'NNN', 'R',
                            'CAT', 'NVDA', 'TSM', 'XOM', 'BA', 'F', 'UI'],
    'HIGH_RISK_TICKERS': ['NNDM', 'ARKK', 'ARKG', 'ARKX',
                          'PLTR', 'SPCE', 'ARQK', 'TSLA', 'NIO', 'RIOT']
}


class RiskLevel(str, Enum):
    LOW_RISK_TICKERS = "low"
    MEDIUM_RISK_TICKERS = "med"
    HIGH_RISK_TICKERS = "high"


@app.get('/health')
def healthcheck():
    return 200


@app.get('/finn/health')
def healthcheck_public():
    return 200


@app.get('/finn/stock/quote/{ticker}')
def getAnalyticsByTicker(ticker: str):
    try:
        return getStockObject(ticker, finn_client)
    except:
        raise HTTPException(
            status_code=500, detail="Stock Service is currently unavailable, please try again later")


@app.get('/finn/stock/recco/{risk_level}')
def getStocksForRiskLevel(risk_level: RiskLevel):
    stocks_to_display = random.sample(all_stocks[risk_level.name], 3)
    result = [getStockObject(stock, finn_client)
              for stock in stocks_to_display]
    return result


@app.get('/finn/stock/getInfo/{tickers}')
def getStockForTickers(tickers: str):
    selected_tickers = unquote(tickers)
    selected_tickers = selected_tickers.split(",")
    return [getStockWidgetObject(ticker, finn_client) for ticker in selected_tickers]


@app.get('/finn/user/recommendation/{cognito_id}')
def generateRecommendations(cognito_id: str):
    return generate_recommendations(cognito_id, user_table)


@app.get('/finn/user/loan_recommendation/{cognito_id}/{loan_amt}')
def generateLoanRecommendations(cognito_id: str, loan_amt: str):
    return generate_loan_recommendations(cognito_id, int(loan_amt), user_table)


if __name__ == "__main__":
    print("Service started!")
    uvicorn.run("main:app", host="0.0.0.0", port=8081, reload=True)
