/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  FileCode, 
  Terminal, 
  ChevronRight, 
  Github, 
  ExternalLink,
  Cpu,
  Zap,
  Lock,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import Markdown from 'react-markdown';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from './lib/utils';
import { BENCHMARK_DATA, VULNERABILITIES, PROTOCOL_SPECS } from './data';

type View = 'dashboard' | 'benchmarks' | 'security' | 'proposals' | 'simulator';

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [selectedSpec, setSelectedSpec] = useState(PROTOCOL_SPECS[0]);
  const [simulatorPrompt, setSimulatorPrompt] = useState('Verify this transaction represents a fair exchange of 0.5 ETH for 1000 USDC.');

  const navigation = [
    { id: 'dashboard', name: 'Overview', icon: Activity },
    { id: 'benchmarks', name: 'Performance', icon: Zap },
    { id: 'security', name: 'Security Audit', icon: ShieldAlert },
    { id: 'proposals', name: 'Enhanced Protocol', icon: FileCode },
    { id: 'simulator', name: 'Intelligent Simulator', icon: Terminal },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/50 bg-[#0E0E11] flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-none">
              GenLayer <br/>
              <span className="text-slate-500 font-medium text-xs">Architect Unit</span>
            </h1>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  activeView === item.id 
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]" 
                    : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", activeView === item.id ? "text-indigo-400" : "text-slate-500")} />
                <span className="font-medium text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/50">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Network Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-sm font-medium text-slate-300">Testnet V2 Stable</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A0B]">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && <DashboardView key="dashboard" />}
          {activeView === 'benchmarks' && <BenchmarksView key="benchmarks" />}
          {activeView === 'security' && <SecurityView key="security" />}
          {activeView === 'proposals' && (
            <ProposalsView 
              key="proposals" 
              selectedSpec={selectedSpec} 
              setSelectedSpec={setSelectedSpec} 
            />
          )}
          {activeView === 'simulator' && (
            <SimulatorView 
              key="simulator" 
              prompt={simulatorPrompt} 
              setPrompt={setSimulatorPrompt} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ViewHeader({ title, description }: { title: string, description: string }) {
  return (
    <header className="p-8 border-b border-slate-800/50 bg-[#0E0E11]/50 backdrop-blur-md sticky top-0 z-10">
      <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
      <p className="text-slate-400 mt-2 text-lg max-w-2xl">{description}</p>
    </header>
  );
}

function DashboardView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pb-20"
    >
      <ViewHeader 
        title="Protocol Intelligence" 
        description="Unified observability into GenLayer throughput, security coverage, and protocol evolution."
      />
      
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Avg. Latency" value="512ms" trend="-12%" icon={Activity} />
        <StatCard label="Vulnerabilities Found" value="3" trend="Critical" variant="danger" icon={ShieldAlert} />
        <StatCard label="Token Efficiency" value="84%" trend="+5.2%" icon={Zap} />
        <StatCard label="Active Proposals" value="2" trend="Drafting" icon={FileCode} />
      </div>

      <div className="px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Section label="Throughput Performance">
            <div className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={BENCHMARK_DATA}>
                  <defs>
                    <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
                  <XAxis dataKey="timestamp" stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0E0E11', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Area type="monotone" dataKey="tps" stroke="#6366f1" fillOpacity={1} fill="url(#colorTps)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section label="Latency vs. Token Count">
              <div className="h-[200px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={BENCHMARK_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
                    <XAxis dataKey="timestamp" hide />
                    <YAxis hide />
                    <Tooltip cursor={false} contentStyle={{ backgroundColor: '#0E0E11', border: '1px solid #374151' }} />
                    <Line type="monotone" dataKey="latency" stroke="#F43F5E" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="tokens" stroke="#10B981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Section>
            <Section label="Validator Success Rate">
               <div className="flex items-center justify-center h-[200px] flex-col">
                  <div className="text-5xl font-bold text-indigo-500">98.8%</div>
                  <div className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-[10px]">Average Across Quorum</div>
               </div>
            </Section>
          </div>
        </div>

        <div className="space-y-6">
          <Section label="Security Alert Log">
            <div className="space-y-4">
              {VULNERABILITIES.map(vuln => (
                <div key={vuln.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 group hover:border-indigo-500/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight",
                      vuln.severity === 'CRITICAL' ? "bg-rose-500/20 text-rose-400" :
                      vuln.severity === 'HIGH' ? "bg-orange-500/20 text-orange-400" :
                      "bg-amber-500/20 text-amber-400"
                    )}>
                      {vuln.severity}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono">{vuln.id}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{vuln.name}</h4>
                </div>
              ))}
              <button className="w-full py-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors border border-transparent hover:border-indigo-500/20 rounded-lg">
                View Full Audit History
              </button>
            </div>
          </Section>

          <Section label="Active Spec Progress">
             <div className="space-y-4">
                {PROTOCOL_SPECS.map(spec => (
                  <div key={spec.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/30 transition-colors group cursor-pointer">
                    <div>
                      <div className="text-sm font-medium text-slate-300 group-hover:text-white">{spec.id}</div>
                      <div className="text-xs text-slate-500">{spec.title.slice(0, 20)}...</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                ))}
             </div>
          </Section>
        </div>
      </div>
    </motion.div>
  );
}

