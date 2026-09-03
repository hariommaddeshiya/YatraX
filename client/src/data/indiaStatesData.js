// Centralized Indian States & Union Territories Master Tourism Catalog (36 Entities)

export const indiaStatesData = [
  {
    id: 'uttar-pradesh',
    code: 'UP',
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    region: 'North',
    description: 'Heartland of Indian civilization, Mughal architecture, sacred ghats, and classical arts.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'taj-mahal', name: 'Taj Mahal (Agra)', category: 'Heritage', xp: 150, description: 'UNESCO World Wonder & iconic marble mausoleum on the Yamuna.', isOffbeat: false },
      { id: 'varanasi-ghats', name: 'Varanasi Sacred Ghats', category: 'Spiritual', xp: 150, description: 'Ancient spiritual riverfront with evening Ganga Aarti.', isOffbeat: false },
      { id: 'ayodhya-ram-mandir', name: 'Ayodhya Shri Ram Janmabhoomi', category: 'Spiritual', xp: 120, description: 'Historic nagara-style temple on the banks of Sarayu.', isOffbeat: false },
      { id: 'fatehpur-sikri', name: 'Fatehpur Sikri & Buland Darwaza', category: 'Heritage', xp: 100, description: '16th-century Mughal red sandstone capital city.', isOffbeat: false },
      { id: 'sarnath-dhamek', name: 'Sarnath & Dhamek Stupa', category: 'Culture', xp: 100, description: 'Sacred grove where Lord Buddha taught his first sermon.', isOffbeat: false },
      { id: 'mathura-vrindavan', name: 'Mathura & Vrindavan Temples', category: 'Spiritual', xp: 100, description: 'Birthplace of Lord Krishna and sacred Braj culture.', isOffbeat: false },
      { id: 'lucknow-imambara', name: 'Bara Imambara & Rumi Darwaza', category: 'Culture', xp: 100, description: 'Grand Awadhi architectural labyrinth & royal gate.', isOffbeat: false },
      { id: 'chitrakoot-falls', name: 'Chitrakoot Sacred Hills & Falls', category: 'Nature', xp: 120, description: 'Pristine forested holy hills along Mandakini river.', isOffbeat: true },
      { id: 'dudhwa-national-park', name: 'Dudhwa Tiger Reserve', category: 'Nature', xp: 150, description: 'Terai wilderness home to rhinos, tigers & swamp deer.', isOffbeat: true },
      { id: 'jhansi-fort', name: 'Jhansi Historic Hill Fort', category: 'Heritage', xp: 100, description: 'Iconic stronghold of Rani Lakshmibai of the 1857 revolt.', isOffbeat: false }
    ]
  },
  {
    id: 'rajasthan',
    code: 'RJ',
    name: 'Rajasthan',
    capital: 'Jaipur',
    region: 'West',
    description: 'Land of Rajput kings, golden desert forts, vibrant folk music, and royal palaces.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'jaisalmer-fort', name: 'Jaisalmer Living Fort', category: 'Heritage', xp: 150, description: 'Golden sandstone fortified citadel in the Thar Desert.', isOffbeat: false },
      { id: 'hawa-mahal', name: 'Hawa Mahal & City Palace (Jaipur)', category: 'Heritage', xp: 120, description: 'Palace of Winds with 953 honeycombed jharokha windows.', isOffbeat: false },
      { id: 'udaipur-lake-palace', name: 'Lake Pichola & City Palace (Udaipur)', category: 'Heritage', xp: 140, description: 'Venice of the East with floating white marble palaces.', isOffbeat: false },
      { id: 'mehrangarh-fort', name: 'Mehrangarh Fort (Jodhpur)', category: 'Heritage', xp: 130, description: 'Towering cliffside fort overlooking the Blue City.', isOffbeat: false },
      { id: 'pushkar-lake', name: 'Pushkar Sacred Lake & Brahma Temple', category: 'Spiritual', xp: 110, description: 'Sacred lake with 52 ghats and rare Lord Brahma shrine.', isOffbeat: false },
      { id: 'ranthambore-safari', name: 'Ranthambore Tiger Reserve', category: 'Nature', xp: 150, description: 'Wild Bengal tigers roaming around ancient fortress ruins.', isOffbeat: false },
      { id: 'dilwara-temples', name: 'Mount Abu Dilwara Jain Temples', category: 'Culture', xp: 120, description: 'Intricate marble carvings nestled in Aravalli mountains.', isOffbeat: true },
      { id: 'chittorgarh-fort', name: 'Chittorgarh Fort', category: 'Heritage', xp: 120, description: 'Largest fort complex in India with Vijay Stambha tower.', isOffbeat: false },
      { id: 'bikaner-junagarh', name: 'Bikaner Junagarh & Camel Breeding Farm', category: 'Culture', xp: 100, description: 'Unconquered desert fortress with ornate gilded halls.', isOffbeat: true },
      { id: 'sam-sand-dunes', name: 'Sam Sand Dunes Desert Camp', category: 'Adventure', xp: 130, description: 'Sunset camel safaris, stargazing and Kalbelia folk dance.', isOffbeat: false }
    ]
  },
  {
    id: 'karnataka',
    code: 'KA',
    name: 'Karnataka',
    capital: 'Bengaluru',
    region: 'South',
    description: 'Ancient empires, monolithic stone chariots, Western Ghats coffee hills, and Arabian shores.',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'hampi-vijayanagara', name: 'Hampi Vijayanagara Ruins', category: 'Heritage', xp: 150, description: 'UNESCO stone chariot and 56 musical pillars in boulder valley.', isOffbeat: false },
      { id: 'mysore-palace', name: 'Mysore Grand Amba Vilas Palace', category: 'Heritage', xp: 130, description: 'Indo-Saracenic royal residence illuminated with 100,000 bulbs.', isOffbeat: false },
      { id: 'coorg-hills', name: 'Coorg (Kodagu) Coffee Plantations', category: 'Nature', xp: 120, description: 'Misty green valleys, spice estates and Abbey Waterfalls.', isOffbeat: false },
      { id: 'badami-caves', name: 'Badami Cave Temples & Agastya Lake', category: 'Heritage', xp: 130, description: '6th-century Chalukya sandstone rock-cut shrines.', isOffbeat: true },
      { id: 'gokarna-om-beach', name: 'Gokarna Om Beach & Mahabaleshwar', category: 'Spiritual', xp: 120, description: 'Secluded Arabian sea cove shaped like the sacred Om symbol.', isOffbeat: false },
      { id: 'chikmagalur-mullayanagiri', name: 'Chikmagalur & Mullayanagiri Peak', category: 'Adventure', xp: 120, description: 'Highest peak in Karnataka with rolling misty trekking trails.', isOffbeat: true },
      { id: 'belur-halebidu', name: 'Belur & Halebidu Hoysala Temples', category: 'Heritage', xp: 130, description: 'UNESCO star-shaped soapstone temples with intricate filigree.', isOffbeat: true },
      { id: 'jog-falls', name: 'Jog Falls (Sharavathi River)', category: 'Nature', xp: 110, description: 'India’s second steepest plunge waterfall dropping 253 meters.', isOffbeat: false },
      { id: 'nagarhole-safari', name: 'Nagarhole National Park & Kabini', category: 'Nature', xp: 140, description: 'Dense Nilgiri biosphere with wild elephants and black panthers.', isOffbeat: false },
      { id: 'pattadakal-monuments', name: 'Pattadakal Monument Complex', category: 'Heritage', xp: 120, description: '7th-century fusion of Dravidian and Nagara temple architecture.', isOffbeat: true }
    ]
  },
  {
    id: 'punjab',
    code: 'PB',
    name: 'Punjab',
    capital: 'Chandigarh',
    region: 'North',
    description: 'Heart of Sikh devotion, golden craftsmanship, vibrant Bhangra culture, and rich agrarian heritage.',
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'golden-temple', name: 'Golden Temple (Harmandir Sahib)', category: 'Spiritual', xp: 150, description: 'Gilded sanctum in the sacred Amrit Sarovar with 24x7 Langar.', isOffbeat: false },
      { id: 'wagah-border', name: 'Attari-Wagah Border Ceremony', category: 'Culture', xp: 120, description: 'Electrifying sunset military flag lowering ceremony.', isOffbeat: false },
      { id: 'jallianwala-bagh', name: 'Jallianwala Bagh Memorial', category: 'Heritage', xp: 100, description: 'Historic national memorial preserving India’s freedom sacrifice.', isOffbeat: false },
      { id: 'anandpur-sahib', name: 'Takht Sri Keshgarh Sahib (Anandpur)', category: 'Spiritual', xp: 120, description: 'Birthplace of the Khalsa surrounded by Shivalik hills.', isOffbeat: false },
      { id: 'virasat-e-khalsa', name: 'Virasat-e-Khalsa Museum', category: 'Culture', xp: 110, description: 'World-renowned architectural museum celebrating 500 years of Sikh heritage.', isOffbeat: false },
      { id: 'patiala-qila-mubarak', name: 'Patiala Qila Mubarak & Sheesh Mahal', category: 'Heritage', xp: 100, description: 'Sikh royal palace with exquisite mirror mosaic artwork.', isOffbeat: true },
      { id: 'harike-wetland', name: 'Harike Bird Sanctuary & Confluence', category: 'Nature', xp: 110, description: 'Largest wetland in northern India at Beas-Sutlej confluence.', isOffbeat: true },
      { id: 'kapurthala-palace', name: 'Kapurthala Jagatjit Palace (Paris of Punjab)', category: 'Heritage', xp: 100, description: 'French Renaissance palace inspired by Palace of Versailles.', isOffbeat: true },
      { id: 'bathinda-fort', name: 'Bathinda Qila Mubarak', category: 'Heritage', xp: 100, description: 'One of the oldest surviving forts in India built in 6th century.', isOffbeat: true },
      { id: 'saragarhi-memorial', name: 'Saragarhi Memorial Gurudwara', category: 'Culture', xp: 100, description: 'Commemorating the legendary last stand of the 21 Sikh soldiers.', isOffbeat: true }
    ]
  },
  {
    id: 'odisha',
    code: 'OD',
    name: 'Odisha',
    capital: 'Bhubaneswar',
    region: 'East',
    description: 'Temple architecture, classical Odissi dance, Chilika wetlands, and coastal sun chariots.',
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'konark-sun-temple', name: 'Konark Sun Temple & Chandrabhaga', category: 'Heritage', xp: 150, description: 'Colossal 13th-century chariot of Surya with 24 sundial wheels.', isOffbeat: false },
      { id: 'puri-jagannath', name: 'Puri Shri Jagannath Temple', category: 'Spiritual', xp: 140, description: 'Sacred Char Dham sanctuary famous for the Grand Ratha Yatra.', isOffbeat: false },
      { id: 'chilika-lake', name: 'Chilika Lake & Irrawaddy Dolphins', category: 'Nature', xp: 130, description: 'Asia’s largest brackish water lagoon with migratory birds.', isOffbeat: false },
      { id: 'lingaraj-temple', name: 'Lingaraj Temple (Bhubaneswar)', category: 'Heritage', xp: 120, description: 'Masterpiece of Kalinga architecture with 180-foot deula tower.', isOffbeat: false },
      { id: 'raghurajpur-village', name: 'Raghurajpur Heritage Craft Village', category: 'Culture', xp: 130, description: 'Centuries-old artisan enclave preserving Pattachitra scroll art.', isOffbeat: true },
      { id: 'dhauli-shanti-stupa', name: 'Dhauli Giri Peace Pagoda', category: 'Heritage', xp: 100, description: 'Historic site of Emperor Ashoka’s transformation to Buddhism.', isOffbeat: false },
      { id: 'simlipal-biosphere', name: 'Simlipal Tiger Reserve & Barehipani', category: 'Nature', xp: 140, description: 'Dense sal forests with melanistic royal Bengal tigers.', isOffbeat: true },
      { id: 'udayagiri-khandagiri', name: 'Udayagiri & Khandagiri Rock Caves', category: 'Heritage', xp: 110, description: 'Ancient Jain rock-cut monks’ cells carved during Kharavela era.', isOffbeat: false },
      { id: 'gopalpur-beach', name: 'Gopalpur-on-Sea Heritage Port', category: 'Nature', xp: 100, description: 'Quiet colonial lighthouse beach on the Bay of Bengal.', isOffbeat: true },
      { id: 'debrigarh-sanctuary', name: 'Debrigarh Wildlife & Hirakud Dam', category: 'Adventure', xp: 110, description: 'Pristine forest overlooking the world’s longest earthen dam.', isOffbeat: true }
    ]
  },
  {
    id: 'tamil-nadu',
    code: 'TN',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    region: 'South',
    description: 'Living Dravidian temple cities, classical Carnatic heritage, Nilgiri hills, and southern capes.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'meenakshi-temple', name: 'Meenakshi Amman Temple (Madurai)', category: 'Spiritual', xp: 150, description: 'Ancient Dravidian temple with 14 polychrome gopurams.', isOffbeat: false },
      { id: 'brihadisvara-thanjavur', name: 'Brihadisvara Great Living Chola Temple', category: 'Heritage', xp: 150, description: 'Granite monolithic marvel with 80-tonne single-stone cap.', isOffbeat: false },
      { id: 'mahabalipuram-shore', name: 'Mahabalipuram Shore Temple & Rathas', category: 'Heritage', xp: 130, description: '7th-century Pallava coastal rock reliefs and Arjuna’s Penance.', isOffbeat: false },
      { id: 'ooty-nilgiri-train', name: 'Nilgiri Mountain Railway & Ooty', category: 'Adventure', xp: 130, description: 'UNESCO steam toy train winding through Nilgiri cloud forests.', isOffbeat: false },
      { id: 'rameswaram-pamban', name: 'Rameswaram & Pamban Sea Bridge', category: 'Spiritual', xp: 140, description: 'Historic 1000-pillar corridor and cantilever sea bridge.', isOffbeat: false },
      { id: 'kanyakumari-cape', name: 'Kanyakumari Vivekananda Rock Memorial', category: 'Nature', xp: 120, description: 'Southernmost tip of mainland India at tri-sea confluence.', isOffbeat: false },
      { id: 'cheOperation-mansions', name: 'Chettinad Heritage Mansions & Cuisine', category: 'Culture', xp: 130, description: 'Burmese teak mansions with spicy Chettinad culinary art.', isOffbeat: true },
      { id: 'dhanushkodi-ruins', name: 'Dhanushkodi Ghost Town & Ram Setu Point', category: 'Offbeat', xp: 140, description: 'Submerged coastal ghost town at the edge of the Indian Ocean.', isOffbeat: true },
      { id: 'kanchipuram-silk', name: 'Kanchipuram Silk & Kailasanathar', category: 'Culture', xp: 110, description: 'City of 1000 temples and master handloom silk weavers.', isOffbeat: false },
      { id: 'kodaikanal-lake', name: 'Kodaikanal Lake & Pillar Rocks', category: 'Nature', xp: 110, description: 'Princess of Hill Stations with pine forests and Kurinji flower hills.', isOffbeat: false }
    ]
  },
  {
    id: 'kerala',
    code: 'KL',
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    region: 'South',
    description: 'God’s Own Country: emerald backwaters, Ayurveda healing, Kathakali dance, and misty tea estates.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'alleppey-backwaters', name: 'Alleppey Backwaters & Houseboat', category: 'Nature', xp: 150, description: 'Interconnected palm canals on solar wooden houseboats.', isOffbeat: false },
      { id: 'munnar-tea-gardens', name: 'Munnar & Anamudi Peak', category: 'Nature', xp: 130, description: 'Verdant rolling tea estates and Nilgiri Tahr habitat.', isOffbeat: false },
      { id: 'kochi-fort-nets', name: 'Fort Kochi & Chinese Fishing Nets', category: 'Culture', xp: 120, description: 'Historic spice port with Dutch palaces and colonial heritage.', isOffbeat: false },
      { id: 'wayanad-edakkal', name: 'Wayanad Edakkal Prehistoric Caves', category: 'Adventure', xp: 130, description: 'Neolithic petroglyph cave engravings atop Ambukuthi Mala.', isOffbeat: true },
      { id: 'varkala-cliff', name: 'Varkala Red Cliff & Papanasam Beach', category: 'Nature', xp: 120, description: 'Dramatic geo-heritage sedimentary cliffs over the Arabian Sea.', isOffbeat: false },
      { id: 'thekkady-periyar', name: 'Periyar Tiger Reserve (Thekkady)', category: 'Nature', xp: 130, description: 'Lake boat safari watching wild elephant herds in rainforest.', isOffbeat: false },
      { id: 'athirappilly-falls', name: 'Athirappilly Waterfalls (Niagara of India)', category: 'Nature', xp: 120, description: '80-foot majestic rainforest plunge waterfall on Chalakudy river.', isOffbeat: false },
      { id: 'bekal-fort', name: 'Bekal Fort & Coastal Ramparts', category: 'Heritage', xp: 110, description: 'Keyhole-shaped seaside fortress overlooking Malabar waves.', isOffbeat: true },
      { id: 'silent-valley', name: 'Silent Valley National Park', category: 'Nature', xp: 140, description: 'Untouched evergreen tropical rainforest with Lion-tailed macaques.', isOffbeat: true },
      { id: 'marari-eco-beach', name: 'Marari Village Eco-Resorts', category: 'Nature', xp: 110, description: 'Peaceful fishing village beach dedicated to sustainable tourism.', isOffbeat: true }
    ]
  },
  {
    id: 'maharashtra',
    code: 'MH',
    name: 'Maharashtra',
    capital: 'Mumbai',
    region: 'West',
    description: 'Rock-cut monolithic caves, Maratha hill forts, Sahyadri valleys, and coastal konkan beaches.',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'ajanta-ellora', name: 'Ajanta & Ellora Caves', category: 'Heritage', xp: 150, description: 'Kailash Cave 16 monolith and ancient Buddhist frescoes.', isOffbeat: false },
      { id: 'gateway-of-india', name: 'Gateway of India & Marine Drive (Mumbai)', category: 'Culture', xp: 110, description: 'Iconic harbor monument and Queen’s Necklace promenade.', isOffbeat: false },
      { id: 'elephanta-caves', name: 'Elephanta Island Trimurti Sculptures', category: 'Heritage', xp: 120, description: 'Rock-cut Shiva cave temples on an island in Mumbai harbour.', isOffbeat: false },
      { id: 'raigad-fort', name: 'Raigad Chhatrapati Shivaji Capital Fort', category: 'Heritage', xp: 130, description: 'Impregnable mountain stronghold of the Maratha Empire.', isOffbeat: false },
      { id: 'kaas-plateau', name: 'Kaas Plateau (Valley of Flowers)', category: 'Nature', xp: 130, description: 'UNESCO volcanic laterite plateau blooming with wild flora in monsoon.', isOffbeat: true },
      { id: 'mahabaleshwar-points', name: 'Mahabaleshwar & Arthur Seat', category: 'Nature', xp: 110, description: 'Queen of Sahyadris with strawberry farms and deep valleys.', isOffbeat: false },
      { id: 'tadoba-andhari', name: 'Tadoba Andhari Tiger Reserve', category: 'Nature', xp: 140, description: 'Premier teak forest tiger haven in Vidarbha.', isOffbeat: true },
      { id: 'shirdi-sai-temple', name: 'Shirdi Sai Baba Samadhi Mandir', category: 'Spiritual', xp: 120, description: 'World-renowned pilgrimage center of unity and devotion.', isOffbeat: false },
      { id: 'sindhudurg-sea-fort', name: 'Sindhudurg Oceanic Fort (Malvan)', category: 'Heritage', xp: 120, description: 'Sea-girt fortress built by Shivaji Maharaj with coral diving.', isOffbeat: true },
      { id: 'lonar-crater-lake', name: 'Lonar Meteorite Impact Crater Lake', category: 'Nature', xp: 130, description: '50,000-year-old hypersaline hyper-alkaline geo-heritage crater.', isOffbeat: true }
    ]
  },
  {
    id: 'meghalaya',
    code: 'ML',
    name: 'Meghalaya',
    capital: 'Shillong',
    region: 'Northeast',
    description: 'Abode of the Clouds: bio-engineered living root bridges, crystal rivers, and sacred rainforests.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'nongriat-bridges', name: 'Nongriat Double Decker Root Bridge', category: 'Adventure', xp: 150, description: '200-year-old living root marvel across rainforest torrents.', isOffbeat: true },
      { id: 'cherrapunji-nohkalikai', name: 'Nohkalikai Falls & Seven Sisters', category: 'Nature', xp: 130, description: 'India’s tallest plunge waterfall into a turquoise pool.', isOffbeat: false },
      { id: 'dawki-umngot', name: 'Dawki Umngot River Boat Drift', category: 'Nature', xp: 130, description: 'Glass-clear emerald river bordering Bangladesh.', isOffbeat: false },
      { id: 'mawlynnong-clean', name: 'Mawlynnong Asia Cleanest Village', category: 'Culture', xp: 120, description: 'Zero-waste Khasi community village with bamboo skywalk.', isOffbeat: false },
      { id: 'mawsmai-caves', name: 'Mawsmai Limestone Show Caves', category: 'Adventure', xp: 110, description: 'Illuminated fossil-rich limestone stalactite caverns.', isOffbeat: false },
      { id: 'laitlum-canyons', name: 'Laitlum Grand Green Canyons', category: 'Nature', xp: 120, description: 'End of the World green cliff edges plunging 3,000 feet.', isOffbeat: true },
      { id: 'krang-shuri-falls', name: 'Krang Shuri Turquoise Cascades', category: 'Nature', xp: 120, description: 'Magical turquoise pool waterfall in West Jaintia Hills.', isOffbeat: true },
      { id: 'umiam-lake', name: 'Umiam Lake (Barapani) Water Sports', category: 'Adventure', xp: 100, description: 'Serene pine-fringed reservoir overlooking Shillong peaks.', isOffbeat: false },
      { id: 'don-bosco-museum', name: 'Don Bosco Indigenous Museum', category: 'Culture', xp: 110, description: '7-story repository of Northeast tribal folklore and crafts.', isOffbeat: false },
      { id: 'mawphlang-sacred-grove', name: 'Mawphlang Ancient Sacred Forest', category: 'Culture', xp: 130, description: 'Protected centuries-old botanical grove governed by Khasi law.', isOffbeat: true }
    ]
  },
  {
    id: 'delhi',
    code: 'DL',
    name: 'Delhi',
    capital: 'New Delhi',
    region: 'North',
    description: 'National Capital Territory: millennia of empires, Mughal wonders, and vibrant culinary streets.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'red-fort', name: 'Red Fort (Lal Qila)', category: 'Heritage', xp: 130, description: 'Historic seat of the Mughal Emperors and symbol of India’s Republic.', isOffbeat: false },
      { id: 'qutub-minar', name: 'Qutub Minar & Iron Pillar', category: 'Heritage', xp: 130, description: '73-meter medieval minaret and rustless metallurgy pillar.', isOffbeat: false },
      { id: 'humayuns-tomb', name: 'Humayun’s Tomb Persian Gardens', category: 'Heritage', xp: 120, description: 'Precursor to the Taj Mahal set within geometric Charbagh.', isOffbeat: false },
      { id: 'india-gate', name: 'India Gate & Kartavya Path', category: 'Heritage', xp: 100, description: 'National war memorial triumphal arch in central New Delhi.', isOffbeat: false },
      { id: 'lotus-temple', name: 'Lotus Temple (Bahá’í House of Worship)', category: 'Culture', xp: 110, description: 'Pure white marble 27-petal lotus sanctuary open to all faiths.', isOffbeat: false },
      { id: 'akshardham-delhi', name: 'Swaminarayan Akshardham Temple', category: 'Culture', xp: 130, description: 'Modern pink sandstone architectural marvel on the Yamuna.', isOffbeat: false },
      { id: 'chandni-chowk', name: 'Chandni Chowk & Jama Masjid', category: 'Food', xp: 120, description: 'Historic 350-year-old culinary street with Paranthe Wali Gali.', isOffbeat: false },
      { id: 'lodhi-gardens', name: 'Lodhi Gardens & Art District', category: 'Culture', xp: 100, description: 'Sayyid & Lodhi dynasty tombs amidst curated urban greenery.', isOffbeat: false },
      { id: 'sunder-nursery', name: 'Sunder Nursery Heritage Park', category: 'Nature', xp: 100, description: 'Restored 16th-century Mughal ecological park with 300 tree species.', isOffbeat: true },
      { id: 'hauz-khas-village', name: 'Hauz Khas Medieval Complex & Lake', category: 'Culture', xp: 100, description: '13th-century Delhi Sultanate madrasa and bohemian cafes.', isOffbeat: false }
    ]
  },
  {
    id: 'himachal-pradesh',
    code: 'HP',
    name: 'Himachal Pradesh',
    capital: 'Shimla',
    region: 'North',
    description: 'Land of Gods: snow-clad Himalayan peaks, Tibetan monasteries, and alpine meadows.',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'spiti-valley-tabo', name: 'Spiti Valley & 1000-Year Tabo Monastery', category: 'Adventure', xp: 150, description: 'High-altitude cold mountain desert with cliffside monasteries.', isOffbeat: true },
      { id: 'dharamshala-mcleodganj', name: 'McLeod Ganj & Dalai Lama Temple', category: 'Spiritual', xp: 130, description: 'Little Lhasa nestled beneath Dhauladhar snow ridges.', isOffbeat: false },
      { id: 'rohtang-atal-tunnel', name: 'Atal Tunnel & Rohtang Pass (Manali)', category: 'Adventure', xp: 140, description: 'World’s longest highway tunnel above 10,000 feet leading to snow.', isOffbeat: false },
      { id: 'shimla-ridge-kalka', name: 'Shimla Ridge & Kalka-Shimla Toy Train', category: 'Heritage', xp: 120, description: 'Colonial summer capital with UNESCO heritage mountain railway.', isOffbeat: false },
      { id: 'kasol-parvati-valley', name: 'Kasol & Kheerganga Hot Springs', category: 'Adventure', xp: 130, description: 'Pine-forested river valley with natural sulfur hot spring baths.', isOffbeat: false },
      { id: 'bir-billing-paragliding', name: 'Bir Billing Paragliding World Cup Site', category: 'Adventure', xp: 140, description: 'Premier tandem paragliding take-off over green tea gardens.', isOffbeat: true },
      { id: 'khajjiar-meadow', name: 'Khajjiar (Mini Switzerland of India)', category: 'Nature', xp: 110, description: 'Saucer-shaped deodar meadow surrounding a floating island lake.', isOffbeat: false },
      { id: 'kinnaur-kalpa', name: 'Kinnaur Valley & Sacred Kinner Kailash', category: 'Culture', xp: 140, description: 'Apple orchards with panoramic views of the sacred peak.', isOffbeat: true },
      { id: 'great-himalayan-park', name: 'Great Himalayan National Park', category: 'Nature', xp: 140, description: 'UNESCO wilderness protecting snow leopards and western tragopan.', isOffbeat: true },
      { id: 'chindi-karsog', name: 'Karsog Valley & Apple Blossoms', category: 'Offbeat', xp: 120, description: 'Untouched rural village nestled among pine-clad hills.', isOffbeat: true }
    ]
  },
  {
    id: 'uttarakhand',
    code: 'UK',
    name: 'Uttarakhand',
    capital: 'Dehradun',
    region: 'North',
    description: 'Devbhoomi: Sacred Himalayan Char Dham, Ganga origins, holy yogic ashrams, and Corbett tigers.',
    image: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'kedarnath-temple', name: 'Kedarnath Jyotirlinga Sanctuary', category: 'Spiritual', xp: 150, description: 'Highest of the 12 Jyotirlingas beneath the Kedarnath peak.', isOffbeat: false },
      { id: 'badrinath-dham', name: 'Badrinath Char Dham & Mana Village', category: 'Spiritual', xp: 150, description: 'Sacred shrine of Vishnu with the first Indian village Mana.', isOffbeat: false },
      { id: 'rishikesh-ganga', name: 'Rishikesh Yoga Capital & White Water Rafting', category: 'Adventure', xp: 130, description: 'Suspension bridges, evening Parmarth Aarti and river rapids.', isOffbeat: false },
      { id: 'valley-of-flowers-uk', name: 'Valley of Flowers & Hemkund Sahib', category: 'Nature', xp: 150, description: 'UNESCO alpine valley blanketed with 500 varieties of wildflowers.', isOffbeat: true },
      { id: 'jim-corbett-safari', name: 'Jim Corbett National Park', category: 'Nature', xp: 140, description: 'India’s oldest national park with Royal Bengal tigers in Dhikala.', isOffbeat: false },
      { id: 'haridwar-har-ki-pauri', name: 'Haridwar Har Ki Pauri Ganga Aarti', category: 'Spiritual', xp: 120, description: 'Ancient holy gateway where the sacred Ganga enters the plains.', isOffbeat: false },
      { id: 'auli-ski-slopes', name: 'Auli Himalayan Ski Slopes & Ropeway', category: 'Adventure', xp: 140, description: 'India’s highest ski resort with 180° views of Nanda Devi.', isOffbeat: false },
      { id: 'chopta-tungnath', name: 'Chopta & Tungnath (Highest Shiva Temple)', category: 'Adventure', xp: 130, description: 'Mini Switzerland trek to the highest stone temple at 12,073 ft.', isOffbeat: true },
      { id: 'nainital-naini-lake', name: 'Nainital Naini Lake & Snow View', category: 'Nature', xp: 110, description: 'Emerald eye-shaped lake surrounded by seven forested hills.', isOffbeat: false },
      { id: 'munsiyari-panchachuli', name: 'Munsiyari Panchachuli Peaks', category: 'Offbeat', xp: 140, description: 'Dramatic frontier town facing five legendary snow-capped peaks.', isOffbeat: true }
    ]
  },
  {
    id: 'jammu-kashmir',
    code: 'JK',
    name: 'Jammu & Kashmir',
    capital: 'Srinagar / Jammu',
    region: 'North',
    description: 'Paradise on Earth: Dal Lake houseboats, Gulmarg powder snow, saffron fields, and alpine valleys.',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'dal-lake-shikara', name: 'Dal Lake & Floating Vegetable Market', category: 'Culture', xp: 150, description: 'Gliding on wooden shikaras past Mughal water gardens.', isOffbeat: false },
      { id: 'gulmarg-gondola', name: 'Gulmarg Gondola & Apharwat Peak', category: 'Adventure', xp: 150, description: 'World’s highest operating cable car to powder snow bowl.', isOffbeat: false },
      { id: 'pahalgam-betaab', name: 'Pahalgam Betaab Valley & Aru Valley', category: 'Nature', xp: 130, description: 'Lidder river valley with pine meadows and pony trails.', isOffbeat: false },
      { id: 'sonamarg-thajiwas', name: 'Sonamarg & Thajiwas Glacier', category: 'Adventure', xp: 130, description: 'Meadow of Gold surrounded by hanging glaciers and Sindh river.', isOffbeat: false },
      { id: 'vaishno-devi-shrine', name: 'Shri Mata Vaishno Devi Shrine (Katra)', category: 'Spiritual', xp: 140, description: 'Holy cave shrine in the Trikuta hills revered across the world.', isOffbeat: false },
      { id: 'doodhpathri-meadows', name: 'Doodhpathri (Valley of Milk)', category: 'Nature', xp: 120, description: 'Pristine green carpet meadow and roaring mountain stream.', isOffbeat: true },
      { id: 'martand-sun-temple-jk', name: 'Martand Sun Temple Ruins (Anantnag)', category: 'Heritage', xp: 120, description: '8th-century colonnaded stone temple ruins facing the valley.', isOffbeat: true },
      { id: 'mughal-gardens-srinagar', name: 'Shalimar & Nishat Mughal Gardens', category: 'Heritage', xp: 110, description: 'Terraced Persian cascading fountains looking out over Dal Lake.', isOffbeat: false },
      { id: 'gurez-valley', name: 'Gurez Valley & Habba Khatoon Peak', category: 'Offbeat', xp: 150, description: 'Secluded Himalayan valley on the ancient Silk Route.', isOffbeat: true },
      { id: 'wular-lake-jk', name: 'Wular Lake Freshwater Wetland', category: 'Nature', xp: 110, description: 'Largest freshwater lake in India framed by mountains.', isOffbeat: true }
    ]
  },
  {
    id: 'ladakh',
    code: 'LA',
    name: 'Ladakh',
    capital: 'Leh',
    region: 'North',
    description: 'Land of High Passes: Moonscape mountains, crystal cobalt lakes, and ancient gompas.',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'pangong-tso-lake', name: 'Pangong Tso Color-Changing Lake', category: 'Nature', xp: 150, description: 'Endorheic lake at 14,270 ft shifting from azure to emerald.', isOffbeat: false },
      { id: 'nubra-valley-hunder', name: 'Nubra Valley & Double-Humped Camels', category: 'Adventure', xp: 140, description: 'White sand dunes at 10,000 ft with Bactrian camels.', isOffbeat: false },
      { id: 'khardung-la-pass', name: 'Khardung La High Mountain Pass', category: 'Adventure', xp: 130, description: 'One of the world’s highest motorable passes at 17,982 ft.', isOffbeat: false },
      { id: 'thiksey-monastery', name: 'Thiksey Monastery (Mini Potala Palace)', category: 'Culture', xp: 130, description: '12-story Tibetan Buddhist complex with 49-ft Maitreya Buddha.', isOffbeat: false },
      { id: 'zanskar-frozen-chadar', name: 'Zanskar Valley & Chadar River Trail', category: 'Adventure', xp: 150, description: 'Dramatic gorge valley with winter frozen river expedition.', isOffbeat: true },
      { id: 'tso-moriri-wetland', name: 'Tso Moriri High Altitude Lake', category: 'Nature', xp: 140, description: 'Sacred mountain lake habitat of black-necked cranes.', isOffbeat: true },
      { id: 'magnetic-hill-ladakh', name: 'Magnetic Hill & Gurudwara Pathar Sahib', category: 'Nature', xp: 110, description: 'Optical gravity-defying hill on the Leh-Kargil highway.', isOffbeat: false },
      { id: 'leh-palace-shanti', name: 'Leh Royal Palace & Shanti Stupa', category: 'Heritage', xp: 120, description: '17th-century Tibetan royal palace overlooking Indus valley.', isOffbeat: false },
      { id: 'hemis-monastery-festival', name: 'Hemis National Park & Monastery', category: 'Culture', xp: 140, description: 'Largest monastery in Ladakh and snow leopard sanctuary.', isOffbeat: true },
      { id: 'hanle-dark-sky', name: 'Hanle Dark Sky Reserve & Observatory', category: 'Offbeat', xp: 150, description: 'India’s premier dark sky reserve for stargazing the Milky Way.', isOffbeat: true }
    ]
  },
  {
    id: 'goa',
    code: 'GA',
    name: 'Goa',
    capital: 'Panaji',
    region: 'West',
    description: 'Sun, sand and spice: Portuguese baroque churches, pristine beaches, and vibrant culinary culture.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'bom-jesus-basilica', name: 'Basilica of Bom Jesus (Old Goa)', category: 'Heritage', xp: 140, description: 'UNESCO Baroque church holding the mortal remains of St. Francis Xavier.', isOffbeat: false },
      { id: 'dudhsagar-falls-goa', name: 'Dudhsagar Four-Tiered Waterfalls', category: 'Nature', xp: 140, description: 'Majestic 310-meter white cascades in the Bhagwan Mahavir park.', isOffbeat: false },
      { id: 'palolem-beach-cove', name: 'Palolem Beach & Butterfly Island', category: 'Nature', xp: 120, description: 'Crescent palm-fringed cove with calm swimming waters.', isOffbeat: false },
      { id: 'fort-aguada-lighthouse', name: 'Fort Aguada & 17th Century Lighthouse', category: 'Heritage', xp: 110, description: 'Portuguese coastal fort guarding the Sinquerim coastline.', isOffbeat: false },
      { id: 'fontainhas-latin-quarter', name: 'Fontainhas Heritage Latin Quarter', category: 'Culture', xp: 130, description: 'Colorful Portuguese colonial mansions and artisanal bakeries.', isOffbeat: false },
      { id: 'chapora-fort-vagator', name: 'Chapora Fort (Dil Chahta Hai Point)', category: 'Heritage', xp: 100, description: 'Hilltop ramparts with panoramic sunset view over Vagator beach.', isOffbeat: false },
      { id: 'divar-island-backwaters', name: 'Divar Island & Mandovi Ferries', category: 'Offbeat', xp: 130, description: 'Peaceful river island with traditional Indo-Portuguese hamlets.', isOffbeat: true },
      { id: 'anjuna-flea-market', name: 'Anjuna Wednesday Flea Market', category: 'Culture', xp: 100, description: 'Bohemian bazaar with handcrafted jewelry and live acoustic gigs.', isOffbeat: false },
      { id: 'grand-island-scuba', name: 'Grand Island Scuba & Coral Reefs', category: 'Adventure', xp: 130, description: 'Shipwreck diving and dolphin spotting in Arabian waters.', isOffbeat: false },
      { id: 'cotigao-wildlife', name: 'Cotigao Wildlife Canopy Walk', category: 'Nature', xp: 120, description: 'Dense deciduous forest with 25-meter treetop watchtower.', isOffbeat: true }
    ]
  },
  {
    id: 'gujarat',
    code: 'GJ',
    name: 'Gujarat',
    capital: 'Gandhinagar',
    region: 'West',
    description: 'Land of Legends: Asiatic lions in Gir, White Rann salt desert, Sun temples, and heritage stepwells.',
    image: 'https://images.unsplash.com/photo-1609137889591-1779350a096e?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'statue-of-unity', name: 'Statue of Unity (Kevadia)', category: 'Heritage', xp: 140, description: 'World’s tallest statue at 182 meters commemorating Sardar Patel.', isOffbeat: false },
      { id: 'rann-of-kutch', name: 'Great Rann of Kutch White Desert', category: 'Culture', xp: 150, description: 'Endless white salt desert glowing beneath full moon nights.', isOffbeat: false },
      { id: 'gir-lion-sanctuary', name: 'Gir National Park (Asiatic Lions)', category: 'Nature', xp: 150, description: 'Only natural wild habitat of the Asiatic lion in the world.', isOffbeat: false },
      { id: 'somnath-jyotirlinga', name: 'Somnath Oceanfront Jyotirlinga', category: 'Spiritual', xp: 130, description: 'First among the 12 sacred Jyotirlingas on the Arabian coast.', isOffbeat: false },
      { id: 'dwarkadhish-temple', name: 'Dwarkadhish Temple (Dwarka Char Dham)', category: 'Spiritual', xp: 140, description: 'Ancient coastal kingdom of Lord Krishna with 72-pillar sanctum.', isOffbeat: false },
      { id: 'rani-ki-vav', name: 'Rani ki Vav Stepwell (Patan)', category: 'Heritage', xp: 130, description: 'UNESCO 7-level inverted subterranean temple with 500 sculptures.', isOffbeat: false },
      { id: 'modhera-sun-temple', name: 'Modhera Sun Temple & Surya Kund', category: 'Heritage', xp: 130, description: '11th-century Solanki architectural marvel aligned to equinox.', isOffbeat: false },
      { id: 'sabarmati-ashram', name: 'Sabarmati Ashram (Ahmedabad)', category: 'Heritage', xp: 100, description: 'Mahatma Gandhi’s headquarters for India’s Non-Violent Freedom Movement.', isOffbeat: false },
      { id: 'lothal-harappan-port', name: 'Lothal Indus Valley Maritime Port', category: 'Heritage', xp: 120, description: '4,500-year-old Harappan tidal dockyard and urban planning.', isOffbeat: true },
      { id: 'saputara-hills', name: 'Saputara Hill Station (Dang Rainforest)', category: 'Nature', xp: 110, description: 'Misty plateau with tribal bamboo handicrafts and waterfalls.', isOffbeat: true }
    ]
  },
  {
    id: 'west-bengal',
    code: 'WB',
    name: 'West Bengal',
    capital: 'Kolkata',
    region: 'East',
    description: 'Cultural capital, Darjeeling Himalayan toy train, Sundarbans mangroves, and terracotta temples.',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'victoria-memorial-kolkata', name: 'Victoria Memorial & Howrah Bridge', category: 'Heritage', xp: 130, description: 'White marble colonial monument and iconic cantilever river bridge.', isOffbeat: false },
      { id: 'darjeeling-toy-train', name: 'Darjeeling Himalayan Railway & Tiger Hill', category: 'Adventure', xp: 140, description: 'UNESCO narrow gauge train facing Mt. Kanchenjunga sunrise.', isOffbeat: false },
      { id: 'sundarbans-mangroves', name: 'Sundarbans Tiger Biosphere', category: 'Nature', xp: 150, description: 'World’s largest mangrove forest home to swimming Royal Bengal tigers.', isOffbeat: false },
      { id: 'dakshineswar-kalighat', name: 'Dakshineswar Kali & Belur Math', category: 'Spiritual', xp: 120, description: 'Sacred temples along the Hooghly river associated with Ramakrishna.', isOffbeat: false },
      { id: 'bishnupur-terracotta', name: 'Bishnupur Terracotta Temples', category: 'Culture', xp: 130, description: '17th-century carved burnt-clay temples and Baluchari silk.', isOffbeat: true },
      { id: 'shantiniketan-ashram', name: 'Shantiniketan (Rabindranath Tagore Ashram)', category: 'Culture', xp: 130, description: 'UNESCO open-air university embracing nature and humanism.', isOffbeat: false },
      { id: 'kalimpong-monasteries', name: 'Kalimpong Durpin & Deolo Hill', category: 'Nature', xp: 110, description: 'Panoramic Teesta valley views with flower nurseries and gompas.', isOffbeat: true },
      { id: 'dooars-jaldapara', name: 'Dooars & Jaldapara Rhino Safari', category: 'Nature', xp: 130, description: 'Foothill riverine grasslands with one-horned rhinos.', isOffbeat: true },
      { id: 'digha-mandarmani', name: 'Mandarmani Motor-Drive Beach', category: 'Nature', xp: 100, description: 'Longest drivable beach on the Bay of Bengal coastline.', isOffbeat: false },
      { id: 'murshidabad-hazarduari', name: 'Hazarduari Palace (Murshidabad)', category: 'Heritage', xp: 110, description: 'Nawab palace of a thousand doors housing royal weapons & art.', isOffbeat: true }
    ]
  },
  {
    id: 'madhya-pradesh',
    code: 'MP',
    name: 'Madhya Pradesh',
    capital: 'Bhopal',
    region: 'Central',
    description: 'Heart of India: UNESCO Khajuraho temples, Sanchi Buddhist stupas, and premier tiger reserves.',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'khajuraho-temples', name: 'Khajuraho Monument Group', category: 'Heritage', xp: 150, description: 'UNESCO Nagara-style temples with intricate sensuous stone carvings.', isOffbeat: false },
      { id: 'sanchi-stupa', name: 'Great Stupa of Sanchi', category: 'Heritage', xp: 140, description: 'Oldest stone structure in India commissioned by Emperor Ashoka.', isOffbeat: false },
      { id: 'bandhavgarh-safari', name: 'Bandhavgarh Tiger Reserve', category: 'Nature', xp: 150, description: 'Highest density of Royal Bengal tigers around 2,000-year-old fort.', isOffbeat: false },
      { id: 'gwalior-fort', name: 'Gwalior Fort (Pearl in Forts of Hind)', category: 'Heritage', xp: 130, description: 'Towering hill fort with blue turquoise tiles and rock-cut Jain statues.', isOffbeat: false },
      { id: 'ujjain-mahakaleshwar', name: 'Ujjain Mahakaleshwar Jyotirlinga', category: 'Spiritual', xp: 140, description: 'Dakshinmukhi sacred shrine famous for the dawn Bhasma Aarti.', isOffbeat: false },
      { id: 'bhedaghat-marble-rocks', name: 'Bhedaghat Marble Rocks & Dhuandhar Falls', category: 'Nature', xp: 130, description: 'Boat ride through 100-foot white marble canyon on Narmada.', isOffbeat: false },
      { id: 'pachmarhi-hills', name: 'Pachmarhi (Queen of Satpura)', category: 'Nature', xp: 120, description: 'Hill station with Pandav Caves and Bee Falls.', isOffbeat: true },
      { id: 'mandu-fortress', name: 'Mandu City of Joy & Jahaz Mahal', category: 'Heritage', xp: 130, description: 'Floating ship palace and romantic Afghan architectural ruins.', isOffbeat: true },
      { id: 'bhimbetka-caves', name: 'Bhimbetka Prehistoric Rock Shelters', category: 'Heritage', xp: 140, description: 'UNESCO 30,000-year-old Paleolithic cave art of early human civilization.', isOffbeat: true },
      { id: 'kanha-national-park', name: 'Kanha Tiger Reserve (Jungle Book)', category: 'Nature', xp: 140, description: 'Lush sal meadows that inspired Rudyard Kipling’s Jungle Book.', isOffbeat: false }
    ]
  },
  {
    id: 'assam',
    code: 'AS',
    name: 'Assam',
    capital: 'Dispur / Guwahati',
    region: 'Northeast',
    description: 'Gateway to Northeast: One-horned rhino capital, mighty Brahmaputra river, and tea gardens.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'kaziranga-rhino', name: 'Kaziranga One-Horned Rhino Sanctuary', category: 'Nature', xp: 150, description: 'UNESCO sanctuary home to two-thirds of the world’s one-horned rhinos.', isOffbeat: false },
      { id: 'majuli-river-island', name: 'Majuli Largest River Island & Satras', category: 'Culture', xp: 150, description: 'World’s largest river island preserving Neo-Vaishnavite mask crafts.', isOffbeat: true },
      { id: 'kamakhya-temple', name: 'Kamakhya Devi Shakti Peeth (Guwahati)', category: 'Spiritual', xp: 140, description: 'Sacred Tantric pilgrimage atop Nilachal hills above Brahmaputra.', isOffbeat: false },
      { id: 'manas-national-park', name: 'Manas Tiger & Pygmy Hog Biosphere', category: 'Nature', xp: 140, description: 'UNESCO foothill wilderness on Bhutan border with golden langurs.', isOffbeat: true },
      { id: 'sivasagar-ahom-palace', name: 'Sivasagar Ahom Kareng Ghar & Talatal', category: 'Heritage', xp: 120, description: '18th-century subterranean military fortress of the Ahom dynasty.', isOffbeat: true },
      { id: 'haflong-hill-station', name: 'Haflong Only Hill Station & Jatinga', category: 'Nature', xp: 120, description: 'Lush blue hills with traditional Dimasa tribal culture.', isOffbeat: true },
      { id: 'hoollongapar-gibbon', name: 'Hoollongapar Hoolock Gibbon Reserve', category: 'Nature', xp: 130, description: 'Only ape sanctuary in India with western hoolock gibbons.', isOffbeat: true },
      { id: 'jorhat-tea-estates', name: 'Jorhat Tea Research & Heritage Bungalows', category: 'Culture', xp: 110, description: 'Tea capital of the world with colonial planter havelis.', isOffbeat: false },
      { id: 'deepor-beel-wetland', name: 'Deepor Beel Ramsar Wetland', category: 'Nature', xp: 100, description: 'Permanent freshwater lake frequented by wild elephant herds.', isOffbeat: true },
      { id: 'kakochang-falls', name: 'Kakochang Waterfalls & Rubber Farms', category: 'Adventure', xp: 110, description: 'Crystal cascade nestled between tea gardens and coffee plants.', isOffbeat: true }
    ]
  },
  {
    id: 'sikkim',
    code: 'SK',
    name: 'Sikkim',
    capital: 'Gangtok',
    region: 'Northeast',
    description: 'First 100% Organic State: Kanchenjunga vistas, sacred lakes, and rhododendron valleys.',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'gurudongmar-lake', name: 'Gurudongmar Sacred High-Altitude Lake', category: 'Nature', xp: 150, description: 'One of the highest lakes in the world at 17,800 ft blessed by Guru Rinpoche.', isOffbeat: true },
      { id: 'tsomgo-lake-nathula', name: 'Tsomgo Lake & Nathu La Indo-China Pass', category: 'Adventure', xp: 140, description: 'Glacial lake with yak rides leading to the historic Silk Route pass.', isOffbeat: false },
      { id: 'yumthang-valley-flowers', name: 'Yumthang Valley of Rhododendrons', category: 'Nature', xp: 140, description: 'Sub-alpine river meadow with 24 species of blooming rhododendrons.', isOffbeat: false },
      { id: 'rumtek-monastery', name: 'Rumtek Dharma Chakra Centre', category: 'Culture', xp: 120, description: 'Largest Tibetan monastery in Sikkim of the Black Hat Karma Kagyu sect.', isOffbeat: false },
      { id: 'pelling-skywalk-kanchenjunga', name: 'Pelling Glass Skywalk & Chenrezig', category: 'Adventure', xp: 130, description: 'India’s first glass skywalk overlooking Mt. Kanchenjunga.', isOffbeat: false },
      { id: 'ravangla-buddha-park', name: 'Ravangla Tathagata Tsal (Buddha Park)', category: 'Spiritual', xp: 120, description: '130-foot consecrated statue of Lord Buddha amidst mountain views.', isOffbeat: false },
      { id: 'namchi-char-dham', name: 'Namchi Siddhesvara Char Dham', category: 'Spiritual', xp: 110, description: 'Replicas of the 4 holy Dhams with 87-foot statue of Lord Shiva.', isOffbeat: false },
      { id: 'teesta-river-rafting', name: 'Teesta River White Water Rafting', category: 'Adventure', xp: 130, description: 'Thrilling grade 3 and 4 rapids slicing through Himalayan gorges.', isOffbeat: false },
      { id: 'yuksom-historic-trail', name: 'Yuksom First Capital & Dzongri Trek', category: 'Adventure', xp: 140, description: 'Historic coronation site and gateway to Kanchenjunga base camp.', isOffbeat: true },
      { id: 'dzangu-lepcha-reserve', name: 'Dzongu Protected Lepcha Reserve', category: 'Offbeat', xp: 150, description: 'Special indigenous reserve preserving pure Lepcha tribal traditions.', isOffbeat: true }
    ]
  },
  {
    id: 'andhra-pradesh',
    code: 'AP',
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    region: 'South',
    description: 'Tirupati Balaji spiritual sanctuary, Gandikota Grand Canyon, and coastal Buddhist monuments.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'tirupati-balaji', name: 'Tirumala Venkateswara Temple', category: 'Spiritual', xp: 150, description: 'Most visited spiritual sanctuary in the world atop Seven Hills.', isOffbeat: false },
      { id: 'gandikota-canyon', name: 'Gandikota (Grand Canyon of India)', category: 'Adventure', xp: 140, description: 'Spectacular red granite gorge carved by the Penna river with ancient fort.', isOffbeat: true },
      { id: 'borra-caves-araku', name: 'Borra Million-Year Caves & Araku Valley', category: 'Nature', xp: 130, description: 'Deepest karst limestone caves in India surrounded by coffee hills.', isOffbeat: false },
      { id: 'lepakshi-hanging-pillar', name: 'Lepakshi Veerabhadra Temple & Nandi', category: 'Heritage', xp: 140, description: '16th-century Vijayanagara marvel with legendary hanging stone pillar.', isOffbeat: true },
      { id: 'rushikonda-beach-vizag', name: 'Rushikonda Blue Flag Beach & Kailasagiri', category: 'Nature', xp: 110, description: 'Pristine surfing beach and hilltop coastal ropeway.', isOffbeat: false },
      { id: 'srisailam-jyotirlinga', name: 'Srisailam Mallikarjuna Jyotirlinga', category: 'Spiritual', xp: 140, description: 'Ancient shrine in Nallamala hills on the banks of Krishna river.', isOffbeat: false },
      { id: 'belam-caves-ap', name: 'Belum Subterranean Caves', category: 'Adventure', xp: 120, description: 'Second longest natural cave system in Indian subcontinent.', isOffbeat: true },
      { id: 'amaravati-stupa', name: 'Amaravati Maha Stupa & Dhyana Buddha', category: 'Heritage', xp: 110, description: '2,000-year-old Buddhist learning center with 125-ft seated Buddha.', isOffbeat: true }
    ]
  },
  {
    id: 'telangana',
    code: 'TS',
    name: 'Telangana',
    capital: 'Hyderabad',
    region: 'South',
    description: 'Charminar heritage, Kakatiya Thousand Pillar temples, and Ramappa UNESCO engineering.',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443a504?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'charminar-hyderabad', name: 'Charminar & Laad Bazaar (Hyderabad)', category: 'Heritage', xp: 130, description: '1591 monument with four grand minarets and pearl bazaars.', isOffbeat: false },
      { id: 'golconda-fort', name: 'Golconda Fort & Acoustic Diamond Vaults', category: 'Heritage', xp: 130, description: 'Medieval fortress known for acoustic engineering and Koh-i-Noor origin.', isOffbeat: false },
      { id: 'ramappa-temple', name: 'Ramappa UNESCO Kakatiya Temple', category: 'Heritage', xp: 150, description: 'Floating brick temple named after its master sculptor Ramappa.', isOffbeat: true },
      { id: 'thousand-pillar-warangal', name: 'Warangal Fort & Thousand Pillar Temple', category: 'Heritage', xp: 120, description: '12th-century Kakatiya star-shaped temple and stone gateway arches.', isOffbeat: true },
      { id: 'chowmahalla-palace', name: 'Chowmahalla Palace of the Nizams', category: 'Culture', xp: 110, description: 'Seat of the Asaf Jahi dynasty with grand chandeliers and vintage cars.', isOffbeat: false },
      { id: 'nagarjuna-sagar-dam', name: 'Nagarjuna Sagar Dam & Island Museum', category: 'Nature', xp: 120, description: 'Massive masonry dam with ancient Buddhist relics island.', isOffbeat: false },
      { id: 'kuntala-waterfalls', name: 'Kuntala Highest Waterfall & Adilabad', category: 'Nature', xp: 120, description: 'Highest cascade in Telangana dropping through Sahyadri rocks.', isOffbeat: true },
      { id: 'ramoji-film-city', name: 'Ramoji Film City', category: 'Culture', xp: 100, description: 'World’s largest integrated film studio complex across 2,000 acres.', isOffbeat: false }
    ]
  },
  {
    id: 'bihar',
    code: 'BR',
    name: 'Bihar',
    capital: 'Patna',
    region: 'East',
    description: 'Cradle of Buddhism & Jainism: Bodh Gaya Mahabodhi Temple, and ancient Nalanda University.',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'bodh-gaya-mahabodhi', name: 'Mahabodhi Temple & Sacred Bodhi Tree', category: 'Spiritual', xp: 150, description: 'UNESCO World Heritage site where Gautama Buddha attained Enlightenment.', isOffbeat: false },
      { id: 'nalanda-university-ruins', name: 'Ancient Nalanda University Ruins', category: 'Heritage', xp: 150, description: '5th-century ancient international seat of learning with 10,000 students.', isOffbeat: false },
      { id: 'rajgir-ropeway-peace', name: 'Rajgir Vishwa Shanti Stupa & Vulture Peak', category: 'Spiritual', xp: 130, description: 'Gridhakuta hill chairlift ropeway to the white marble peace pagoda.', isOffbeat: false },
      { id: 'vaishali-ashokan-pillar', name: 'Vaishali Ashokan Lion Pillar', category: 'Heritage', xp: 120, description: 'World’s earliest democratic republic and Mahavira’s birthplace.', isOffbeat: true },
      { id: 'vikramshila-ruins', name: 'Vikramashila Ancient University', category: 'Heritage', xp: 120, description: 'Major center of Buddhist learning established by King Dharmapala.', isOffbeat: true },
      { id: 'sasaram-sher-shah', name: 'Sher Shah Suri Sandstone Tomb (Sasaram)', category: 'Heritage', xp: 120, description: 'Majestic red sandstone octagonal mausoleum standing in an artificial lake.', isOffbeat: true },
      { id: 'valmiki-tiger-reserve', name: 'Valmiki Tiger Reserve (Gandak)', category: 'Nature', xp: 130, description: 'Pristine sub-Himalayan Terai forest on the border of Nepal.', isOffbeat: true },
      { id: 'barabar-caves-bihar', name: 'Barabar 3rd Century BC Granite Caves', category: 'Heritage', xp: 130, description: 'Oldest surviving rock-cut caves in India with mirror-polished granite walls.', isOffbeat: true }
    ]
  },
  {
    id: 'jharkhand',
    code: 'JH',
    name: 'Jharkhand',
    capital: 'Ranchi',
    region: 'East',
    description: 'Land of Forests: Majestic waterfalls, Betla tiger wilderness, and sacred Jain hill shrines.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'parasmath-shikharji', name: 'Shikharji (Parasnath Hill)', category: 'Spiritual', xp: 150, description: 'Holiest Jain pilgrimage where 20 of the 24 Tirthankaras attained Moksha.', isOffbeat: false },
      { id: 'hundru-jonha-falls', name: 'Hundru & Jonha Waterfalls (Ranchi)', category: 'Nature', xp: 120, description: 'Subarnarekha river plunging 320 ft over jagged plateau rocks.', isOffbeat: false },
      { id: 'betla-national-park', name: 'Betla National Park & Palamu Fort', category: 'Nature', xp: 130, description: 'First park in the world to conduct tiger census with Chero dynasty fort.', isOffbeat: true },
      { id: 'deoghar-baidyanath', name: 'Baidyanath Dham Jyotirlinga (Deoghar)', category: 'Spiritual', xp: 140, description: 'One of the 12 sacred Jyotirlingas drawing millions of Kanwar yatris.', isOffbeat: false },
      { id: 'netarhat-sunset', name: 'Netarhat Queen of Chotanagpur Plateau', category: 'Nature', xp: 120, description: 'Misty pine forest hill station famous for dramatic sunsets.', isOffbeat: true },
      { id: 'patratu-valley', name: 'Patratu S-Curve Valley & Dam', category: 'Adventure', xp: 110, description: 'Winding scenic mountain road cutting through lush forested hills.', isOffbeat: false }
    ]
  },
  {
    id: 'chhattisgarh',
    code: 'CG',
    name: 'Chhattisgarh',
    capital: 'Raipur',
    region: 'Central',
    description: 'Tribal heartland, Chitrakote Niagara falls, ancient Sirpur ruins, and Bastar bell-metal art.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'chitrakote-falls-cg', name: 'Chitrakote Falls (Niagara of India)', category: 'Nature', xp: 150, description: 'Widest waterfall in India spanning 980 ft over Indravati river.', isOffbeat: false },
      { id: 'sirpur-heritage', name: 'Sirpur 7th Century Lakshmana Temple', category: 'Heritage', xp: 130, description: 'Exquisite red brick temple dedicated to Vishnu along Mahanadi.', isOffbeat: true },
      { id: 'bastar-tribal-crafts', name: 'Bastar Dhokra & Bell Metal Craft Enclave', category: 'Culture', xp: 140, description: '4,000-year-old lost-wax metal casting art by Maria tribes.', isOffbeat: true },
      { id: 'kanger-valley-caves', name: 'Kanger Valley & Kotumsar Stalactite Caves', category: 'Adventure', xp: 130, description: 'Deep limestone caverns home to blind subterranean cave fish.', isOffbeat: true },
      { id: 'barnawapara-sanctuary', name: 'Barnawapara Wildlife Sanctuary', category: 'Nature', xp: 120, description: 'Teak and sal forest with flying squirrels and leopards.', isOffbeat: true },
      { id: 'bhoramdeo-temple', name: 'Bhoramdeo Temple (Khajuraho of Chhattisgarh)', category: 'Heritage', xp: 130, description: '11th-century Nagara stone temple in the Maikal mountain range.', isOffbeat: true }
    ]
  },
  {
    id: 'haryana',
    code: 'HR',
    name: 'Haryana',
    capital: 'Chandigarh',
    region: 'North',
    description: 'Sacred Kurukshetra Gita battlefield, Sultanpur bird haven, and Indus Valley Rakhigarhi.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'kurukshetra-brahma-sarovar', name: 'Brahma Sarovar & Jyotisar (Kurukshetra)', category: 'Spiritual', xp: 130, description: 'Birthplace of the Bhagavad Gita under the eternal banyan tree.', isOffbeat: false },
      { id: 'sultanpur-bird-park', name: 'Sultanpur National Park & Bird Sanctuary', category: 'Nature', xp: 120, description: 'Ramsar wetland hosting 250 species of winter migratory waterfowl.', isOffbeat: false },
      { id: 'rakhigarhi-indus-site', name: 'Rakhigarhi Indus Valley Harappan Metropolis', category: 'Heritage', xp: 140, description: 'Largest settlement of the ancient Harappan Civilization spanning 350 hectares.', isOffbeat: true },
      { id: 'pinjore-yadavindra-gardens', name: 'Yadavindra Mughal Terraced Gardens (Pinjore)', category: 'Heritage', xp: 110, description: '17th-century 7-terrace Mughal garden with cascading fountains.', isOffbeat: false },
      { id: 'morni-hills-tikkar-taal', name: 'Morni Hills & Tikkar Taal Lakes', category: 'Adventure', xp: 110, description: 'Only hill station in Haryana with twin natural lakes.', isOffbeat: true },
      { id: 'damdama-lake-sohna', name: 'Damdama Lake & Sohna Sulfur Springs', category: 'Nature', xp: 100, description: 'Largest natural lake in Haryana against Aravalli ridges.', isOffbeat: false }
    ]
  },
  {
    id: 'arunachal-pradesh',
    code: 'AR',
    name: 'Arunachal Pradesh',
    capital: 'Itanagar',
    region: 'Northeast',
    description: 'Land of Dawn-Lit Mountains: Tawang monastery, Sela Pass, and tribal valleys.',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'tawang-monastery', name: 'Tawang Monastery (Galden Namgey Lhatse)', category: 'Culture', xp: 150, description: 'Second largest Buddhist monastery in the world at 10,000 ft.', isOffbeat: false },
      { id: 'sela-pass-lake', name: 'Sela Pass & Frozen Paradise Lake', category: 'Adventure', xp: 140, description: 'High Himalayan mountain pass at 13,700 ft guarded by snow ridges.', isOffbeat: false },
      { id: 'ziro-valley-apatani', name: 'Ziro Valley & Apatani Tribal Enclave', category: 'Culture', xp: 150, description: 'UNESCO cultural landscape with unique facial tattoo heritage.', isOffbeat: true },
      { id: 'namdapha-tiger-reserve', name: 'Namdapha Four-Cat Biosphere', category: 'Nature', xp: 150, description: 'Only park in the world home to tiger, leopard, snow leopard & clouded leopard.', isOffbeat: true },
      { id: 'madhuri-lake-sangetsar', name: 'Sangetsar Lake (Madhuri Lake)', category: 'Nature', xp: 130, description: 'Ethereal lake formed by earthquake with dead pine trunks rising from water.', isOffbeat: true },
      { id: 'mechuka-valley', name: 'Mechuka Valley (Forbidden Valley)', category: 'Adventure', xp: 150, description: 'Fairytale mountain valley near Indo-Tibet border with 400-year monastery.', isOffbeat: true }
    ]
  },
  {
    id: 'nagaland',
    code: 'NL',
    name: 'Nagaland',
    capital: 'Kohima',
    region: 'Northeast',
    description: 'Land of Festivals: Hornbill celebrations, Dzukou valley treks, and warrior tribal heritage.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'hornbill-kisama', name: 'Kisama Heritage Village (Hornbill Festival)', category: 'Culture', xp: 150, description: 'Festival of Festivals showcasing all 17 Naga indigenous tribes.', isOffbeat: false },
      { id: 'dzukou-valley-trek', name: 'Dzukou Valley of Lilies', category: 'Adventure', xp: 150, description: 'Dramatic emerald rolling hill valley blooming with rare Dzukou lilies.', isOffbeat: true },
      { id: 'kohima-war-cemetery', name: 'Kohima WWII War Cemetery', category: 'Heritage', xp: 120, description: 'Battle of Kohima memorial ("When you go home, tell them of us...").', isOffbeat: false },
      { id: 'khonoma-green-village', name: 'Khonoma India’s First Green Village', category: 'Culture', xp: 140, description: 'Angami warrior village transformed into a zero-hunting conservation model.', isOffbeat: true },
      { id: 'mon-konyak-headhunters', name: 'Mon (Land of the Konyak Headhunters)', category: 'Culture', xp: 150, description: 'Meeting the last surviving tattooed warrior elders of Longwa.', isOffbeat: true }
    ]
  },
  {
    id: 'manipur',
    code: 'MN',
    name: 'Manipur',
    capital: 'Imphal',
    region: 'Northeast',
    description: 'Jewel of India: Loktak floating phumdis lake, Keibul Lamjao sangai deer, and Ima Keithel.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'loktak-floating-lake', name: 'Loktak Lake & Floating Phumdis', category: 'Nature', xp: 150, description: 'Largest freshwater lake in Northeast with unique circular floating islands.', isOffbeat: false },
      { id: 'keibul-lamjao-sangai', name: 'Keibul Lamjao Floating National Park', category: 'Nature', xp: 150, description: 'World’s only floating national park and last refuge of the dancing Sangai deer.', isOffbeat: true },
      { id: 'ima-keithel-market', name: 'Ima Keithel (Mothers’ Market)', category: 'Culture', xp: 130, description: '500-year-old market run entirely by 5,000 women entrepreneurs.', isOffbeat: false },
      { id: 'kangla-fort-imphal', name: 'Kangla Royal Fort & Palace', category: 'Heritage', xp: 120, description: 'Ancient seat of the Meitei kings along the Imphal river.', isOffbeat: false },
      { id: 'shirui-kashong-peak', name: 'Shirui Hills & Rare Shirui Lily', category: 'Adventure', xp: 130, description: 'Only mountain peak in the world where the pink Shirui lily grows.', isOffbeat: true }
    ]
  },
  {
    id: 'mizoram',
    code: 'MZ',
    name: 'Mizoram',
    capital: 'Aizawl',
    region: 'Northeast',
    description: 'Land of the Hill People: Lush bamboo ridges, Vantawng falls, and Cheraw bamboo dance.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'vantawng-falls-mz', name: 'Vantawng Two-Tiered Waterfalls', category: 'Nature', xp: 140, description: 'Highest 750-ft waterfall in Mizoram surrounded by dense bamboo forests.', isOffbeat: true },
      { id: 'reiek-peak-heritage', name: 'Reiek Tlang Peak & Mizo Heritage Village', category: 'Adventure', xp: 130, description: 'Panoramic cliff viewpoint overlooking Aizawl and Bangladesh plains.', isOffbeat: false },
      { id: 'phawngpui-blue-mountain', name: 'Phawngpui (Blue Mountain National Park)', category: 'Nature', xp: 150, description: 'Highest mountain peak in Mizoram revered as abode of the deities.', isOffbeat: true },
      { id: 'tam-dil-lake', name: 'Tam Dil Sacred Forest Lake', category: 'Nature', xp: 110, description: 'Serene natural lake surrounded by evergreen tropical canopies.', isOffbeat: true },
      { id: 'aizawl-solomon-temple', name: 'Solomon’s Temple & Durtlang Hills', category: 'Culture', xp: 110, description: 'Pure white marble architectural landmark in Aizawl.', isOffbeat: false }
    ]
  },
  {
    id: 'tripura',
    code: 'TR',
    name: 'Tripura',
    capital: 'Agartala',
    region: 'Northeast',
    description: 'Royal Palaces: Floating Neermahal water castle, Unakoti rock carvings, and Ujjayanta Palace.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'unakoti-rock-carvings', name: 'Unakoti 7th Century Rock Reliefs', category: 'Heritage', xp: 150, description: 'Ancient mountain pilgrimage with millions of colossal Shiva rock carvings.', isOffbeat: true },
      { id: 'neermahal-water-palace', name: 'Neermahal Water Palace (Rudrasagar Lake)', category: 'Heritage', xp: 140, description: 'Only floating water palace in Eastern India blending Hindu and Mughal styles.', isOffbeat: false },
      { id: 'ujjayanta-palace-agartala', name: 'Ujjayanta Royal Palace & State Museum', category: 'Heritage', xp: 120, description: 'Grand white neoclassical palace with Mughal gardens.', isOffbeat: false },
      { id: 'tripura-sundari-temple', name: 'Matabari Tripura Sundari Temple', category: 'Spiritual', xp: 120, description: 'One of the 51 holy Shakti Peethas built by Maharaja Dhanya Manikya.', isOffbeat: false },
      { id: 'jampui-hills-orange', name: 'Jampui Hills (Orange Festival Ridge)', category: 'Nature', xp: 120, description: 'Highest hill range in Tripura famous for eternal spring and orange orchids.', isOffbeat: true }
    ]
  },
  // --- UNION TERRITORIES (8 UTs) ---
  {
    id: 'andaman-nicobar',
    code: 'AN',
    name: 'Andaman & Nicobar Islands',
    capital: 'Port Blair',
    region: 'South',
    description: 'Tropical archipelago: Radhanagar white sands, Cellular Jail history, and coral diving.',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'radhanagar-beach-havelock', name: 'Radhanagar Beach No. 7 (Havelock/Swaraj)', category: 'Nature', xp: 150, description: 'Voted Asia’s best beach with turquoise waters and white powdery sands.', isOffbeat: false },
      { id: 'cellular-jail-port-blair', name: 'Cellular Jail National Memorial (Kala Pani)', category: 'Heritage', xp: 140, description: 'Historic colonial prison commemorating freedom fighters.', isOffbeat: false },
      { id: 'elephant-beach-snorkeling', name: 'Elephant Beach Coral Reefs', category: 'Adventure', xp: 130, description: 'Pristine live coral reefs with sea walking and scuba diving.', isOffbeat: false },
      { id: 'baratang-mud-volcano', name: 'Baratang Limestone Caves & Mud Volcano', category: 'Nature', xp: 140, description: 'Mangrove boat safari leading to million-year-old limestone formations.', isOffbeat: true },
      { id: 'ross-island-ruins', name: 'Netaji Subhash Chandra Bose Island', category: 'Heritage', xp: 120, description: 'Colonial ruins entwined with giant banyan roots overlooking the bay.', isOffbeat: false },
      { id: 'neil-natural-bridge', name: 'Neil Island Natural Rock Bridge (Howrah Bridge)', category: 'Nature', xp: 120, description: 'Living natural rock formation jutting into tidal coral pools.', isOffbeat: true }
    ]
  },
  {
    id: 'lakshadweep',
    code: 'LD',
    name: 'Lakshadweep',
    capital: 'Kavaratti',
    region: 'South',
    description: 'Emerald Coral Atolls: Lagoon diving, uninhabited islets, and zero-carbon island escapes.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'agatti-island-lagoon', name: 'Agatti Island Coral Atoll & Airfield', category: 'Nature', xp: 150, description: 'Narrow airstrip surrounded by translucent turquoise lagoons on both sides.', isOffbeat: false },
      { id: 'bangaram-island-scuba', name: 'Bangaram Tear-Drop Island & Scuba', category: 'Adventure', xp: 150, description: 'Uninhabited paradise island with bioluminescent plankton at night.', isOffbeat: true },
      { id: 'kavaratti-marine-aquarium', name: 'Kavaratti Marine Aquarium & Ujra Mosque', category: 'Culture', xp: 130, description: 'Administrative capital with glass-bottom boat coral excursions.', isOffbeat: false },
      { id: 'kadmat-water-sports', name: 'Kadmat Long Beach & Kayaking Lagoon', category: 'Adventure', xp: 130, description: '8-km pristine reef lagoon ideal for windsurfing and snorkeling.', isOffbeat: true },
      { id: 'minicoy-lighthouse', name: 'Minicoy Island British Lighthouse', category: 'Heritage', xp: 140, description: '300-ft historic lighthouse overlooking Maldivian Mahl culture.', isOffbeat: true }
    ]
  },
  {
    id: 'puducherry',
    code: 'PY',
    name: 'Puducherry',
    capital: 'Puducherry',
    region: 'South',
    description: 'French Riviera of the East: Yellow colonial villas, Auroville Matrimandir, and Promenade.',
    image: 'https://images.unsplash.com/photo-1588096344356-9b575775f0a0?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'auroville-matrimandir', name: 'Auroville & Golden Matrimandir Dome', category: 'Culture', xp: 140, description: 'Universal experimental township with golden meditation sphere.', isOffbeat: false },
      { id: 'white-town-french-colony', name: 'White Town French Quarter & Promenade', category: 'Culture', xp: 120, description: 'Colonial mustard-yellow villas, bougainvillea alleys and cafes.', isOffbeat: false },
      { id: 'sri-aurobindo-ashram', name: 'Sri Aurobindo Ashram', category: 'Spiritual', xp: 110, description: 'Spiritual center founded by Sri Aurobindo and The Mother.', isOffbeat: false },
      { id: 'paradise-beach-chunnambar', name: 'Paradise Beach & Chunnambar Boat House', category: 'Nature', xp: 120, description: 'Secluded golden sand spit reached by mangrove river ferry.', isOffbeat: false },
      { id: 'arikamedu-roman-port', name: 'Arikamedu Ancient Roman Trade Port', category: 'Heritage', xp: 120, description: '2,000-year-old archaeological ruins of Indo-Roman maritime commerce.', isOffbeat: true }
    ]
  },
  {
    id: 'chandigarh-ut',
    code: 'CH',
    name: 'Chandigarh',
    capital: 'Chandigarh',
    region: 'North',
    description: 'City Beautiful: Le Corbusier modern architecture, Nek Chand Rock Garden, and Sukhna Lake.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'rock-garden-nek-chand', name: 'Nek Chand Rock Garden', category: 'Culture', xp: 130, description: 'Visionary 40-acre sculpture park built entirely from industrial & household waste.', isOffbeat: false },
      { id: 'sukhna-lake-chandigarh', name: 'Sukhna Lake Promenade & Shivalik Views', category: 'Nature', xp: 110, description: 'Peaceful man-made reservoir at the foot of the Himalayas.', isOffbeat: false },
      { id: 'capitol-complex-corbusier', name: 'UNESCO Le Corbusier Capitol Complex', category: 'Heritage', xp: 130, description: 'Monumental Open Hand monument and modernist architecture.', isOffbeat: false },
      { id: 'zakir-hussain-rose-garden', name: 'Zakir Hussain Rose Garden', category: 'Nature', xp: 100, description: 'Asia’s largest rose garden with 50,000 rose bushes of 1,600 species.', isOffbeat: false }
    ]
  },
  {
    id: 'dadra-nagar-haveli-daman-diu',
    code: 'DN',
    name: 'Dadra & Nagar Haveli and Daman & Diu',
    capital: 'Daman',
    region: 'West',
    description: 'Portuguese Coastal Strongholds: Diu sea fort, Nani Daman, and Vanganga lake garden.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    destinations: [
      { id: 'diu-fort-naida-caves', name: 'Diu Ocean Fort & Naida Carved Caves', category: 'Heritage', xp: 140, description: 'Colossal Portuguese fortress surrounded by the sea on three sides.', isOffbeat: false },
      { id: 'ghoghla-blue-flag-beach', name: 'Ghoghla Golden Sand Blue Flag Beach', category: 'Nature', xp: 120, description: 'Cleanest swimming beach on the Saurashtra coast with water sports.', isOffbeat: false },
      { id: 'moti-daman-fort', name: 'Moti Daman Fort & Bom Jesus Church', category: 'Heritage', xp: 120, description: 'Historic 16th-century fortress with ornate Portuguese woodwork.', isOffbeat: true },
      { id: 'vanganga-lake-silvassa', name: 'Vanganga Lake Garden (Silvassa)', category: 'Nature', xp: 100, description: 'Japanese-style landscaped garden with paddle boating and wooden bridges.', isOffbeat: true }
    ]
  }
];

// Helper lookup functions
export const getAllStates = () => indiaStatesData;

export const getStateById = (stateId) => {
  return indiaStatesData.find(s => s.id === stateId || s.code.toLowerCase() === stateId.toLowerCase()) || null;
};

export const getDestinationById = (destId) => {
  for (const state of indiaStatesData) {
    const found = state.destinations.find(d => d.id === destId);
    if (found) return { ...found, stateId: state.id, stateName: state.name };
  }
  return null;
};

export const getTotalDestinationsCount = () => {
  return indiaStatesData.reduce((acc, s) => acc + s.destinations.length, 0);
};
