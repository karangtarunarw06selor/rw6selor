#!/usr/bin/env python3
import json, re, time, urllib.error, urllib.parse, urllib.request
from io import BytesIO
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/questions"
UA = {"User-Agent": "RW06-TebakGambar/1.0 (educational community game)"}
# id, Indonesian answer, English Wikipedia title, category, accepted aliases
ITEMS = [
("liberty","Patung Liberty","Statue of Liberty","Tempat",["Statue of Liberty"]),("tajmahal","Taj Mahal","Taj Mahal","Tempat",[]),("colosseum","Colosseum","Colosseum","Tempat",["Koloseum"]),("bigben","Big Ben","Big Ben","Tempat",[]),("pisa","Menara Pisa","Leaning Tower of Pisa","Tempat",["Leaning Tower of Pisa"]),("sydneyopera","Sydney Opera House","Sydney Opera House","Tempat",["Gedung Opera Sydney"]),("greatwall","Tembok Besar China","Great Wall of China","Tempat",["Great Wall of China"]),("petra","Petra Yordania","Petra","Tempat",["Petra"]),("machupicchu","Machu Picchu","Machu Picchu","Tempat",[]),("pyramid","Piramida Giza","Great Pyramid of Giza","Tempat",["Piramida Mesir"]),("niagara","Air Terjun Niagara","Niagara Falls","Tempat",["Niagara Falls"]),("grandcanyon","Grand Canyon","Grand Canyon","Tempat",[]),("fuji","Gunung Fuji","Mount Fuji","Tempat",["Fuji"]),("bromo","Gunung Bromo","Mount Bromo","Tempat",["Bromo"]),("komodoisland","Pulau Komodo","Komodo (island)","Tempat",[]),("tanahlot","Tanah Lot","Tanah Lot","Tempat",[]),("prambanan","Candi Prambanan","Prambanan","Tempat",["Prambanan"]),("bundaranhi","Monumen Selamat Datang","Selamat Datang Monument","Tempat",["Bundaran HI"]),("merlion","Merlion","Merlion","Tempat",[]),("burjkhalifa","Burj Khalifa","Burj Khalifa","Tempat",[]),
("lion","Singa","Lion","Hewan",["Lion"]),("elephant","Gajah","Elephant","Hewan",["Elephant"]),("giraffe","Jerapah","Giraffe","Hewan",["Giraffe"]),("zebra","Zebra","Zebra","Hewan",[]),("panda","Panda","Giant panda","Hewan",["Panda Raksasa"]),("kangaroo","Kanguru","Kangaroo","Hewan",["Kangaroo"]),("penguin","Penguin","Penguin","Hewan",[]),("dolphin","Lumba Lumba","Dolphin","Hewan",["Lumba-lumba"]),("shark","Ikan Hiu","Shark","Hewan",["Hiu"]),("octopus","Gurita","Octopus","Hewan",[]),("peacock","Burung Merak","Peafowl","Hewan",["Merak"]),("owl","Burung Hantu","Owl","Hewan",[]),("camel","Unta","Camel","Hewan",[]),("rhino","Badak","Rhinoceros","Hewan",["Rhinoceros"]),("orangutan","Orangutan","Orangutan","Hewan",[]),("komodo","Komodo","Komodo dragon","Hewan",["Komodo Dragon"]),("koala","Koala","Koala","Hewan",[]),("flamingo","Flamingo","Flamingo","Hewan",[]),("seahorse","Kuda Laut","Seahorse","Hewan",[]),("butterfly","Kupu Kupu","Butterfly","Hewan",["Kupu-kupu"]),
("pizza","Pizza","Pizza","Makanan",[]),("sushi","Sushi","Sushi","Makanan",[]),("hamburger","Hamburger","Hamburger","Makanan",["Burger"]),("donut","Donat","Doughnut","Makanan",["Doughnut"]),("croissant","Croissant","Croissant","Makanan",["Kroisan"]),("ramen","Ramen","Ramen","Makanan",[]),("satay","Sate","Satay","Makanan",["Satay"]),("rendang","Rendang","Rendang","Makanan",[]),("nasi-goreng","Nasi Goreng","Nasi goreng","Makanan",[]),("bakso","Bakso","Bakso","Makanan",[]),("durian","Durian","Durian","Makanan",[]),("watermelon","Semangka","Watermelon","Makanan",[]),("pineapple","Nanas","Pineapple","Makanan",[]),("strawberry","Stroberi","Strawberry","Makanan",["Strawberry"]),("avocado","Alpukat","Avocado","Makanan",[]),
("bicycle","Sepeda","Bicycle","Kendaraan",["Bicycle"]),("motorcycle","Sepeda Motor","Motorcycle","Kendaraan",["Motor"]),("train","Kereta Api","Electric locomotive","Kendaraan",["Kereta"]),("airplane","Pesawat Terbang","Airplane","Kendaraan",["Pesawat"]),("helicopter","Helikopter","Helicopter","Kendaraan",[]),("sailboat","Kapal Layar","Sailboat","Kendaraan",["Perahu Layar"]),("submarine","Kapal Selam","Submarine","Kendaraan",[]),("hotairballoon","Balon Udara","Hot air balloon","Kendaraan",[]),("ambulance","Ambulans","Ambulance","Kendaraan",[]),("firetruck","Mobil Pemadam Kebakaran","Fire engine","Kendaraan",["Mobil Damkar"]),
("guitar","Gitar","Guitar","Benda",[]),("piano","Piano","Piano","Benda",[]),("violin","Biola","Violin","Benda",[]),("camera","Kamera","Camera","Benda",[]),("telescope","Teleskop","Telescope","Benda",[]),("umbrella","Payung","Umbrella","Benda",[]),("hourglass","Jam Pasir","Hourglass","Benda",[]),("compass","Kompas","Compass","Benda",[]),("typewriter","Mesin Ketik","Typewriter","Benda",[]),("lightbulb","Bola Lampu","Light bulb","Benda",["Lampu"]),("scissors","Gunting","Scissors","Benda",[]),("toothbrush","Sikat Gigi","Toothbrush","Benda",[]),("backpack","Tas Ransel","Backpack","Benda",["Ransel"]),("alarmclock","Jam Alarm","Alarm clock","Benda",[]),("robot","Robot","Robot","Benda",[]),
("football","Sepak Bola","Association football","Olahraga",["Football","Soccer"]),("basketball","Bola Basket","Basketball","Olahraga",["Basketball"]),("badminton","Bulu Tangkis","Shuttlecock","Olahraga",["Badminton"]),("tennis","Tenis","Tennis","Olahraga",[]),("boxing","Tinju","Boxing","Olahraga",["Boxing"]),("surfing","Selancar","Surfing","Olahraga",["Surfing"]),("skateboard","Skateboard","Skateboarding","Olahraga",["Papan Seluncur"]),("archery","Panahan","Archery","Olahraga",["Archery"]),("bowling","Bowling","Bowling","Olahraga",[]),("chess","Catur","Chess","Olahraga",["Chess"]),
("einstein","Albert Einstein","Albert Einstein","Tokoh",["Einstein"]),("chaplin","Charlie Chaplin","The Tramp","Tokoh",["Chaplin"]),
("polarbear","Beruang Kutub","Polar bear","Hewan",["Beruang Es"]),("crocodile","Buaya","Crocodile","Hewan",[]),("eagle","Burung Elang","Eagle","Hewan",["Elang"]),("turtle","Kura Kura","Turtle","Hewan",["Kura-kura"]),("rabbit","Kelinci","Rabbit","Hewan",[]),("horse","Kuda","Horse","Hewan",[]),("cow","Sapi","Cattle","Hewan",[]),("goat","Kambing","Goat","Hewan",[])
]
assert len(ITEMS) == 100