function BenchmarksView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20"
    >
      <ViewHeader 
        title="Execution Benchmarks" 
        description="Deep analysis of non-deterministic compute costs and validation latency profiles."
      />
      
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Section label="Latency Distribution (ms)">
            <div className="h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BENCHMARK_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
                  <XAxis dataKey="timestamp" stroke="#4B5563" fontSize={12} />
                  <YAxis stroke="#4B5563" fontSize={12} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: '#0E0E11', border: '1px solid #374151' }} 
                  />
                  <Bar dataKey="latency" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section label="Token Consumption Per TX">
            <div className="h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={BENCHMARK_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
                  <XAxis dataKey="timestamp" stroke="#4B5563" fontSize={12} />
                  <YAxis stroke="#4B5563" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0E0E11', border: '1px solid #374151' }} />
                  <Area type="step" dataKey="tokens" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        <div className="bg-[#0E0E11] rounded-2xl border border-slate-800/50 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 border-b border-slate-800/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">Time Period</th>
                <th className="px-6 py-4">Max TPS</th>
                <th className="px-6 py-4">Avg Latency</th>
                <th className="px-6 py-4">P99 Latency</th>
                <th className="px-6 py-4">Cost (GenL)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {BENCHMARK_DATA.map((row) => (
                <tr key={row.timestamp} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 text-slate-300 font-mono">{row.timestamp}</td>
                  <td className="px-6 py-4 font-semibold text-white">{row.tps}</td>
                  <td className="px-6 py-4">{row.latency}ms</td>
                  <td className="px-6 py-4">{(row.latency * 1.4).toFixed(0)}ms</td>
                  <td className="px-6 py-4 text-indigo-400 font-mono">0.00{row.tokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function SecurityView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20"
    >
      <ViewHeader 
        title="Security Audit & Attack Vectors" 
        description="Identifying vulnerabilities specific to Intelligent Contracts and non-deterministic execution environments."
      />
      
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 gap-6">
          {VULNERABILITIES.map(vuln => (
            <div key={vuln.id} className="bg-[#0E0E11] rounded-2xl border border-slate-800/50 p-6 flex flex-col md:flex-row gap-6 hover:shadow-[0_0_30px_rgba(244,63,94,0.05)] transition-shadow">
              <div className="md:w-64 shrink-0">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block",
                  vuln.severity === 'CRITICAL' ? "bg-rose-500/20 text-rose-400 border border-rose-500/20" :
                  vuln.severity === 'HIGH' ? "bg-orange-500/20 text-orange-400 border border-orange-500/20" :
                  "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                )}>
                  {vuln.severity} Severity
                </span>
                <div className="text-2xl font-bold text-white tracking-tight">{vuln.id}</div>
                <div className="text-slate-500 text-xs mt-2 font-medium italic">Detected in Mainnet Simulation</div>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{vuln.name}</h3>
                  <p className="text-slate-400 leading-relaxed">{vuln.description}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Proposed Remediation
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{vuln.remediation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Section label="Attack Vector Heatmap">
           <div className="h-[300px] flex items-center justify-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
              <div className="text-center">
                 <ShieldAlert className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                 <p className="text-slate-500 max-w-sm px-6">
                   Cross-validator consensus drift visualization currently in processing. Attack surfaces are ranked by economic impact and probability.
                 </p>
              </div>
           </div>
        </Section>
      </div>
    </motion.div>
  );
}

function ProposalsView({ selectedSpec, setSelectedSpec }: { selectedSpec: any, setSelectedSpec: (s: any) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col"
    >
      <ViewHeader 
        title="Protocol Enhancements" 
        description="Formal specifications for the next evolution of the GenLayer Intelligent Execution Layer."
      />
      
      <div className="flex-1 flex min-h-0">
        {/* Spec List */}
        <div className="w-80 border-r border-slate-800/50 overflow-y-auto p-4 space-y-3">
          {PROTOCOL_SPECS.map(spec => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpec(spec)}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all border",
                selectedSpec.id === spec.id 
                  ? "bg-slate-800/50 border-slate-700 text-white shadow-lg" 
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono opacity-60 tracking-wider uppercase">{spec.id}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold uppercase",
                  spec.status === 'PROPOSED' ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-300"
                )}>
                  {spec.status}
                </span>
              </div>
              <div className="font-semibold text-sm leading-tight">{spec.title}</div>
            </button>
          ))}
          
          <button className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-800 text-slate-500 hover:text-slate-200 hover:border-slate-700 transition-all text-sm font-medium">
            <Plus className="w-4 h-4" /> Propose Enhancement
          </button>
        </div>

        {/* Spec Content */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-12">
          <div className="max-w-3xl mx-auto prose prose-invert prose-indigo prose-sm">
            <Markdown>{selectedSpec.content}</Markdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SimulatorView({ prompt, setPrompt }: { prompt: string, setPrompt: (v: string) => void }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [output, setOutput] = useState<any>(null);

  const simulate = async () => {
    if (!prompt.trim()) return;
    setIsSimulating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a GenLayer Intelligent Validator. 
        Your task is to audit and execute the following Intelligent Contract prompt. 
        Analyze it for semantic validity, potential security risks (prompt injection), and provide a final verdict.
        
        Contract Prompt: "${prompt}"
        
        Return your answer strictly in the following JSON format:
        {
          "verdict": "CONFIRMED | REJECTED",
          "confidence": number (0-1),
          "logicTrace": "string explaining the semantic steps taken",
          "tokenUsage": number (simulate tokens used),
          "latency": "string (simulate latency e.g. 450ms)"
        }`,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      setOutput({
        verdict: result.verdict || 'REJECTED',
        confidence: result.confidence || 0,
        logicTrace: result.logicTrace || 'Verification failed.',
        tokenUsage: result.tokenUsage || 150,
        latency: result.latency || '500ms'
      });
    } catch (error) {
      console.error('Audit simulation failed:', error);
      setOutput({
        verdict: 'ERROR',
        confidence: 0,
        logicTrace: 'Audit engine encountered a critical failure. System integrity check required.',
        tokenUsage: 0,
        latency: '0ms'
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-20"
    >
      <ViewHeader 
        title="Intelligent Simulator" 
        description="Dry-run your Intelligent Contract logic against simulated validator quorums."
      />
      
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div className="bg-[#0E0E11] rounded-2xl border border-slate-800/50 p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Intelligent Contract Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-40 bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none font-mono text-sm"
              placeholder="Enter the semantic execution logic..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-4">
               <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Base Model</span>
                  <span className="text-xs text-indigo-400 font-medium">Gemini 1.5 Pro</span>
               </div>
               <div className="flex flex-col border-l border-slate-800 pl-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Validators</span>
                  <span className="text-xs text-white font-medium">7 (Quorum 5)</span>
               </div>
            </div>
            <button 
              onClick={simulate}
              disabled={isSimulating}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center gap-2"
            >
              {isSimulating ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Run Execution Plan
                </>
              )}
            </button>
          </div>
        </div>

        {output && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Section label="Execution Outcome">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                 <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
                    <div className="text-xs text-emerald-500 font-bold uppercase mb-1">Verdict</div>
                    <div className="text-3xl font-black text-emerald-400">{output.verdict}</div>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Confidence</div>
                    <div className="text-3xl font-black text-white">{(output.confidence * 100).toFixed(1)}%</div>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">Tokens used</div>
                    <div className="text-3xl font-black text-indigo-400">{output.tokenUsage}</div>
                 </div>
                 <div className="md:col-span-3 bg-slate-900/30 border border-slate-800/50 rounded-xl p-6">
                    <div className="text-xs text-slate-500 font-bold uppercase mb-4 tracking-widest underline decoration-indigo-500/50 underline-offset-4">Logic Trace & Semantic Audit</div>
                    <pre className="text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">{output.logicTrace}</pre>
                 </div>
              </div>
            </Section>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, trend, icon: Icon, variant = 'default' }: { label: string, value: string, trend: string, icon: any, variant?: 'default' | 'danger' }) {
  return (
    <div className="bg-[#0E0E11] p-6 rounded-2xl border border-slate-800/50 shadow-sm transition-all hover:bg-slate-800/20 group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-lg",
          variant === 'danger' ? "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500" : "bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600"
        )}>
          <Icon className={cn("w-5 h-5 transition-colors", "group-hover:text-white")} />
        </div>
        <span className={cn(
          "text-[10px] font-bold px-2 py-1 rounded bg-slate-100/5 border border-slate-800",
          variant === 'danger' ? "text-rose-400" : "text-emerald-400"
        )}>
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function Section({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</h3>
        <div className="h-px flex-1 bg-slate-800/50"></div>
      </div>
      {children}
    </section>
  );
}
