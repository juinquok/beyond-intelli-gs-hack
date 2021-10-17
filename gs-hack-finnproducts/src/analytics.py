from datetime import datetime, timedelta

today = datetime.now()
start_date = today.strftime('%Y-%m-%d')
end_date = (today - timedelta(weeks=4)).strftime('%Y-%m-%d')


def getNews(ticker, start_date, end_date, client):
    news = client.company_news(ticker, _from=end_date, to=start_date)
    return news


def getAnalystRatings(ticker, client):
    raw_trends = client.recommendation_trends(ticker)
    return raw_trends[0:5]


def getCompanyProfile(ticker, client):
    profile = client.company_profile2(symbol=ticker)
    return profile


def getNewsSentiment(ticker, client):
    news_sentiment = client.news_sentiment(ticker)
    return news_sentiment


def getAggregateByDay(ticker, client):
    aggregateByDay = client.aggregate_indicator(ticker, 'D')
    return aggregateByDay


def getAggregateByMonth(ticker, client):
    aggregateByDay = client.aggregate_indicator(ticker, 'M')
    return aggregateByDay


def getStockPrices(ticker, client):
    stockPrices = client.quote(ticker)
    return stockPrices


def getStockObject(ticker, client):
    stock_analysis = {'ticker': ticker,
                      'profile': getCompanyProfile(ticker, client),
                      'trends': getAnalystRatings(ticker, client),
                      'news': getNews(ticker, start_date, end_date, client),
                      'aggregate_indicators': {
                          'month': getAggregateByMonth(ticker, client),
                          "day": getAggregateByDay(ticker, client)
                      },
                      'stock_prices': getStockPrices(ticker, client),
                      'message': 'API-LIVE'
                      }
    return stock_analysis


def getStockWidgetObject(ticker, client):
    stock_analysis = {'ticker': ticker,
                      'profile': getCompanyProfile(ticker, client),
                      'trends': getAnalystRatings(ticker, client),
                      'aggregate_indicators': {
                          'month': getAggregateByMonth(ticker, client),
                          "day": getAggregateByDay(ticker, client)
                      },
                      'stock_prices': getStockPrices(ticker, client),
                      'message': 'API-LIVE'
                      }
    return stock_analysis
