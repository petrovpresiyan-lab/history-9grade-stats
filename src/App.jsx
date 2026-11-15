import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  BarChart3,
  Factory,
  Train,
  Users,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Calculator,
  Award,
  RotateCcw,
  HelpCircle,
  Sparkles,
  PenLine
} from 'lucide-react';

const STEAM_DATA = [
  { year: '1840', uk: 320, fr: 30, de: 20, ru: 5 },
  { year: '1850', uk: 500, fr: 70, de: 40, ru: 10 },
  { year: '1860', uk: 700, fr: 180, de: 140, ru: 20 },
  { year: '1870', uk: 920, fr: 310, de: 900, ru: 80 },
  { year: '1880', uk: 2000, fr: 550, de: 1700, ru: 180 },
  { year: '1888', uk: 2200, fr: 800, de: 1980, ru: 250 },
];

const PIG_IRON_DATA = [
  { id: 'uk', country: 'Великобритания', y1830: 680, y1840: 1400, y1850: 2250, diff: 1570 },
  { id: 'de', country: 'Германия', y1830: 120, y1840: 165, y1850: 210, diff: 90 },
  { id: 'fr', country: 'Франция', y1830: 225, y1840: 405, y1850: 405, diff: 180 },
  { id: 'us', country: 'САЩ', y1830: 180, y1840: 290, y1850: 565, diff: 385 },
];

const RAIL_ABS_DATA = [
  { country: 'Великобритания', y1840: '2 390', y1880: '25 060', y1900: '30 079' },
  { country: 'Франция', y1840: '496', y1880: '23 089', y1900: '38 109' },
  { country: 'Германия', y1840: '469', y1880: '33 838', y1900: '51 678' },
  { country: 'Австрия', y1840: '144', y1880: '18 507', y1900: '36 330' },
  { country: 'Русия', y1840: '27', y1880: '22 856', y1900: '53 234' },
  { country: 'Италия', y1840: '20', y1880: '9 290', y1900: '16 429' },
  { country: 'Нидерландия', y1840: '17', y1880: '1 846', y1900: '2 776' },
  { country: 'Швеция', y1840: '–', y1880: '5 876', y1900: '11 303' },
];

const RAIL_SHARE_DATA = [
  { region: 'Европа (без Русия)', y1840: '46,3%', y1880: '37,9%', y1900: '28,4%' },
  { region: 'Великобритания', y1840: '27,0%', y1880: '7,0%', y1900: '4,0%' },
  { region: 'Франция', y1840: '4,7%', y1880: '6,6%', y1900: '4,9%' },
  { region: 'Германия', y1840: '6,2%', y1880: '9,1%', y1900: '6,1%' },
  { region: 'Русия', y1840: '0,4%', y1880: '5,0%', y1900: '5,9%' },
  { region: 'Северна Америка', y1840: '51,7%', y1880: '45,5%', y1900: '45,4%' },
  { region: 'Азия', y1840: '–', y1880: '3,2%', y1900: '7,5%' },
  { region: 'Африка', y1840: '–', y1880: '1,3%', y1900: '2,2%' },
  { region: 'Австралия', y1840: '–', y1880: '2,1%', y1900: '3,2%' },
  { region: 'ОБЩО за света (в км)', y1840: '8 845', y1880: '357 355', y1900: '749 793', highlight: true },
];

const POP_DATA = [
  { country: 'Русия', pop1800: '40 000 000', share1800: '21%', pop1850: '57 000 000', share1850: '21,8%' },
  { country: 'Франция', pop1800: '28 800 000', share1800: '15%', pop1850: '35 800 000', share1850: '13,6%' },
  { country: 'Австрия', pop1800: '28 000 000', share1800: '15%', pop1850: '36 000 000', share1850: '13,7%' },
  { country: 'Германия', pop1800: '23 000 000', share1800: '13%', pop1850: '35 100 000', share1850: '13,0%' },
  { country: 'Италия', pop1800: '18 000 000', share1800: '9,2%', pop1850: '25 000 000', share1850: '9,2%' },
  { country: 'Британски о-ви', pop1800: '16 000 000', share1800: '9%', pop1850: '27 500 000', share1850: '10,5%' },
  { country: 'ОБЩО', pop1800: '153 800 000', share1800: '82,2%', pop1850: '216 400 000', share1850: '81,8%', highlight: true },
];

