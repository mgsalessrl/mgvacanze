"use client";

import { MapPin, Compass, Anchor, Sun, Wind } from 'lucide-react';
import { useState } from 'react';

const itineraries = [
    {
        id: 1,
        title: "Salento Adriatico: Grotte e Falesie",
        route: "Leuca – Otranto – Castro - Cala dell’Acquaviva - Porto Badisco o Torre Sant’Andrea - Brindisi – Torre Guaceto - Polignano a Mare – Monopoli – Brindisi - Otranto - Leuca",
        description: "Un viaggio tra la storia e la natura selvaggia della costa adriatica, caratterizzata da alte falesie, grotte misteriose e antiche torri di avvistamento.",
        icon: <Wind className="w-5 h-5" />
    },
    {
        id: 2,
        title: "Salento Ionico: Spiagge e Maldive",
        route: "Leuca – Pescoluse – Gallipoli - Porto Cesareo - Campomarino di Maruggio – Taranto - Torre Ovo - Gallipoli – Leuca",
        description: "Navigazione rilassata lungo acque cristalline e lunghe distese di sabbia bianca. Il versante ideale per chi ama i tramonti e l'atmosfera caraibica.",
        icon: <Sun className="w-5 h-5" />
    },
    {
        id: 3,
        title: "Golfo di Taranto e Riserve Marine",
        route: "Taranto e le Isole Cheradi – Campomarino di Maruggio - Porto Cesareo e Isola dei Conigli – Torre Lapillo e Porto Selvaggio – Gallipoli – S.Pietro in Bevagna – Taranto",
        description: "Alla scoperta delle isole Cheradi e delle aree marine protette, un itinerario ricco di biodiversità e storia millenaria.",
        icon: <Anchor className="w-5 h-5" />
    },
    {
        id: 4,
        title: "Grecia Ionica: Isole Diapontie e Corfù Nord",
        route: "Leuca – Othonoi – Erikousa – Mathraki – Corfù – Agios Stefanos - Ottono – Leuca",
        description: "Traversata verso la Grecia per esplorare le piccole perle delle Diapontie e la costa settentrionale di Corfù.",
        icon: <Compass className="w-5 h-5" />
    },
    {
        id: 5,
        title: "Grecia Ionica: Paxos e Antipaxos",
        route: "Leuca – Othonoi - Erikousa – Paxos – Lakka – Sivota – Othonoi - Leuca",
        description: "Un itinerario più lungo che tocca Paxos e le sue acque smeraldine, passando per la pittoresca Sivota.",
        icon: <MapPin className="w-5 h-5" />
    }
];

export function WeeklyItinerary() {
    const [activeItinerary, setActiveItinerary] = useState<number | null>(null);

    return (
        <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
            <div className="prose prose-lg max-w-none text-gray-600 mb-10">
                <h3 className="text-2xl font-display text-brand-dark mb-4">I nostri Itinerari Consigliati</h3>
                <p>I nostri itinerari si sviluppano lungo coste altamente scenografiche, dove natura e storia si incontrano.</p>
                <div className="grid md:grid-cols-2 gap-8 my-6">
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Versante Adriatico</h4>
                        <p className="text-sm">Caratterizzato da grotte marine, falesie e torri federiciane, sentinelle di pietra affacciate sul mare.</p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-teal-500">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Versante Ionico</h4>
                        <p className="text-sm">Regala grandi spiagge, atmosfere mediterranee e acque turchesi, ideali per una navigazione rilassata.</p>
                    </div>
                </div>
                <p className="text-sm italic">
                    Ogni itinerario rappresenta una base di partenza, personalizzabile in base alle tue esigenze, al meteo e allo stile di vacanza che desideri.
                </p>
            </div>

            <div className="space-y-4">
                {itineraries.map((it) => (
                    <div 
                        key={it.id} 
                        className={`bg-white rounded-lg transition-all duration-300 overflow-hidden ${activeItinerary === it.id ? 'shadow-md ring-2 ring-brand-gold ring-opacity-50' : 'shadow-sm hover:shadow'}`}
                    >
                        <button 
                            onClick={() => setActiveItinerary(activeItinerary === it.id ? null : it.id)}
                            className="w-full text-left px-6 py-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${activeItinerary === it.id ? 'bg-brand-gold text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {it.icon}
                                </div>
                                <h4 className="font-bold text-gray-800">{it.title}</h4>
                            </div>
                            <span className={`text-2xl text-brand-gold transition-transform duration-300 ${activeItinerary === it.id ? 'rotate-180' : ''}`}>
                                ↓
                            </span>
                        </button>
                        
                        <div className={`px-6 overflow-hidden transition-all duration-300 ${activeItinerary === it.id ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-14">
                                <p className="text-gray-600 mb-2 font-medium border-l-2 border-brand-gold/30 pl-3">
                                    {it.route}
                                </p>
                                <p className="text-sm text-gray-500 italic">
                                    {it.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
