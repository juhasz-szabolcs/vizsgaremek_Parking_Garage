from dotenv import load_dotenv
import os

class EnvLibrary:
    ROBOT_LIBRARY_SCOPE = 'GLOBAL'

    def __init__(self):
        load_dotenv()

    def get_environment_variables(self):
        """Load all environment variables and return them as a dictionary"""
        variables = {
            'URL': os.getenv('URL'),
            'VALID_EMAIL': os.getenv('VALID_EMAIL'),
            'INVALID_EMAIL': os.getenv('INVALID_EMAIL'),
            'PASSWORD': os.getenv('PASSWORD')
        }
        
        # Check if any variable is missing
        missing = [name for name, value in variables.items() if value is None]
        if missing:
            raise ValueError(f"Missing environment variables: {', '.join(missing)}")
            
        return variables 