# Civil Rights Data Collection

<img src="img/example.png">

## Requirements 
Python 3.5+

## About 
The civil rights data collection is something department of Ed does every year where they ask schools across America to fill out a questionnaire about their school like how many students are enrolled by race, how many of those students are in gifted programs, how many students was suspended by race and a bunch of other useful information. You can learn more about the Department of Education’s civil rights dataset @  [https://www2.ed.gov/about/offices/list/ocr/data.html](https://www2.ed.gov/about/offices/list/ocr/data.html)



## History
I originally built this back in 2016 over a couple of days as 20% project at [US Digital Service](https://usds.gov). I built it as a way to help find a good school for my son. My criteria for a school was not only finding a diverse school but also making sure that he went to a school where he had an equal opportunity to get into gifted programs as everyone else.  After originally releasing this in 2016 to help find a good school for my son, I wanted to see how the school we picked compared to 2013-2015 data and ended up updating the dataset along with updating how I build the dataset. I took out the requirement for a Postgres database and also replaced node.js for python. I did this in order to make it more serverless. Below are the instructions on how to build it. If you want the 2013-2015 dataset, you can find it on the 2013-2014-crdc-branch. 


## Problems with the data

For the 2015-2016 dataset, there is currently no way to find schools by zip, which is useful for people to search for schools. At least there is no way to do it without a lot of work.  The reason being is this paragraph on page 14 section 5.2 of the civil rights data collection documentation which states 

```
In most cases, the LEAID and SCHID combined (COMBOKEY) match the National Center of Education Data (NCES)
ID used in EDFacts, although there are some schools where the CRDC and NCES identifiers differ due to
differences in definitions and procedures between EDFacts and the CRDC. LEAs that did not have an existing
ID were issued an NCES ID if there was one, or a new 7-digit LEAID, which consisted of the 2-digit state
FIPS code followed by a 5-digit ID assigned by the PSC. Schools that did not have an existing ID were
issued an NCES ID if there was one, or a new ID that consisted of the LEAID and a 5-digit school code
assigned by the PSC. 
```

This means that for some schools there isn’t an accurate NCES number which makes it hard to find the geographical information of the school.  This wouldn’t be a problem except some large schools in cities like NYC  share 1 NCES number in the CRDC dataset but in reality each county in NYC has a separate NCES number. 


Luckily, the office of [Policy and Program Studies Service at the Department]( https://www2.ed.gov/about/offices/list/opepd/ppss/crdc-state-files.html
] also used the dataset and they break it down by state to make it easier for states to use CRDC data without having to download the entire 400MB(34mb zipped) dataset.  

The good thing about the PPSS dataset is that it contains the [NCES number]( https://nces.ed.gov/ccd/schoolsearch/
) for the schools. The NCES number is the global id used to identify schools. Having that is important because NCES, also has a dataset [https://nces.ed.gov/ccd/pubschuniv.asp
]( https://nces.ed.gov/ccd/pubschuniv.asp
) for you to search school information by their NCES number. Using that I wrote a simple python script to merge the 2 dataset together in order to use them for School Diversity report.  


Other problems include not all the state data from PPSS has NCES IDs and because of that, I can’t match it with the NCES data. Currently there are about 6% of schools missing from schooldiversityreport.com. I am working on fixing that. 

More information on how to build the data for the site is below.


## How to build and run locally.
I tried this on Mac OS X Mojave, but should work the same using Linux.

```
Clone repo
CD into directory

Run “./Build.sh”
# After that runs go to 
http://localhost:8000/public/

```

What this does is it will take the CSV’s and break them down into individual json files put into directories by zip code and NCES ID  like this ```/{ZIP_CODE}/{NCES_ID}.json``` fair warning that breaking down the 400MB CSV files to 96,000 separate JSON files takes up about ~5GB of space. By default ```./Build.sh``` will start the python local server but for future references you can run ``` python -m SimpleHTTPServer```



