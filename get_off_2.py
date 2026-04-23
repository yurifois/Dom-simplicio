import urllib.request
import urllib.parse
import json

queries = {
    "Suco 1L": "suco uva 1l",
    "Refrigerante Lata": "coca cola lata",
    "Heineken 350ml": "heineken lata 350ml",
    "Brahma Chopp 269ml": "brahma 269ml",
    "Guaraná Kuat 1.5L": "kuat",
    "Itaipava 269ml": "itaipava 269ml"
}

def get_off_image(query):
    url = "https://br.openfoodfacts.org/cgi/search.pl?search_terms=" + urllib.parse.quote(query) + "&search_simple=1&action=process&json=1"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=5).read().decode('utf-8'))
        if data.get('products'):
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
