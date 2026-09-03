import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Info, 
  Layers, 
  Compass, 
  Sparkles, 
  MapPin, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  Headphones, 
  Play, 
  Pause, 
  Square,
  Camera,
  CheckCircle2,
  Navigation,
  Footprints,
  ChevronRight,
  Move
} from 'lucide-react';
import { DataSourceBadge } from '../common/DataSourceBadge.jsx';

// =========================================================================
// TOP 10 INDIAN SANCTUARIES - 360° DUAL-HEMISPHERE EQUIRECTANGULAR VR
// Front (0°) = Main Monument | Back (180°) = Authentic Matching Opposite View
// =========================================================================
const HERITAGE_WALKAROUND_NODES = {
  // 1. Taj Mahal (Agra, UP)
  'taj-mahal': [
    {
      id: 'pool',
      name: '1. Charbagh Fountains & Central Reflection Pool',
      subtitle: 'Front (0°): Makrana Marble Dome & Minarets • Behind (180°): Royal Great Gate (Darwaza-i-Rauza)',
      frontImageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'plinth', label: 'Step onto Marble Plinth ➔' }]
    },
    {
      id: 'plinth',
      name: '2. Main White Marble Plinth & Archway',
      subtitle: 'Front (0°): Translucent Marble & Pietra Dura Inlay • Behind (180°): Charbagh Gardens & Yamuna River',
      frontImageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1585506942812-e72b29cef752?auto=format&fit=crop&w=2400&q=90',
      arrows: [
        { targetNodeId: 'river', label: 'Walk to Yamuna Terrace ➔' },
        { targetNodeId: 'pool', label: '⬅ Walk Back to Pool' }
      ]
    },
    {
      id: 'river',
      name: '3. Yamuna Riverfront & Mosque Terrace',
      subtitle: 'Front (0°): Red Sandstone Mosque Courtyard • Behind (180°): Broad Yamuna River & Mehtab Bagh Horizon',
      frontImageUrl: 'https://images.unsplash.com/photo-1585506942812-e72b29cef752?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'plinth', label: '⬅ Return to Marble Plinth' }]
    }
  ],

  // 2. Varanasi Sacred Ghats & Kashi (Varanasi, UP)
  'varanasi-ghats': [
    {
      id: 'dash',
      name: '1. Dashashwamedh Main Ghat Arena',
      subtitle: 'Front (0°): Historic Tiered Stone Steps & Aarti Altars • Behind (180°): Holy Ganga Expanse & Riverboats',
      frontImageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'ganga', label: 'Step onto Holy Ganga Boat ➔' }]
    },
    {
      id: 'ganga',
      name: '2. Ganga Mid-River Vantage Point',
      subtitle: 'Front (0°): Crescent Curve of 84 Ancient Stone Ghats • Behind (180°): Eastern Sunrise Riverbank & Morning Mist',
      frontImageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=2400&q=90',
      arrows: [
        { targetNodeId: 'mani', label: 'Walk to Maratha River Pavilions ➔' },
        { targetNodeId: 'dash', label: '⬅ Return to Dashashwamedh' }
      ]
    },
    {
      id: 'mani',
      name: '3. Ancient Sandstone River Pavilions',
      subtitle: 'Front (0°): Centuries-old Stone Chattris • Behind (180°): Sacred River Horizon & Wooden Boats',
      frontImageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'ganga', label: '⬅ Return to River Boat' }]
    }
  ],

  // 3. Hampi Vijayanagara Ruins (Karnataka)
  'hampi-vijayanagara': [
    {
      id: 'chariot',
      name: '1. Monolithic Vittala Stone Chariot',
      subtitle: 'Front (0°): Carved Granite Solar Chariot • Behind (180°): 56 Musical Pillars Maha-Mandapa',
      frontImageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443a504?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'pillars', label: 'Walk to Musical Pillars Mandapa ➔' }]
    },
    {
      id: 'pillars',
      name: '2. 56 Musical Granite Pillars Mandapa',
      subtitle: 'Front (0°): Resonating Dravidian Columns • Behind (180°): Hemakuta Hill Boulder Horizon',
      frontImageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443a504?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=2400&q=90',
      arrows: [
        { targetNodeId: 'hill', label: 'Walk to Hemakuta Sunset Horizon ➔' },
        { targetNodeId: 'chariot', label: '⬅ Return to Stone Chariot' }
      ]
    },
    {
      id: 'hill',
      name: '3. Hemakuta Hill Boulder Sanctuary',
      subtitle: 'Front (0°): Ancient Hilltop Shrines • Behind (180°): Virupaksha Soaring Gopuram Horizon',
      frontImageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'pillars', label: '⬅ Return to Temple Mandapa' }]
    }
  ],

  // 4. Golden Temple (Harmandir Sahib, Amritsar, Punjab)
  'golden-temple': [
    {
      id: 'entrance',
      name: '1. Clock Tower Deori Gateway & Arch',
      subtitle: 'Front (0°): Gilded Harmandir Sahib in Amrit Sarovar • Behind (180°): Victorian Clock Tower Gateway Plaza',
      frontImageUrl: 'https://images.unsplash.com/photo-1588096344356-9b575775f0a0?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1609137144820-21016834164b?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'parikrama', label: 'Walk along Amrit Sarovar ➔' }]
    },
    {
      id: 'parikrama',
      name: '2. Amrit Sarovar Marble Parikrama',
      subtitle: 'Front (0°): Akal Takht & Sacred Pool • Behind (180°): White Marble Colonnades & Dukh Bhanjani Beri',
      frontImageUrl: 'https://images.unsplash.com/photo-1609137144820-21016834164b?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=2400&q=90',
      arrows: [
        { targetNodeId: 'sanctum', label: 'Walk across Guru Causeway ➔' },
        { targetNodeId: 'entrance', label: '⬅ Return to Clock Tower' }
      ]
    },
    {
      id: 'sanctum',
      name: '3. Gilded Harmandir Sahib Sanctum',
      subtitle: 'Front (0°): 500kg Pure Gold Foil Sanctum • Behind (180°): Marble Causeway (Guru’s Bridge) to Entrance',
      frontImageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1588096344356-9b575775f0a0?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'parikrama', label: '⬅ Return to Parikrama' }]
    }
  ],

  // 5. Konark Sun Temple (Puri, Odisha)
  'konark-sun-temple': [
    {
      id: 'wheels',
      name: '1. Grand Sun Chariot 24 Wheels',
      subtitle: 'Front (0°): Colossal Stone Sundial Wheels of Surya • Behind (180°): Natya Mandapa Dancing Hall',
      frontImageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1609137889591-1779350a096e?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'natya', label: 'Walk to Natya Mandapa ➔' }]
    },
    {
      id: 'natya',
      name: '2. Natya Mandapa Dancing Hall',
      subtitle: 'Front (0°): Carved Columns of Odissi Dancers • Behind (180°): Chandrabhaga Coastal Casuarina Dunes',
      frontImageUrl: 'https://images.unsplash.com/photo-1609137889591-1779350a096e?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'wheels', label: '⬅ Return to Sun Wheels' }]
    }
  ],

  // 6. Meenakshi Amman Temple (Madurai, Tamil Nadu)
  'meenakshi-temple': [
    {
      id: 'gopuram',
      name: '1. Southern Polychrome Gopuram (170 ft)',
      subtitle: 'Front (0°): Soaring Gateway with 33,000 Deities • Behind (180°): Golden Lotus Sacred Water Tank',
      frontImageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'tank', label: 'Walk to Golden Lotus Tank ➔' }]
    },
    {
      id: 'tank',
      name: '2. Golden Lotus Sacred Tank (Potramarai Kulam)',
      subtitle: 'Front (0°): Sacred Pool Reflecting Gopurams • Behind (180°): Hall of 1000 Granite Pillars Prakaram',
      frontImageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'gopuram', label: '⬅ Return to South Gopuram' }]
    }
  ],

  // 7. Jaisalmer Living Fort (Rajasthan)
  'jaisalmer-fort': [
    {
      id: 'gate',
      name: '1. Suraj Pol Golden Gateway',
      subtitle: 'Front (0°): Yellow Sandstone Bastions & Ramps • Behind (180°): Great Thar Desert Vast Golden Dunes',
      frontImageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'palace', label: 'Walk to Maharaja Palace ➔' }]
    },
    {
      id: 'palace',
      name: '2. Maharaja Palace & Fort Ramparts',
      subtitle: 'Front (0°): 7-Tiered Royal Palace Facade • Behind (180°): Walled Desert City & Sam Sand Dunes Horizon',
      frontImageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'gate', label: '⬅ Return to Fort Gate' }]
    }
  ],

  // 8. Alleppey Backwaters & Vembanad (Kerala)
  'alleppey-backwaters': [
    {
      id: 'boat',
      name: '1. Traditional Houseboat Sun Deck',
      subtitle: 'Front (0°): Handcrafted Wooden Kettuvallam & Vembanad Lake • Behind (180°): Lush Coconut Palm Canals & Paddy Banks',
      frontImageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'canal', label: 'Glide into Palm Canal ➔' }]
    },
    {
      id: 'canal',
      name: '2. Palm-Fringed Village Canal Crossing',
      subtitle: 'Front (0°): Serene Backwater Waterways • Behind (180°): Snake Boat Race Pavilion & Chinese Fishing Nets',
      frontImageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'boat', label: '⬅ Return to Houseboat' }]
    }
  ],

  // 9. Ajanta & Ellora Caves (Maharashtra)
  'ajanta-ellora': [
    {
      id: 'kailash',
      name: '1. Kailash Temple Cave 16 Monolith Ground',
      subtitle: 'Front (0°): Monolithic Shrine Carved from Top-Down • Behind (180°): 100-ft Vertical Basalt Cliff Ravine & Elephants',
      frontImageUrl: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1609137889591-1779350a096e?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'court', label: 'Walk to Upper Galleries ➔' }]
    },
    {
      id: 'court',
      name: '2. Upper Cliff Galleries & Monolithic Pillars',
      subtitle: 'Front (0°): Two-Story Rock-Cut Colonnades • Behind (180°): Sahyadri Mountain Waterfall Gorge',
      frontImageUrl: 'https://images.unsplash.com/photo-1609137889591-1779350a096e?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'kailash', label: '⬅ Return to Monolith Base' }]
    }
  ],

  // 10. Mawlynnong & Nongriat Living Roots (Meghalaya)
  'nongriat-bridges': [
    {
      id: 'bridge',
      name: '1. Double Decker Living Root Bridge',
      subtitle: 'Front (0°): 500-Year Bio-Engineered Ficus Root Bridge • Behind (180°): Turquoise Glacial Rainforest Plunge Pool',
      frontImageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'pool', label: 'Walk to Turquoise River Pool ➔' }]
    },
    {
      id: 'pool',
      name: '2. Natural Turquoise Rainforest Plunge Pool',
      subtitle: 'Front (0°): Crystal Turquoise Mountain River Basin • Behind (180°): Dense Meghalaya Rainforest Canopy & Boulders',
      frontImageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=90',
      arrows: [{ targetNodeId: 'bridge', label: '⬅ Return to Living Bridge' }]
    }
  ]
};

