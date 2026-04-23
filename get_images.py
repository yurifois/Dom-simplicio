import urllib.request
import urllib.parse
import re
import json

drinks = [
    "suco de uva 1l garrafa png transparent",
    "coca cola lata 350ml png",
    "coca cola 2l pet png",
    "fanta laranja 2l pet png",
    "guarana antarctica 2l pet png",
    "guarana kuat 1.5l pet png",
    "heineken lata 350ml png",
    "heineken shot 250ml garrafa png",
    "coronita 210ml garrafa png",
    "amstel lata 269ml png",
    "brahma chopp lata 269ml png",
    "cerveja antarctica lata 269ml png",
    "itaipava lata 269ml png"
]

def search_image(query):
    try:
        url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query + " transparent")
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, timeout=5).read().decode('utf-8')
        # Duckduckgo HTML doesn't return direct image URLs easily, it usually links to sites.
        # Let's try duckduckgo lite image search or another source.
    except Exception as e:
        pass
    return None

