# Book-server 
Vefþjónusta fyrir bókasöfn


## Forkröfur
_____________

Þú þarft að hafa Node uppsett hjá þér.
```bash
#fyrir linux
> sudo apt-get install nodejs

#fyrir mac
> brew install node
```

```powershell
#fyrir windows
> start http://bit.ly/2FPECLN
> Remove-Item -Recurse -Force homedir
```

## Uppsetning
_____________

Keyrir skipunina

```bash
> git clone https://github.com/adalsteinn95/vef2-2018-h1.git
> cd vef2-2018-h1
> npm install
```

Það þarf að fylla út .env skránna í rót verkefnisins 

```
JWT_SECRET=LEYNIORD
DATABASE_URL=postgres://username:password@localhost/database
CLOUDINARY_NAME=NAME
CLOUDINARY_APIKEY=NUMBER
CLOUDINARY_APISECRET=SECRET
```

Síðan eru keyrðar eftirfarandi skipanir til að setja upp gagnagrunn og gögn inn í hann

```bash
#býr til db
node createdb.js

#setur inn gögn í db
node init
```

Tekur smá tíma þar sem þetta er gert sync
## Vefþjónustur

* `/register`
  - `POST` býr til notanda

  ```
  curl -X POST \
  http://localhost:3000/register \
  -H 'Content-Type: application/json' \
  -d '{
	"username": "notandi",
	"password": "leyniord",
	"name": "nafn"
  }'
  ```
  - Skilar notanda
  ```
  {
    "username": "notandi",
    "name": "nafn"
  }
  ```
* `/login`
  - `POST` með notendanafni og lykilorði skilar token sem notar síðan sem authorization
  ```
  curl -X POST \
  http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{
	"username": "notandi",
	"password": "leyniord"
  }'
  ```

  Skilar token

  ```
  {
    "token": "{TOKEN}"
  }
  ```
* `/users`
  - `GET` skilar síðu af notendum

  ```
  curl -X GET \
  http://localhost:3000/users \
  -H 'Authorization: Bearer {TOKEN}' \
  -H 'Content-Type: application/json' 
  ```

  - Skilar fylki af notendum

  ```
  [
    {
        "id": 1,
        "username": "notandi",
        "name": "nafn",
        "image": null
    }
  ]
  ```
* `/users/:id`
  - `GET` skilar stökum notanda ef til
  ```
  curl -X GET \
  http://localhost:3000/users/1 \
  -H 'Authorization: Bearer {TOKEN}' \
  -H 'Content-Type: application/json' \
  ```
  - Skilar notanda
  ```
  {
    "id": 1,
    "username": "notandi",
    "name": "nafn",
    "image": null
  }
  ```
* `/users/me`
  - `GET` skilar innskráðum notanda

  ```
  curl -X GET \
  http://localhost:3000/users/me \
  -H 'Authorization: Bearer {TOKEN}' \
  -H 'Content-Type: application/json' 
  ```
  - Skilar notanda
  ```
  {
    "id": 1,
    "name": "nafn",
    "username": "notandi"
  }
  ```
  - `PATCH` uppfærir sendar upplýsingar um notanda fyrir utan notendanafn, getur verið nafn eða lykilorð, ef þau eru gild

  ```
  curl -X PATCH \
  http://localhost:3000/users/me \
  -H 'Authorization: Bearer {TOKEN}' \
  -H 'Content-Type: application/json' \
  -d '{
	  "password": "lalala",
	  "name": "breyting"
  }'
  ```
* `/users/me/profile`
  - `POST` setur eða uppfærir mynd fyrir notanda í gegnum Cloudinary og skilar slóð af myndinni ásamt því að vista hana fyrir viðeigandi notanda
  ```
  curl -X POST \
  http://localhost:3000/users/me/profile \
  -H 'Authorization: Bearer {TOKEN}' \
  -F 'image=@locationOfTheImage'
  ```
  - Skilar URL

  ```
  {
    "url": "https://res.cloudinary.com/hckoju8k4/image/upload/v1521566673/p2likueqwkljz9gwxzie.jpg"
  }
  ```
