import pandas as pd

def upload_contents(reporter,content):
    idx = len(pd.read_csv("contents.csv"))
    new_df = pd.DataFrame({
                          "reporter":reporter,
                          "solvedornot":False,
                          "lat":0,
                          "lon":0,
                          "content":content},index=[idx])
    
    new_df.to_csv("contents.csv",mode="a",header=False)
    return idx