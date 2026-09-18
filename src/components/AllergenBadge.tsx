import React from 'react';
import { AllergenType } from '../types';
import { Wheat, Bean, Nut, Milk, Egg, Shell, Fish, CircleDot, AlertTriangle } from 'lucide-react';

interface AllergenBadgeProps {
  allergen: AllergenType;
  showName?: boolean;
  size?: 'sm' | 'md';
}

const ALLERGEN_LABELS_EN: Record<string, string> = {
  Gluten: 'Gluten',
  Soya: 'Soy',
  Maní: 'Peanuts',
  'Frutos secos': 'Tree Nuts',
  Lácteos: 'Dairy',
  Huevo: 'Egg',
  Mariscos: 'Shellfish',
  Pescado: 'Fish',
  Sésamo: 'Sesame',
};

export const AllergenBadge: React.FC<AllergenBadgeProps> = ({ allergen, showName = true, size = 'sm' }) => {
  const getIcon = () => {
    switch (allergen) {
      case 'Gluten':
        return <Wheat className="w-3.5 h-3.5 text-[#E5B869]" />;
      case 'Soya':
        return <Bean className="w-3.5 h-3.5 text-[#8ED09E]" />;
      case 'Maní':
      case 'Frutos secos':
        return <Nut className="w-3.5 h-3.5 text-[#E59B69]" />;
      case 'Lácteos':
        return <Milk className="w-3.5 h-3.5 text-[#A5C4D4]" />;
      case 'Huevo':
        return <Egg className="w-3.5 h-3.5 text-[#F2D06B]" />;
      case 'Mariscos':
        return <Shell className="w-3.5 h-3.5 text-[#E89DA8]" />;
      case 'Pescado':
        return <Fish className="w-3.5 h-3.5 text-[#86C1D6]" />;
      case 'Sésamo':
        return <CircleDot className="w-3.5 h-3.5 text-[#CFCBC0]" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-[#E5B869]" />;
    }
  };

  const displayName = ALLERGEN_LABELS_EN[allergen] || allergen;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium bg-[#1B211E]/80 border border-white/10 text-[#E8E5DD] hover:border-[#E5B869]/40 transition-colors ${
        size === 'sm' ? 'text-[11px] py-0.5' : 'text-xs py-1'
      }`}
      title={`Contains ${displayName}`}
    >
      {getIcon()}
      {showName && <span>{displayName}</span>}
    </span>
  );
};
