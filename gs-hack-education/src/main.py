import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from enum import Enum
from newsapi import NewsApiClient


class ArticleType(str, Enum):
    business = "business"
    general = "general"
    science = "science"
    technology = "technology"


app = FastAPI(docs_url="/edu/swagger")

origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# news_api_key = os.environ['NEWS_API_KEY']
news_api_key = 'bc22fee2b01642b3abd15f8cf1be4ced'

api = NewsApiClient(api_key=news_api_key)

# Please raise this exception if there is an error
# raise HTTPException(status_code=500, detail="Stock Service is currently unavailable, please try again later")
# Use os.environ[''] for any secrets!

# USE /edu FOR THE STARTING OF ALL REQUESTS FOR ROUTING PURPOSES #


@app.get('/health')
def healthcheck():
    return 200


@app.get("/edu")
def eduRun():
    return 200


@app.get("/edu/news_update/{article_type}")
def get_news(article_type: ArticleType):
    return api.get_top_headlines(country='sg', category=article_type.value, page_size=20)


if __name__ == "__main__":
    print("Service started!")
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
