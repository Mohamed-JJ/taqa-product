from io import BytesIO
from typing import Union

from fastapi import FastAPI, File, UploadFile
import joblib
import pandas as pd

from unidecode import unidecode
import string
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

import re

app = FastAPI()

model = joblib.load("xgb_multioutput_pipeline_2.pkl")

def preprocess_french(text):
    if pd.isna(text):
        return ""


    french_stopwords = set(stopwords.words('french'))
    
    text = unidecode(text.lower())
    text = text.translate(str.maketrans('', '', string.punctuation)) 
    tokens = word_tokenize(text, language='french')
    tokens = [t for t in tokens if t not in french_stopwords and len(t) > 1 and not t.isdigit()]
    return ' '.join(tokens)

def preprocess_column_name(col):
    col = col.lower()
    col = unidecode(col) 
    col = re.sub(r'[^\w\s]', '', col)
    col = re.sub(r'\s+', '_', col.strip())
    return col

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/file")
async def upload_file(file: UploadFile = File(...)):
    
    try :
        content = await file.read()
    
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(content)
        elif file.filename.endswith('.csv'):
            df = pd.read_csv(content)
        else:
            return {"error": "File must be xlsx or csv format"}

        df.dropna(inplace=True)

        data = df.to_dict(orient='records')
        
        print(df.size)
        
        return {
            "filename": file.filename,
            "data": data,
            "row_count": df.size
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        content = await file.read()
        
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(BytesIO(content))
        elif file.filename.endswith('.csv'):
            df = pd.read_csv(content)
        else:
            return {"error": "File must be xlsx or csv format"}

        df.columns = [preprocess_column_name(col) for col in df.columns]

        df.dropna(inplace=True)

        # print(df.columns)

        required_cols = ["description", "description_de_lequipement", "systeme", "section_proprietaire"] 

        if not all(col in df.columns for col in required_cols):
            return {"error": "File must contain description, equipment_description and systeme columns"}

        results = []
        
        for _, row in df.iterrows():
            row_data = row.to_dict()
            
            
            # Create DataFrame for single prediction
            pred_df = pd.DataFrame([row_data])
            # Apply preprocessing to the required columns
            pred_df['clean_description'] = pred_df['description'].apply(preprocess_french)
            pred_df['clean_description_equipment'] = pred_df['description_de_lequipement'].apply(preprocess_french)
            pred_df['clean_section_proprietaire'] = pred_df['section_proprietaire'].apply(preprocess_french)
            
            # Drop original columns since we have the preprocessed versions
            pred_df = pred_df.drop(['description', 'description_de_lequipement', 'section_proprietaire'], axis=1)
            
            predictions = model.predict(pred_df)
            
            # Combine original data with predictions
            prediction_results = {
                "Disponibilité": float(predictions[0][0]),
                "Process Safety": float(predictions[0][1]), 
                "Fiabilité Intégrité": float(predictions[0][2]),
                "Criticité": float(predictions[0][0]) + float(predictions[0][1]) + float(predictions[0][2])
            }
            
            results.append({
                "original_data": row_data,
                "predictions": prediction_results
            })
        
        return {
            "filename": file.filename,
            "results": results
        }

    except Exception as e:
        print(e)
        return {"error": str(e)}

