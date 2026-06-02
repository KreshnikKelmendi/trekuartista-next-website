"""Generate data/works.json (static portfolio skeleton) from embedded definitions."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "works.json"


def p(path: str) -> str:
    path = path.strip()
    if path.startswith("http"):
        return path
    m = re.search(r"Assets/(.+)$", path.replace("\\", "/"))
    if m:
        return "trekuartista/works/" + m.group(1)
    return path


def W(**kwargs):  # noqa: N802
    return kwargs


works: list[dict] = []

# --- Zone Club latest (40) ---
zone_media = [
    p(f"Assets/zone/zone-latest/zone-{i}.{'mp4' if i in (12, 18, 21, 22) else 'jpg'}")
    for i in range(1, 25)
]
works.append(
    W(
        id=40,
        workName="The circle your ZØNE",
        specialCategory="Brand Strategy",
        category="Logo / Rebranding / Animation / Marketing Strategy",
        workDescription="Logo / 3D / Animation / Marketing Strategy",
        cover=zone_media[0],
        thumbnail=zone_media[7],
        media=zone_media,
        createdAt="2026-01-10T00:00:00.000Z",
        descriptions=[
            "For Zone Club, we built a rebrand around one powerful idea: the circle. A symbol of rhythm, energy, connection, and the people who come together through music.",
            "From the streets to the screen, a brand made to move. A visual system that lives across outdoor and social media, all built around one idea: the circle.",
            "A visual system that lives across outdoor and social media, all built around one idea: the circle. Identity that performs.",
        ],
    )
)

works.append(
    W(
        id="zone-club-latest-ad-campaign",
        workName="Enter the Circle - AD campaign for Zone Club",
        specialCategory="TV AD",
        category="Brand Strategy",
        cover=p("Assets/video-advertising/Enter the Circle - Latest AD campaign for Zone Club.mp4"),
        thumbnail=p("Assets/zone/zone-latest/zone-8.jpg"),
        media=[p("Assets/video-advertising/Enter the Circle - Latest AD campaign for Zone Club.mp4")],
        createdAt="2026-01-08T00:00:00.000Z",
        workDescription="Video Advertising / Production",
        descriptions=[
            "Introducing our latest campaign for Zone Club. A visual direction built on identity, energy, and rhythm — centered around “the circle. your zøne.” It’s about turning space into a feeling, where sound, design, and atmosphere move together as one.",
        ],
        youtubeLink="https://www.youtube.com/watch?v=XjY2fr3BSAg",
    )
)

ysabel_media = [
    p(f"Assets/ysabel-work/{n}")
    for n in [
        "1-1.mp4",
        "2.webp",
        "3-3.mp4",
        "4-4.mp4",
        "5.webp",
        "6.webp",
        "7-7.mp4",
        "8-8.mp4",
        "9.webp",
        "10.webp",
        "11.webp",
        "12.webp",
        "12Version2.webp",
        "13.webp",
        "14.webp",
        "15.webp",
        "16.webp",
        "17.webp",
        "ins-1.jpg",
        "ins-2.jpg",
        "ins-3.jpg",
        "ins-4.jpg",
        "ins-5.jpg",
        "ins-6.jpg",
        "ins-7.jpg",
        "ins-8.jpg",
        "ins-9.jpg",
        "ins-10.jpg",
        "ins-11.jpg",
        "ins-12.jpg",
        "ins-13.jpg",
    ]
]
works.append(
    W(
        id=38,
        workName="YSABEL SOCIETY Brand",
        specialCategory="Brand Strategy",
        category="Logo / 3D / Animation / Marketing Strategy / UI & UX / Web Development",
        workDescription="Logo / 3D / Animation / Marketing Strategy / UI & UX / Web Development",
        cover=ysabel_media[0],
        thumbnail=ysabel_media[1],
        media=ysabel_media,
        createdAt="2026-01-05T00:00:00.000Z",
        descriptions=[
            "We’ve developed a refined visual identity for Ysabel Society — a seamless blend of logo design, typography, and visual language inspired by modern minimalism and timeless elegance. Every element reflects the brand’s essence: confident, graceful, and unapologetically sophisticated.",
            "The visual system flows effortlessly across all touchpoints — from digital presence to print and packaging — creating a cohesive and elevated Ysabel Society experience. A world where style, identity, and detail come together.",
            "A curated visual journey: imagery defined by subtle contrast, motion guided by intention, and design shaped by emotion. Every detail tells a story — a celebration of identity, refinement, and modern femininity.",
        ],
    )
)

works.append(
    W(
        id="ysabel-advertising",
        workName="ysabel society ad",
        specialCategory="TV AD",
        category="Brand Strategy",
        cover=p("Assets/video-advertising/ysabel-ad.mp4"),
        media=[p("Assets/video-advertising/ysabel-ad.mp4")],
        createdAt="2026-01-03T00:00:00.000Z",
        workDescription="Video Advertising / Production",
        descriptions=[],
        youtubeVideos=[
            {
                "url": "https://www.youtube.com/watch?v=mlekOyrX194",
                "title": "ZYRATH — The Guardian of Ysabel",
                "description": "He doesn’t speak. He watches. He guards the castle of Ysabel. And still... you’ve seen nothing yet.",
            },
            {
                "url": "https://www.youtube.com/watch?v=pEJFk1l38R4",
                "title": "YLARISSE — The White Soul of Ysabel",
                "description": "She carries light within darkness and what was hidden learns to fly. The white dove takes flight and Ysabel is set free.",
            },
            {
                "url": "https://www.youtube.com/watch?v=FUng0ELz9D8",
                "title": "DARVYON — The Visionary of Ysabel",
                "description": "Born from her thought, he builds what she dreams. Through his creativity, Ysabel becomes real.",
            },
            {
                "url": "https://www.youtube.com/watch?v=cOdFiPKrVOc",
                "title": "MIYU — The Ancient Mystic of the East",
                "description": "She plays with the air, writing what eyes cannot see. Then it burns, and from her silence Ysabel speaks.",
            },
            {
                "url": "https://www.youtube.com/watch?v=2bptC2ZU5zk",
                "title": "KORVYAN — The Time Traveler of Ysabel",
                "description": "Between two worlds he walks. Through him, Ysabel saw the future, and began to build her castle of time.",
            },
            {
                "url": "https://www.youtube.com/watch?v=TpdvkUTRXgM",
                "title": "ELYRIA - The First Light of Ysabel",
                "description": "She carries the essence of welcome, where fragrance becomes emotion.",
            },
            {
                "url": "https://www.youtube.com/watch?v=4VHxtF0aXLc",
                "title": "YSABEL - is our creation",
                "description": "At Trekuartista, true impact is born where strategy meets soul. It's been a true pleasure to be able to imagine, create, and bring to life this beautiful project.",
            },
        ],
    )
)

zone15 = [p(f"Assets/zone/zone-{i}{'-'+str(i) if i<=11 or i>=7 else ''}.{'mp4' if 'mp4' in f'zone-{i}' else 'png'}") for i in range(1,24)]
# rebuild zone 15 properly
zone15_files = [
    "zone-1-1.mp4", "zone-2.png", "zone-3-3.mp4", "zone-4.png", "zone-5.png", "zone-6.png",
    "zone-7-7.mp4", "zone-8.png", "zone-9-9.mp4", "zone-10.png", "zone-12-12.mp4", "zone-13.png",
    "zone-14.webp", "zone-15.png", "zone-16.png", "zone-17.png", "zone-18.png", "zone-19.png",
    "zone-20.png", "zone-21.png", "zone-22.webp", "zone-23.png", "zone-24-24.mp4",
]
zone15 = [p(f"Assets/zone/{f}") for f in zone15_files]
works.append(
    W(
        id=27,
        workName="ZONE CLUB 15",
        specialCategory="Brand Strategy",
        category="Logo / 3D / Animation / Marketing",
        workDescription="Logo / 3D / Animation / Marketing",
        cover=zone15[0],
        thumbnail=zone15[7],
        media=zone15,
        createdAt="2025-12-20T00:00:00.000Z",
        descriptions=[
            "We’ve crafted a new visual identity for Zone Club 15th Anniversary: logo, typography, and visuals inspired by pixel art and glitch aesthetics. From bold colors to nostalgic elements, every detail is designed to capture the club’s vibe – playful, unconventional, and full of rhythm.",
            "The new visual system and logo flows into everything – from posters to merch – making the Zone Club experience more beautiful and truly unique. 15 Years of ZONE CLUB",
            "A season of visuals: posters alive with color, videos pulsing with rhythm, icons born from play. Every frame, every detail, a celebration of 15 years of Zone Club.",
        ],
    )
)

esport_files = [f"esport-{i}{'-'+str(i) if i<=9 else ''}.{'mp4' if i<=9 or i in (14,15,17,18) else 'png'}" for i in range(1,23)]
esport_map = {
    1: "esport-1-1.mp4", 2: "esport-2-2.mp4", 3: "esport-3-3.mp4", 4: "esport-4-4.mp4",
    5: "esport-5-5.mp4", 6: "esport-6-6.mp4", 7: "esport-7-7.mp4", 8: "esport-8-8.mp4",
    9: "esport-9-9.mp4", 10: "esport-10.png", 11: "esport-11.png", 12: "esport-12.png",
    13: "esport-13.png", 14: "esport-14-14.mp4", 15: "esport-15-15.mp4", 16: "esport-16.png",
    17: "esport-17-17.mp4", 18: "esport-19-19.mp4", 19: "esport-20.png", 20: "esport-21.png",
    21: "esport-22.png", 22: "esport-23.png",
}
esport = [p(f"Assets/esports-assets/{esport_map[i]}") for i in range(1, 23)]
works.append(
    W(
        id=26,
        workName="EEC25 Championship",
        specialCategory="Brand Strategy",
        category="Brand Strategy / Logo / 3D /  Animation / UI & UX / Web Development",
        workDescription="Brand Strategy / Logo / 3D /  Animation / UI & UX / Web Development",
        cover=esport[0],
        thumbnail=esport[9],
        media=esport,
        createdAt="2025-12-15T00:00:00.000Z",
        descriptions=[
            "We’re proud to have brought the European Esports Championship 2025 brand to life - from the bold, competitive logo design to the full visual identity that fuels the hype. Our work spans across official merchandise, social media visuals, and event branding, all crafted to capture the energy, precision, and passion of Europe’s biggest esports stage. This is more than just design, it’s the heartbeat of a championship.",
            "This year’s EEC was more than just a competition, it was a full experience. Trekuartista was behind the design that brought it all together.",
            "We didn’t just design. We created symbols of victory, community, and energy that made the event unforgettable. Seeing our work come alive on stage, in the crowd, and in the hands of the winners is what keeps us pushing the limits of creativity.",
        ],
    )
)

works.append(
    W(
        id=86,
        workName="EEC25 Championship AD",
        specialCategory="TV AD",
        category="Brand Strategy",
        cover=p("Assets/video-advertising/esports-11.mp4"),
        thumbnail=p("Assets/esports-assets/esport-10.png"),
        media=[p("Assets/video-advertising/esports-11.mp4")],
        createdAt="2025-12-12T00:00:00.000Z",
        workDescription="Video Advertising / Production",
        descriptions=[
            "A Choice Driven by Expertise. When a Medical Doctor and Wellness Coach chooses Emona, it speaks to the power of quality and consistency. At Trekuartista, we are thrilled to have facilitated this collaboration, highlighting how mindful choices shape our long-term wellbeing. Because every sip is an investment in yourself. A Trekuartista production.",
        ],
        youtubeLink="https://www.youtube.com/watch?v=R2uDS3PzpGk",
    )
)

works.append(
    W(
        id=39,
        workName="EMONA BRAND AD",
        specialCategory="TV AD",
        category="Brand Strategy",
        cover=p("Assets/emona/Emona Brand & Rita Parashumti - Trekuartista (1080p, h264) (online-video-cutter.com).mp4"),
        thumbnail=p("Assets/emona/EMONA.jpg"),
        media=[p("Assets/emona/Emona Brand & Rita Parashumti - Trekuartista (1080p, h264) (online-video-cutter.com).mp4")],
        createdAt="2025-12-10T00:00:00.000Z",
        workDescription="Video Advertising / Production",
        descriptions=[
            "Collection of Trekuartista video productions for Emona Brand AD. Each concept focuses on a different storytelling angle while keeping one consistent brand emotion.",
        ],
        youtubeVideos=[
            {
                "url": "https://www.youtube.com/watch?v=PfFkVYfmIcU",
                "title": "Rita Parashumti & Emona Brand",
                "description": "A Choice Driven by Expertise. When a Medical Doctor and Wellness Coach chooses Emona, it speaks to the power of quality and consistency.",
            },
            {
                "url": "https://www.youtube.com/watch?v=D2VwUSkkbZM",
                "title": "Holiday Campaign Story",
                "description": "A special holiday story with Emona’s Çaji i Zemrës.",
            },
            {
                "url": "https://www.youtube.com/watch?v=mDO-VaL35Kw",
                "title": 'Moments with "Çaji i Zemrës"',
                "description": "With Çaji i Zemrës by Emona, every moment becomes warmer.",
            },
        ],
    )
)

alim_files = [
    "ALIM-1.webp", "ALIM-2.png", "ALIM-3-3.mp4", "ALIM-4.png", "ALIM-5.png", "ALIM-77.png",
    "ALIM-7.png", "ALIM-6.png", "ALIM-8.png", "ALIM-10.webp", "ALIM-11-11.mp4", "ALIM-12.png",
    "ALIM-13.png", "ALIM-14.webp", "ALIM-15.webp", "ALIM-16.png", "ALIM-17-17.mp4",
    "ALIM-18.png", "ALIM-19.webp", "ALIM-20-20.mp4", "ALIM-21-21.mp4",
]
alim = [p(f"Assets/alimGrup/{f}") for f in alim_files]
works.append(
    W(
        id=25,
        workName="ALIM GRUP",
        specialCategory="Brand Strategy",
        category="Brand Strategy / Logo /  UI & UX / Animation / Marketing",
        workDescription="Brand Strategy / Logo /  UI & UX / Animation / Marketing",
        cover=alim[0],
        media=alim,
        createdAt="2025-11-28T00:00:00.000Z",
        descriptions=[
            "Inspired by Nature, Built for Impact. We proudly brings a fresh visual identity rebranding ALIM GRUP, based in Turkey - a leader in wood-based panels, from MDF to laminate flooring.",
            "From bold outdoor signage to clean digital feeds, the new ALIM GRUP identity adapts effortlessly across every platform.",
            "Whether it’s on a billboard in the city or a scroll on your screen, the re-branding Trekuartista did, speaks with clarity, strength, and consistency.",
        ],
    )
)

datajet_files = [
    "datajet-post-1.png", "datajet-post-2-2.mp4", "datajet-post-3-3.mp4", "datajet-post-4-4.mp4",
    "datajet-post-5.png", "datajet-post-6-6.mp4", "datajet-post-7-7.mp4", "datajet-post-8.png",
    "datajet-post-9.png", "datajet-post-10-10.mp4", "datajet-post-11-11.mp4", "datajet-post-12.png",
    "datajet-post-13.png", "datajet-post-14.png", "datajet-post-15.png", "datajet-post-16-16.mp4",
    "datajet-post-17-17.mp4", "datajet-post-18-18.mp4", "datajet-post-19.png", "datajet-post-20.png",
    "datajet-post-21-21.mp4", "datajet-post-22-22.mp4", "datajet-post-23-23.mp4",
]
datajet = [p(f"Assets/datajet/{f}") for f in datajet_files]
works.append(
    W(
        id=24,
        workName="DataJet",
        specialCategory="Brand Strategy",
        category="Brand Strategy / Logo /  UI & UX / Animation / Marketing / eSIM",
        workDescription="Brand Strategy / Logo /  UI & UX / Animation / Marketing / eSIM",
        cover=datajet[0],
        media=datajet,
        createdAt="2025-11-20T00:00:00.000Z",
        descriptions=[
            "Introducing the new face of connectivity: DataJet, reimagined by Trekuartista. For DataJet , we created a bold, fluid, and future-ready brand that mirrors its mission: effortless, borderless connection.",
            "From the spark of the idea to the final pixel, our team at Trekuartista led the creative journey — blending movement, tech, and trust into a clean visual language. This is branding that travels.",
            "More than icons — it’s identity in motion. Each destination, each data package is represented through shapes born from the DataJet logo.",
        ],
    )
)

works.append(
    W(
        id=23,
        workName="47",
        specialCategory="Brand Strategy",
        category="Design Brand Strategy / Logo /  Animation / Web Development",
        workDescription="Design Brand Strategy / Logo /  Animation / Web Development",
        cover=p("Assets/47/47-47.mp4"),
        thumbnail=p("Assets/47/47-4.png"),
        media=[
            p("Assets/47/47-1-1.mp4"),
            p("Assets/47/47-47.mp4"),
            p("Assets/47/47-4.png"),
            p("Assets/47/47-3-3.mp4"),
        ],
        createdAt="2025-11-10T00:00:00.000Z",
        descriptions=[
            'Some numbers hold power, and 47 is one of them. When we designed the "47" logo, we wanted something unstoppable. Rotate it 180°—you still get 47!',
            "We took 47 from the creative stage to the street. From billboards to merch, digital screens to real-life impact, the 47 mindset is everywhere.",
        ],
    )
)

lemonita_files = [
    "lemonita-1-1.mp4", "LEMONITA-2-2.mp4", "lemonita-3-3.mp4", "lemonita-4-4.mp4",
    "lemonita-6-6.mp4", "lemonita-7-7.mp4", "lemonita-5-5.mp4", "lemonita-8-8.mp4",
    "lemonita-9-9.mp4", "lemonita-10.jpg", "lemonita-11.jpg", "lemonita-12-12.mp4",
    "lemonita-13.jpg", "lemonita-14-14.mp4", "lemonita-15.jpg",
]
lemonita = [p(f"Assets/lemonita/{f}") for f in lemonita_files]
works.append(
    W(
        id=22,
        workName="LEMONITA",
        specialCategory="Brand Strategy",
        category="Design Brand Strategy / Animation / 3D",
        workDescription="Design Brand Strategy / Animation / 3D",
        cover=lemonita[0],
        thumbnail=lemonita[9],
        media=lemonita,
        createdAt="2025-10-25T00:00:00.000Z",
        descriptions=[
            "Lemonita a refreshing drink brand designed by us to radiate energy and vitality.",
            "Lemonita’s bottle label design speaks volumes. Crafted by Trekuartista, this label combines the energy of lemons with a sleek and modern look.",
            "Inspired by waves of freshness and natural elements, every detail showcases creativity and passion.",
        ],
    )
)

gjelber_order = [
    "gjelber-1-1.mp4", "gjelber-2-2.mp4", "gjelber-3-3.mp4", "gjelber-06 (1).png",
    "gjelber-4-4.mp4", "gjelber-5-5.mp4", "gjelber-6-6.mp4", "gjelber-7-7.mp4",
    "gjelber-8-8.mp4", "gjelber-9-9.mp4", "gjelber-11.jpg", "gjelber-12.jpg",
    "gjelber-11 (1).png", "gjelber-13.jpg", "gjelber-15.jpg", "gjelber-16.jpg",
    "gjelber-17.jpg", "gjelber-18.jpg", "gjelber-19.jpg", "gjelber-20.jpg",
    "gjelber-21.jpg", "gjelber-22.jpg",
]
gjelber = [p(f"Assets/gjelber/{f}") for f in gjelber_order]
works.append(
    W(
        id=2,
        workName="GJELBËR",
        specialCategory="Brand Strategy",
        category="Brand Strategy",
        workDescription="Design Brand Strategy / Web Design / Web Development",
        cover=gjelber[0],
        thumbnail=gjelber[3],
        media=gjelber,
        createdAt="2025-10-01T00:00:00.000Z",
        descriptions=[
            "For Gjelber, we created a brand that highlights their commitment to environmental sustainability and habitat preservation.",
            "We also designed engaging content to promote Gjelber’s initiatives, focusing on informative social media posts and brochures that inspire community involvement.",
            "Additionally, we provided a range of creative assets, including graphics and promotional materials, to support Gjelber’s outreach efforts.",
        ],
    )
)

floil_media = [
    p("Assets/floilKampanja/floil-2.png"),
    p("Assets/floilKampanja/floil-3.png"),
    p("Assets/floilKampanja/floil-1.png"),
    p("Assets/floilKampanja/floil-5.mp4"),
    p("Assets/floilKampanja/floil-6.mp4"),
    p("Assets/floilKampanja/floil-7.png"),
    p("Assets/floilKampanja/floil-8.png"),
    p("Assets/floilKampanja/floil-9.png"),
    p("Assets/floilKampanja/floil-10.png"),
    p("Assets/floilKampanja/floil-11.png"),
    p("Assets/floilKampanja/floil-12.png"),
    p("Assets/floilKampanja/floil-13.jpg"),
    p("Assets/floilKampanja/floil-14.jpg"),
    p("Assets/floilKampanja/floil-15.jpg"),
]
works.append(
    W(
        id=10,
        workName="FLOIL - LATEST CAMPAIGN",
        specialCategory="Brand Strategy",
        category="Campaign / Advertising / Shija e gatimeve të nënës",
        workDescription="Campaign / Advertising / Shija e gatimeve të nënës",
        cover=p("Assets/floilKampanja/floil-3.png"),
        media=floil_media,
        createdAt="2025-09-20T00:00:00.000Z",
        hoverText="Campaign / Advertising / Shija e gatimeve të nënës",
        color="#1E1E1E",
        buttonTextColor="white",
        descriptions=[
            "From a spark of inspiration to bringing characters to life we brought Floil with a unique twist!",
            "We went from the creative stage to the streets! Take a look at our outdoor ad placements, bringing our campaign beyond screens.",
        ],
    )
)

works.append(
    W(
        id="floil-advertising",
        workName="Floil Advertising",
        specialCategory="TV AD",
        category="Brand Strategy",
        cover=p("Assets/video-advertising/floil-mix-1.mp4"),
        thumbnail=p("Assets/floilKampanja/floil-13.jpg"),
        media=[p("Assets/video-advertising/floil-mix-1.mp4")],
        createdAt="2025-09-15T00:00:00.000Z",
        workDescription="Video Advertising / Production",
        descriptions=[],
        youtubeVideos=[
            {
                "url": "https://www.youtube.com/watch?v=Y33q9Pqowa0",
                "title": "Floil! Shija e gatimeve të nënës",
                "description": "A warm and emotional TV commercial created for Floil.",
            },
        ],
    )
)

astravel_order = [
    "astravel-2.png", "astravel-3.png", "astravel-4.png", "astravel-4.png",
    "astravel-5.png", "astravel-6.png", "astravel-10.png", "astravel-11.png",
    "astravel-16.png", "asas.jpg", "astravel-17.png", "astravel-15.png",
    "asasas.jpg", "astravel-7.png", "astravel-9.png", "2 (1)-1.mp4", "3 (1)-1.mp4",
    "4 (1)-1.mp4", "astravel-12.png", "astravel-13.png", "astravel-14.png",
]
astravel = [p(f"Assets/astravel/{f}") for f in astravel_order]
astravel.insert(0, p("Assets/astravel/15VJETOR_3 (1)-1.mp4"))
works.append(
    W(
        id=9,
        workName="AS TRAVEL - 15",
        specialCategory="Brand Strategy",
        category="Brand Strategy",
        workDescription="Logo / Branding / Marketing Strategy / PR / Animation & 3D",
        cover=p("Assets/astravel/astravel-1.png"),
        media=astravel,
        createdAt="2025-09-01T00:00:00.000Z",
        hoverText="Campaign / Design / Branding",
        color="#1E1E1E",
        buttonTextColor="white",
        descriptions=[
            "For AS Travel's 15th anniversary, we had the privilege of designing a new logo that captures their growth and commitment to exceptional travel experiences.",
            "We also carefully selected a typography that reflects the brand's adventurous spirit and commitment to exceptional service.",
            "By integrating this typography into their logo and promotional content, we aimed to create a strong brand presence that captures the essence of exploration.",
        ],
    )
)

epoque_order = [
    "epoque-2-2.mp4", "epoque-3-3.mp4", "epoque-4-4.mp4", "epoque-5-5.mp4",
    "epoque-6-6.mp4", "epoque-7-7.mp4", "epoque-8.jpg", "epoque-9-9.mp4",
    "epoque-10-10.mp4", "epoque-11-11.mp4", "epoque-12.jpg", "epoque-13-13.mp4",
]
epoque = [p(f"Assets/epoque/{f}") for f in epoque_order]
works.append(
    W(
        id=8,
        workName="EPOQUE",
        specialCategory="Brand Strategy",
        category="Brand Strategy",
        workDescription="Logo / Branding / Marketing Strategy / PR / Animation & 3D / Web Design & Development",
        cover=p("Assets/epoque/epoque-1-1.mp4"),
        thumbnail=p("Assets/epoque/epoque-8.jpg"),
        media=epoque,
        createdAt="2025-08-20T00:00:00.000Z",
        hoverText="Campaign / Design / Logo / Website Design / Development",
        descriptions=[
            "For Époque, we carefullly crafted a logo that captures the timeless elegance of a bygone era, blending intricate vintage details with a modern twist.",
            "Our work approach highlights the unique character of Époque, with a refined aesthetic that complements its innovative menu.",
            "The Époque's website that we realized, is a digital showcase that perfectly captures the elegance of dining.",
        ],
    )
)

kidsday = [p(f"Assets/kidsday/{f}") for f in [
    "Post_01-01.mp4", "Post_02-02.mp4", "Post_03-03.mp4", "Post_04-04.mp4",
    "Post_05-05.mp4", "Post_06-06.mp4", "Post_07-07.mp4", "Post_08-08.mp4",
    "Post_09-09.mp4", "Post_10-10.mp4", "Post_11-11.mp4", "Post_12-12.mp4",
    "kidsday13.png", "kidsday14.png", "kidsday15.jpg", "kidsday16.jpg",
    "kidsday17.jpg", "kidsday18.jpg",
]]
works.append(
    W(
        id=7,
        workName="KIDSDAY",
        specialCategory="Brand Strategy",
        category="Brand Strategy",
        workDescription="Logo / Branding / Animation & 3D",
        cover=kidsday[0],
        thumbnail=kidsday[12],
        media=kidsday,
        createdAt="2025-08-01T00:00:00.000Z",
        hoverText="Campaign / Design / Logo",
        descriptions=[
            "We had the privilege to re-brand the identity for Kidsday, creating a logo that beautifully captures the bonds between them.",
            "Blue offers versatility and elegance. This palette encourages creativity and imagination.",
            "For Kidsday, we crafted a playful and engaging visual identity that reflects the app's mission to make every child’s day an adventure.",
        ],
    )
)

works.append(
    W(
        id="kosovo-olympic-committee",
        workName="Kosovo Olympic Committee",
        specialCategory="TV AD",
        category="Brand Strategy",
        cover=p("Assets/video-advertising/kok.mp4"),
        media=[p("Assets/video-advertising/kok.mp4")],
        createdAt="2025-07-20T00:00:00.000Z",
        workDescription="Video Advertising / Production",
        descriptions=[
            "We poured creativity and dedication into this project for the Kosovo Olympic Committee, contributing to their efforts in representing the nation on the global stage.",
        ],
        youtubeLink="https://www.youtube.com/watch?v=0youPK0fjE0",
    )
)

vegza = [p(f"Assets/vegza/{f}") for f in [
    "vegza-44.jpg", "vegza-45.jpg", "vegza-48.jpg", "vegza-1.mp4", "vegza-46.jpg",
    "vegza-49.jpg", "vegza-50.jpg", "vegza-51.jpg", "vegza-52.jpg", "vegza-53.jpg", "vegza-54.jpg",
]]
works.append(
    W(
        id=6,
        workName="VEGZA",
        specialCategory="Brand Strategy",
        category="Brand Strategy",
        workDescription="Logo / Branding / Marketing Strategy / PR / Animation / Web Design & Development",
        cover=p("Assets/vegza/2000x2000 (1)-1.mp4"),
        thumbnail=p("Assets/vegza/vegza-44.jpg"),
        media=vegza,
        createdAt="2025-07-01T00:00:00.000Z",
        hoverText="Campaign / Design / Logo",
        descriptions=[
            "Embracing the fusion of asymmetry and modernism, Vegza's newest logo redesign beautifully intertwines the timeless essence of heritage with the contemporary edge of innovation.",
            "In crafting the social media strategy, we’ve ensured that every post reflects Vegza’s unique perspective.",
            "We redefined Vegza’s brand, merging modern architectural elegance with innovative visual elements.",
        ],
    )
)

boyut_order = [
    "boyut11-11.mp4", "boyutAnimation-1.mp4", "boyut15-15.mp4", "boyut10-10.mp4",
    "boyut5.png", "boyut6.png", "boyut7.png", "boyut4.png", "boyut8.png", "boyut9.png",
    "boyut3.png", "boyut12.png", "boyut15.png", "boyut14.png", "boyut16.png", "boyut-88.jpg",
]
boyut = [p(f"Assets/boyut/{f}") for f in boyut_order]
works.append(
    W(
        id=5,
        workName="BOYUT",
        specialCategory="Brand Strategy",
        category="Brand Strategy",
        workDescription="Logo / Branding / Marketing Strategy / PR / Animation & 3D",
        cover=p("Assets/boyut/boyut-1.jpg"),
        media=boyut,
        createdAt="2025-06-15T00:00:00.000Z",
        hoverText="Campaign / Design / Logo",
        color="#FFFFFF",
        buttonTextColor="#1E1E1E",
        descriptions=[
            "We are incredibly proud to have played a key role in Boyut Plastik's transformative journey.",
            "We designed Boyut Plastik’s logo to balance its heritage with innovation.",
            "Our design for Boyut Plastik focuses on consistency and impact, with every element crafted to showcase the brand's commitment to progress and sustainability.",
        ],
    )
)

mokne = [p(f"Assets/mokne/{f}") for f in [
    "mokneVideo1-1.mp4", "mokneVideo2-2.mp4", "mokne-3.jpg", "mokne-4.jpg",
    "mokne-5.jpg", "mokne-6.jpg", "mokne-7.jpg", "mokne-8.jpg", "mokne-10.jpg",
    "mokne-11.jpg", "mokne-12.jpg", "mokne-13.jpg", "mokne-14.jpg", "mokne-15.jpg",
]]
works.append(
    W(
        id=4,
        workName="MOKNE",
        specialCategory="Brand Strategy",
        category="Brand Strategy",
        workDescription="Bottle / Mokne / Logo / Design Brand Strategy / Natyral Water from Istog",
        cover=p("Assets/mokne/mokne.png"),
        media=mokne,
        createdAt="2025-06-01T00:00:00.000Z",
        descriptions=[
            "We are pleased to present our remarkable work in designing the Mokne water bottle label.",
            "MOKNE, a prominent water brand, enlisted our expertise to develop a brand identity that reflects purity, freshness, and natural.",
            "The logo embodies clarity and precision, symbolizing the water's purity and exclusivity.",
        ],
    )
)

termokos = [p(f"Assets/termokos/{f}") for f in [
    "termokosVideo-1.mp4", "termokos-3.jpg", "termokos-4.jpg", "Logo_Animation-1.mp4",
    "termokos-5.jpg", "termokos-6.jpg", "termokos-7.jpg", "termokos-8.jpg", "termokos-9.jpg",
    "termokos-10.jpg", "termokos-11.jpg", "termokos-12.jpg", "termokos-13.jpg",
    "termokos-14.jpg", "termokos-15.jpg", "termokos-16.jpg", "termokos-17.jpg", "termokos-18.jpg",
]]
works.append(
    W(
        id=3,
        workName="Termokos",
        specialCategory="Brand Strategy",
        category="Brand Strategy",
        workDescription="Logo / Branding / Packaging Design / Marketing Strategy",
        cover=p("Assets/termokos/termokos-1.jpg"),
        media=termokos,
        createdAt="2025-05-20T00:00:00.000Z",
        descriptions=[
            "Introducing Termokos’s refreshed identity, symbolizing their commitment to innovation and evolution.",
            "In the mission of reshaping TERMOKOS, we ingeniously infused the distinctive silhouette of its buildings into the design.",
            "This new logo embodies the core values functionality, setting the stage for exciting journeys ahead.",
        ],
    )
)

dokutech = [p(f"Assets/dokutech1/{f}") for f in [
    "Untitle1312d-2-01 (1).png", "Untitle1312d-2-02 (1).png", "Untitle1312d-2-07 (1).png",
    "DokuTechFinal-1.mp4", "Untitle1312d-2-08 (1).png", "dokutech-9-9.mp4", "dokutech-2-1.mp4",
    "dokutech-3-1.mp4", "dokutech-4-4.mp4", "dokutech-5-5.mp4", "dokutech-6-6.mp4",
    "dokutech-7-7.mp4", "dokutech-8-8.mp4", "Untitle1312d-2-09 (1).png",
    "Untitle1312d-2-05 (1).png", "Untitle1312d-2-06 (1).png", "Untitle1312d-2-10 (1).png",
]]
works.append(
    W(
        id=101,
        workName="DOKUTECH",
        specialCategory="Brand Strategy",
        category="Brand Strategy",
        workDescription="Design Brand Strategy / Web Design / Web Development",
        cover=p("Assets/dokutech1/Untitle1312d-2-01 (1).png"),
        media=dokutech,
        createdAt="2025-05-01T00:00:00.000Z",
        descriptions=[
            "We created the visual identity, communication strategy, and overall design for the jubilee edition of Dokutech.",
            "We encapsulated a decade of tech goodness within one edition's visuals, full of colors and futuristic vibes.",
            "The main visual in the design is the clock/spinning wheel/wormhole imagery.",
        ],
    )
)

drops_order = [
    "drops-2-1.mp4", "drops-3-1.mp4", "drops-4-1.mp4", "drops-5-1.mp4", "drops-6.png",
    "drops-15-1.mp4", "drops-8.png", "drops-9-1.mp4", "drops-10-1.mp4", "drops-11.png",
    "drops-12.jpg", "drops-13.png", "drops-14-1.mp4", "drops-7.webp",
]
drops = [p(f"Assets/drops/{f}") for f in drops_order]
works.append(
    W(
        id=12,
        workName="DROPS",
        specialCategory="Brand Strategy",
        category="Brand Strategy",
        workDescription="Design Brand Strategy / Web Design / Web Development",
        cover=p("Assets/drops/drops-1-1.mp4"),
        thumbnail=p("Assets/drops/drops-6.png"),
        media=drops,
        createdAt="2025-04-15T00:00:00.000Z",
        descriptions=[
            "For Drops, a modern pub in the heart of Graz, Austria. we crafted a distinctive and captivating identity.",
            "Our goal was to create a brand presence for Drops that is both vibrant and memorable.",
            "These carefully crafted symbols help bring the brand to life, encapsulating the essence of Drops in a visual language.",
        ],
    )
)

herz = [p(f"Assets/herzpraxis/{f}") for f in [
    "herzpraxis2.jpg", "herzpraxis3.jpg", "herzpraxis4.jpg", "herzpraxis5.jpg",
    "herzpraxis6.jpg", "herzpraxis7.jpg", "herzpraxis8-8.mp4", "herzpraxis9.jpg",
    "herzpraxis10.jpg", "herzpraxis11.jpg", "herzpraxis12.jpg", "herzpraxis13.jpg",
    "herzpraxis14.jpg", "herzpraxis15.jpg", "herzpraxis16.jpg", "herzpraxis17.jpg",
    "herzpraxis18.jpg", "herzpraxis19.jpg",
]]
works.append(
    W(
        id=14,
        workName="HERZPRAXIS",
        specialCategory="Brand Strategy",
        category="Brand Strategy / Web Design ",
        workDescription="Design Brand Strategy / Web Design / Web Development",
        cover=p("Assets/herzpraxis/herzpraxis1.jpg"),
        media=herz,
        createdAt="2025-04-01T00:00:00.000Z",
        descriptions=[
            "In this unique project, we created a visual identity that precisely reflects the spirit of a medical practice dedicated to heart health.",
            "The logo for Herzpraxis blends simplicity with depth.",
            "The Herzpraxi’s website is designed with the same attention to detail as the brand’s visual identity.",
        ],
    )
)

emona_brand = [p(f"Assets/emona/{f}") for f in [
    "emona-video (1)-1.mp4", "emona-tea (1).jpg", "2-tea (1).jpg", "3-tea (1).jpg",
    "4-tea (1).jpg", "6-emona (1) (1).jpg", "6-emona (2) (1).jpg",
    "emona-2-animation (1)-1.mp4", "emona-3-animation (1)-2.mp4",
]]
works.append(
    W(
        id=1,
        workName="EMONA BRAND",
        specialCategory="Brand Strategy",
        category="Brand Strategy",
        workDescription="Bottle / Logo / Design Brand Strategy",
        cover=p("Assets/emona/EMONA.jpg"),
        media=emona_brand,
        createdAt="2025-03-01T00:00:00.000Z",
        descriptions=[],
    )
)

# filter categories
category_by_id: dict[str, str] = {}
for w in works:
    wid = str(w["id"])
    w["filterCategory"] = category_by_id.get(wid, "Unassigned")

HOMEPAGE_FEATURED_WORK_IDS = [
    "zone-club-latest-ad-campaign",
    38,
    "ysabel-advertising",
    27,
    26,
    86,
    39,
    6,
]

WORK_FILTER_CATEGORIES = [
    "Brand Identity",
    "Social Media",
    "Campaigns",
    "Video Production",
    "Web / UI-UX",
    "3D / Motion",
    "Unassigned",
]

payload = {
    "__meta": {
        "instructions": (
            "Paste full Cloudinary delivery URLs (Copy URL) into cover, thumbnail, "
            "and each media string. Leave \"\" to skip an asset. Videos can use "
            '{ "url": "https://...mp4", "thumbnail": "https://...jpg" }. '
            "Re-run scripts/gen-work-data.py only to reset from Assets paths — "
            "otherwise edit this file by hand."
        )
    },
    "featuredIds": HOMEPAGE_FEATURED_WORK_IDS,
    "filterCategories": WORK_FILTER_CATEGORIES,
    "works": works,
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(
    json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
    encoding="utf-8",
)
print(f"Wrote {len(works)} works to {OUT}")
