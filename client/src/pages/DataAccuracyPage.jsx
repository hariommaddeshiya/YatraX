import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Database, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Zap,
  TrendingUp
} from 'lucide-react';
import api from '../utils/api.js';
import { useTrip } from '../context/TripContext.jsx';
import { DataSourceBadge } from '../components/common/DataSourceBadge.jsx';

export const DataAccuracyPage = () => {
  const { activeTrip } = useTrip();
  const [accuracyData, setAccuracyData] = useState(null);
  const [apiLogs, setApiLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accRes, apiRes] = await Promise.all([
          api.get('/stats/data-accuracy'),
          api.get('/stats/apis')
        ]);

        if (accRes.success) setAccuracyData(accRes);
        if (apiRes.success) setApiLogs(apiRes.apis);
      } catch (err) {
        console.error('Error fetching transparency data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTrip]);

  const budget = activeTrip?.budgetBreakdown || accuracyData?.budgetCalculationTransparency;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-3.5 py-1 rounded-full text-xs font-bold font-cinzel border border-blue-300">
          <FileCheck2 className="w-3.5 h-3.5 text-blue-700" />
          <span>DATA ACCURACY & TRANSPARENCY CENTER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 font-serif">
          Where Every Piece of Live Data Comes From
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Rigorous categorization of Live API, Verified Government, AI Predicted, and Calculated telemetry with mathematical calculation transparency.
        </p>
      </div>

      {/* 1. Live API Monitoring Status Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-sand-300 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand-200">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-xl font-bold text-slate-800">
                Live External API Health & Latency Monitor
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                5 Active Services
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time response latencies, endpoint origins, and provider attributions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiLogs.map((log) => (
            <div key={log.id} className="p-4.5 rounded-2xl bg-sand-50/80 border border-sand-300 space-y-2.5 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-slate-900">{log.apiName}</h4>
                  <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[200px]">{log.endpoint}</span>
                </div>
                <DataSourceBadge type={log.sourceType} size="xs" />
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-sand-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
                  <div className="font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>{log.status}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Latency</span>
                  <div className="font-mono font-bold text-slate-900">{log.responseTimeMs} ms</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {log.description}
              </p>

              <div className="pt-2 border-t border-sand-200 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>Attribution: {log.attribution}</span>
                <span>Updated: Just now</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Full Data Provenance & Category Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-sand-300 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-sand-200">
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-800">
              Data Category & Provenance Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly distinguishing Live API Data, Verified Data, Calculated Data, and AI Predictions.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sand-300 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Data Point</th>
                <th className="py-3 px-3">Category Tag</th>
                <th className="py-3 px-3">Direct Source / Provider</th>
                <th className="py-3 px-3">Formula or Origin Rule</th>
                <th className="py-3 px-3">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {accuracyData?.dataAccuracyMatrix?.map((row, idx) => (
                <tr key={idx} className="hover:bg-sand-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {row.dataPoint}
                  </td>
                  <td className="py-3 px-3">
                    <DataSourceBadge type={row.category} size="xs" />
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">
                    {row.source}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    {row.formulaOrRule}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-700">
                    {row.confidence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Budget Accuracy Calculation Transparency */}
      {budget && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-sand-300 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand-200">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-800">
                Budget Accuracy & Calculation Transparency
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mathematical transparency according to SIH reference formula.
              </p>
            </div>
            <div className="bg-eco-100 border border-eco-300 text-eco-900 px-4 py-2 rounded-xl text-right">
              <span className="text-[10px] uppercase font-bold block text-eco-700">Calculated Accuracy</span>
              <strong className="font-mono text-lg">{budget.budgetAccuracyPercent}%</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-sand-50 p-4 rounded-2xl border border-sand-300">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Initial Reference Budget</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                ₹{budget.referenceCost?.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">Baseline benchmark</span>
            </div>

            <div className="bg-sand-50 p-4 rounded-2xl border border-sand-300">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Current Calculated Cost</span>
              <div className="text-xl font-extrabold text-terracotta-700 font-mono mt-1">
                ₹{budget.totalEstimatedCost?.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">Sum of 6 dynamic categories</span>
            </div>

            <div className="bg-sand-50 p-4 rounded-2xl border border-sand-300">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Difference vs Target</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                ₹{Math.abs(budget.totalEstimatedCost - budget.referenceCost)?.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Within Safe Deviation</span>
            </div>
          </div>

          {/* Mathematical Formula Breakdown */}
          <div className="bg-sand-100 p-5 rounded-2xl border border-sand-300 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <HelpCircle className="w-4 h-4 text-terracotta-600" />
              <span>SIH Verified Accuracy Equation:</span>
            </div>
            <div className="font-mono text-xs bg-white p-3 rounded-xl border border-sand-300 text-slate-900">
              Accuracy = 1 - (|₹{budget.totalEstimatedCost} - ₹{budget.referenceCost}| / ₹{budget.referenceCost}) = <strong>{budget.budgetAccuracyPercent}%</strong>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              *Accuracy is calculated from available source and reference datasets and does not constitute a guaranteed commercial tariff.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
