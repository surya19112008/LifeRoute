import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';
import {
  Truck,
  Plane,
  MapPin,
  Radio,
  Thermometer,
  Compass,
  Battery,
  ShieldCheck,
  Maximize2,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Navigation,
  Info,
  Building2,
  Sparkles,
  Zap,
  Globe,
} from 'lucide-react';

export interface VehiclePlaceholder {
  id: string;
  code: string;
  type: 'ground_convoy' | 'air_heli' | 'cold_courier';
  organ: string;
  organCategory: string;
  origin: string;
  destination: string;
  speed: string;
  temp: string;
  battery: string;
  eta: string;
  progressPercent: number; // 0 to 100 along path
  latLng: { lat: number; lng: number };
  startLatLng: { lat: number; lng: number };
  endLatLng: { lat: number; lng: number };
  color: string;
  escort: string;
  urgency: string;
}

const initialVehicles: VehiclePlaceholder[] = [
  {
    id: 'veh_1',
    code: 'CONVOY-9042',
    type: 'ground_convoy',
    organ: 'Kidney Graft (Right)',
    organCategory: 'Major Organ',
    origin: 'King George Hospital (KGH), Maharanipeta',
    destination: 'Apollo Hospitals, Health City, Arilova',
    speed: '68 km/h',
    temp: '4.2°C',
    battery: '88%',
    eta: '14 min',
    progressPercent: 54,
    color: '#0d9488', // Teal
    escort: 'Vizag City Traffic Police Green Corridor',
    urgency: 'Critical Tier 1',
    startLatLng: { lat: 17.7065, lng: 83.3032 },
    endLatLng: { lat: 17.7685, lng: 83.3280 },
    latLng: { lat: 17.7375, lng: 83.3156 },
  },
  {
    id: 'veh_2',
    code: 'MEDVAC-9043',
    type: 'air_heli',
    organ: 'Heart (Cardiopulmonary)',
    organCategory: 'Major Organ',
    origin: 'SevenHills Hospital, Waltair',
    destination: 'INS Dega / Vizag Airport Helipad (VTZ)',
    speed: '185 km/h',
    temp: '4.0°C',
    battery: '94%',
    eta: '12 min',
    progressPercent: 38,
    color: '#e11d48', // Rose
    escort: 'Navy & Airport ATC Priority Vector',
    urgency: 'Stat Priority',
    startLatLng: { lat: 17.7196, lng: 83.3102 },
    endLatLng: { lat: 17.7215, lng: 83.2245 },
    latLng: { lat: 17.7205, lng: 83.2673 },
  },
  {
    id: 'veh_3',
    code: 'COURIER-9044',
    type: 'cold_courier',
    organ: 'Corneal Tissue (Pair)',
    organCategory: 'Tissue',
    origin: 'LVPEI & Mohsin Eye Bank, Hanumanthawaka',
    destination: 'Care Hospital, Ram Nagar, Vizag',
    speed: '42 km/h',
    temp: '5.0°C',
    battery: '98%',
    eta: '22 min',
    progressPercent: 62,
    color: '#2563eb', // Blue
    escort: 'AP Jeevandan Cold-Chain Courier',
    urgency: 'Scheduled Tissue',
    startLatLng: { lat: 17.7650, lng: 83.3360 },
    endLatLng: { lat: 17.7170, lng: 83.3070 },
    latLng: { lat: 17.7410, lng: 83.3215 },
  },
];

const hospitalLocations = [
  {
    id: 'hosp_kgh',
    name: 'King George Hospital (KGH) & AMC',
    role: 'Donor Harvest Govt Teaching Hospital',
    position: { lat: 17.7065, lng: 83.3032 },
    badge: 'KGH Vizag',
    color: '#0d9488',
  },
  {
    id: 'hosp_apollo',
    name: 'Apollo Hospitals, Health City',
    role: 'Recipient Transplant OR-1',
    position: { lat: 17.7685, lng: 83.3280 },
    badge: 'Apollo Arilova',
    color: '#0d9488',
  },
  {
    id: 'hosp_sevenhills',
    name: 'SevenHills Hospital',
    role: 'Cardiac Donor Emergency Unit',
    position: { lat: 17.7196, lng: 83.3102 },
    badge: 'SevenHills Vizag',
    color: '#e11d48',
  },
  {
    id: 'hosp_lvpei',
    name: 'LV Prasad Eye Institute (GMRV)',
    role: 'Regional Cornea & Tissue Bank',
    position: { lat: 17.7650, lng: 83.3360 },
    badge: 'LVPEI Hanumanthawaka',
    color: '#2563eb',
  },
];

interface TransitMapComponentProps {
  onVehicleSelect?: (vehicle: VehiclePlaceholder) => void;
  onOpenLivePodTracker?: () => void;
}

