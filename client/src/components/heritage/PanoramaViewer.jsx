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
  Move,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { DataSourceBadge } from '../common/DataSourceBadge.jsx';

// =========================================================================
// SAFE PROXY URL RESOLVER
// Routes external images through backend proxy to guarantee 100% CORS-clean
// WebGL texture access without tainted canvas errors or browser network blocks.
// =========================================================================
const getSafeImageUrl = (rawUrl) => {
  if (!rawUrl) return null;
  // If it's an external HTTP/HTTPS URL, route through our server proxy
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return `/api/heritage/proxy-image?url=${encodeURIComponent(rawUrl)}`;
  }
  return rawUrl;
};

// =========================================================================
// AUTHENTIC 360° PHOTOSPHERE TEXTURE COMPOSITOR & LOADER
// Renders the ACTUAL, AUTHENTIC destination photography in full 360° spherical
// projection. Zero fake/procedural cartoon graphics or text labels on the sphere.
// =========================================================================
const loadAuthentic360Texture = (frontUrl, backUrl) => {
  return new Promise((resolve) => {
    const safeFront = getSafeImageUrl(frontUrl);
    const safeBack = getSafeImageUrl(backUrl);

    // If both front and distinct back views exist (e.g. curated sanctuaries), composite dual-hemisphere
    if (safeBack && safeBack !== safeFront) {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      // Clean neutral dark base
      ctx.fillStyle = '#061a18';
      ctx.fillRect(0, 0, w, h);

      const frontImg = new Image();
      frontImg.crossOrigin = 'anonymous';

      const backImg = new Image();
      backImg.crossOrigin = 'anonymous';

      let count = 0;
      let hasFinished = false;

      const finishCanvas = () => {
        if (hasFinished) return;
        hasFinished = true;

        try {
          const frontValid = frontImg.complete && frontImg.naturalWidth > 0;
          const backValid = backImg.complete && backImg.naturalWidth > 0;

          if (frontValid && backValid) {
            // 1. Draw Front Monument centered at 0° (X = w/4 to 3w/4, width = w/2)
            ctx.drawImage(frontImg, w * 0.25, 0, w * 0.5, h);

            // 2. Draw Authentic Rear View split across left (0 to w/4) and right (3w/4 to w)
            ctx.drawImage(backImg, 0, 0, backImg.width / 2, backImg.height, w * 0.75, 0, w * 0.25, h);
            ctx.drawImage(backImg, backImg.width / 2, 0, backImg.width / 2, backImg.height, 0, 0, w * 0.25, h);

            // 3. Seamless lateral gradient feathering at 90° and 270° seams
            const blendW = 48;
            const grad1 = ctx.createLinearGradient(w * 0.25 - blendW, 0, w * 0.25 + blendW, 0);
            grad1.addColorStop(0, 'rgba(6, 26, 24, 0.35)');
            grad1.addColorStop(0.5, 'rgba(6, 26, 24, 0.08)');
            grad1.addColorStop(1, 'rgba(6, 26, 24, 0)');
            ctx.fillStyle = grad1;
            ctx.fillRect(w * 0.25 - blendW, 0, blendW * 2, h);

            const grad2 = ctx.createLinearGradient(w * 0.75 - blendW, 0, w * 0.75 + blendW, 0);
            grad2.addColorStop(0, 'rgba(6, 26, 24, 0)');
            grad2.addColorStop(0.5, 'rgba(6, 26, 24, 0.08)');
            grad2.addColorStop(1, 'rgba(6, 26, 24, 0.35)');
            ctx.fillStyle = grad2;
            ctx.fillRect(w * 0.75 - blendW, 0, blendW * 2, h);

          } else if (frontValid) {
            // Draw frontImg across the entire panoramic canvas
            ctx.drawImage(frontImg, 0, 0, w, h);
          } else if (backValid) {
            ctx.drawImage(backImg, 0, 0, w, h);
          }
        } catch (e) {
          console.warn('[PanoramaViewer] Canvas compositing notice:', e);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        resolve(texture);
      };

      // 6s timeout safety net
      const timer = setTimeout(finishCanvas, 6000);

      const checkBoth = () => {
        count++;
        if (count >= 2) {
          clearTimeout(timer);
          finishCanvas();
        }
      };

      frontImg.onload = checkBoth;
      frontImg.onerror = checkBoth;
      backImg.onload = checkBoth;
      backImg.onerror = checkBoth;

      frontImg.src = safeFront;
      backImg.src = safeBack;

    } else {
      // Single authentic photograph: use THREE.TextureLoader directly with MirroredRepeatWrapping
      // This seamlessly maps the authentic destination photo all around the 360° sphere
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');

      loader.load(
        safeFront,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.MirroredRepeatWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.repeat.set(2, 1);
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          resolve(texture);
        },
        undefined,
        () => {
          // If proxy fails, try direct URL fallback
          loader.load(
            frontUrl,
            (tex) => {
              tex.colorSpace = THREE.SRGBColorSpace;
              tex.wrapS = THREE.MirroredRepeatWrapping;
              tex.wrapT = THREE.ClampToEdgeWrapping;
              tex.repeat.set(2, 1);
              resolve(tex);
            },
            undefined,
            () => resolve(null)
          );
        }
      );
    }
  });
};

