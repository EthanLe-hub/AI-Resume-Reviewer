from fastapi import FastAPI

app = FastAPI() # create a fastapi instance.

@app.get("/") # get the request from the client and return the response to the client. 
def read_root(): # define a function to read the root of the api and return the response to the client. 
    return {"message": "API Resume Reviewer API is working!!"} 