#!/bin/sh
aws s3 sync "./public/" s3://schooldiversityreport.com/ && echo "URL:http://davideholmes-website.s3-website-us-east-1.amazonaws.com"