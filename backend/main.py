from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
async def search_food(query: str):
    results = [
        {
            "platform": "Swiggy",
            "item": f"{query}",
            "price": 299,
            "delivery_fee": 30,
            "delivery_time": 35,
            "url": f"https://www.swiggy.com/search?query={query}"
        },
        {
            "platform": "Zomato",
            "item": f"{query}",
            "price": 279,
            "delivery_fee": 25,
            "delivery_time": 30,
            "url": f"https://www.zomato.com/bangalore/order-food-online?query={query}"
        }
    ]
    return {"results": results}

@app.get("/")
def root():
    return {"status": "FoodDeal backend running!"}