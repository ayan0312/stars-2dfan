# stars-2dfan

```
net start mongodb
yarn start
```

# Subject

```
{
    "_id" : ObjectId("f76e52c80000000000000000"),
    "name" : "xxxxx",
    "anotherName" : "",
    "brand" : [ 
        "xxx"
    ],
    "releaseDate" : [ 
        "2015-10-30"
    ],
    "painter" : [ 
        "xxx"
    ],
    "voiceActor" : [ 
        "xxx"
    ],
    "scriptwriter" : [ 
        "xxx"
    ],
    "musician" : [],
    "singer" : [],
    "image" : {
        "path" : "g:/galgame/stars-2dfan.images/",
        "name" : "62b83b10b092be971fe8a2ad9e0a609c",
        "type" : "jpg",
        "size" : "91708",
        "filename" : "g:/galgame/stars-2dfan.images/62b83b10b092be971fe8a2ad9e0a609c.jpg"
    },
    "type" : [ 
        "ADV"
    ],
    "web2dfan" : {
        "imageURL" : "https://img.2dfan.com/old_source/1510/2958_1.jpg",
        "subjectID" : "2943",
        "topicID" : "2943"
    },
    "remark" : "",
    "date" : "2019-9-3,22:01:38"
}
```

# Topic

```
{
    "_id" : ObjectId("f76e5cef0000000000000000"),
    "date" : "2019-9-3,22:01:40",
    "subject_id" : ObjectId("f76e52c80000000000000000"),
    "html" : [ 
        {
            "page" : 1,
            "images" : [ 
                {
                    "path" : "g:/galgame/stars-2dfan.images/",
                    "name" : "eyJpbmRleCI6MCwidG9waWNJRCI6IjI5NDMiLCJwYWdlIjoxfQ==",
                    "type" : "jpg",
                    "size" : "23358",
                    "filename" : "g:/galgame/stars-2dfan.images/eyJpbmRleCI6MCwidG9waWNJRCI6IjI5NDMiLCJwYWdlIjoxfQ==.jpg"
                }, 
                {
                    "path" : "g:/galgame/stars-2dfan.images/",
                    "name" : "eyJpbmRleCI6MSwidG9waWNJRCI6IjI5NDMiLCJwYWdlIjoxfQ==",
                    "type" : "jpg",
                    "size" : "25427",
                    "filename" : "g:/galgame/stars-2dfan.images/eyJpbmRleCI6MSwidG9waWNJRCI6IjI5NDMiLCJwYWdlIjoxfQ==.jpg"
                }
            ],
            "content" : [ 
                "<p>...</p>",
                "<p>...</p>",
                "<img src=\"/assets/images/eyJpbmRleCI6MiwidG9waWNJRCI6IjI5NDMiLCJwYWdlIjoyfQ==.jpg\" alt>"
            ]
        }, 
        {
            "page" : 2,
            "images" : [ 
                {
                    "path" : "g:/galgame/stars-2dfan.images/",
                    "name" : "eyJpbmRleCI6MCwidG9waWNJRCI6IjI5NDMiLCJwYWdlIjoyfQ==",
                    "type" : "jpg",
                    "size" : "19942",
                    "filename" : "g:/galgame/stars-2dfan.images/eyJpbmRleCI6MCwidG9waWNJRCI6IjI5NDMiLCJwYWdlIjoyfQ==.jpg"
                }, 
                {
                    "path" : "g:/galgame/stars-2dfan.images/",
                    "name" : "eyJpbmRleCI6MSwidG9waWNJRCI6IjI5NDMiLCJwYWdlIjoyfQ==",
                    "type" : "jpg",
                    "size" : "23033",
                    "filename" : "g:/galgame/stars-2dfan.images/eyJpbmRleCI6MSwidG9waWNJRCI6IjI5NDMiLCJwYWdlIjoyfQ==.jpg"
                }, 
                {
                    "path" : "g:/galgame/stars-2dfan.images/",
                    "name" : "eyJpbmRleCI6MiwidG9waWNJRCI6IjI5NDMiLCJwYWdlIjoyfQ==",
                    "type" : "jpg",
                    "size" : "316441",
                    "filename" : "g:/galgame/stars-2dfan.images/eyJpbmRleCI6MiwidG9waWNJRCI6IjI5NDMiLCJwYWdlIjoyfQ==.jpg"
                }
            ],
            "content" : [ 
                "<p>...</p>",
                "<p>...</p>"
            ]
        }
    ]
}
```

# Config

`lib/config.json`

```
{
    "Cookie": "...",
    "images": {
        "path": "g:/galgame/stars-2dfan.images/"
    },
    "download": {
        "filters": [
            "https://img.2dfan.com/package.png"
        ]
    },
    "server":{
        "imagesPath":"/assets/images/"
    },
    "mongodb":{
        "connection":"stars-2dfan",
        "localhost":"mongodb://localhost:27017/"
    }
}
```

# Server

```
yarn server //localhost:3000
```

![Image text](/resources/subjects.png)
![Image text](/resources/topic.png)

# License

MIT
