import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { HOLDERS_DATA, HOLDERS_DISTRIBUTION } from '../constants';
import { Users, PieChart as PieIcon } from 'lucide-react';

const HoldersTable: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Default to the last item ("Others") if nothing is hovered, or keep it specific
  const activeItem = activeIndex !== null ? HOLDERS_DISTRIBUTION[activeIndex] : HOLDERS_DISTRIBUTION[HOLDERS_DISTRIBUTION.length - 1];

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Custom Active Shape for the Pie Chart
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 2}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-300"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 8}
          outerRadius={innerRadius - 4}
          fill={fill}
          opacity={0.3}
        />
      </g>
    );
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Chart Section */}
      <div className="w-full xl:w-5/12 bg-[#0f0f13]/80 backdrop-blur-md rounded-2xl border border-white/10 p-1 flex flex-col h-fit group transition-all hover:border-primary/30">
         {/* Decorative corners */}
         <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 rounded-tl-lg"></div>
         <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 rounded-tr-lg"></div>
         <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 rounded-bl-lg"></div>
         <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 rounded-br-lg"></div>

         <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <PieIcon size={20} />
                </div>
                <h3 className="text-xl font-bold text-white font-mono tracking-tight uppercase">Token Distribution</h3>
            </div>
            
            <div className="h-[320px] w-full relative mb-8 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        activeIndex={activeIndex ?? -1}
                        activeShape={renderActiveShape}
                        data={HOLDERS_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        innerRadius={85}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                    >
                    {HOLDERS_DISTRIBUTION.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke="rgba(0,0,0,0.5)"
                            strokeWidth={2}
                            className="transition-all duration-300 outline-none focus:outline-none"
                            style={{ 
                                filter: activeIndex === index ? `drop-shadow(0 0 8px ${entry.color})` : 'none',
                                opacity: activeIndex !== null && activeIndex !== index ? 0.4 : 1
                            }}
                        />
                    ))}
                    </Pie>
                </PieChart>
                </ResponsiveContainer>
                
                {/* Dynamic Center Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                    <div className="text-center transition-all duration-300 transform scale-100">
                        <span 
                            className="block text-gray-400 text-xs font-mono font-bold uppercase tracking-widest mb-2"
                            style={{ color: activeItem.color }}
                        >
                            {activeItem.name}
                        </span>
                        <span className="block text-4xl md:text-5xl font-bold text-white font-mono tracking-tighter">
                            {activeItem.value}<span className="text-lg text-gray-500">%</span>
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Interactive Legend */}
            <div className="space-y-2 mt-auto">
                {HOLDERS_DISTRIBUTION.map((item, index) => (
                    <div 
                        key={item.name} 
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${
                            activeIndex === index 
                                ? 'bg-white/10 border-white/10 scale-[1.02] shadow-lg' 
                                : 'hover:bg-white/5 hover:border-white/5'
                        }`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span 
                                    className={`block w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'shadow-[0_0_10px_currentColor]' : ''}`}
                                    style={{ backgroundColor: item.color, color: item.color }} 
                                ></span>
                                {activeIndex === index && (
                                    <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: item.color }}></span>
                                )}
                            </div>
                            <span className={`text-sm font-medium transition-colors ${activeIndex === index ? 'text-white' : 'text-gray-400'}`}>
                                {item.name}
                            </span>
                        </div>
                        <span className={`font-mono font-bold transition-colors ${activeIndex === index ? 'text-white' : 'text-gray-500'}`}>
                            {item.value}%
                        </span>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* Table Section */}
      <div className="w-full xl:w-7/12 bg-[#0f0f13]/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden flex flex-col h-fit group hover:border-primary/30 transition-all">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Users size={20} />
                </div>
                <h3 className="text-xl font-bold text-white font-mono uppercase tracking-tight">Top Addresses</h3>
                <span className="ml-auto px-2 py-1 bg-accent-green/10 text-accent-green text-[10px] font-mono font-bold uppercase rounded border border-accent-green/20">
                    Live Data
                </span>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-black/20 text-gray-500 text-[10px] uppercase tracking-wider font-mono">
                    <th className="px-6 py-4 font-bold">Rank</th>
                    <th className="px-6 py-4 font-bold">Address</th>
                    <th className="px-6 py-4 text-right font-bold">Percentage</th>
                    <th className="px-6 py-4 text-right font-bold">Holdings (SATS)</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {HOLDERS_DATA.map((holder) => (
                <tr key={holder.rank} className="hover:bg-white/[0.03] transition-colors group/row">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-mono text-sm font-bold border transition-all ${
                            holder.rank <= 3 
                                ? 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_10px_rgba(108,92,231,0.1)] group-hover/row:shadow-[0_0_15px_rgba(108,92,231,0.3)]' 
                                : 'bg-white/5 border-white/10 text-gray-500'
                        }`}>
                            {holder.rank}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm text-gray-400 group-hover/row:text-primary transition-colors cursor-pointer select-all">
                            {holder.address}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                         <div className="flex items-center justify-end gap-2">
                             <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-primary transition-all duration-500" 
                                    style={{ width: `${parseFloat(holder.percentage) * 20}%` }}
                                 ></div>
                             </div>
                             <span className="text-sm text-gray-300 font-mono font-bold">{holder.percentage}</span>
                         </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300 font-mono group-hover/row:text-white transition-colors">
                        {holder.value}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
            <a href="https://unisat.io/brc20/%F0%9D%9B%91" target="_blank" rel="noreferrer" className="text-xs font-mono text-gray-500 hover:text-primary transition-colors uppercase tracking-widest">
                View All Holders on Explorer →
            </a>
        </div>
      </div>
    </div>
  );
};

export default HoldersTable;