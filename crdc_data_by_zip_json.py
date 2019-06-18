import csv  
import json
import glob
import os
import pathlib
CRDC_FOLDER = './data/crdc_data_by_state/'
SINGLE_CRDC_FILE = f"{CRDC_FOLDER}crdc2015-16-AL-oct-2018.csv"
NCES_DATA_FOLDER = "./data/NCES_data/"
NCES_DATA_FILE = f"{NCES_DATA_FOLDER}2015-16-NCES-data.csv"
CRDC_BY_ZIP_FOLDER = "./public/data/crdc_data_by_zip_json/"
SCHOOL_DATA_BY_NCES_ID = {}
missing_count = 0
total_count = 0

ALL_FILES_IN_CRDC_BY_STATE_FOLDER = glob.glob(f"{CRDC_FOLDER}*.csv")
# get the headers  and save them 

# def headers():
#   SCHOOL_DATA_HEADERS = open(SINGLE_CRDC_FILE).readline().rstrip() + ",ZIPCODE,CITY"
#   f = open(f"headers.csv", "a")
#   f.write(SCHOOL_DATA_HEADERS)
#   f.close()

# headers()

def write_to_disk(crdc_school):
  NCES_SCHOOL_ID = crdc_school["NCES_SCHOOL_ID"]
  ZIPCODE = crdc_school["ZIPCODE"]
  SAVE_FOLDER_LOCATION = f"{CRDC_BY_ZIP_FOLDER}/{ZIPCODE}/"
  FILENAME = f"{NCES_SCHOOL_ID}.json"
  save = pathlib.Path(SAVE_FOLDER_LOCATION).mkdir(parents=True, exist_ok=True)
  f = open(f"{SAVE_FOLDER_LOCATION}{FILENAME}", "a")
  f.write(json.dumps(crdc_school))
  f.close()
  print(f"SAVED {SAVE_FOLDER_LOCATION}/{FILENAME}")
  return save

def NCES_DATA():  
  with open(NCES_DATA_FILE,encoding="utf8", errors='ignore') as nces_data:
    schools = csv.DictReader(nces_data, delimiter=',')
    for school in schools:
      NCES_SCHOOL_ID = school["NCESSCH"].lstrip("0")
      SCHOOL_DATA_BY_NCES_ID[NCES_SCHOOL_ID] = school
    return SCHOOL_DATA_BY_NCES_ID


def CRDC_DATA_BY_STATE(SINGLE_CRDC_FILE):
  global missing_count
  global total_count
  with open(SINGLE_CRDC_FILE,encoding="utf8", errors='ignore') as crdc_file:
    crdc_schools = csv.DictReader(crdc_file, delimiter=',')
    for crdc_school in crdc_schools:
      NCES_CRDC_FILE_ID = str(crdc_school["NCES_SCHOOL_ID"])
      NCES_CRDC_FILE_ID = str(crdc_school["NCES_SCHOOL_ID"])
      # if(NCES_CRDC_FILE_ID == "10000201705"):
      #   print(True)
      if NCES_CRDC_FILE_ID in SCHOOL_DATA_BY_NCES_ID:
        crdc_school["ZIPCODE"] =SCHOOL_DATA_BY_NCES_ID[NCES_CRDC_FILE_ID]["MZIP"]
        crdc_school["CITY"] = SCHOOL_DATA_BY_NCES_ID[NCES_CRDC_FILE_ID]["MCITY"]
        write_to_disk(crdc_school)
      else:
        # print(json.dumps(crdc_school))
        print(f"{NCES_CRDC_FILE_ID} not in SCHOOL_DATA_BY_NCES_ID")
        missing_count += 1
      total_count += 1 

def merge_files():
  SCHOOL_DATA_BY_NCES_ID = NCES_DATA()
  for SINGLE_CRDC_FILE in ALL_FILES_IN_CRDC_BY_STATE_FOLDER:
    CRDC_DATA_BY_STATE(SINGLE_CRDC_FILE)


if __name__ == '__main__':
  merge_files()
  missing_percentage = (missing_count / total_count) * 100
  print(f"{missing_count} total missing count  and {total_count} in total records.. total missing records precentage is {missing_percentage}")




# print(SCHOOL_DATA_HEADERS)