const INITIAL_STATE = {
  studentName: '',
  studentClass: '8а',
  studentNum: '',
  m1_period: '',
  m1_unit: '',
  m1_leader: '',
  m1_jump: '',
  m1_russia: '',
  m2_uk: '',
  m2_de: '',
  m2_fr: '',
  m2_us: '',
  m2_connection: '',
  m3_uk_km: '',
  m3_overtake: [],
  m3_paradox: '',
  m3_continent: '',
  m4_grow: [],
  m4_drop: '',
  m4_compare: '',
  m4_q1: '',
  m4_q2: '',
};

function scoreOpenText(text, keywordGroups, minLength = 25) {
  const clean = (text || '').toLowerCase().trim();
  if (clean.length < minLength) return 0;

  let matchedGroups = 0;
  for (const group of keywordGroups) {
    if (group.some((kw) => clean.includes(kw))) {
      matchedGroups += 1;
    }
  }

  if (matchedGroups >= 2) return 2;
  if (matchedGroups === 1) return 1;
  return 0;
}

export default function App() {
  const [step, setStep] = useState(0);
  const [selectedYear, setSelectedYear] = useState('1880');
  const [railTab, setRailTab] = useState('abs');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem('history_worksheet_v4');
      return saved ? { ...INITIAL_STATE, ...JSON.parse(saved) } : INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('history_worksheet_v4', JSON.stringify(answers));
    } catch {
      // ignore storage errors
    }
  }, [answers]);

  const updateField = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMulti = (field, value) => {
    setAnswers((prev) => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((item) => item !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const resetAll = () => {
    if (window.confirm('Сигурни ли сте, че искате да изчистите всички попълнени отговори?')) {
      setAnswers(INITIAL_STATE);
      setSubmitted(false);
      setStep(0);
      localStorage.removeItem('history_worksheet_v4');
    }
  };

  const evaluateFullTest = () => {
    let closedPts = 0;
    const checks = {
      m1_period: answers.m1_period === '1840-1888',
      m1_unit: answers.m1_unit === 'abs_hp',
      m1_leader: answers.m1_leader === 'uk',
      m1_jump: answers.m1_jump === 'de',
      m2_uk: Number(answers.m2_uk) === 1570,
      m2_de: Number(answers.m2_de) === 90,
      m2_fr: Number(answers.m2_fr) === 180,
      m2_us: Number(answers.m2_us) === 385,
      m3_uk_km: String(answers.m3_uk_km).replace(/\s+/g, '') === '27689',
      m3_overtake:
        answers.m3_overtake.length === 4 &&
        ['Германия', 'Русия', 'Франция', 'Австрия'].every((c) =>
          answers.m3_overtake.includes(c)
        ),
      m3_continent: answers.m3_continent === 'na',
      m4_grow:
        answers.m4_grow.length === 2 &&
        answers.m4_grow.includes('Британски о-ви') &&
        answers.m4_grow.includes('Русия'),
      m4_drop: answers.m4_drop === 'fr',
    };

    if (checks.m1_period) closedPts += 1;
    if (checks.m1_unit) closedPts += 1;
    if (checks.m1_leader) closedPts += 1;
    if (checks.m1_jump) closedPts += 1;
    if (checks.m2_uk) closedPts += 1;
    if (checks.m2_de) closedPts += 1;
    if (checks.m2_fr) closedPts += 1;
    if (checks.m2_us) closedPts += 1;
    if (checks.m3_uk_km) closedPts += 1;
    if (checks.m3_overtake) closedPts += 2;
    if (checks.m3_continent) closedPts += 1;
    if (checks.m4_grow) closedPts += 2;
    if (checks.m4_drop) closedPts += 1;

    const open_1_5 = scoreOpenText(answers.m1_russia, [
      ['крепостн', '1861', 'селяни', 'феодал', 'свободна работна'],
      ['аграр', 'земедел', 'пазар', 'изостанал', 'капитал', 'индустри'],
    ]);

    const open_2_2 = scoreOpenText(answers.m2_connection, [
      ['машин', 'изработ', 'метал', 'желяз', 'пещ', 'мин'],
      ['жп', 'железниц', 'релс', 'търсен', 'суровин', 'стимулир', 'връзк'],
    ]);

    const open_3_4 = scoreOpenText(answers.m3_paradox, [
      ['остров', 'територи', 'площ', 'малка', 'насищ', 'завърш'],
      ['свят', 'световн', 'сащ', 'русия', 'германия', 'континент', 'другите държави', 'повече'],
    ]);

    const open_4_3 = scoreOpenText(answers.m4_compare, [
      ['не', 'различн', 'индустриал', 'урбанизац', 'смъртност', 'жизнен стандарт'],
      ['раждаемост', 'аграр', 'селск', 'традицион', 'територи', 'патриархал'],
    ]);

    const q1Valid = (answers.m4_q1 || '').trim().length >= 12;
    const q2Valid = (answers.m4_q2 || '').trim().length >= 12;
    const open_4_4 = q1Valid && q2Valid ? 1 : 0;

    const openPts = open_1_5 + open_2_2 + open_3_4 + open_4_3 + open_4_4;
    const totalPts = closedPts + openPts;

    let exactGrade = 2.0;
    if (totalPts >= 8) {
      exactGrade = 3.0 + ((totalPts - 8) / 16) * 3.0;
    }
    const roundedGrade = Math.min(6, Math.max(2, Math.round(exactGrade)));

    let label = 'Слаб';
    let badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
    if (roundedGrade === 6) {
      label = 'Отличен';
      badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    } else if (roundedGrade === 5) {
      label = 'Много добър';
      badgeColor = 'bg-blue-100 text-blue-900 border-blue-300';
    } else if (roundedGrade === 4) {
      label = 'Добър';
      badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
    } else if (roundedGrade === 3) {
      label = 'Среден';
      badgeColor = 'bg-orange-100 text-orange-900 border-orange-300';
    }

    return {
      closedPts,
      openPts,
      totalPts,
      maxPts: 24,
      exactGrade: exactGrade.toFixed(2).replace('.', ','),
      roundedGrade,
      label,
      badgeColor,
      checks,
      openScores: { open_1_5, open_2_2, open_3_4, open_4_3, open_4_4 },
    };
  };

  const generateReportText = () => {
    const res = evaluateFullTest();
    return [
      `РАБОТЕН ЛИСТ: Анализ на статистически данни в историята`,
      `Ученик: ${answers.studentName || 'Непопълнено'} | Клас: ${answers.studentClass} | №: ${answers.studentNum || '-'}`,
      `ОЦЕНКА: ${res.label} ${res.roundedGrade} (${res.exactGrade}) | Общ резултат: ${res.totalPts} / ${res.maxPts} т.`,
      `----------------------------------------`,
      `МОДУЛ 1 (Парни машини): Писмен отговор: ${answers.m1_russia || '(няма отговор)'}`,
      `МОДУЛ 2 (Чугун): Писмен отговор: ${answers.m2_connection || '(няма отговор)'}`,
      `МОДУЛ 3 (ЖП мрежа): Писмен отговор: ${answers.m3_paradox || '(няма отговор)'}`,
      `МОДУЛ 4 (Население): Писмен отговор: ${answers.m4_compare || '(няма отговор)'}`,
    ].join('\n');
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const stepsMeta = [
    { title: 'Начало', icon: BookOpen },
    { title: '1. Парни машини', icon: BarChart3 },
    { title: '2. Чугун', icon: Factory },
    { title: '3. ЖП мрежа', icon: Train },
    { title: '4. Население', icon: Users },
    { title: 'Оценка', icon: Award },
  ];

  const activeSteam = STEAM_DATA.find((d) => d.year === selectedYear) || STEAM_DATA[4];
  const evaluation = evaluateFullTest();

  const OptionButton = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between gap-2 ${
        active
          ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs ring-1 ring-blue-600'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      <span>{children}</span>
      {active && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans selection:bg-blue-100">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                История и цивилизации • Упражнение
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight mt-0.5">
                Анализ на статистически данни
              </h1>
            </div>
            <button
              onClick={resetAll}
              title="Изчисти отговорите"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
            {stepsMeta.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setStep(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-5 space-y-5">
        {step === 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Данни за ученика
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Име и фамилия
                  </label>
                  <input
                    type="text"
                    placeholder="Напр. Иван Петров"
                    value={answers.studentName}
                    onChange={(e) => updateField('studentName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Изберете клас / паралелка
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: '8а', label: '8. а' },
                      { id: '8в', label: '8. в' },
                      { id: '9а', label: '9. а' },
                      { id: '9в', label: '9. в' },
                    ].map((cls) => (
                      <button
                        key={cls.id}
                        type="button"
                        onClick={() => updateField('studentClass', cls.id)}
                        className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition text-center ${
                          answers.studentClass === cls.id
                            ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cls.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Номер в клас
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="35"
                    placeholder="Въведете вашия № в дневника"
                    value={answers.studentNum}
                    onChange={(e) => updateField('studentNum', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50/90 rounded-2xl p-5 border border-amber-200 space-y-3">
              <h3 className="font-bold text-amber-950 text-base">
                Алгоритъм за анализ и скала за оценяване (24 точки)
              </h3>
              <ol className="space-y-2 text-sm text-amber-900 list-decimal pl-4">
                <li>
                  <strong>Паспорт на данните:</strong> Период, пространствен обхват и мерни единици.
                </li>
                <li>
                  <strong>Коментар на динамиката:</strong> Ръст, застой или спад и съотношение между държавите.
                </li>
                <li>
                  <strong>Исторически изводи:</strong> Свържете числата със знанията си за епохата.
                </li>
              </ol>
              <div className="pt-2 border-t border-amber-200/80 text-xs text-amber-900 font-medium">
                Скала: 0–7 т. = Слаб (2) • 8–11 т. = Среден (3) • 12–15 т. = Добър (4) • 16–19 т. = Мн. добър (5) • 20–24 т. = Отличен (6)
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">Задача 1</span>
                <h2 className="text-lg font-bold text-slate-900">
                  Използване на парната машина през XIX в.
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Инсталирани мощности (в хиляди конски сили). Докоснете година, за да видите точните стойности:
                </p>
              </div>

              <div className="grid grid-cols-6 gap-1.5">
                {STEAM_DATA.map((item) => (
                  <button
                    key={item.year}
                    onClick={() => setSelectedYear(item.year)}
                    className={`py-2 rounded-lg text-xs font-bold transition ${
                      selectedYear === item.year
                        ? 'bg-slate-900 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.year}
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                  <span>Година: <strong className="text-slate-900">{activeSteam.year} г.</strong></span>
                  <span>Макс. скала: 2250 хил. к.с.</span>
                </div>

                {[
                  { label: 'Великобритания', val: activeSteam.uk, color: 'bg-purple-600' },
                  { label: 'Германия', val: activeSteam.de, color: 'bg-slate-500' },
                  { label: 'Франция', val: activeSteam.fr, color: 'bg-lime-600' },
                  { label: 'Русия', val: activeSteam.ru, color: 'bg-amber-400' },
                ].map((bar) => (
                  <div key={bar.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{bar.label}</span>
                      <span className="font-mono text-slate-900">{bar.val} хил. к.с.</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${bar.color} rounded-full transition-all duration-300`}
                        style={{ width: `${Math.max((bar.val / 2250) * 100, 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900">Въпроси за анализ</h3>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  1. Какъв е хронологичният обхват на диаграмата? (1 т.)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: '1800-1850', text: '1800 – 1850 г.' },
                    { id: '1840-1888', text: '1840 – 1888 г.' },
                    { id: '1840-1900', text: '1840 – 1900 г.' },
                  ].map((opt) => (
                    <OptionButton
                      key={opt.id}
                      active={answers.m1_period === opt.id}
                      onClick={() => updateField('m1_period', opt.id)}
                    >
                      {opt.text}
                    </OptionButton>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  2. Как са представени данните в графиката? (1 т.)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'abs_hp', text: 'В абсолютни числа (хиляди конски сили)' },
                    { id: 'pct_world', text: 'В проценти от световното производство (%)' },
                    { id: 'tons', text: 'В хиляди тонове произведена продукция' },
                  ].map((opt) => (
                    <OptionButton
                      key={opt.id}
                      active={answers.m1_unit === opt.id}
                      onClick={() => updateField('m1_unit', opt.id)}
                    >
                      {opt.text}
                    </OptionButton>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  3. Коя държава има категорично превъзходство до 60-те години на XIX в.? (1 т.)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'uk', text: 'Великобритания' },
                    { id: 'fr', text: 'Франция' },
                    { id: 'de', text: 'Германия' },
                    { id: 'ru', text: 'Русия' },
                  ].map((opt) => (
                    <OptionButton
                      key={opt.id}
                      active={answers.m1_leader === opt.id}
                      onClick={() => updateField('m1_leader', opt.id)}
                    >
                      {opt.text}
                    </OptionButton>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800">
                  4. Коя държава бележи най-рязък скок след 1870 г. (почти догонвайки лидера)? (1 т.)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'uk', text: 'Великобритания' },
                    { id: 'fr', text: 'Франция' },
                    { id: 'de', text: 'Германия' },
                    { id: 'ru', text: 'Русия' },
                  ].map((opt) => (
                    <OptionButton
                      key={opt.id}
                      active={answers.m1_jump === opt.id}
                      onClick={() => updateField('m1_jump', opt.id)}
                    >
                      {opt.text}
                    </OptionButton>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 space-y-2">
                <label className="block text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <PenLine className="w-4 h-4 text-blue-600 shrink-0" />
                  5. Писмен анализ (2 т.): Защо Русия бележи сравнително нисък ръст при парната енергия през целия период?
                </label>
                <textarea
                  rows={4}
                  placeholder="Напишете своя отговор тук..."
                  value={answers.m1_russia}
                  onChange={(e) => updateField('m1_russia', e.target.value)}
                  className="w-full p-3 rounded-xl border border-blue-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">Задача 2</span>
                <h2 className="text-lg font-bold text-slate-900">
                  Производство на чугун (1830 – 1850 г.)
                </h2>
                <p className="text-xs text-slate-500">В хиляди тонове</p>
              </div>

              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-xs">
                      <th className="p-2.5 text-left rounded-tl-lg">Държава</th>
                      <th className="p-2.5 text-right">1830 г.</th>
                      <th className="p-2.5 text-right">1840 г.</th>
                      <th className="p-2.5 text-right rounded-tr-lg">1850 г.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {PIG_IRON_DATA.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-semibold">{row.country}</td>
                        <td className="p-2.5 text-right font-mono">{row.y1830}</td>
                        <td className="p-2.5 text-right font-mono">{row.y1840}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-blue-700">
                          {row.y1850}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">
                  1. Изчислете абсолютния ръст (1850 г. минус 1830 г.) (4 × 1 т.)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'm2_uk', label: 'Великобритания (2250 − 680)', target: 1570 },
                  { key: 'm2_de', label: 'Германия (210 − 120)', target: 90 },
                  { key: 'm2_fr', label: 'Франция (405 − 225)', target: 180 },
                  { key: 'm2_us', label: 'САЩ (565 − 180)', target: 385 },
                ].map((item) => (
                  <div key={item.key} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {item.label}
                    </label>
                    <input
                      type="number"
                      placeholder="хил. т"
                      value={answers[item.key]}
                      onChange={(e) => updateField(item.key, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 space-y-2">
                <label className="block text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <PenLine className="w-4 h-4 text-blue-600 shrink-0" />
                  2. Писмен анализ (2 т.): Установете причинно-следствената връзка между парната машина и чугуна:
                </label>
                <textarea
                  rows={4}
                  placeholder="Напишете своя отговор тук..."
                  value={answers.m2_connection}
                  onChange={(e) => updateField('m2_connection', e.target.value)}
                  className="w-full p-3 rounded-xl border border-blue-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">Задача 3</span>
                <h2 className="text-lg font-bold text-slate-900">
                  Развитие на железопътната мрежа
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setRailTab('abs')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                    railTab === 'abs' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Таблица 1: Европа (в км)
                </button>
                <button
                  onClick={() => setRailTab('share')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition ${
                    railTab === 'share' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Таблица 2: Свят (в %)
                </button>
              </div>

              {railTab === 'abs' ? (
                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="w-full text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-2 text-left">Държава</th>
                        <th className="p-2 text-right">1840 г.</th>
                        <th className="p-2 text-right">1880 г.</th>
                        <th className="p-2 text-right">1900 г.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {RAIL_ABS_DATA.map((r) => (
                        <tr key={r.country}>
                          <td className="p-2 font-semibold">{r.country}</td>
                          <td className="p-2 text-right font-mono">{r.y1840}</td>
                          <td className="p-2 text-right font-mono">{r.y1880}</td>
                          <td className="p-2 text-right font-mono font-bold">{r.y1900}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="w-full text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-2 text-left">Континент / Държава</th>
                        <th className="p-2 text-right">1840 г.</th>
                        <th className="p-2 text-right">1880 г.</th>
                        <th className="p-2 text-right">1900 г.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {RAIL_SHARE_DATA.map((r) => (
                        <tr
                          key={r.region}
                          className={r.highlight ? 'bg-amber-50 font-bold text-amber-950' : ''}
                        >
                          <td className="p-2">{r.region}</td>
                          <td className="p-2 text-right font-mono">{r.y1840}</td>
                          <td className="p-2 text-right font-mono">{r.y1880}</td>
                          <td className="p-2 text-right font-mono">{r.y1900}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  1. С колко километра нараства жп мрежата на Великобритания от 1840 до 1900 г. (1 т.)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['22 670', '27 689', '32 469'].map((val) => (
                    <OptionButton
                      key={val}
                      active={answers.m3_uk_km === val.replace(/\s+/g, '')}
                      onClick={() => updateField('m3_uk_km', val.replace(/\s+/g, ''))}
                    >
                      {val} км
                    </OptionButton>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  2. Кои 4 европейски държави изпреварват Великобритания до 1900 г.? (2 т.)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Германия', 'Русия', 'Франция', 'Австрия', 'Италия', 'Швеция'].map((c) => (
                    <OptionButton
                      key={c}
                      active={answers.m3_overtake.includes(c)}
                      onClick={() => toggleMulti('m3_overtake', c)}
                    >
                      {c}
                    </OptionButton>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  3. Кой континент държи първенството в световната жп мрежа? (1 т.)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'eu', text: 'Европа (без Русия)' },
                    { id: 'na', text: 'Северна Америка' },
                    { id: 'as', text: 'Азия' },
                  ].map((opt) => (
                    <OptionButton
                      key={opt.id}
                      active={answers.m3_continent === opt.id}
                      onClick={() => updateField('m3_continent', opt.id)}
                    >
                      {opt.text}
                    </OptionButton>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 space-y-2">
                <label className="block text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <PenLine className="w-4 h-4 text-blue-600 shrink-0" />
                  4. Писмено сравнение (2 т.): Защо жп линиите на ВБ растат 12 пъти, но делът ѝ падо от 27% на 4%?
                </label>
                <textarea
                  rows={4}
                  placeholder="Напишете своя отговор тук..."
                  value={answers.m3_paradox}
                  onChange={(e) => updateField('m3_paradox', e.target.value)}
                  className="w-full p-3 rounded-xl border border-blue-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">Задача 4</span>
                <h2 className="text-lg font-bold text-slate-900">
                  Населението на Европа (1800 – 1850 г.)
                </h2>
              </div>

              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-2 text-left">Държава</th>
                      <th className="p-2 text-right">1800 г. (бр.)</th>
                      <th className="p-2 text-right">% Евр.</th>
                      <th className="p-2 text-right">1850 г. (бр.)</th>
                      <th className="p-2 text-right">% Евр.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {POP_DATA.map((r) => (
                      <tr
                        key={r.country}
                        className={r.highlight ? 'bg-slate-100 font-bold' : ''}
                      >
                        <td className="p-2 font-semibold">{r.country}</td>
                        <td className="p-2 text-right font-mono">{r.pop1800}</td>
                        <td className="p-2 text-right font-mono text-slate-600">{r.share1800}</td>
                        <td className="p-2 text-right font-mono">{r.pop1850}</td>
                        <td className="p-2 text-right font-mono font-bold text-blue-700">
                          {r.share1850}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  1. При кои ДВЕ държави нараства относителният дял (%) от населението на Европа? (2 т.)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Британски о-ви', 'Русия', 'Франция', 'Германия'].map((c) => (
                    <OptionButton
                      key={c}
                      active={answers.m4_grow.includes(c)}
                      onClick={() => toggleMulti('m4_grow', c)}
                    >
                      {c}
                    </OptionButton>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  2. Коя държава бележи най-голям спад в относителния си дял (от 15% на 13,6%)? (1 т.)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'fr', text: 'Франция' },
                    { id: 'at', text: 'Австрия' },
                    { id: 'it', text: 'Италия' },
                  ].map((opt) => (
                    <OptionButton
                      key={opt.id}
                      active={answers.m4_drop === opt.id}
                      onClick={() => updateField('m4_drop', opt.id)}
                    >
                      {opt.text}
                    </OptionButton>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 space-y-2">
                <label className="block text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                  <PenLine className="w-4 h-4 text-blue-600 shrink-0" />
                  3. Писмен анализ (2 т.): Еднакви ли са причините за ръста на населението във Великобритания и в Русия?
                </label>
                <textarea
                  rows={4}
                  placeholder="Напишете своя отговор тук..."
                  value={answers.m4_compare}
                  onChange={(e) => updateField('m4_compare', e.target.value)}
                  className="w-full p-3 rounded-xl border border-blue-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  4. Съставете самостоятелно два опорни въпроса към таблицата (1 т.):
                </label>
                <input
                  type="text"
                  placeholder="Въпрос 1..."
                  value={answers.m4_q1}
                  onChange={(e) => updateField('m4_q1', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
                <input
                  type="text"
                  placeholder="Въпрос 2..."
                  value={answers.m4_q2}
                  onChange={(e) => updateField('m4_q2', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Предаване и автоматична оценка</h2>
                  <p className="text-xs text-slate-500">
                    Ученик: {answers.studentName || 'Непопълнено име'} ({answers.studentClass}, № {answers.studentNum || '-'})
                  </p>
                </div>
                <Award className="w-8 h-8 text-amber-500" />
              </div>

              {!submitted ? (
                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-base"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Предай работния лист и виж оценката си
                </button>
              ) : (
                <div className="space-y-4">
                  <div className={`border-2 rounded-2xl p-5 text-center space-y-1 ${evaluation.badgeColor}`}>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                      Крайна оценка от автоматичната проверка
                    </div>
                    <div className="text-3xl sm:text-4xl font-black">
                      {evaluation.label} ({evaluation.roundedGrade})
                    </div>
                    <div className="text-sm font-bold">
                      Точна оценка: {evaluation.exactGrade} • Точки: {evaluation.totalPts} от {evaluation.maxPts} т.
                    </div>
                  </div>

                  <button
                    onClick={handleCopyReport}
                    className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 text-emerald-400" />
                        Резултатът и оценката са копирани!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Копирай оценката и отговорите за учителя
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 px-4 py-3 z-30">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl font-semibold text-sm border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Предишна
          </button>

          <span className="text-xs font-semibold text-slate-400">
            Стъпка {step + 1} от {stepsMeta.length}
          </span>

          {step < stepsMeta.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(stepsMeta.length - 1, s + 1))}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
            >
              Следваща
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Копирано!' : 'Копирай'}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