def api_batch(titles):
    query=urllib.parse.urlencode({"action":"query","format":"json","redirects":1,"prop":"pageimages|info","piprop":"thumbnail|name","pithumbsize":1000,"titles":"|".join(titles),"inprop":"url","origin":"*"})
    req=urllib.request.Request("https://en.wikipedia.org/w/api.php?"+query,headers=UA)
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req,timeout=45) as r:data=json.load(r)
            pages={page.get("title","").lower():page for page in data["query"]["pages"].values()}
            aliases={item["from"].lower():item["to"].lower() for key in ("normalized","redirects") for item in data.get("query",{}).get(key,[])}
            result={}
            for title in titles:
                resolved=title.lower()
                seen=set()
                while resolved in aliases and resolved not in seen:
                    seen.add(resolved);resolved=aliases[resolved]
                page=pages.get(resolved,{})
                result[title]=(page.get("thumbnail",{}).get("source"),page.get("fullurl"),page.get("pageimage"))
            return result
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 5: raise
            time.sleep(5 * (attempt + 1))

def download(url):
    req=urllib.request.Request(url,headers=UA)
    for attempt in range(8):
        try:
            with urllib.request.urlopen(req,timeout=60) as r:return r.read()
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 7: raise
            time.sleep(8 * (attempt + 1))
    raise RuntimeError(f"Download gagal: {url}")

