/**
 * Tabbed Customization Panel Component
 * 
 * Provides a tabbed interface for avatar customization with image previews
 * for each option instead of text dropdowns.
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAvatarStore } from '@/lib/avatarStore';
import { getCategoryOptions } from '@/lib/componentRegistry';
import { ComponentRegistryEntry } from '@/lib/types';
import ExportButton from '@/components/ExportButton';
import RandomButton from '@/components/controls/RandomButton';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { 
    id: 'eyes', 
    label: 'Eyes', 
    icon: (
      <svg viewBox="0 0 804 454" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
        <ellipse cx="159.5" cy="227" rx="159.5" ry="227" />
        <ellipse cx="644.5" cy="227" rx="159.5" ry="227" />
      </svg>
    )
  },
  { 
    id: 'hats', 
    label: 'Hats', 
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
        <path d="M25.7,19.6c0.1,0.7,0.2,1.4,0.3,2.1c0.1,1.3-0.6,2.5-1.8,3c-2.6,1.1-5.3,1.7-8.2,1.7s-5.6-0.6-8.2-1.7c-1.5-0.6-2.2-2.3-1.6-3.8l0.6-1.6C3.7,20.5,2,22.1,2,24c0,3.9,7.2,6,14,6s14-2.1,14-6C30,22.2,28.5,20.7,25.7,19.6z"/>
      </svg>
    )
  },
  { 
    id: 'capes', 
    label: 'Capes', 
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
        <path d="M14.43,3l-.29.49a2.5,2.5,0,0,1-4.29,0L9.57,3H6.76L2,5.38V11H6V21H18V11h4V5.38L17.24,3Z"/>
      </svg>
    )
  },
  { 
    id: 'accessories', 
    label: 'Accessories', 
    icon: (
      <svg viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5 sm:w-7 sm:h-7">
        <path d="M303.736,226.095v-105.98c0-10.72-8.715-19.428-19.428-19.428h-56.616c-10.728,0-19.428,8.708-19.428,19.428v105.98c0,10.729,8.7,19.413,19.428,19.413h56.616C295.021,245.508,303.736,236.825,303.736,226.095z"/>
        <path d="M220.141,258.463H117.669C73.92,314.67,0,346.714,0,346.714l58.74,33.028l5.302,76.075c80.448-43.756,136.357-131.622,162.832-197.283C226.685,258.557,224.215,258.533,220.141,258.463z"/>
        <path d="M394.331,258.463H291.859c-4.059,0.071-6.544,0.094-6.718,0.071c26.476,65.661,82.368,153.528,162.833,197.283l5.286-76.075L512,346.714C512,346.714,438.095,314.67,394.331,258.463z"/>
      </svg>
    )
  },
  { 
    id: 'backgrounds', 
    label: 'Backgrounds', 
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
        <path d="M3,20V4A1,1,0,0,1,4,3H20a1,1,0,0,1,1,1V20a1,1,0,0,1-1,1H4A1,1,0,0,1,3,20Z"/>
      </svg>
    )
  },
];

interface CustomizationPanelProps {
  className?: string;
  svgRef?: React.RefObject<SVGSVGElement>;
}

// Dummy component for "None" option
const NoneComponent = () => null;

export default function TabbedCustomizationPanel({ className = '', svgRef }: CustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('eyes');
  const { config, updateConfig } = useAvatarStore();

  const renderOptionButton = (category: string, option: ComponentRegistryEntry, isNoneOption: boolean = false) => {
    // Map plural category names to singular config keys
    const configKey = (category === 'hats' ? 'hat' : 
                      category === 'capes' ? 'cape' :
                      category === 'accessories' ? 'accessory' :
                      category === 'backgrounds' ? 'background' : 
                      category) as keyof typeof config;
    
    const isSelected = isNoneOption 
      ? (!config[configKey] || config[configKey] === 'none' || config[configKey] === null)
      : config[configKey] === option.id;
    // Use PNG for eyes, hats, accessories, capes, and backgrounds, SVG for others
    const fileExtension = (category === 'eyes' || category === 'hats' || category === 'accessories' || category === 'capes' || category === 'backgrounds') ? 'png' : 'svg';
    const imagePath = `/ghost-parts/${category}/${option.id}.${fileExtension}`;
    
    return (
      <button
        key={option.id}
        onClick={() => {
          if (isNoneOption) {
            // For optional categories, set to null
            updateConfig({ [configKey]: null });
          } else {
            updateConfig({ [configKey]: option.id });
          }
        }}
        className={`
          relative group rounded-xl p-3 transition-all duration-200 flex flex-col items-center justify-center
          ${isSelected 
            ? 'ring-2 ring-purple-500 bg-purple-50' 
            : 'ring-2 ring-gray-200 hover:ring-purple-300 bg-white hover:bg-purple-50'
          }
        `}
        aria-label={`Select ${option.label}`}
        aria-pressed={isSelected}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center p-1">
          {isNoneOption ? (
            <div className="text-4xl text-gray-400 flex items-center justify-center w-full h-full">∅</div>
          ) : (
            <img
              src={imagePath}
              alt={option.label}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          )}
        </div>
        <span className="sr-only">
          {isNoneOption ? 'None' : option.label}
        </span>
      </button>
    );
  };

  const renderTabContent = () => {
    const options = getCategoryOptions(activeTab);
    const isOptionalCategory = ['hats', 'accessories', 'capes'].includes(activeTab);
    
    return (
      <>
        {/* Add "none" option for optional categories */}
        {isOptionalCategory && (
          renderOptionButton(activeTab, { id: 'none', label: 'None', component: NoneComponent }, true)
        )}
        {/* Render actual options, filtering out 'none.svg' files */}
        {options
          .filter(option => option.id !== 'none')
          .map((option) => renderOptionButton(activeTab, option, false))
        }
      </>
    );
  };

  return (
    <div className={`bg-white flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 bg-primary-purple flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 20 24" fill="none">
              <path d="M3.80081 18.5661C1.32306 24.0572 6.59904 25.434 10.4904 22.2205C11.6339 25.8242 15.926 23.1361 17.4652 20.3445C20.8578 14.1915 19.4877 7.91459 19.1361 6.61988C16.7244 -2.20972 4.67055 -2.21852 2.59581 6.6649C2.11136 8.21946 2.10284 9.98752 1.82846 11.8233C1.69011 12.749 1.59258 13.3398 1.23436 14.3135C1.02841 14.8733 0.745043 15.3704 0.299833 16.2082C-0.391594 17.5095 -0.0998802 20.021 3.46397 18.7186V18.7195L3.80081 18.5661Z" fill="white" />
              <path d="M10.9614 10.4413C9.97202 10.4413 9.82422 9.25893 9.82422 8.55407C9.82422 7.91791 9.93824 7.4124 10.1542 7.09197C10.3441 6.81003 10.6158 6.66699 10.9614 6.66699C11.3071 6.66699 11.6036 6.81228 11.8128 7.09892C12.0511 7.42554 12.177 7.92861 12.177 8.55407C12.177 9.73591 11.7226 10.4413 10.9616 10.4413H10.9614Z" fill="black" />
              <path d="M15.0318 10.4413C14.0423 10.4413 13.8945 9.25893 13.8945 8.55407C13.8945 7.91791 14.0086 7.4124 14.2245 7.09197C14.4144 6.81003 14.6861 6.66699 15.0318 6.66699C15.3774 6.66699 15.6739 6.81228 15.8831 7.09892C16.1214 7.42554 16.2474 7.92861 16.2474 8.55407C16.2474 9.73591 15.793 10.4413 15.0319 10.4413H15.0318Z" fill="black" />
            </svg>
            <div className="relative h-6 sm:h-8 w-auto flex items-center">
              {/* Mobile logo */}
              <Image 
                src="/kiroween-avatar-mobile.png" 
                alt="Kiroween Avatar" 
                width={300}
                height={40}
                className="!h-12 !sm:h-8 w-auto object-contain md:hidden"
                priority
              />
              {/* Desktop logo */}
              <Image 
                src="/kiroween-avatar.png" 
                alt="Kiroween Avatar" 
                width={300}
                height={40}
                className="!h-6 !sm:h-8 w-auto object-contain hidden md:block"
                priority
              />
            </div>
          </div>
          {svgRef && (
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <RandomButton />
              </div>
              <ExportButton svgRef={svgRef} />
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-50 flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-2 sm:px-6 py-3 sm:py-6 text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'text-purple-700 bg-white shadow-sm relative z-10'
                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100'
              }
            `}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <div className="flex items-center justify-center mb-1 sm:mb-2">{tab.icon}</div>
            <span className="hidden sm:block text-xs sm:text-sm font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-white min-h-0 p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 pb-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}