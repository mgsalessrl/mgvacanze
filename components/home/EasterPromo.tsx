import Link from 'next/link';
import Image from 'next/image';

export default function EasterPromo() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-4xl text-brand-dark mb-4 uppercase tracking-widest">Festeggia la Pasqua in Mare</h2>
        <p className="text-xl text-gray-600 mb-2">Noleggia per una settimana le nostre imbarcazioni</p>
        <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
            Pasqua in barca: il piacere di vivere il mare in modo esclusivo. 
            Scrivici per creare la tua esperienza personalizzata e concederti la vacanza di Pasqua che meriti davvero.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pasqua Dream */}
            <div className="group">
                <Link href="/noleggio/pasqua-dream">
                    <div className="relative h-64 w-full overflow-hidden mb-4 rounded-lg shadow-md group-hover:shadow-xl transition-all">
                        <Image 
                            src="/images/img_sito/psqua dream/1316-excess14-0604-min-scaled.jpg" // Using an image from the folder
                            alt="Elyvian Dream Pasqua"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <h3 className="text-xl font-display text-brand-dark group-hover:text-brand-gold transition-colors">ELYVIAN DREAM</h3>
                </Link>
            </div>

            {/* Pasqua Spirit */}
            <div className="group">
                <Link href="/noleggio/pasqua-spirit">
                    <div className="relative h-64 w-full overflow-hidden mb-4 rounded-lg shadow-md group-hover:shadow-xl transition-all">
                         <Image 
                            src="/images/img_sito/pasqua spirit/1070-excess11-int-ncz7428-hdr-a3-scaled.jpg"
                            alt="Elyvian Spirit Pasqua"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <h3 className="text-xl font-display text-brand-dark group-hover:text-brand-gold transition-colors">ELYVIAN SPIRIT</h3>
                </Link>
            </div>

            {/* Pasqua Breeze */}
            <div className="group">
                <Link href="/noleggio/pasqua-in-mare-elyvian-breeze">
                    <div className="relative h-64 w-full overflow-hidden mb-4 rounded-lg shadow-md group-hover:shadow-xl transition-all">
                         <Image 
                            src="/images/img_sito/pasqua breeze/53124270a7c3417f9d398ed9d2ddf53d-683x1024-2.jpg"
                            alt="Elyvian Breeze Pasqua"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <h3 className="text-xl font-display text-brand-dark group-hover:text-brand-gold transition-colors">ELYVIAN BREEZE</h3>
                </Link>
            </div>

        </div>
      </div>
    </section>
  );
}
