import urllib.request
import multiprocessing
import time 
import os
from pathlib import Path
import requests
US_STATES = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", 
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
          "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
          "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
          "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]

DEPARTMENT_OF_ED_OPED_URL = "https://www2.ed.gov/about/offices/list/opepd/ppss/crdc/"
SAVE_FOLDER = "./crdc_data_by_state/"
CREATE_PATH_IF_NEED = pathlib.Path(SAVE_FOLDER_LOCATION).mkdir(parents=True, exist_ok=True)


def download_crdc_file_by_state(state):
  FILE_NAME = f"crdc-2015-16-{state.lower()}-aug-2018.csv"
  save_name = f"{SAVE_FOLDER}{FILE_NAME}" 
  exists = os.path.isfile(save_name)
  if  exists:
      print(f"already downloaded: {save_name}")
  else:
    DOWNLOAD_URL = f"{DEPARTMENT_OF_ED_OPED_URL}{FILENAME}"
    print(f"Downloading: ",DOWNLOAD_URL)
    filename = Path(save_name)
    url = DOWNLOAD_URL
    response = requests.get(url,verify= False)
    filename.write_bytes(response.content)

# Download 1 by 1 as to not overload the Department of eds servers.. really not that much to download so no big deal.
def download_all_crdc_files():
  for state in US_STATES:
      time.sleep(1)
      download_crdc_file_by_state(state)

if __name__ == '__main__':
  starttime = time.time()
  download_all_crdc_files()
  print('That took {} seconds'.format(time.time() - starttime))