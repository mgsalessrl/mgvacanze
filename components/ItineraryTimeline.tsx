'use client';

import { Anchor, Flag, Calendar } from 'lucide-react';

export interface ItineraryStep {
  day: string;
  title: string;
  description: string;
}

export interface ItineraryDocs {
    title: string;
    description: string;
    steps: ItineraryStep[];
}

interface ItineraryTimelineProps {
  data: ItineraryDocs;
}

export function ItineraryTimeline({ data }: ItineraryTimelineProps) {
  return (
    <div className="py-8">
      <div className="mb-10 text-center md:text-left">
          <h3 className="text-2xl font-display text-brand-dark mb-3">{data.title}</h3>
          <p className="text-gray-600 leading-relaxed max-w-3xl">{data.description}</p>
      </div>
      
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-gold/50 before:to-transparent">
        {data.steps.map((step, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Icon / Dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-brand-gold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {index === 0 ? <Flag className="w-4 h-4 text-white" /> : 
                 index === data.steps.length - 1 ? <Anchor className="w-4 h-4 text-white" /> : 
                 <span className="text-white font-bold text-xs">{index + 1}</span>}
            </div>
            
            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-1 mb-2">
                 <span className="font-bold text-xs uppercase tracking-wider text-brand-gold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {step.day}
                 </span>
                 <h4 className="font-bold text-gray-900 text-lg">{step.title}</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
