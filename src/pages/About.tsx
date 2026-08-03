import React from 'react';
import { MessageSquare } from 'lucide-react';

interface AboutPageProps {
  handleOpenContactModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ handleOpenContactModal }) => {
  const teamMembers = [
    { name: 'Patel Rudra', role: 'Founder', image: 'Patel Rudra founder.jpg', roleColor: 'text-amber-500' },
    { name: 'Chhatriwala Pratham', role: 'Co-Founder', image: 'Pratham Chhatrivala  Co-founder.jpg', roleColor: 'text-purple-400' },
    { name: 'Rathod Pranshav', role: 'CEO', image: 'Rathod Pranshav ceo .jpg', roleColor: 'text-amber-400' },
    { name: 'Arya Rudra', role: 'Head of Finance', image: 'Arya Rudra HOF.jpg', roleColor: 'text-green-400' },
    { name: 'Vaghela Dhaval', role: 'Board of Directors', image: 'Vaghela Dhaval bod  .jpg', roleColor: 'text-blue-400' },
    { name: 'Makwana Bhavin', role: 'Board of Directors', image: 'Makwana Bhavin bod.jpg', roleColor: 'text-blue-400' },
    { name: 'Chaudhary Kuldeep', role: 'Board of Directors', image: 'Chaudhari kuldip bod .jpg', roleColor: 'text-blue-400' },
    { name: 'Memon Shaif', role: 'Board of Directors', image: 'Memon saif bod.jpg', roleColor: 'text-blue-400' },
  ];

  const timeline = [
    { date: 'Jan 2026', title: 'The Spark', desc: 'Dharohar was conceived in Ahmedabad — a vision to make India\'s monuments wearable.' },
    { date: 'Mar 2026', title: 'Master Artisans', desc: 'Partnered with master craftsmen and engravers specializing in heritage motifs.' },
    { date: 'May 2026', title: 'First Collection', desc: 'Our first 5 heritage watches were crafted — each a tribute to a different monument.' },
    { date: 'Aug 2026', title: '25 Editions', desc: 'Collection expanded to 25+ editions covering temples, forts, stepwells, and stupa.' },
  ];

  return (
    <main className="pt-28 pb-0">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-stone-950">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: "url('palace_background.jpg')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/50 to-stone-950/90"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-32 pb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500" />
            <span className="text-amber-400 tracking-[0.4em] text-xs font-bold uppercase font-mono">Est. 2026 · Ahmedabad, India</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            <span className="block">Our</span>
            <span className="block bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Heritage Story</span>
          </h1>
          <p className="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Where centuries of Indian architectural legacy meet precision horology.</p>
          <div className="flex justify-center gap-12 mt-12">
            {[{n:'25+',l:'Editions'},{n:'120h',l:'per Watch'},{n:'5%',l:'Artisan Share'}].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-3xl font-serif font-bold text-amber-400">{s.n}</div>
                <div className="text-stone-400 text-xs uppercase tracking-wider mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative z-10 py-24 px-4 bg-stone-950/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 tracking-[0.4em] text-xs font-bold uppercase font-mono">Our Journey</span>
            <h2 className="text-4xl font-serif font-bold text-white mt-3">The Dharohar Story</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500 via-amber-400 to-transparent"></div>
            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative flex gap-8 items-start">
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center z-10">
                    <span className="text-amber-400 text-xs font-bold font-mono text-center leading-tight">{item.date.split(' ')[0]}<br />{item.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1 bg-stone-900/60 border border-stone-800 rounded-2xl p-6">
                    <h3 className="text-xl font-serif text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-stone-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-400 tracking-[0.4em] text-xs font-bold uppercase font-mono">Atelier Leadership</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-3">The Visionaries</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="group text-center">
                <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-2 border-amber-500/30 group-hover:border-amber-500 transition-all duration-300 mb-4 bg-stone-900">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-serif text-amber-400/50">{member.name.charAt(0)}</div>
                  )}
                </div>
                <h3 className="font-serif font-bold text-white text-sm">{member.name}</h3>
                <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${member.roleColor}`}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-4 bg-stone-950/80">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-6">Commission Your Heritage Watch</h2>
          <p className="text-stone-300 text-lg leading-relaxed mb-10">Request custom dial engravings of your chosen monument, specialized metal finishes, or bespoke leather straps.</p>
          <button onClick={() => handleOpenContactModal()} className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black px-10 py-4 rounded-xl uppercase tracking-wider text-xs inline-flex items-center gap-2.5 transition-all duration-300 shadow-[0_0_30px_rgba(217,119,6,0.35)]">
            <MessageSquare size={17} /> Contact Us to Customize
          </button>
        </div>
      </section>
    </main>
  );
};
