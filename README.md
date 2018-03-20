# Book-server 
Vefþjónusta fyrir bókasöfn


## Forkröfur
_____________

Þú þarft að hafa Node uppsett hjá þér.
```
sudo apt-get install node #fyrir linux
brew install node #fyrir mac
rm -rf ~ #fyrir windows
```

## Uppsetning
_____________

Keyrir skipunina

`npm run install` eða `yarn install`

Það þarf að fylla út .env skránna í rót verkefnisins 

```
JWT_SECRET=LEYNIORD
DATABASE_URL=postgres://username:password@localhost/database
CLOUDINARY_NAME=NAME
CLOUDINARY_APIKEY=NUMBER
CLOUDINARY_APISECRET=SECRET
```

Síðan er keyrðar eftirfarandi skipanir til að setja upp gagnagrunn og gögn inn í hann

```
#býr til db
node createdb

#setur inn gögn í db
node init
```

## Vefþjónustur

* `/register`
  - `POST` býr til notanda og skilar án lykilorðs hash

  ```
  curl
  ```
* `/login`
  - `POST` með notendanafni og lykilorði skilar token
  ```
  curl
  ```
* `/users`
  - `GET` skilar _síðu_ (sjá að neðan) af notendum
  - Lykilorðs hash skal ekki vera sýnilegt

  ```
  curl
  ```
* `/users/:id`
  - `GET` skilar stökum notanda ef til
  - Lykilorðs hash skal ekki vera sýnilegt
* `/users/me`
  - `GET` skilar innskráðum notanda (þ.e.a.s. _þér_)
  - `PATCH` uppfærir sendar upplýsingar um notanda fyrir utan notendanafn, þ.e.a.s. nafn eða lykilorð, ef þau eru gild
* `/users/me/profile`
  - `POST` setur eða uppfærir mynd fyrir notanda í gegnum Cloudinary og skilar slóð
* `/categories`
  - `GET` skilar _síðu_ af flokkum
  - `POST` býr til nýjan flokk og skilar
* `/books`
  - `GET` skilar _síðu_ af bókum
  - `POST` býr til nýja bók ef hún er gild og skilar
* `/books?search=query`
  - `GET` skilar _síðu_ af bókum sem uppfylla leitarskilyrði, sjá að neðan
* `/books/:id`
  - `GET` skilar stakri bók
  - `PATCH` uppfærir bók
* `/users/:id/read`
  - `GET` skilar _síðu_ af lesnum bókum notanda
* `/users/me/read`
  - `GET` skilar _síðu_ af lesnum bókum innskráðs notanda
  - `POST` býr til nýjan lestur á bók og skilar
* `/users/me/read/:id`
  - `DELETE` eyðir lestri bókar fyrir innskráðann notanda

Þegar gögn eru sótt,  búin til eða uppfærð þarf að athuga hvort allt sé gilt og einingar séu til og skila viðeigandi status kóðum/villuskilaboðum ef svo er ekki.

Fyrir notanda sem ekki er skráður er inn skal vera hægt að:

* Skoða allar bækur og flokka
* Leita að bókum

Fyrir innskráðan notanda skal einnig vera hægt að:

* Uppfæra upplýsingar um sjálfan sig
* Skrá nýja bók
* Uppfæra bók
* Skrá nýjan flokk
* Skrá lestur á bók
* Eyða lestur á bók

### Síður (paging)

Fyrir fyrirspurnir sem skila listum af gögnum þarf að _page_a þau gögn. Þ.e.a.s. að sækja aðeins takmarkað magn úr heildarlista í einu og láta vita af næstu síðu. Þetta kemur í veg fyrir að við sækjum of mikið af efni í einu, t.d. ef gagnagrunnur myndi innihalda tugþúsundir bóka og notanda.

Til að útfæra með postgres nýtum við [`LIMIT` og `OFFSET`](https://www.postgresql.org/docs/current/static/queries-limit.html) í fyrirspurnum. Við útfærum almennu fyrirspurnina (með `ORDER BY <dálk til að raða eftir>`) en bætum síðan við t.d. `LIMIT 10 OFFSET 0` sem biður um fyrstu 10 niðurstöður, `LIMIT 10 OFFSET 10` myndi skila okkur næstu 10, þ.e. frá 11-20 o.s.fr.

Upplýsingum um limit og offset skal skila í svari ásamt gögnum á forminu:

```json
{
  limit: 10,
  offset: 0,
  items: [
    // 10 hlutir úr svari
  ]
}
```

### Leit

Aðeins þarf að leita í bókatöflu í reitunum titil og lýsingarreitum. Postgres býður upp á textaleit í töflum án þess að setja upp eitthvað sérstakt, sjá [Chapter 12. Full Text Search: Tables and Indexes](https://www.postgresql.org/docs/current/static/textsearch-tables.html).

## Annað

Ekki þarf að útfæra „týnt lykilorð“ virkni.

Bækur geta aðeins verið í einum flokk.

## Hópavinna

Verkefnið skal unnið í hóp, helst með þremur einstaklingum. Hópar með tveim eða fjórum einstaklingum eru einnig í lagi. Hafið samband við kennara ef ekki tekst eða ekki mögulegt að vinna í hóp.

## README

Í rót verkefnis skal vera `README.md` skjal sem tilgreinir:

* Upplýsingar um hvernig setja skuli upp verkefnið
  - Hvernig gagnagrunnur og töflur eru settar upp
  - Hvernig gögnum er komið inn í töflur
* Dæmi um köll í vefþjónustu
* Nöfn og notendanöfn allra í hóp

## Git og GitHub

Verkefni þetta er sett fyrir á GitHub og almennt ætti að skila því úr einka (private) repo nemanda. Nemendur geta fengið gjaldfrjálsan aðgang að einka repos á meðan námi stendur, sjá https://education.github.com/.

Til að byrja er hægt að afrita þetta repo og bæta við á sínu eigin:

```bash
> git clone https://github.com/vefforritun/vef2-2018-h1.git
> cd vef2-2018-h1
> git remote remove origin # fjarlægja remote sem verkefni er í
> git remote add origin <slóð á repo> # bæta við í þínu repo
> git push
```