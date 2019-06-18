#!/bin/sh
unzip  data.zip && python3 crdc_data_by_zip_json.py  && python -m SimpleHTTPServer