* `/categories`
  - `GET` skilar _síðu_ af flokkum . Offset segir til um hvaða síða er birt. offset=10 sleppur fyrstu 10 flokkunum og offset=20 sleppur fyrstu 20 flokkunum
  ```
  curl -X GET \
  http://localhost:3000/categories?offset=0 \ 
  ```
  - Skilar flokkunum með offset 0
  ```
  {
    "LIMIT": 10,
    "offsets": 0,
    "categories": [
        {
            "id": 7,
            "name": "Business"
        },
        ...
    ]
  }
  ```
  - `POST` býr til nýjan flokk og skilar
  ```
  curl -X POST \
  http://localhost:3000/categories \
  -H 'Authorization: Bearer {TOKEN}' \
  -H 'Content-Type: application/json' \
  -d '{
	"name": "Historic"
  }'
  ```
  - Skilar flokkinum
  ```
  {
    "result": {
        "id": 13,
        "name": "Historic"
    }
  }
  ```
* `/books`
  - `GET` skilar _síðu_ af bókum. Offset segir til um hvaða síða er birt. offset=10 sleppur fyrstu 10 bókunum og offset=20 sleppur fyrstu 20 bókunum

  ```
  curl -X GET \
  http://localhost:3000/books?offset=0
  ```
  - Skilar
  ```
  {
    "LIMIT": 10,
    "offsets": 0,
    "books": [
        {
            "id": 1,
            "title": "1984",
            "isbn13": "9780451524935",
            "author": "George Orwell",
            "description": "Winston Smith is a worker at the Ministry of Truth, where he falsifies records for the party. Secretly subversive, he and his colleague Julia try to free themselves from political slavery but the price of freedom is betrayal.",
            "category": "Science Fiction",
            "isbn10": "0451524934",
            "published": "",
            "pagecount": 246,
            "language": "en"
        },]
      ....
  }
  ```
  - `POST` býr til nýja bók ef hún er gild og skilar
  ```
  curl -X POST \
  http://localhost:3000/books \
  -H 'Authorization: Bearer {TOKEN}' \
  -H 'Content-Type: application/json' \
  -d '{
	  "title": "BookTitle",
	  "isbn13": "9783161484100",
	  "isbn10": "0198526636",
	  "category": "Historic",
	  "pagecount": 12,
	  "language": "en"
  }'
  ```
  - Skilar 
  ```
  {
      "id": 538,
	  "title": "BookTitle",
	  "isbn13": "9781402894626",
      "author": "",
      "description": "",
	  "category": "Historic",
      "isbn10": "0198526636",
      "published": "",
      "pagecount": 12,
	  "language": "en"
  }
  ```
* `/books?search=query`
  - `GET` skilar _síðu_ af bókum sem uppfylla leitarskilyrði. Offset segir til um hvaða síða er birt. offset=10 sleppur       -  fyrstu 10 bókunum og offset=20 sleppur fyrstu 20 bókunum
  ```
  curl -X GET \
  'http://localhost:3000/books?search=king&offset=0' \
  -H 'Content-Type: application/json' 
  ```
  - Skilar bókum sem innihalda 'king' í titli eða lýsingu
  ```
  {
    "LIMIT": 10,
    "offsets": 0,
    "books": [
        {
            "id": 3,
            "title": "A Clash of Kings (A Song of Ice and Fire, #2)",
            "isbn13": "9780553381696",
            "author": "George R. R. Martin",
            "description": "With his estate divided and his family scattered, Lord Eddard Stark returns to his territory to fight an ancient spell that is slowly devouring what is left of his land. Reprint.",
            "category": "Fantasy",
            "isbn10": "0553381695",
            "published": "1999",
            "pagecount": 761,
            "language": "en"
        },...
    ]
  }
  ```
