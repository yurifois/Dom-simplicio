import urllib.request
import urllib.parse
import json

queries = [
    "suco de uva garrafa png",
    "coca cola lata 350ml png",
    "coca cola pet 2l png",
    "fanta laranja pet 2l png",
    "guarana antarctica pet 2l png",
    "guarana kuat pet png",
    "heineken lata png",
    "heineken garrafa long neck png",
    "cerveja corona garrafa png",
    "amstel lata png",
    "brahma lata png",
    "antarctica lata png",
    "itaipava lata png"
]

results = {}
for q in queries:
    try:
        url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(q)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        response = urllib.request.urlopen(req, timeout=5).read().decode('utf-8')
        # find the first image link inside html
        import re
        imgs = re.findall(r'<img[^>]+src="([^">]+)"', response)
        valid_imgs = [img for img in imgs if img.startswith('http') and 'transparent' not in img and 'duckduckgo' not in img]
        if valid_imgs:
            results[q] = valid_imgs[0]
        else:
            # Let's try duckduckgo image search vqd
            vqd_match = re.search(r'vqd=([\d-]+)', response)
            if vqd_match:
                vqd = vqd_match.group(1)
                i_url = "https://duckduckgo.com/i.js?q=" + urllib.parse.quote(q) + "&o=json&vqd=" + vqd
                i_req = urllib.request.Request(i_url, headers={'User-Agent': 'Mozilla/5.0'})
                i_resp = urllib.request.urlopen(i_req, timeout=5).read().decode('utf-8')
                i_data = json.loads(i_resp)
                if 'results' in i_data and len(i_data['results']) > 0:
                    results[q] = i_data['results'][0]['image']
                else:
                    results[q] = "No image found in JSON"
            else:
                results[q] = "No VQD found"
    except Exception as e:
        results[q] = str(e)

print(json.dumps(results, indent=2))
