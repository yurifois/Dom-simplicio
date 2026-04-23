import urllib.request
import urllib.parse
import json

queries = {
    "Suco 1L": "Grape juice",
    "Refrigerante Lata": "Coca-Cola",
    "Coca-Cola 2L": "Coca-Cola",
    "Fanta 2L": "Fanta",
    "Guaraná 2L": "Guaraná Antarctica",
    "Guaraná Kuat 1.5L": "Guaraná Antarctica",
    "Heineken 350ml": "Heineken",
    "Heineken Shot 250ml": "Heineken",
    "Coronita 210ml": "Corona (beer)",
    "Amstel 269ml": "Amstel Brewery",
    "Brahma Chopp 269ml": "Brahma beer",
    "Antártica 269ml": "Antarctica (beer)",
    "Itaipava 269ml": "Grupo Petrópolis"
}

def get_wiki_image(query):
    try:
        url = "https://en.wikipedia.org/w/api.php?action=query&titles=" + urllib.parse.quote(query) + "&prop=pageimages&format=json&pithumbsize=400"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = json.loads(urllib.request.urlopen(req, timeout=5).read().decode('utf-8'))
        pages = data['query']['pages']
        for page_id in pages:
            if 'thumbnail' in pages[page_id]:
                return pages[page_id]['thumbnail']['source']
    except:
        pass
    return None

results = {}
for k, v in queries.items():
    results[k] = get_wiki_image(v)

print(json.dumps(results, indent=2))
