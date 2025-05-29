import React from 'react';

// Импорт SVG иконок из shared папки
import { ReactComponent as ArmchairSvg } from '../../../shared/assets/icons-for-types/armchair.svg';
import { ReactComponent as BedSvg } from '../../../shared/assets/icons-for-types/bed.svg';
import { ReactComponent as LampSvg } from '../../../shared/assets/icons-for-types/lamp.svg';
import { ReactComponent as SofaSvg } from '../../../shared/assets/icons-for-types/sofa.svg';
import { ReactComponent as StoolSvg } from '../../../shared/assets/icons-for-types/stool.svg';
import { ReactComponent as TableSvg } from '../../../shared/assets/icons-for-types/table.svg';

// Компоненты-обертки для иконок с нужными пропсами
const ArmchairIcon = ({ size = 20, color = '#333333' }) => (
  <ArmchairSvg 
    style={{ 
      width: size, 
      height: size, 
      fill: color,
      stroke: 'none'
    }} 
  />
);

const BedIcon = ({ size = 20, color = '#333333' }) => (
  <BedSvg 
    style={{ 
      width: size, 
      height: size, 
      fill: color,
      stroke: 'none'
    }} 
  />
);

const LampIcon = ({ size = 20, color = '#333333' }) => (
  <LampSvg 
    style={{ 
      width: size, 
      height: size, 
      fill: color,
      stroke: 'none'
    }} 
  />
);

const SofaIcon = ({ size = 20, color = '#333333' }) => (
  <SofaSvg 
    style={{ 
      width: size, 
      height: size, 
      fill: color,
      stroke: 'none'
    }} 
  />
);

const StoolIcon = ({ size = 20, color = '#333333' }) => (
  <StoolSvg 
    style={{ 
      width: size, 
      height: size, 
      fill: color,
      stroke: 'none'
    }} 
  />
);

const TableIcon = ({ size = 20, color = '#333333' }) => (
  <TableSvg 
    style={{ 
      width: size, 
      height: size, 
      fill: color,
      stroke: 'none'
    }} 
  />
);

// Функция для получения иконки по типу
export const getTypeIcon = (typeName, size = 20, color = '#333333') => {
  const lowerTypeName = typeName.toLowerCase();
  
  switch (lowerTypeName) {
    case 'диваны':
    case 'диван':
    case 'sofa':
    case 'модульные диваны':
    case 'модульный диван':
    case 'modular sofa':
    case 'угловые диваны':
    case 'угловой диван':
    case 'corner sofa':
      return <SofaIcon size={size} color={color} />;
    
    case 'стулья':
    case 'стул':
    case 'chair':
    case 'табуреты':
    case 'табурет':
    case 'stool':
      return <StoolIcon size={size} color={color} />;
    
    case 'столы':
    case 'стол':
    case 'table':
      return <TableIcon size={size} color={color} />;
    
    case 'кровати':
    case 'кровать':
    case 'bed':
      return <BedIcon size={size} color={color} />;
    
    case 'кресла':
    case 'кресло':
    case 'armchair':
      return <ArmchairIcon size={size} color={color} />;
    
    case 'шкафы':
    case 'шкаф':
    case 'cabinet':
    case 'wardrobe':
    case 'тумбочки':
    case 'тумбочка':
    case 'nightstand':
    case 'bedside table':
    case 'полки':
    case 'полка':
    case 'shelf':
    case 'shelves':
    case 'комоды':
    case 'комод':
    case 'dresser':
    case 'chest of drawers':
      return <StoolIcon size={size} color={color} />;
    
    case 'зеркала':
    case 'зеркало':
    case 'mirror':
    case 'декор':
    case 'decor':
    case 'decoration':
    case 'турецкая мебель':
    case 'turkish furniture':
    case 'аксессуары':
    case 'аксессуар':
    case 'accessories':
    case 'лампы':
    case 'лампа':
    case 'lamp':
      return <LampIcon size={size} color={color} />;
    
    default:
      return <SofaIcon size={size} color={color} />;
  }
}; 