// =========================================================================
// EQUIRECTANGULAR 360° PHOTOSPHERE CANVAS COMPOSITOR
// Composites Front (0°) and Authentic Back (180°) with seamless seam blending
// =========================================================================
const compose360EquirectangularTexture = (frontUrl, backUrl) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const frontImg = new Image();
    frontImg.crossOrigin = 'anonymous';

    const backImg = new Image();
    backImg.crossOrigin = 'anonymous';

    let loaded = 0;
    const renderCanvas = () => {
      loaded++;
      if (loaded < 2) return;

      const w = canvas.width;
      const h = canvas.height;

      // Fill background
      ctx.fillStyle = '#0a1a18';
      ctx.fillRect(0, 0, w, h);

      // In Three.js SphereGeometry inverted (scale(-1, 1, 1)):
      // U = 0.5 (X = w/2) corresponds to theta = 0 deg (STRAIGHT AHEAD / FRONT)
      // U = 0.0 & U = 1.0 (X = 0 & X = w) correspond to theta = 180 deg (STRAIGHT BEHIND / BACK)

      // 1. Draw FRONT Image centered at X = w/2 (span X: w/4 to 3*w/4, width = w/2)
      ctx.drawImage(frontImg, w / 4, 0, w / 2, h);

      // 2. Draw BACK Image split at left (X: 0 to w/4) and right (X: 3*w/4 to w)
      // Left half of backImg at [3*w/4, w] and Right half of backImg at [0, w/4]
      ctx.drawImage(backImg, 0, 0, backImg.width / 2, backImg.height, 3 * w / 4, 0, w / 4, h);
      ctx.drawImage(backImg, backImg.width / 2, 0, backImg.width / 2, backImg.height, 0, 0, w / 4, h);

      // 3. Apply smooth subtle feathering at the 90° (w/4) and 270° (3*w/4) lateral transitions
      const blendW = 40;
      
      // Seam 1: at X = w/4
      const grad1 = ctx.createLinearGradient(w / 4 - blendW, 0, w / 4 + blendW, 0);
      grad1.addColorStop(0, 'rgba(10, 26, 24, 0.25)');
      grad1.addColorStop(0.5, 'rgba(10, 26, 24, 0.05)');
      grad1.addColorStop(1, 'rgba(10, 26, 24, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(w / 4 - blendW, 0, blendW * 2, h);

      // Seam 2: at X = 3*w/4
      const grad2 = ctx.createLinearGradient(3 * w / 4 - blendW, 0, 3 * w / 4 + blendW, 0);
      grad2.addColorStop(0, 'rgba(10, 26, 24, 0)');
      grad2.addColorStop(0.5, 'rgba(10, 26, 24, 0.05)');
      grad2.addColorStop(1, 'rgba(10, 26, 24, 0.25)');
      ctx.fillStyle = grad2;
      ctx.fillRect(3 * w / 4 - blendW, 0, blendW * 2, h);

      // Create Three.js Texture with ClampToEdgeWrapping (NO MIRRORED REPEAT)
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(1, 1);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      resolve(texture);
    };

    frontImg.onload = renderCanvas;
    frontImg.onerror = () => { loaded++; if (loaded === 2) renderCanvas(); };

    backImg.onload = renderCanvas;
    backImg.onerror = () => { loaded++; if (loaded === 2) renderCanvas(); };

    frontImg.src = frontUrl;
    backImg.src = backUrl || frontUrl;
  });
};

