# Na página indivudual de cada série liste as temporadas


# crie um select com a lista das temporadas

GET /series/{id}/seasons

[
    {
        "id": "2e59f49b-a5e9-4793-984e-9f1e5712854e",
        "serie_id": "3191e63e-ab59-460d-a2bc-24d76065bc9a",
        "season_number": 1,
        "title": "Temporada 1",
        "description": "Casa de davi",
        "poster": "uploads/seasons/poster_6f503b94-ee00-4ad9-84a0-7968a45e7555.png",
        "is_published": true,
        "published_at": "2025-10-23T16:24:20.192775-03:00",
        "created_at": "2025-10-23T16:24:20.192774-03:00",
        "updated_at": "2025-10-23T16:24:20.192774-03:00"
    }
]


# ao seleciona a temporada carrege os episodios, listados 1 uma coluna abaixo do select

GET /seasons/{id}/episodes

[
    {
        "id": "e01237aa-be65-491d-8b29-4daa04c60d38",
        "season_id": "2e59f49b-a5e9-4793-984e-9f1e5712854e",
        "episode_number": 1,
        "title": "Episódio 1",
        "description": "Episódio 1",
        "thumbnail": "uploads/episodes/thumbnail_76c89162-01e7-42d7-8c5f-1e6697d6f8da.png",
        "video_url": "https://www.youtube.com/watch?v=K1-FoFj8Jbo",
        "duration": 200,
        "views": 0,
        "is_published": true,
        "published_at": "2025-10-23T16:24:57.124302-03:00",
        "created_at": "2025-10-23T16:24:57.1243-03:00",
        "updated_at": "2025-10-23T16:24:57.1243-03:00"
    }
]