sources_path=OUT/"sources.json"
sources=json.loads(sources_path.read_text()) if sources_path.exists() else {}
questions=[]
metadata={}
missing_titles=[title for slug,answer,title,category,aliases in ITEMS if not (OUT/f"{slug}.jpg").exists() or f"{slug}.jpg" not in sources]
for offset in range(0,len(missing_titles),25):
    metadata.update(api_batch(missing_titles[offset:offset+25]))
    time.sleep(2)
for i,(slug,answer,title,category,aliases) in enumerate(ITEMS,1):
    target=OUT/f"{slug}.jpg"
    image_url,page_url,pageimage=metadata.get(title,(None,None,None))
    if not target.exists():
        if not image_url: raise RuntimeError(f"No image for {title}")
        raw=download(image_url)
        image=Image.open(BytesIO(raw)).convert("RGB")
        image.thumbnail((900,650),Image.Resampling.LANCZOS)
        canvas=Image.new("RGB",(900,650),(245,243,238))
        canvas.paste(image,((900-image.width)//2,(650-image.height)//2))
        canvas.save(target,"JPEG",quality=84,optimize=True)
        time.sleep(.08)
    if target.name not in sources:
        if not image_url: raise RuntimeError(f"No source metadata for {title}")
        sources[target.name]={"page":page_url,"image":image_url,"pageImage":pageimage,"retrieved":"2026-10-25"}
    words=[w for w in re.findall(r"[a-z0-9]+",answer.lower()) if len(w)>2]
    examples={"Tempat":["Negara atau kota","Bentuk bangunan","Ciri terkenal","Lokasi"],"Hewan":["Habitat","Warna tubuh","Makanan","Cara bergerak"],"Makanan":["Asal daerah","Bahan utama","Rasa","Cara penyajian"],"Kendaraan":["Tempat bergerak","Jumlah roda","Kegunaan","Sumber tenaga"],"Benda":["Tempat digunakan","Bahan","Bentuk","Fungsi"],"Olahraga":["Arena","Peralatan","Jumlah pemain","Cara mendapat angka"],"Tokoh":["Negara asal","Bidang terkenal","Era","Karya atau ciri"]}[category]
    questions.append({"id":slug,"answer":answer,"aliases":aliases,"category":category,"image":target.name,"forbidden":words,"examples":examples})
# Normalize all source records by actual local filename.
sources={record.get("file",key):record for key,record in sources.items()}
for record in sources.values(): record.pop("file",None)
# Fetch reusable license metadata in batches from the same encyclopedia API.
needs_license=[record for record in sources.values() if record.get("pageImage") and not record.get("license")]
for offset in range(0,len(needs_license),25):
    batch=needs_license[offset:offset+25]
    query=urllib.parse.urlencode({"action":"query","format":"json","prop":"imageinfo","iiprop":"extmetadata","titles":"|".join("File:"+record["pageImage"] for record in batch),"origin":"*"})
    req=urllib.request.Request("https://en.wikipedia.org/w/api.php?"+query,headers=UA)
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req,timeout=45) as response: payload=json.load(response)
            break
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 5: raise
            time.sleep(5*(attempt+1))
    by_name={page.get("title","").removeprefix("File:"):page for page in payload["query"]["pages"].values()}
    for record in batch:
        metadata=(by_name.get(record["pageImage"],{}).get("imageinfo") or [{}])[0].get("extmetadata",{})
        value=lambda key: re.sub(r"<[^>]+>","",metadata.get(key,{}).get("value","")).strip()
        record["license"]=value("LicenseShortName") or "See source page"
        record["artist"]=value("Artist") or value("Credit") or "See source page"
    time.sleep(2)
sources_path.write_text(json.dumps(sources,ensure_ascii=False,indent=2)+"\n")
(ROOT/"assets/questions/generated.json").write_text(json.dumps(questions,ensure_ascii=False,indent=2)+"\n")
print(json.dumps({"generated":len(questions),"sources":len(sources)}))