export const TransitMapComponent: React.FC<TransitMapComponentProps> = ({
  onVehicleSelect,
  onOpenLivePodTracker,
}) => {
  const [vehicles, setVehicles] = useState<VehiclePlaceholder[]>(initialVehicles);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh_1');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [mapMode, setMapMode] = useState<'google_maps' | 'tactical_radar'>('google_maps');
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [showTrafficLights, setShowTrafficLights] = useState<boolean>(true);

  // Retrieve Google Maps API Key from runtime environment
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

  // Calculate coordinates along linear vector based on percentage
  const interpolateCoord = (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number },
    percent: number
  ) => {
    const ratio = Math.max(0, Math.min(100, percent)) / 100;
    return {
      lat: start.lat + (end.lat - start.lat) * ratio,
      lng: start.lng + (end.lng - start.lng) * ratio,
    };
  };

  // Real-time animation simulation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((veh) => {
          let next = veh.progressPercent + (veh.type === 'air_heli' ? 0.8 : 0.5);
          if (next > 98) next = 4;
          const nextLatLng = interpolateCoord(veh.startLatLng, veh.endLatLng, next);
          return {
            ...veh,
            progressPercent: next,
            latLng: nextLatLng,
          };
        })
      );
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const handleSelectVehicle = (veh: VehiclePlaceholder) => {
    setSelectedVehicleId(veh.id);
    if (onVehicleSelect) onVehicleSelect(veh);
  };

  const handleResetPositions = () => {
    setVehicles(initialVehicles);
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden text-white space-y-0">
      {/* Map Header Toolbar */}
      <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-bold text-white leading-tight flex items-center gap-1.5">
              <span>Google Maps Live Transit Radar</span>
              <span className="text-[10px] text-teal-400 font-mono">GMP-SDK</span>
            </span>
            <span className="text-[10px] text-slate-400">
              3 real-time organ delivery units in transit
            </span>
          </div>
        </div>

        {/* View Mode & Map Controls */}
        <div className="flex items-center gap-1">
          {/* Toggle between Google Maps SDK & Tactical Radar */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-[11px]">
            <button
              onClick={() => setMapMode('google_maps')}
              className={`px-2 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                mapMode === 'google_maps'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Map API</span>
            </button>
            <button
              onClick={() => setMapMode('tactical_radar')}
              className={`px-2 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                mapMode === 'tactical_radar'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>Radar</span>
            </button>
          </div>

          {/* Satellite / Roadmap Toggle (when in Google Maps mode) */}
          {mapMode === 'google_maps' && (
            <button
              onClick={() =>
                setMapTypeId(mapTypeId === 'roadmap' ? 'hybrid' : 'roadmap')
              }
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold transition-colors"
              title="Toggle Satellite view"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title={isPlaying ? 'Pause movement' : 'Play movement'}
            aria-label={isPlaying ? 'Pause movement' : 'Play movement'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleResetPositions}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
            title="Reset positions"
            aria-label="Reset positions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Viewport Area */}
      <div className="relative w-full h-72 sm:h-80 bg-[#0f172a] select-none overflow-hidden">
        {mapMode === 'google_maps' ? (
          /* GOOGLE MAPS PLATFORM API INTEGRATION */
          <APIProvider apiKey={apiKey}>
            <Map
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              defaultCenter={{ lat: 17.7375, lng: 83.3100 }}
              defaultZoom={12.4}
              gestureHandling="greedy"
              disableDefaultUI={false}
              mapTypeId={mapTypeId}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Hospital Trauma & Recipient Center Markers */}
              {hospitalLocations.map((hosp) => (
                <AdvancedMarker
                  key={hosp.id}
                  position={hosp.position}
                  title={`${hosp.name} (${hosp.role})`}
                >
                  <div className="flex flex-col items-center group cursor-pointer">
                    <div
                      className="px-2 py-0.5 rounded-md text-[9px] font-bold text-white shadow-md border border-white/20 flex items-center gap-1"
                      style={{ backgroundColor: hosp.color }}
                    >
                      <Building2 className="w-3 h-3" />
                      <span>{hosp.badge}</span>
                    </div>
                    <div
                      className="w-2.5 h-2.5 rotate-45 -mt-1 shadow-xs"
                      style={{ backgroundColor: hosp.color }}
                    />
                  </div>
                </AdvancedMarker>
              ))}

              {/* Real-time Organ Delivery Vehicle Advanced Markers */}
              {vehicles.map((veh) => {
                const isSelected = veh.id === selectedVehicleId;
                return (
                  <AdvancedMarker
                    key={veh.id}
                    position={veh.latLng}
                    title={`${veh.code} - ${veh.organ}`}
                    onClick={() => handleSelectVehicle(veh)}
                  >
                    <div className="relative flex flex-col items-center cursor-pointer transition-transform group">
                      {/* Live Pulsing Beacon Ring */}
                      <span
                        className="absolute -top-1 w-9 h-9 rounded-full animate-ping opacity-75"
                        style={{ backgroundColor: veh.color }}
                      />

                      {/* Floating Vehicle Badge */}
                      <div
                        className={`relative z-10 px-2 py-1 rounded-xl text-white font-bold text-[10px] shadow-lg flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'ring-2 ring-white scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: veh.color }}
                      >
                        {veh.type === 'ground_convoy' && <Truck className="w-3.5 h-3.5" />}
                        {veh.type === 'air_heli' && <Plane className="w-3.5 h-3.5" />}
                        {veh.type === 'cold_courier' && <Navigation className="w-3.5 h-3.5" />}
                        <span className="font-mono">{veh.code.split('-')[1]}</span>
                      </div>

                      {/* Micro Pointer */}
                      <div
                        className="w-2 h-2 rotate-45 -mt-1 shadow-xs"
                        style={{ backgroundColor: veh.color }}
                      />
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>
          </APIProvider>
        ) : (
          /* TACTICAL VECTOR RADAR FALLBACK */
          <svg
            className="w-full h-full"
            viewBox="0 0 380 240"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="tacticalGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1e293b" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#0a0f1d" />
            <rect width="100%" height="100%" fill="url(#tacticalGrid)" />

            {/* Arterials */}
            <path d="M 20 180 L 360 80" fill="none" stroke="#334155" strokeWidth="8" />
            <path d="M 50 160 Q 140 135 230 110 T 330 65" fill="none" stroke="#0d9488" strokeWidth="4" strokeDasharray="6 3" />
            <path d="M 40 60 Q 180 100 320 175" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 4" />

            {vehicles.map((veh, idx) => {
              const x = 50 + (idx * 110) + (veh.progressPercent * 0.9);
              const y = 80 + (idx * 45);
              return (
                <g key={veh.id} transform={`translate(${x % 340}, ${y % 200})`} onClick={() => handleSelectVehicle(veh)} className="cursor-pointer">
                  <circle r="10" fill={veh.color} opacity="0.3" className="animate-ping" />
                  <circle r="7" fill="#0f172a" stroke={veh.color} strokeWidth="2" />
                  <text x="0" y="-10" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">{veh.code.split('-')[1]}</text>
                </g>
              );
            })}
          </svg>
        )}

        {/* Floating Map Legend Overlay */}
        <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl px-2.5 py-1.5 text-[10px] space-y-1 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-slate-300">Vizag Green Corridor (KGH → Apollo)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-slate-300">Air Lifeline to VTZ Airport (Heart)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-300">Jeevandan Tissue Courier (Cornea)</span>
          </div>
        </div>

        {/* Speed / Green Corridor Status Banner */}
        <div className="absolute bottom-2 right-2 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl px-2.5 py-1 text-[10px] text-teal-300 font-mono flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Google Maps SDK Active</span>
        </div>
      </div>

      {/* Selected Vehicle Interactive Inspector Card */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: `${selectedVehicle.color}25`, color: selectedVehicle.color }}
            >
              {selectedVehicle.type === 'ground_convoy' && <Truck className="w-4 h-4" />}
              {selectedVehicle.type === 'air_heli' && <Plane className="w-4 h-4" />}
              {selectedVehicle.type === 'cold_courier' && <Navigation className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">
                  {selectedVehicle.code}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-teal-300">
                  {selectedVehicle.urgency}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {selectedVehicle.organ} · {selectedVehicle.escort}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-extrabold text-white block">
              ETA {selectedVehicle.eta}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Progress: {Math.round(selectedVehicle.progressPercent)}%
            </span>
          </div>
        </div>

        {/* Telemetry Sensor Bar */}
        <div className="grid grid-cols-3 gap-2 text-xs bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Thermometer className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Pod Temp</span>
              <span className="font-mono font-bold text-white">{selectedVehicle.temp}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Speed</span>
              <span className="font-mono font-bold text-white">{selectedVehicle.speed}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Battery className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Battery</span>
              <span className="font-mono font-bold text-white">{selectedVehicle.battery}</span>
            </div>
          </div>
        </div>

        {/* Route Origin & Destination */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-850">
          <div className="flex items-center gap-1 truncate max-w-[45%]">
            <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="truncate">{selectedVehicle.origin}</span>
          </div>
          <span className="text-slate-600 font-mono">→</span>
          <div className="flex items-center gap-1 truncate max-w-[45%] justify-end text-slate-200 font-medium">
            <span className="truncate">{selectedVehicle.destination}</span>
            <Building2 className="w-3 h-3 text-teal-400 shrink-0" />
          </div>
        </div>

        {/* Quick trigger to open pod telemetry drawer */}
        {onOpenLivePodTracker && (
          <button
            onClick={onOpenLivePodTracker}
            className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Open Perfusion Pod Diagnostics ({selectedVehicle.code})</span>
          </button>
        )}
      </div>
    </div>
  );
};
