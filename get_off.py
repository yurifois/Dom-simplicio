import urllib.request
import urllib.parse
import json

queries = {
    "Suco 1L": "suco de uva 1l",
    "Refrigerante Lata": "coca cola lata 350ml",
    "Coca-Cola 2L": "coca cola 2l",
    "Fanta 2L": "fanta 2l",
    "Guaraná 2L": "guarana antarctica 2l",
    "Guaraná Kuat 1.5L": "guarana kuat",
    "Heineken 350ml": "heineken 350ml",
    "Heineken Shot 250ml": "heineken 250ml",
    "Coronita 210ml": "coronita",
    "Amstel 269ml": "amstel 269ml",
    "Brahma Chopp 269ml": "brahma 269ml",
    "Antártica 269ml": "antarctica 269ml",
    "Itaipava 269ml": "itaipava 269ml"
}

def get_off_image(query):
    url = "https://br.openfoodfacts.org/cgi/search.pl?search_terms=" + urllib.parse.quote(query) + "&search_simple=1&action=process&json=1"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=5).read().decode('utf-8'))
        if data.get('products') and len(data['products']) > 0:
            for p in data['products']:
                if p.get('image_front_url'):
                    return p['image_front_url']
    except Exception as e:
        pass
    return None

results = {}
for k, v in queries.items():
    results[k] = get_off_image(v)

print(json.dumps(results, indent=2))
