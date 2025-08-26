# middleware.py
from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
    """
    Adds CORS middleware to the FastAPI app.
    """
    origins = [
        "http://localhost:5173",  
        "http://localhost:5174", 
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,  # or ["*"] for development
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
