# TeleskopApp PDF Maker!

This project is for the making pdf files for the specific url and merge them as one.

# Usage

Example Urls;

- /genel?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /haber-analiz?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /twitter?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
- /instagram?token=**token**&stream_id=**stream_id**&start_date=**start_date**&end_date=**end_date**
	> **token** => get token from the backend
	> **stream_id** => get stream_id from the backend
	> **start_date** => starting date range for the pdf
	> **end_date** => ending date range for the pdf

## Making and merging pdf then respond

- /pdf
	>Just visit the below url and verify that pdfs are made and one pdf which it is named as **final.pdf**  is created under current timestamp folder for example **pdfs/1579878093380/final.pdf**
