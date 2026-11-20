// Competition rules: short summaries (kz / ru / en) + download links.
// Sources: official rules in public/docs (Kazakh originals).
window.RULES = [
  {
    id: 'zerde',
    title: { kz: '«Зерде»', ru: '«Зерде»', en: 'Zerde' },
    grades: { kz: '2–8 сынып', ru: '2–8 классы', en: 'Grades 2–8' },
    lead: {
      kz: '«Дарын» РҒПО өткізетін зерттеу жобалары мен шығармашылық жұмыстардың республикалық конкурсы. Ережелер 2026 жылғы 9 қыркүйекте бекітілген.',
      ru: 'Республиканский конкурс исследовательских проектов и творческих работ, который проводит РНПЦ «Дарын». Правила утверждены 9 сентября 2026 года.',
      en: 'National competition of research projects and creative works run by the Daryn Republican Center. Rules approved on 9 September 2026.',
    },
    file: 'docs/zerde-erezheleri-kz.pdf',
    drive: 'https://drive.google.com/file/d/1MlCt8q_Wv1pclWbwdsRJDopJr7SnOCCN/view',
    blocks: [
      {
        h: { kz: 'Кім қатыса алады', ru: 'Кто участвует', en: 'Who can take part' },
        kz: ['«Бастауыш буын» санаты — 2–4 сынып, «Орта буын» санаты — 5–8 сынып (TD оқушылары — 7–8 сынып).', 'Жеке жұмыс немесе екі оқушыдан тұратын команда; команда мүшелері бір санатта болуы тиіс.', 'Республикалық кезеңде оқушы тек бір жұмыстың авторы бола алады.'],
        ru: ['Категория «Младшее звено» — 2–4 классы, «Среднее звено» — 5–8 классы (ученики TD — 7–8 классы).', 'Индивидуальная работа или команда из двух учеников одной категории.', 'На республиканском этапе ученик может быть автором только одной работы.'],
        en: ['“Junior” category — grades 2–4, “Middle” category — grades 5–8 (TD students are in grades 7–8).', 'Individual work or a team of two students from the same category.', 'At the national stage a student may author only one work.'],
      },
      {
        h: { kz: 'Кезеңдер', ru: 'Этапы', en: 'Stages' },
        kz: ['I — мектептік, II — аудандық (қалалық), III — облыстық, IV — республикалық («Дарын» РҒПО).', 'IV кезеңге әр секция мен санаттан III кезеңде 1-орын алған бір жұмыс жіберіледі.'],
        ru: ['I — школьный, II — районный (городской), III — областной, IV — республиканский (РНПЦ «Дарын»).', 'На IV этап от каждой секции и категории направляется одна работа, занявшая 1 место на III этапе.'],
        en: ['I — school, II — district (city), III — regional, IV — national (Daryn Center).', 'One first-place work per section and category from stage III goes on to stage IV.'],
      },
      {
        h: { kz: 'Секциялар', ru: 'Секции', en: 'Sections' },
        kz: ['Жаратылыстану-математикалық бағыт: математика және қолданбалы математика; физика, ғарыш және Жер туралы ғылымдар; туризм, спорт және өмір қауіпсіздігі; химия және биология; информатика, ЖИ, робототехника және STEM-инженерия; экология, адам денсаулығы және психология.', 'Қоғамдық-гуманитарлық бағыт: қазақ тілі мен әдебиеті; орыс тілі мен әдебиеті; шет тілдері; тарих, өлкетану, құқықтық және азаматтық сауаттылық; этномәдениеттану және мәдени мұра; технология, өнер, дизайн және креативті индустриялар.'],
        ru: ['Естественно-математическое направление: математика и прикладная математика; физика, космос и науки о Земле; туризм, спорт и безопасность жизнедеятельности; химия и биология; информатика, ИИ, робототехника и STEM-инженерия; экология, здоровье человека и психология.', 'Общественно-гуманитарное направление: казахский язык и литература; русский язык и литература; иностранные языки; история, краеведение, правовая и гражданская грамотность; этнокультуроведение и культурное наследие; технология, искусство, дизайн и креативные индустрии.'],
        en: ['Science & math track: mathematics and applied mathematics; physics, space and Earth sciences; tourism, sport and life safety; chemistry and biology; computer science, AI, robotics and STEM engineering; ecology, human health and psychology.', 'Social sciences & humanities track: Kazakh language and literature; Russian language and literature; foreign languages; history, local studies, legal and civic literacy; ethnocultural studies and heritage; technology, art, design and creative industries.'],
      },
      {
        h: { kz: 'Жұмысқа қойылатын талаптар', ru: 'Требования к работе', en: 'Work requirements' },
        kz: ['Мәселе, мақсат, міндеттер және қажет болса болжам нақты көрсетіледі; кемінде бір зерттеу әдісі қолданылады.', 'Деректер кесте, диаграмма немесе сурет түрінде беріледі; қорытынды мен «мен не үйрендім, нені жетілдіремін?» рефлексиясы болуы керек.', 'Кемінде үш сенімді дереккөз және зерттеу күнделігі міндетті.', 'Тілі — қазақ немесе орыс. А4, Times New Roman 14, интервал 1,5, абзац 1,25 см, жиектер: сол 3 см, қалғаны 2 см.', '«Орта буын» үшін негізгі мәтін — 30 беттен, аннотация — 200 сөзден аспайды.'],
        ru: ['Чётко указаны проблема, цель, задачи и при необходимости гипотеза; применяется хотя бы один метод исследования.', 'Данные представлены таблицами, диаграммами или рисунками; есть вывод и рефлексия «чему я научился, что улучшу?».', 'Обязательны минимум три надёжных источника и дневник исследования.', 'Язык — казахский или русский. А4, Times New Roman 14, интервал 1,5, абзац 1,25 см, поля: левое 3 см, остальные 2 см.', 'Для «Среднего звена» основной текст — не более 30 страниц, аннотация — не более 200 слов.'],
        en: ['The problem, aim, objectives and (if needed) hypothesis are clearly stated; at least one research method is used.', 'Data is shown in tables, charts or pictures; there is a conclusion and a reflection “what did I learn, what will I improve?”.', 'At least three reliable sources and a research diary are required.', 'Language: Kazakh or Russian. A4, Times New Roman 14 pt, 1.5 spacing, 1.25 cm indent, margins: left 3 cm, others 2 cm.', 'For the Middle category: main text up to 30 pages, abstract up to 200 words.'],
      },
      {
        h: { kz: 'Құжаттар (IV кезең)', ru: 'Документы (IV этап)', en: 'Documents (stage IV)' },
        kz: ['Жұмыс, аннотация, ғылыми жетекшінің пікірі, антиплагиат анықтамасы, ЖИ пайдалану туралы декларация, этика және қауіпсіздік бақылау парағы, зерттеу күнделігі; командаға — авторлық үлес парағы.', 'Әр құжат — 10 МБ-тан аспайтын жеке PDF файл.'],
        ru: ['Работа, аннотация, отзыв научного руководителя, справка антиплагиата, декларация об использовании ИИ, чек-лист по этике и безопасности, дневник исследования; для команды — лист авторского вклада.', 'Каждый документ — отдельный PDF не больше 10 МБ.'],
        en: ['The work, abstract, supervisor’s review, plagiarism-check report, AI-use declaration, ethics & safety checklist, research diary; for teams — an author-contribution sheet.', 'Each document is a separate PDF up to 10 MB.'],
      },
      {
        h: { kz: 'Жасанды интеллект', ru: 'Искусственный интеллект', en: 'Artificial intelligence' },
        kz: ['Рұқсат: идеяны нақтылау, дереккөз іздеу, мәтінді редакциялау және аудару, кодтағы қатені табу, өз деректеріңді визуализациялау — бәрі декларацияда көрсетіледі.', 'Тыйым салынады: ЖИ-мен дайын мәтін, деректер, қорытынды, фото жасау, жалған дереккөздер, ЖИ пайдалануды жасыру.', 'Қағидат: «Шешімді адам қабылдайды – жасанды интеллект тек көмектеседі».'],
        ru: ['Можно: уточнить идею, искать источники, редактировать и переводить свой текст, искать ошибки в коде, визуализировать собственные данные — всё указывается в декларации.', 'Нельзя: генерировать ИИ готовый текст, данные, выводы, фото, выдумывать источники, скрывать использование ИИ.', 'Принцип: «Решение принимает человек — ИИ только помогает».'],
        en: ['Allowed: refining your idea, finding sources, editing and translating your own text, debugging code, visualising your own data — all listed in the declaration.', 'Not allowed: AI-generated text, data, conclusions or photos, fake sources, hiding AI use.', 'Principle: “A human makes the decisions — AI only helps.”'],
      },
      {
        h: { kz: 'Қорғау және бағалау', ru: 'Защита и оценка', en: 'Defence and scoring' },
        kz: ['Көрме-жәрмеңке: үш бөлікті стенд (60×80 см және 2×30×80 см, ашық күйде 120×80 см); стендте аты-жөні, мектеп, өңір көрсетілмейді.', 'Баяндама 5–7 минут, сұрақтарға 3 минут.', '100 балл, 8 критерий: мәселе (10), мақсат және логика (10), әдістер мен қауіпсіздік (15), деректер мен нәтижелер (20), құжаттау, дереккөздер, ЖИ (15), қорытынды және рефлексия (10), презентация (10), сұрақтарға жауап және авторлық үлес (10).', 'I дәрежелі диплом — 90–100, II — 80–89,99, III — 70–79,99, «Дарын» грамотасы — 60–69,99 балл. Дипломдар қатысушылардың 60%-ынан аспайды.'],
        ru: ['Выставка-ярмарка: стенд из трёх панелей (60×80 см и 2×30×80 см, в раскрытом виде 120×80 см); на стенде нет имён, школы и региона.', 'Доклад 5–7 минут, ответы на вопросы — 3 минуты.', '100 баллов, 8 критериев: проблема (10), цель и логика (10), методы и безопасность (15), данные и результаты (20), документирование, источники, ИИ (15), выводы и рефлексия (10), презентация (10), ответы на вопросы и авторский вклад (10).', 'Диплом I степени — 90–100, II — 80–89,99, III — 70–79,99, грамота «Дарын» — 60–69,99 балла. Дипломов не более 60% участников.'],
        en: ['Exhibition format: a three-panel stand (60×80 cm plus 2×30×80 cm, 120×80 cm unfolded); no names, school or region on the stand.', 'Talk 5–7 minutes, questions 3 minutes.', '100 points, 8 criteria: problem (10), aim and logic (10), methods and safety (15), data and results (20), documentation, sources, AI (15), conclusions and reflection (10), presentation (10), answers and personal contribution (10).', '1st-degree diploma — 90–100, 2nd — 80–89.99, 3rd — 70–79.99, Daryn certificate of merit — 60–69.99 points. Diplomas go to at most 60% of participants.'],
      },
      {
        h: { kz: 'Қабылданбайды', ru: 'Не допускается', en: 'Not allowed' },
        kz: ['Деректерді бұрмалау, өзгенің жұмысын иемдену, толық ЖИ жасаған жұмыс, бұрын ұсынылған жұмысты өзгеріссіз қайта ұсыну, жануарларға және денсаулыққа зиян келтіретін тәжірибелер.'],
        ru: ['Фальсификация данных, присвоение чужой работы, работа, целиком сделанная ИИ, повторная подача ранее представленной работы без существенных изменений, опыты, вредящие животным и здоровью.'],
        en: ['Falsified data, someone else’s work, work fully made by AI, resubmitting an earlier work without substantial changes, experiments harmful to animals or health.'],
      },
    ],
  },
  {
    id: 'proeco',
    title: { kz: '«ProEco»', ru: '«ProEco»', en: 'ProEco' },
    grades: { kz: '5–8 сынып', ru: '5–8 классы', en: 'Grades 5–8' },
    lead: {
      kz: '«Дарын» РҒПО өткізетін экологиялық жобалардың республикалық конкурсы. Мақсаты — экологияға қызығатын, зерттеу қабілеті жоғары оқушыларды анықтау және қолдау.',
      ru: 'Республиканский конкурс экологических проектов РНПЦ «Дарын». Цель — найти и поддержать учеников, которым интересна экология и которые умеют исследовать.',
      en: 'National environmental project competition run by the Daryn Center. It aims to find and support students who care about ecology and can do research.',
    },
    file: 'docs/proeco-erezhesi-kz.pdf',
    drive: 'https://drive.google.com/file/d/1olnp-yjO5ou-s54U8b7FbW96_0kQ31YK/view',
    blocks: [
      {
        h: { kz: 'Кезеңдер', ru: 'Этапы', en: 'Stages' },
        kz: ['I — аудандық / қалалық, II — облыстық (іріктеу), III — республикалық қорытынды кезең.', 'I кезеңге өтінімді мектеп білім бөліміне тапсырады.', 'Апелляция қарастырылмайды.'],
        ru: ['I — районный / городской, II — областной (отборочный), III — республиканский финал.', 'Заявку на I этап школа подаёт в отдел образования.', 'Апелляции не рассматриваются.'],
        en: ['I — district / city, II — regional (qualifying), III — national final.', 'The school submits applications for stage I to the education department.', 'Appeals are not accepted.'],
      },
      {
        h: { kz: '4 бағыт', ru: '4 направления', en: '4 categories' },
        kz: ['«Туған өлке табиғаты» — виртуалды экскурсия, 3D-модель, интерактивті карта, фотоесеп, инфографика (жеке жоба).', '«Мені қоршаған әлем – ғажайып әлем» — бейнетүсірілім, фотоэссе, иллюстрацияланған әңгіме, шағын деректі фильм (жеке жоба).', '«Үздік экологиялық бастама» — зерттеу жобасы (мәтін, инфографика), макет, экодизайн (жеке немесе 2 адамға дейінгі команда).', '«Таза қала сізден басталады» — экоакциялар, көгалдандыру, фото/бейне есеп, «бұрын/кейін» кадрлары (жеке жоба).'],
        ru: ['«Природа родного края» — виртуальная экскурсия, 3D-модель, интерактивная карта, фотоотчёт, инфографика (индивидуально).', '«Мир вокруг меня — удивительный мир» — видеосъёмка, фотоэссе, иллюстрированный рассказ, мини-документальный фильм (индивидуально).', '«Лучшая экологическая инициатива» — исследовательский проект (текст, инфографика), макет, экодизайн (индивидуально или команда до 2 человек).', '«Чистый город начинается с тебя» — экоакции, озеленение, фото- и видеоотчёт, кадры «до/после» (индивидуально).'],
        en: ['“Nature of my homeland” — virtual tour, 3D model, interactive map, photo report, infographic (individual).', '“The world around me is a wonderful world” — video, photo essay, illustrated story, short documentary (individual).', '“Best eco initiative” — research project (text, infographic), mock-up, eco-design (individual or a team of up to 2).', '“A clean city starts with you” — eco campaigns, greening, photo/video report, before/after shots (individual).'],
      },
      {
        h: { kz: 'Талаптар және қорғау', ru: 'Требования и защита', en: 'Requirements and defence' },
        kz: ['Әр жұмыста автордың аты-жөні, мектебі және жасалған күні көрсетіледі.', '«Үздік бастамада» экологиялық мәселенің талдауы мен шешу жолдары болуы керек.', 'Сөз сөйлеу — 7–8 минут, қазылардың сұрақтарына — 3–5 минут.'],
        ru: ['В каждой работе указываются ФИО автора, школа и дата создания.', 'В «Лучшей инициативе» нужен анализ экологической проблемы и пути её решения.', 'Выступление — 7–8 минут, ответы на вопросы жюри — 3–5 минут.'],
        en: ['Every work shows the author’s name, school and creation date.', 'The “Best eco initiative” must analyse an environmental problem and propose solutions.', 'Talk 7–8 minutes, jury questions 3–5 minutes.'],
      },
      {
        h: { kz: 'Бағалау (100 балл)', ru: 'Оценка (100 баллов)', en: 'Scoring (100 points)' },
        kz: ['Әр бағыттың өз критерийлері бар. Мысалы, «Үздік экологиялық бастама»: практикалық маңыздылығы (20), жаңашылдығы (20), мәселенің зерттелу деңгейі (15), ұсынылу сапасы (15), безендірілуі (15), әлеуметтік маңыздылығы (15).', '«Туған өлке табиғаты»: тақырыпқа сәйкестігі (20), интерактивтілігі және көрнекілігі (20), зерттеу тереңдігі, композиция, креативтілік, техникалық сапа (әрқайсысы 15).'],
        ru: ['У каждого направления свои критерии. Например, «Лучшая инициатива»: практическая значимость (20), новизна (20), глубина исследования проблемы (15), качество представления (15), оформление (15), социальная значимость (15).', '«Природа родного края»: соответствие теме (20), интерактивность и наглядность (20), глубина исследования, композиция, креативность, техническое качество (по 15).'],
        en: ['Each category has its own criteria. E.g. “Best eco initiative”: practical value (20), novelty (20), depth of research (15), presentation quality (15), design (15), social value (15).', '“Nature of my homeland”: relevance (20), interactivity and visuals (20), research depth, composition, creativity, technical quality (15 each).'],
      },
      {
        h: { kz: 'Марапаттау', ru: 'Награждение', en: 'Awards' },
        kz: ['Жеңімпаздар 4 бағыт бойынша анықталады; қатысушылардың 45%-ы I, II, III дәрежелі дипломдармен және «Дарын» грамоталарымен марапатталады.', 'Барлық қатысушыға сертификат беріледі.', 'Финал күндері тұру мен тамақтану — «Дарын» есебінен, жол шығыны — жіберуші тарап есебінен.', 'Байланыс: info@daryn.kz, +7 (7172) 57-65-63.'],
        ru: ['Победители определяются по 4 направлениям; 45% участников награждаются дипломами I, II, III степени и грамотами «Дарын».', 'Все участники получают сертификаты.', 'Проживание и питание в дни финала — за счёт «Дарын», проезд — за счёт направляющей стороны.', 'Контакты: info@daryn.kz, +7 (7172) 57-65-63.'],
        en: ['Winners are chosen in each of the 4 categories; 45% of participants receive 1st–3rd degree diplomas and Daryn certificates of merit.', 'All participants receive a certificate.', 'Accommodation and meals during the final are covered by Daryn; travel is paid by the sending side.', 'Contacts: info@daryn.kz, +7 (7172) 57-65-63.'],
      },
    ],
  },
  {
    id: 'general',
    title: { kz: 'Ғылыми жобалар конкурсы (жалпы)', ru: 'Конкурс научных проектов (общий)', en: 'Science Project Competition (general)' },
    grades: { kz: '9–11 сынып', ru: '9–11 классы', en: 'Grades 9–11' },
    lead: {
      kz: 'Жалпы білім беретін пәндер бойынша республикалық ғылыми жобалар конкурсы. ҚР БҒМ 2012 жылғы 13 наурыздағы № 99 бұйрығының 3-қосымшасы.',
      ru: 'Республиканский конкурс научных проектов по общеобразовательным предметам. Приложение 3 к приказу МОН РК № 99 от 13 марта 2012 года.',
      en: 'National science project competition in general-education subjects. Annex 3 to Order No. 99 of the Ministry of Education (13 March 2012).',
    },
    file: 'docs/gylymi-zhobalar-99-buiryq-kz.pdf',
    drive: 'https://drive.google.com/file/d/11WW6Axt9RTub82zX4_0YJ8N_YcKTTYws/view',
    blocks: [
      {
        h: { kz: 'Кім қатыса алады', ru: 'Кто участвует', en: 'Who can take part' },
        kz: ['9–11 сынып оқушылары, ғылыми жетекшінің немесе оқушылардың ғылыми қоғамының ұсынуымен; жұмысты бір немесе екі оқушы орындайды.', 'Зерттеу тақырыбы «Дарын» РҒПО-да тиісті жылдың 20 қыркүйегінен кешіктірілмей тіркеледі.'],
        ru: ['Ученики 9–11 классов по представлению научного руководителя или научного общества учащихся; работу выполняют один или два ученика.', 'Тема исследования регистрируется в РНПЦ «Дарын» не позднее 20 сентября текущего года.'],
        en: ['Students of grades 9–11 nominated by a supervisor or the student science society; one or two authors per work.', 'The research topic must be registered with the Daryn Center no later than 20 September.'],
      },
      {
        h: { kz: 'Кезеңдер', ru: 'Этапы', en: 'Stages' },
        kz: ['1 — мектептік / аудандық.', '2 — іріктеу алдындағы: I тур — жобаны қорғау, II тур — бейіндік пән бойынша тест: 60 сұрақ, 120 балл, 2 сағат. Келесі кезеңге кемінде 50% (60 балл) жинағандар өтеді; командада — авторлардың орташа баллы.', '3 — іріктеу (алдын ала сараптама): жаратылыстану-математика — «Дарын» РҒПО, қоғамдық-гуманитарлық — облыс.', '4 — республикалық: жобаны қорғау, баяндамаға 10–15 минут.'],
        ru: ['1 — школьный / районный.', '2 — предотборочный: I тур — защита проекта, II тур — тест по профильному предмету: 60 вопросов, 120 баллов, 2 часа. Дальше проходят набравшие не менее 50% (60 баллов); для команды — средний балл авторов.', '3 — отборочный (предварительная экспертиза): естественно-математическое направление — РНПЦ «Дарын», общественно-гуманитарное — область.', '4 — республиканский: защита проекта, на доклад 10–15 минут.'],
        en: ['1 — school / district.', '2 — pre-qualifying: round I — project defence, round II — test in the core subject: 60 questions, 120 points, 2 hours. At least 50% (60 points) is needed to advance; for teams — the authors’ average.', '3 — qualifying (expert review): science & math — Daryn Center, humanities — regional level.', '4 — national: project defence, 10–15 minutes for the talk.'],
      },
      {
        h: { kz: '16 секция', ru: '16 секций', en: '16 sections' },
        kz: ['Физика, Техника, Жер және ғарыш туралы ғылымдар, Математика, Қолданбалы математика, Информатика, Экономика, Биология, Химия, Қоршаған ортаны қорғау және адам денсаулығын сақтау, Тарих, Адам және қоғам, Өлкетану, Әдебиет, Этномәдениеттану, Тіл білімі.', 'Әр секция бойынша сынама тестті «Тест» бетінде тапсыруға болады.'],
        ru: ['Физика, Техника, Науки о Земле и космосе, Математика, Прикладная математика, Информатика, Экономика, Биология, Химия, Охрана окружающей среды и здоровья человека, История, Человек и общество, Краеведение, Литература, Этнокультуроведение, Языкознание.', 'Пробный тест по каждой секции можно пройти на странице «Тест».'],
        en: ['Physics, Engineering, Earth and Space Sciences, Mathematics, Applied Mathematics, Computer Science, Economics, Biology, Chemistry, Environmental Protection and Human Health, History, Humans and Society, Local Studies, Literature, Ethnocultural Studies, Linguistics.', 'A practice test for every section is on the “Test” page.'],
      },
      {
        h: { kz: 'Жұмыстың құрылымы', ru: 'Структура работы', en: 'Structure of the work' },
        kz: ['Титул парағы, мазмұны, абстракт (250 сөзге дейін; қазақ немесе орыс тілінде және ағылшынша), кіріспе (2 беттен аспайды), зерттеу бөлімі (кемінде 20 бет), қорытынды (1 беттен аспайды), әдебиеттер тізімі.', 'Абстрактта: мақсат, болжам, кезеңдер, әдістеме, жаңалық, нәтиже және қолдану саласы.', 'Әдебиетке сілтеме — төртбұрышты жақшада; ғылыми жетекшінің пікірі қоса беріледі.'],
        ru: ['Титульный лист, содержание, абстракт (до 250 слов; на казахском или русском и на английском), введение (не более 2 страниц), исследовательская часть (не менее 20 страниц), заключение (не более 1 страницы), список литературы.', 'В абстракте: цель, гипотеза, этапы, методика, новизна, результаты и область применения.', 'Ссылки на литературу — в квадратных скобках; прилагается отзыв научного руководителя.'],
        en: ['Title page, contents, abstract (up to 250 words; in Kazakh or Russian and in English), introduction (up to 2 pages), research part (at least 20 pages), conclusion (up to 1 page), references.', 'The abstract covers the aim, hypothesis, stages, methods, novelty, results and applications.', 'References go in square brackets; the supervisor’s review is attached.'],
      },
      {
        h: { kz: 'Стенд', ru: 'Стенд', en: 'Poster stand' },
        kz: ['135×125 см стенд. Жоғарғы жағында — абстракт, қатысушының аты, жасы, мектебі, қаласы, облысы; төменде — нөмірленген кестелер, фото, диаграммалар және қорытындылар.'],
        ru: ['Стенд 135×125 см. Сверху — абстракт, имя, возраст, школа, город и область участника; ниже — пронумерованные таблицы, фото, диаграммы и выводы.'],
        en: ['A 135×125 cm stand. At the top: abstract, participant’s name, age, school, city and region; below: numbered tables, photos, charts and conclusions.'],
      },
      {
        h: { kz: 'Қабылданбайды', ru: 'Не допускается', en: 'Not allowed' },
        kz: ['Кәмелетке толмағандарға рұқсат етілмеген аспаптар, жануарларға қатігездік, улы, радиоактивті заттар, патогендер, ішімдік, никотинмен жұмыстар.', 'Республикалық жарыстарда бұрын қорғалған жұмыстар, ғылыми жалғандық, өзгенің жұмысын өзінікі ретінде ұсыну.'],
        ru: ['Приборы, запрещённые для несовершеннолетних, жестокость к животным, работа с ядовитыми и радиоактивными веществами, патогенами, алкоголем, никотином.', 'Работы, уже защищённые на республиканских конкурсах, научная фальсификация, выдача чужой работы за свою.'],
        en: ['Equipment not allowed for minors, cruelty to animals, toxic or radioactive substances, pathogens, alcohol, nicotine.', 'Works already defended at national competitions, scientific fraud, presenting someone else’s work as your own.'],
      },
      {
        h: { kz: 'Марапаттау', ru: 'Награждение', en: 'Awards' },
        kz: ['Облыстық кезең — I, II, III дәрежелі дипломдар.', 'Республикалық кезеңде жеңімпаздар — әр секция қатысушыларының 45%-ы: олардың 20%-ы — I, 30%-ы — II, 50%-ы — III дәрежелі диплом.'],
        ru: ['Областной этап — дипломы I, II, III степени.', 'На республиканском этапе победители — 45% участников секции: из них 20% получают диплом I степени, 30% — II, 50% — III.'],
        en: ['Regional stage — 1st, 2nd and 3rd degree diplomas.', 'At the national stage, 45% of a section’s participants win: 20% of them get 1st-degree, 30% 2nd-degree and 50% 3rd-degree diplomas.'],
      },
    ],
  },
];