* `/books/:id`
  - `GET` skilar stakri bók út frá id
  ```
  curl -X GET \
  http://localhost:3000/books/1 \
  -H 'Content-Type: application/json' 
  ```
  - Skilar bók sem hefur id=1
  ```
  {
    "id": 1,
    "title": "1984",
    "isbn13": "9780451524935",
    "author": "George Orwell",
    "description": "Winston Smith is a worker at the Ministry of Truth, where he falsifies records for the party. Secretly subversive, he and his colleague Julia try to free themselves from political slavery but the price of freedom is betrayal.",
    "category": "Science Fiction",
    "isbn10": "0451524934",
    "published": "",
    "pagecount": 246,
    "language": "en"
  }
  ```
  - `PATCH` uppfærir bók. Getur uppfært eftirfarandi hluti
    - title  
    - isbn10  
    - isbn13  
    - author  
    - description  
    - category  
    - published  
    - pagecount  
    - language  
  ```
  curl -X PATCH \
  http://localhost:3000/books/1 \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTIxNjYzMzc3LCJleHAiOjYwMDAwMDAwMDAxNTIxNjYwMDAwfQ.uqq5HRzCgS-KzIpdzabE0Pvytrspeoaui-UZqMWNq-w' \
  -H 'Content-Type: application/json' \
  -d '{
	  "title": "BookTitle12",
	  "author": "me"
	  
  }'
  ```
  - Skilar bókinni með uppfærðar upplýsingar
  ```
  {
    "id": 1,
    "title": "BookTitle12",
    "isbn13": "9780451524935",
    "author": "me",
    "description": "Winston Smith is a worker at the Ministry of Truth, where he falsifies records for the party. Secretly subversive, he and his colleague Julia try to free themselves from political slavery but the price of freedom is betrayal.",
    "category": "Science Fiction",
    "isbn10": "0451524934",
    "published": "",
    "pagecount": 246,
    "language": "en"
  }
  ```
* `/users/:id/read`
  - `GET` skilar _síðu_ af lesnum bókum notanda
  ```
  curl -X GET \
  http://localhost:3000/users/1/read \
  -H 'Authorization: Bearer {TOKEN}' \0
  -H 'Content-Type: application/json' 
  ```
  - Skilar 
  ```
  []
  ```
* `/users/me/read`
  - `GET` skilar _síðu_ af lesnum bókum innskráðs notanda
  ```
  curl -X GET \
  http://localhost:3000/users/2/read \
  -H 'Authorization: Bearer   {TOKEN}' \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/json' \
    -H 'Postman-Token: 512613dc-f8d2-49ab-accc-fe673de90c6e' \
    -d '{
	  "bookID": 2,
	  "rating": 1
  }'
  ```
  - Skilar
  ```
  {
    "id": 1,
    "userid": 2,
    "bookid": 2,
    "rating": 1,
    "ratingtext": ""
  }
  ```
  - `POST` býr til nýjan lestur á bók og skilar
  ```
  curl -X POST \
  http://localhost:3000/users/me/read \
  -H 'Authorization: Bearer     {TOKEN}' \
  -H 'Content-Type: application/json' \
  -d '{
	  "bookID": 2,
	  "rating": 1
  }'
  ```
  - Skilar 
  ```
  {
    "id": 1,
    "userid": 2,
    "bookid": 2,
    "rating": 1,
    "ratingtext": ""
  }
  ```
* `/users/me/read/:id`
  - `DELETE` eyðir lestri bókar fyrir innskráðann notanda. 

  ```
  curl -X DELETE \
  http://localhost:3000/users/me/read/2 \
  -H 'Authorization: Bearer {TOKEN}' \
  -H 'Content-Type: application/json' \
  ```
_____

# Meðlimir Weather CO.

## Þjálfari**(CEO) - Fannar G. Guðmundsson (fgg2@hi.is) [Github](https://github.com/fgg2)
* Er í forystu og leiðbeinir á fundum þar sem hópurinn er að forrita og hanna. 
* Þjálfarinn hefur yfirsýn yfir hvernig teyminu gengur og hvetur aðra áfram. 
* Þjálfarinn passar upp á að teymið vinni eftir góðri aðferð. 

## Kóða- og hönnunarstjóri**(CTO) - Aðalsteinn I. Pálsson (aip7@hi.is) [Github](https://github.com/Adalsteinn95) 
* Sér um útgáfu stjórnun, setur kóðastaðla, stýrir paraforritun. 
* Sér um að kóði sé rýndur og samþykkir Git branch í master. 
* Gefur út hugbúnaðinn. Hjálpar öðrum með einingaprófanir eða aðrar prófanir. 
* Vinnur að því að einfalda hönnun og refactora. 

