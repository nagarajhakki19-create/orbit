import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { TelemetryHistoryPoint } from '../../types/simulation';
import { Activity, Zap, TrendingUp } from 'lucide-react';

interface ResourceTrendsChartProps {
  data: TelemetryHistoryPoint[];
}

export const ResourceTrendsChart: React.FC<ResourceTrendsChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'consumables' | 'power'>('consumables');

  // If there's minimal data, generate a smooth starting curve so the chart is visually informative
  const chartData = data.length > 2 ? data : [
    { timeLabel: 'Sol 1 00:00', oxygenPct: 100, waterPct: 100, foodPct: 100, batteryPct: 85, powerGenKw: 100, powerLoadKw: 35 },
    { timeLabel: 'Sol 1 06:00', oxygenPct: 99, waterPct: 98, foodPct: 99, batteryPct: 70, powerGenKw: 40, powerLoadKw: 35 },
    { timeLabel: 'Sol 1 12:00', oxygenPct: 98, waterPct: 97, foodPct: 98, batteryPct: 95, powerGenKw: 120, powerLoadKw: 45 },
    { timeLabel: 'Sol 1 18:00', oxygenPct: 97, waterPct: 96, foodPct: 97, batteryPct: 90, powerGenKw: 50, powerLoadKw: 40 },
    ...data
  ];

  return (
    <div className="hud-panel p-5 rounded-2xl border border-space-border/80 shadow-2xl space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-space-border/60 gap-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-space-cyan" />
          <h2 className="font-display font-bold text-sm text-space-light tracking-wider">
            HISTORICAL MISSION TELEMETRY
          </h2>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-lg bg-space-dark border border-space-border">
          <button
            onClick={() => setActiveTab('consumables')}
            className={`px-3 py-1 rounded text-xs font-mono transition-all ${
              activeTab === 'consumables'
                ? 'bg-space-cyan/20 text-space-cyan border border-space-cyan/40 font-bold'
                : 'text-space-muted hover:text-space-light'
            }`}
          >
            Consumable Curves (%)
          </button>
          <button
            onClick={() => setActiveTab('power')}
            className={`px-3 py-1 rounded text-xs font-mono transition-all ${
              activeTab === 'power'
                ? 'bg-space-amber/20 text-space-amber border border-space-amber/40 font-bold'
                : 'text-space-muted hover:text-space-light'
            }`}
          >
            Power Balance (kW)
          </button>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'consumables' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="o2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42D9FF" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#42D9FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFB547" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FFB547" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3250" opacity={0.6} />
              <XAxis dataKey="timeLabel" stroke="#8E9EB5" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#8E9EB5" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#101A2B', 
                  borderColor: '#1E3250', 
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '11px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Area type="monotone" dataKey="oxygenPct" name="Oxygen %" stroke="#42D9FF" fillOpacity={1} fill="url(#o2Grad)" strokeWidth={2} />
              <Area type="monotone" dataKey="waterPct" name="Water %" stroke="#60A5FA" fillOpacity={1} fill="url(#waterGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="batteryPct" name="Battery %" stroke="#FFB547" fillOpacity={1} fill="url(#batteryGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="foodPct" name="Food %" stroke="#36E0C0" strokeWidth={1.5} dot={false} />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3250" opacity={0.6} />
              <XAxis dataKey="timeLabel" stroke="#8E9EB5" fontSize={10} tickLine={false} />
              <YAxis stroke="#8E9EB5" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#101A2B', 
                  borderColor: '#1E3250', 
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '11px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              <Line type="monotone" dataKey="powerGenKw" name="Solar Gen (kW)" stroke="#FFB547" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="powerLoadKw" name="Outpost Load (kW)" stroke="#FF6B70" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
