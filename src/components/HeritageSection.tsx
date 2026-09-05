import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  BookOpen, 
  Award, 
  MapPin, 
  History, 
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Check,
  HelpCircle
} from 'lucide-react';
import { mockHeritageMilestones } from '../data';

interface HeritageSectionProps {
  onShowToast: (message: string) => void;
}

export default function HeritageSection({ onShowToast }: HeritageSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Sab');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);

  // Interactive Quiz State
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);

  const tags = ['Sab', 'Defense', 'Monarchy', 'Kisaani', 'Sports'];

  const quizQuestion = {
    question: "Bharatpur, Rajasthan ke Lohagarh Fort ko 'Ajey Fort' (Impregnable) kyu kaha jata hai?",
    options: [
      "Isme Persia se import kiye gaye lohe ke doors the.",
      "Iski mitti ki bani outer walls British cannons ke heavy balls ko absorb kar leti thin.",
      "Ye ek active volcano ke upar bana tha jisse dushman darr jaate the.",
      "Iske andar underground rivers thi jo dushmano ko baha deti thin."
    ],
    correctIdx: 1,
    explanation: "Sahi Jawab! Lohagarh Fort ki mitti ki walls ne 1805 me British cannons ke heavy cannonballs ko absorb kar liya tha. Saare gola-barood mitti ke andar dhans gaye aur killa hamesha ajey raha!"
  };

  const handleQuizAnswer = (idx: number) => {
    setSelectedQuizAnswer(idx);
    setQuizAnswered(true);
    if (idx === quizQuestion.correctIdx) {
      onShowToast("🏆 Gazab! Aapne bilkul sahi jawab diya.");
    } else {
      onShowToast("📚 Bohot karib! Niche di dharohar list ko padhein aur jaanein.");
    }
  };

  const filteredMilestones = mockHeritageMilestones.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.legacy.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTag === 'Sab') return matchesSearch;
    if (selectedTag === 'Defense') return matchesSearch && (m.id === 'milestone_1');
    if (selectedTag === 'Monarchy') return matchesSearch && (m.id === 'milestone_2');
    if (selectedTag === 'Kisaani') return matchesSearch && (m.id === 'milestone_3');
    if (selectedTag === 'Sports') return matchesSearch && (m.id === 'milestone_4');
    return matchesSearch;
  });

  return (
    <div id="heritage-container" className="flex flex-col gap-6 max-w-3xl mx-auto pb-24 md:pb-6 select-none">
      
      {/* Royal Banner Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-500/30 p-6 shadow-sm">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl"></div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-amber-800 font-bold uppercase mb-2">
              <Compass className="w-3.5 h-3.5" /> Dharohar Spotlight
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 leading-tight">
              Apni Dharohar aur Itihaas
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-lg">
              Apne shahi parivar, ajey killo, kisaani milestones aur sports ki chamakti kamyabi ko explore karein jo hamara sir garv se uncha karti hain.
            </p>
          </div>
          <History className="hidden sm:block w-14 h-14 text-amber-600/20 shrink-0" />
        </div>
      </div>

      {/* Interactive Heritage Quiz Mini-Widget */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-widest">Buzurgo ki Legacy ka Quiz</span>
        </div>
        <h4 className="text-sm font-sans font-semibold text-slate-900 mb-3">{quizQuestion.question}</h4>
        
        <div className="flex flex-col gap-2">
          {quizQuestion.options.map((option, idx) => {
            const isSelected = selectedQuizAnswer === idx;
            const isCorrect = idx === quizQuestion.correctIdx;
            
            let btnStyle = "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300 font-medium";
            if (quizAnswered) {
              if (isCorrect) {
                btnStyle = "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold";
              } else if (isSelected) {
                btnStyle = "bg-red-50 border-red-300 text-red-900";
              } else {
                btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={quizAnswered}
                onClick={() => handleQuizAnswer(idx)}
                className={`w-full py-2.5 px-4 rounded-xl border text-left text-xs transition-all duration-200 flex items-center justify-between ${btnStyle} cursor-pointer`}
              >
                <span>{option}</span>
                {quizAnswered && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {quizAnswered && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-slate-700 leading-relaxed font-sans">
            <span className="font-bold text-amber-900 block mb-1">🔍 Itihaas se Seekh:</span>
            {quizQuestion.explanation}
          </div>
        )}
      </div>

      {/* Explorer Controls: Search & Tags */}
      <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Purani ghatnayein, places aur itihaas search karein..."
            className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-amber-500 shadow-2xs font-medium"
          />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-display tracking-wide border transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-amber-600 border-amber-600 text-white font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Milestones Timeline list */}
      <div id="heritage-timeline" className="flex flex-col gap-6">
        {filteredMilestones.length === 0 ? (
          <div className="rounded-xl bg-white border border-slate-200 p-8 text-center shadow-xs">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500 text-xs font-mono">Aapki search ke hisab se koi dharohar record nahi mila.</p>
          </div>
        ) : (
          filteredMilestones.map((milestone) => {
            const isOpen = activeMilestoneId === milestone.id;

            return (
              <div 
                key={milestone.id}
                id={`milestone-card-${milestone.id}`}
                className="group rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 overflow-hidden shadow-sm"
              >
                {/* Visual Thumbnail */}
                <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
                  <img 
                    src={milestone.image} 
                    alt={milestone.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                  
                  {/* Floating Era Tag */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-amber-500/40 rounded-lg px-3 py-1 font-mono text-xs font-bold text-amber-900 tracking-wider shadow-sm">
                    {milestone.year}
                  </div>
                </div>

                {/* Info and Expand */}
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors duration-200">
                    {milestone.title}
                  </h3>
                  
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    {milestone.description}
                  </p>

                  <div className="mt-4 border-t border-slate-100 pt-3 flex flex-col gap-2">
                    <span className="text-[10px] font-mono uppercase text-amber-800 tracking-widest font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-600" /> Samaj ki Legacy
                    </span>
                    <p className="text-xs text-slate-600 italic">
                      "{milestone.legacy}"
                    </p>
                  </div>

                  {/* Expand button and interactive action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActiveMilestoneId(isOpen ? null : milestone.id);
                        if (!isOpen) onShowToast(`📜 Itihaas scroll khul chuka hai: ${milestone.title}`);
                      }}
                      className="flex items-center gap-1.5 text-xs text-amber-700 font-display font-bold hover:text-amber-800 outline-none cursor-pointer"
                    >
                      <span>{isOpen ? 'Scroll Band Karein' : 'Poora Itihaas Padhein'}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90 text-amber-600' : ''}`} />
                    </button>
                    
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`Heritage Archive: ${milestone.title} (${milestone.year}) - Legacy: ${milestone.legacy}`);
                        onShowToast('🔗 Itihaas summary link copy ho gaya hai.');
                      }}
                      className="text-slate-400 hover:text-slate-700 text-xs font-medium outline-none cursor-pointer"
                      title="Share Legacy Link"
                    >
                      Dharohar Share Karein
                    </button>
                  </div>

                  {/* Nested Extended Narrative scroll */}
                  {isOpen && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-slate-800 leading-relaxed space-y-2 animate-fade-in font-sans">
                      <span className="font-serif font-bold text-amber-900 block border-b border-amber-200/80 pb-1.5 mb-2">EXTENDED CHRONICLES</span>
                      {milestone.id === 'milestone_1' && (
                        <p>
                          During the siege of 1805, the British General Lord Lake assaulted Lohagarh Fort multiple times with state-of-the-art heavy artillery siege weapons. The clever design formulated by the engineers of Maharaja Surajmal placed thick mud composite layers backed by standard sandstone frames. The cannon fire, instead of breaking the wall, simply embedded itself within the thick wet mud. The fort became an ultimate legend, standing undefeated, as Lord Lake was forced to sign a peaceful treaty after massive British casualties.
                        </p>
                      )}
                      {milestone.id === 'milestone_2' && (
                        <p>
                          Maharaja Surajmal’s reign represented the peak of cultural and judicial balance. He did not only defend the community but also created structured, secure grain collection depots, subsidized rural blacksmiths, and funded prominent scholars across languages. His state had robust diplomatic networks that maintained sovereignty amid constant regional skirmishes, setting a benchmark for future modern administration in India.
                        </p>
                      )}
                      {milestone.id === 'milestone_3' && (
                        <p>
                          The Green Revolution's primary core relied on tireless mechanical adaptation. Local farming families transformed standard subsistence farming into heavy corporate networks, pioneering the implementation of tubewell irrigation, cooperative credit systems, and modern tractor leasing models, which today makes Haryana and Western UP the most financially independent rural belts in India.
                        </p>
                      )}
                      {milestone.id === 'milestone_4' && (
                        <p>
                          What makes the akhada culture so resilient is the lack of vanity. Olympic champions return from international podiums directly back to the clay rings (Akhada) to mentor children. The custom of drinking milk, taking pure ghee, and performing thousands of Hindu squats (Dand-Baithak) daily creates a legendary muscular and cardiorespiratory endurance engine that translates seamlessly to global modern sporting platforms.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