// Practice test sections (titles in three languages)
window.TEST_SECTIONS = {
  1: { kz: 'Физика', ru: 'Физика', en: 'Physics' },
  2: { kz: 'Техника', ru: 'Техника', en: 'Engineering' },
  3: { kz: 'Жер және ғарыш туралы ғылымдар', ru: 'Науки о Земле и космосе', en: 'Earth and Space Sciences' },
  4: { kz: 'Математика', ru: 'Математика', en: 'Mathematics' },
  5: { kz: 'Қолданбалы математика', ru: 'Прикладная математика', en: 'Applied Mathematics' },
  6: { kz: 'Информатика', ru: 'Информатика', en: 'Computer Science' },
  7: { kz: 'Экономика', ru: 'Экономика', en: 'Economics' },
  8: { kz: 'Биология', ru: 'Биология', en: 'Biology' },
  9: { kz: 'Химия', ru: 'Химия', en: 'Chemistry' },
  10: { kz: 'Қоршаған ортаны қорғау және адам денсаулығын сақтау', ru: 'Охрана окружающей среды и здоровья человека', en: 'Environmental Protection and Human Health' },
  11: { kz: 'Тарих', ru: 'История', en: 'History' },
  12: { kz: 'Адам және қоғам', ru: 'Человек и общество', en: 'Humans and Society' },
  13: { kz: 'Өлкетану', ru: 'Краеведение', en: 'Local Studies' },
  14: { kz: 'Әдебиет', ru: 'Литература', en: 'Literature' },
  15: { kz: 'Этномәдениеттану', ru: 'Этнокультуроведение', en: 'Ethnocultural Studies' },
  16: { kz: 'Тіл білімі', ru: 'Языкознание', en: 'Linguistics' },
};
