
import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const getColors = () => {
    switch (level) {
      case RiskLevel.SAFE: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case RiskLevel.LOW: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case RiskLevel.MEDIUM: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case RiskLevel.HIGH: return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case RiskLevel.CRITICAL: return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getColors()}`}>
      {level}
    </span>
  );
};