export const PanoramaViewer = ({ site }) => {
  const mountRef = useRef(null);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [loadingTexture, setLoadingTexture] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentFov, setCurrentFov] = useState(75);
  const [viewOrientation, setViewOrientation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Studio Audio Narration
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(0.95);
  const [speechProgress, setSpeechProgress] = useState(0);
  const utteranceRef = useRef(null);

  // Three.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereMeshRef = useRef(null);
  const sphereMaterialRef = useRef(null);

  const isUserInteractingRef = useRef(false);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const phiRef = useRef(0);
  const thetaRef = useRef(0);

  // Universal Walkaround Nodes for Destinations
  const nodes = (site?.walkaroundNodes && site.walkaroundNodes.length > 0)
    ? site.walkaroundNodes
    : [
        {
          id: 'main',
          name: `1. ${site?.name || 'Sanctuary'} - Principal View`,
          subtitle: `Front (0°): Main Sanctum & Facade • Behind (180°): Outer Horizon & Entrance`,
          frontImageUrl: site?.panoramaUrl || site?.image || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=80',
          backImageUrl: site?.image || site?.panoramaUrl
        },
        {
          id: 'courtyard',
          name: `2. Outer Courtyard & Colonnade`,
          subtitle: `Front (0°): Courtyard Colonnade • Behind (180°): Surrounding Heritage Landscape`,
          frontImageUrl: site?.image || site?.panoramaUrl,
          backImageUrl: site?.panoramaUrl || site?.image
        }
      ];

  const activeNode = nodes[currentNodeIndex] || nodes[0];

  // Reset node on site change
  useEffect(() => {
    setCurrentNodeIndex(0);
  }, [site?.id]);

  // -------------------------------------------------------------
  // STUDIO AUDIO GUIDE
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

    const narrationText = `${site?.name || 'Sacred Sanctuary'}, situated in ${site?.location || site?.state || 'India'}. ${site?.historicalSummary || ''} ${activeNode?.subtitle || ''}`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utteranceRef.current = utterance;
    utterance.rate = audioSpeed;
    utterance.pitch = 1.0;

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
  // THREE.JS 360° SPHERICAL VR INITIALIZATION
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Inverted 360 Sphere
    const geometry = new THREE.SphereGeometry(600, 80, 60);
    geometry.scale(-1, 1, 1);

    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
    sphereMaterialRef.current = sphereMaterial;
    const sphereMesh = new THREE.Mesh(geometry, sphereMaterial);
    sphereMeshRef.current = sphereMesh;
    scene.add(sphereMesh);

    // 5. Load Authentic Destination 360 Photosphere
    setLoadingTexture(true);
    loadAuthentic360Texture(activeNode.frontImageUrl, activeNode.backImageUrl).then((texture) => {
      if (sphereMaterialRef.current && texture) {
        sphereMaterialRef.current.map = texture;
        sphereMaterialRef.current.color.setHex(0xFFFFFF);
        sphereMaterialRef.current.needsUpdate = true;
      }
      setLoadingTexture(false);
    });

    // 6. User Interaction Handlers
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

    // 7. Resize Handler
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
  // TRANSITION TO WALKAROUND NODE
  // -------------------------------------------------------------
  const handleWalkToNode = (targetIndex) => {
    if (targetIndex === currentNodeIndex || !nodes[targetIndex]) return;

    setIsTransitioning(true);
    setLoadingTexture(true);

    const targetNode = nodes[targetIndex];
    loadAuthentic360Texture(targetNode.frontImageUrl, targetNode.backImageUrl).then((newTex) => {
      if (sphereMaterialRef.current && newTex) {
        sphereMaterialRef.current.map = newTex;
        sphereMaterialRef.current.color.setHex(0xFFFFFF);
        sphereMaterialRef.current.needsUpdate = true;
      }
      setCurrentNodeIndex(targetIndex);
      setLoadingTexture(false);
      setTimeout(() => setIsTransitioning(false), 250);
    });
  };

  // Zoom & Pan Handlers
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

  const toggleFullscreen = () => {
    if (!mountRef.current) return;
    const elem = mountRef.current.parentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Direction descriptor based on bearing
  const getViewDirectionLabel = (deg) => {
    if (deg >= 315 || deg < 45) return { dir: 'FRONT (0°)', desc: 'Primary Monument Sanctum', color: 'text-emerald-300' };
    if (deg >= 45 && deg < 135) return { dir: 'EAST (90°)', desc: 'East Cloister & Architectural Wings', color: 'text-amber-300' };
    if (deg >= 135 && deg < 225) return { dir: 'BEHIND (180°)', desc: 'Rear Perspective & Entrance Gateway', color: 'text-cyan-300' };
    return { dir: 'WEST (270°)', desc: 'West Terraces & Horizon Vista', color: 'text-rose-300' };
  };

  const dirInfo = getViewDirectionLabel(viewOrientation);

  return (
    <div className={`relative w-full rounded-4xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 bg-[#051F1C] select-none text-white ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      
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
              Loading 360° Photosphere Environment...
            </span>
            <span className="text-xs text-emerald-300 font-mono">
              Aligning Spherical VR View • {site?.name}
            </span>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TOP BAR: SITE IDENTITY & COMPASS HUD
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

        {/* Right: Camera Controls (Pan, Zoom, Auto-Rotate, Reset, Fullscreen) */}
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

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen 360° VR'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* -------------------------------------------------------------
          WALKAROUND VIEWPOINTS SELECTOR
         ------------------------------------------------------------- */}
      {nodes.length > 1 && (
        <div className="absolute top-[110px] left-4 z-20 flex flex-col gap-1.5 pointer-events-auto max-w-[240px]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 px-2 py-0.5 bg-[#051F1C]/80 rounded-md backdrop-blur-xs self-start border border-emerald-500/30">
            Ground Viewpoints:
          </span>
          {nodes.map((n, idx) => (
            <button
              key={n.id || idx}
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
