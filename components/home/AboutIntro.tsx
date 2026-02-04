import Image from 'next/image';

export default function AboutIntro() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-brand-dark mb-6">
            Un viaggio che va oltre la navigazione
          </h2>
          <div className="w-24 h-1 bg-brand-gold mx-auto mb-8"></div>
          <p className="text-gray-600 text-lg leading-relaxed">
            MG Vacanze nasce dal desiderio di offrire esperienze in mare uniche, dove il lusso incontra la libertà. 
            Ogni dettaglio - dal design degli interni all’itinerario personalizzato - è pensato per farti vivere 
            il mare con eleganza e autenticità. Che si desideri un charter romantico, una vacanza in famiglia 
            o un’esperienza con amici, Elyvian ti guida verso la rotta perfetta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Placeholders for the 3 images - ideally we pick from recovered images */}
          <div className="relative h-80 w-full overflow-hidden group">
             <Image 
               src="/uploads/about-1.jpg" // Placeholder path
               alt="Luxury Interior"
               fill
               className="object-cover transition-transform duration-500 group-hover:scale-105"
             />
          </div>
          <div className="relative h-80 w-full overflow-hidden group">
             <Image 
               src="/uploads/about-2.jpg" 
               alt="Sea View"
               fill
               className="object-cover transition-transform duration-500 group-hover:scale-105"
             />
          </div>
          <div className="relative h-80 w-full overflow-hidden group">
             <Image 
               src="/uploads/about-3.jpg" 
               alt="Yacht Lifestyle"
               fill
               className="object-cover transition-transform duration-500 group-hover:scale-105"
             />
          </div>
        </div>
      </div>
    </section>
  );
}
