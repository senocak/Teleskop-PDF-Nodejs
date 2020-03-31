# TeleskopApp PDF Maker!

This project is for the making pdf files for the specific urls and merge them as one.

# Usage

Example Urls;

- /kapak?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /genel?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /haber/1/?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /haber/2/?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /haber/3/?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /haber/4/?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /twitter/1/?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /twitter/2/?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /twitter/3/?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /instagram?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /blogforum/1/?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /blogforum/2/?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /video/1/?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /video/2/?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
	> **token** => get token from the backend
	> **stream_id** => get stream_id from the backend
	> **start_date** => starting date range for the pdf
	> **end_date** => ending date range for the pdf

## Making the pdfs then merging the pdfs as one

- /pdf?uuid=**UUID**
	> **UUID** => UUID for the variables
	>Just visit the below url and verify that pdfs are made and one pdf which it is named as **final.pdf**  is created under current timestamp folder for example **pdfs/<timestamp>/final.pdf**

- /rapor?uuid=**UUID**
	> **UUID** => UUID for the variables
	>Just visit the url and verify that all pdfs are embedded

## Screenshoots

<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-01.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-02.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-03.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-04.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-05.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-06.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-07.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-08.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-09.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-10.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-11.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-12.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-13.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-14.jpg?raw=true"  width="250px"/> |
<img src="https://github.com/senocak/NodeJsPDF/blob/master/assets/final/final-15.jpg?raw=true"  width="250px"/> |


- docker build -t pdf:1.0 .
- docker rm -f pdf
- docker run -d -p 3000:3000 --name pdf pdf:1.0
- docker exec -it pdf bash
	- npm i -g pm2
	- pm2 start index.js