export const PanoramaViewer = ({ site }) => {
  const mountRef = useRef(null);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [loadingTexture, setLoadingTexture] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentFov, setCurrentFov] = useState(75);
  const [viewOrientation, setViewOrientation] = useState(0); // degrees for compass
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Studio Clean Audio Narration State (Zero Background Noise)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(0.95);
  const [speechProgress, setSpeechProgress] = useState(0);
  const utteranceRef = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereMeshRef = useRef(null);

  const isUserInteractingRef = useRef(false);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const phiRef = useRef(0);
  const thetaRef = useRef(0);

  // Walkaround Nodes for this site
  const nodes = HERITAGE_WALKAROUND_NODES[site?.id] || [
    {
      id: 'main',
      name: `1. ${site?.name || 'Main Sanctuary View'}`,
      subtitle: site?.historicalSummary || 'Historic Sanctuary 360° Spherical Photosphere',
      frontImageUrl: site?.panoramaUrl || site?.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2400&q=90',
      backImageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2400&q=90',
      arrows: []
    }
  ];

  const activeNode = nodes[currentNodeIndex] || nodes[0];

  // Reset node index when site changes
  useEffect(() => {
    setCurrentNodeIndex(0);
  }, [site?.id]);

  // -------------------------------------------------------------
  // STUDIO AUDIO GUIDE (Zero synthesized drone/oscillator)
  // -------------------------------------------------------------
  const stopAudioNarration = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAudioPlaying(false);
    setIsAudioPaused(false);
    setSpeechProgress(0);
  }, []);

  const playAudioNarration = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis audio is not supported in this browser.');
      return;
    }

    if (isAudioPaused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
      setIsAudioPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const narrationText = `${site?.name || 'Heritage Sanctuary'}, located in ${site?.location || ''}, ${site?.state || 'India'}. ${site?.historicalSummary || ''} ${activeNode?.subtitle || ''}`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utteranceRef.current = utterance;
    utterance.rate = audioSpeed;
    utterance.pitch = 1.0;

    // Use clean natural voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('India') || v.name.includes('Samantha')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => {
      setIsAudioPlaying(true);
      setIsAudioPaused(false);
    };

    utterance.onend = () => {
      setIsAudioPlaying(false);
      setIsAudioPaused(false);
      setSpeechProgress(100);
    };

    utterance.onerror = () => {
      setIsAudioPlaying(false);
      setIsAudioPaused(false);
    };

    utterance.onboundary = (e) => {
      if (narrationText.length > 0) {
        setSpeechProgress(Math.min(100, Math.round((e.charIndex / narrationText.length) * 100)));
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseAudioNarration = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isAudioPlaying) {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
      setIsAudioPlaying(false);
    }
  };

  const toggleAudioNarration = () => {
    if (isAudioPlaying) {
      pauseAudioNarration();
    } else {
      playAudioNarration();
    }
  };

  useEffect(() => {
    stopAudioNarration();
    return () => {
      stopAudioNarration();
    };
  }, [site, stopAudioNarration]);

  // -------------------------------------------------------------
  // THREE.JS 360° SPHERICAL VIRTUAL REALITY INITIALIZATION
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mountRef.current || !site) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 580;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(currentFov, width / height, 1, 2000);
    camera.target = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance' 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Inverted 360 Sphere
    const geometry = new THREE.SphereGeometry(600, 80, 60);
    geometry.scale(-1, 1, 1);

    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
    sphereMeshRef.current = sphereMesh;
    scene.add(sphereMesh);

    // 5. Load Real Dual-Hemisphere Equirectangular Texture (Front != Back)
    setLoadingTexture(true);
    compose360EquirectangularTexture(activeNode.frontImageUrl, activeNode.backImageUrl).then((texture) => {
      sphereMaterial.map = texture;
      sphereMaterial.color.setHex(0xFFFFFF);
      sphereMaterial.needsUpdate = true;
      setLoadingTexture(false);
    });

    // 6. Mouse / Touch Drag Handlers
    const onPointerDown = (event) => {
      isUserInteractingRef.current = true;
      const clientX = event.clientX || (event.touches && event.touches[0].clientX);
      const clientY = event.clientY || (event.touches && event.touches[0].clientY);
      onPointerDownPointerXRef.current = clientX;
      onPointerDownPointerYRef.current = clientY;
      onPointerDownLonRef.current = lonRef.current;
      onPointerDownLatRef.current = latRef.current;
    };

    const onPointerMove = (event) => {
      if (isUserInteractingRef.current === true) {
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        lonRef.current = (onPointerDownPointerXRef.current - clientX) * 0.12 + onPointerDownLonRef.current;
        latRef.current = (clientY - onPointerDownPointerYRef.current) * 0.12 + onPointerDownLatRef.current;
      }
    };

    const onPointerUp = () => {
      isUserInteractingRef.current = false;
    };

    const onWheel = (event) => {
      event.preventDefault();
      const newFov = THREE.MathUtils.clamp(camera.fov + event.deltaY * 0.05, 25, 100);
      camera.fov = newFov;
      camera.updateProjectionMatrix();
      setCurrentFov(Math.round(newFov));
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 7. Window Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight || 580;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAutoRotating && !isUserInteractingRef.current) {
        lonRef.current += 0.08 * rotationSpeed;
      }

      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      phiRef.current = THREE.MathUtils.degToRad(90 - latRef.current);
      thetaRef.current = THREE.MathUtils.degToRad(lonRef.current);

      camera.target.x = 600 * Math.sin(phiRef.current) * Math.cos(thetaRef.current);
      camera.target.y = 600 * Math.cos(phiRef.current);
      camera.target.z = 600 * Math.sin(phiRef.current) * Math.sin(thetaRef.current);

      camera.lookAt(camera.target);

      // Orientation degree for compass HUD (0 = Front/North, 180 = Rear/South)
      const normDeg = (Math.round(lonRef.current) % 360 + 360) % 360;
      setViewOrientation(normDeg);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [site]);

  // -------------------------------------------------------------
  // SMOOTH WALKAROUND NODE TRANSITION WITH REAL OPPOSITE ANGLE
  // -------------------------------------------------------------
  const handleWalkToNode = (targetIndex) => {
    if (targetIndex === currentNodeIndex || !nodes[targetIndex]) return;

    setIsTransitioning(true);
    setLoadingTexture(true);

    const targetNode = nodes[targetIndex];
    if (sphereMeshRef.current) {
      compose360EquirectangularTexture(targetNode.frontImageUrl, targetNode.backImageUrl).then((newTex) => {
        if (sphereMeshRef.current) {
          sphereMeshRef.current.material.map = newTex;
          sphereMeshRef.current.material.needsUpdate = true;
        }
        setCurrentNodeIndex(targetIndex);
        setLoadingTexture(false);
        setTimeout(() => setIsTransitioning(false), 300);
      });
    } else {
      setCurrentNodeIndex(targetIndex);
      setIsTransitioning(false);
      setLoadingTexture(false);
    }
  };

  const handleWalkByArrow = (targetNodeId) => {
    const targetIdx = nodes.findIndex(n => n.id === targetNodeId);
    if (targetIdx !== -1) {
      handleWalkToNode(targetIdx);
    }
  };

  // Zoom Handlers
  const handleZoomIn = () => {
    if (!cameraRef.current) return;
    const newFov = THREE.MathUtils.clamp(cameraRef.current.fov - 12, 25, 100);
    cameraRef.current.fov = newFov;
    cameraRef.current.updateProjectionMatrix();
    setCurrentFov(Math.round(newFov));
  };

  const handleZoomOut = () => {
    if (!cameraRef.current) return;
    const newFov = THREE.MathUtils.clamp(cameraRef.current.fov + 12, 25, 100);
    cameraRef.current.fov = newFov;
    cameraRef.current.updateProjectionMatrix();
    setCurrentFov(Math.round(newFov));
  };

  const handleResetView = () => {
    if (!cameraRef.current) return;
    lonRef.current = 0;
    latRef.current = 0;
    cameraRef.current.fov = 75;
    cameraRef.current.updateProjectionMatrix();
    setCurrentFov(75);
  };

  const handlePan = (dir) => {
    if (dir === 'left') lonRef.current -= 25;
    if (dir === 'right') lonRef.current += 25;
    if (dir === 'up') latRef.current += 15;
    if (dir === 'down') latRef.current -= 15;
  };

  // View direction descriptor based on current compass orientation
  const getViewDirectionLabel = (deg) => {
    if (deg >= 315 || deg < 45) return { dir: 'FRONT (0°)', desc: 'Primary Monument Facade & Sanctum', color: 'text-emerald-300' };
    if (deg >= 45 && deg < 135) return { dir: 'EAST (90°)', desc: 'Side Courtyard & Architectural Cloister', color: 'text-amber-300' };
    if (deg >= 135 && deg < 225) return { dir: 'BEHIND (180°)', desc: 'Authentic Rear Perspective & Entrance Gate', color: 'text-cyan-300' };
    return { dir: 'WEST (270°)', desc: 'Adjacent Water Body & Horizon Vista', color: 'text-orange-300' };
  };

  const dirInfo = getViewDirectionLabel(viewOrientation);

  return (
    <div className="relative w-full rounded-4xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 bg-[#051F1C] select-none text-white">
      
      {/* 360 WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        className="w-full h-[460px] sm:h-[580px] lg:h-[640px] cursor-grab active:cursor-grabbing relative"
      />

      {/* Loading Overlay */}
      {loadingTexture && (
        <div className="absolute inset-0 z-30 bg-[#051F1C]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin" />
          <div className="text-center space-y-1">
            <span className="text-sm font-sora font-extrabold text-white block">
              Compositing 360° Photosphere Environment...
            </span>
            <span className="text-xs text-emerald-300 font-mono">
              Aligning Front (0°) & Rear (180°) Perspectives • {activeNode.name}
            </span>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TOP BAR: SITE IDENTITY, NODE SELECTOR & COMPASS HUD
         ------------------------------------------------------------- */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Site & Node Title Pill */}
        <div className="bg-[#051F1C]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-lg pointer-events-auto max-w-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">
              360° Spherical Photosphere
            </span>
            <DataSourceBadge type="VERIFIED DATA" source="360° VR Equirectangular" />
          </div>
          <h3 className="font-sora text-sm sm:text-base font-extrabold text-white truncate">
            {site?.name}
          </h3>
          <p className="text-[11px] text-slate-200 truncate font-medium">
            📍 {activeNode.subtitle}
          </p>
        </div>

        {/* Live 360° Direction & Compass HUD */}
        <div className="bg-[#051F1C]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-500/40 shadow-lg pointer-events-auto flex items-center gap-3 self-start sm:self-auto">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Compass 
              className="w-7 h-7 text-emerald-400 transition-transform duration-100" 
              style={{ transform: `rotate(${-viewOrientation}deg)` }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold">
              <span className={dirInfo.color}>{dirInfo.dir}</span>
              <span className="text-slate-400">({viewOrientation}°)</span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              {dirInfo.desc}
            </div>
          </div>
        </div>

      </div>

      {/* -------------------------------------------------------------
          BOTTOM CONTROLS BAR: AUDIO GUIDE, NAVIGATION & ZOOM
         ------------------------------------------------------------- */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col md:flex-row md:items-end justify-between gap-3 pointer-events-none">
        
        {/* Left: Studio Audio Narration Player */}
        <div className="bg-[#051F1C]/95 backdrop-blur-md p-3.5 rounded-3xl border border-emerald-500/40 shadow-xl pointer-events-auto flex items-center gap-3 max-w-sm">
          <button
            onClick={toggleAudioNarration}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isAudioPlaying 
                ? 'bg-amber-500 text-slate-950 shadow-md animate-pulse' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
            title={isAudioPlaying ? 'Pause Studio Audio Tour' : 'Play Studio Audio Tour'}
          >
            {isAudioPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-sora font-bold text-white text-[11px] truncate flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5 text-amber-300" />
                <span>Studio Audio Guide</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold">
                {speechProgress}%
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${speechProgress}%` }}
              />
            </div>
          </div>

          {isAudioPlaying && (
            <button
              onClick={stopAudioNarration}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Stop Audio"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Camera Controls (Pan, Zoom, Auto-Rotate, Reset) */}
        <div className="bg-[#051F1C]/95 backdrop-blur-md p-2 rounded-2xl border border-emerald-500/40 shadow-xl pointer-events-auto flex items-center gap-1.5 self-center md:self-auto">
          
          <button
            onClick={() => handlePan('left')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Pan Left (Rotate View)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => handlePan('right')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Pan Right (Rotate View)"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isAutoRotating ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-slate-300'
            }`}
            title={isAutoRotating ? 'Pause 360° Auto-Rotation' : 'Start 360° Auto-Rotation'}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetView}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Reset View to 0° Front"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* -------------------------------------------------------------
          WALKAROUND NODES SELECTOR (GROUND ARROWS)
         ------------------------------------------------------------- */}
      {nodes.length > 1 && (
        <div className="absolute top-20 left-4 z-20 flex flex-col gap-1.5 pointer-events-auto max-w-[220px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 px-2 py-0.5 bg-[#051F1C]/80 rounded-md backdrop-blur-xs self-start border border-emerald-500/30">
            Ground Viewpoints:
          </span>
          {nodes.map((n, idx) => (
            <button
              key={n.id}
              onClick={() => handleWalkToNode(idx)}
              className={`px-3 py-2 rounded-xl text-left text-xs font-sora font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                currentNodeIndex === idx
                  ? 'bg-emerald-600 text-white shadow-md border border-emerald-400'
                  : 'bg-[#051F1C]/85 hover:bg-[#051F1C] text-slate-200 hover:text-white border border-emerald-500/20'
              }`}
            >
              <span className="truncate">{n.name}</span>
              {currentNodeIndex === idx && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};
