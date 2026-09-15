/**
 * Global HR public copy (English / Japanese / Korean / Russian).
 * Locked meaning:
 *   ja: 人材紹介 — never 人材派遣
 *   ko: 인력소개 — never 파견
 *   ru: подбор персонала — never аутстаффинг / лизинг персонала
 * Singapore EA licence wording stays explicit. No other-country licence implied.
 */
(function (window, document) {
  var LANG_KEY = "globalhr_lang";
  var listeners = [];

  var STRINGS = {
    "meta.homeTitle": {
      en: "Global HR | Recruitment Agency — Asia-Pacific & Beyond",
      ja: "Global HR｜アジア太平洋地域の人材紹介会社",
    },
    "meta.homeDesc": {
      en: "Global HR connects top talent with trusted employers across Asia-Pacific & beyond, including Dubai, Abu Dhabi, Oman, and Doha.",
      ja: "Global HRは、アジア太平洋地域およびその先で、企業と人材をつなぐ人材紹介会社です。",
    },
    "meta.aboutTitle": { en: "About Us | Global HR", ja: "会社概要 | Global HR" },
    "meta.aboutDesc": {
      en: "Learn about Global HR — recruitment across Asia-Pacific & beyond, including China and India.",
      ja: "Global HRについて — アジア太平洋地域およびその先での人材紹介。中国・インドを含みます。",
    },
    "meta.servicesTitle": { en: "Industries | Global HR", ja: "業界 | Global HR" },
    "meta.servicesDesc": {
      en: "Industries Global HR serves across Asia-Pacific & beyond — construction, marine shipyard, manufacturing, hospitality, healthcare, and more.",
      ja: "Global HRが対応する業界（アジア太平洋地域およびその先）— 建設、マリン・シップヤード、製造、ホスピタリティ、ヘルスケアなど。",
    },
    "meta.trainingTitle": {
      en: "Training & Certification | Global HR",
      ja: "研修・資格取得支援 | Global HR",
    },
    "meta.trainingDesc": {
      en: "Training and certification programs for employers and professionals across Asia-Pacific & beyond.",
      ja: "採用企業および求職者向けの研修・資格取得支援（アジア太平洋地域およびその先）。",
    },
    "meta.newsTitle": { en: "Updates | Global HR", ja: "最新情報 | Global HR" },
    "meta.newsDesc": {
      en: "Latest updates from Global HR — activities, arrivals, training, job openings, and partnerships across Asia-Pacific.",
      ja: "Global HRの最新情報 — 活動、到着、研修、求人、パートナーシップ。",
    },
    "meta.contactTitle": { en: "Contact | Global HR", ja: "お問い合わせ | Global HR" },
    "meta.contactDesc": {
      en: "Contact Global HR — offices across Asia-Pacific & beyond.",
      ja: "Global HRへのお問い合わせ — アジア太平洋地域のオフィス。",
    },
    "meta.subscribeTitle": { en: "Get Job Alerts | Global HR", ja: "求人お知らせ | Global HR" },
    "meta.subscribeDesc": {
      en: "Sign up for Global HR job alerts — leave your email and phone to hear about new openings across Asia-Pacific & beyond.",
      ja: "Global HRの求人お知らせに登録 — 新しい求人のご案内をメールまたは電話でお届けします。",
    },

    "nav.home": { en: "Home", ja: "ホーム" },
    "nav.about": { en: "About Us", ja: "会社概要" },
    "nav.services": { en: "Industries", ja: "業界" },
    "nav.training": { en: "Highlights", ja: "ハイライト" },
    "nav.updates": { en: "Updates", ja: "最新情報" },
    "nav.contact": { en: "Contact", ja: "お問い合わせ" },
    "nav.aboutGroup": { en: "About Global HR", ja: "Global HRについて" },
    "nav.whoWeAre": { en: "Who we are", ja: "私たちについて" },
    "nav.history": { en: "Our history", ja: "沿革" },
    "nav.success": { en: "Success stories", ja: "実績紹介" },
    "nav.licences": { en: "Licences & credentials", ja: "免許・登録" },
    "nav.values": { en: "Our Core Values", ja: "コアバリュー" },
    "nav.peoplePlaces": { en: "People & places", ja: "拠点・体制" },
    "nav.offices": { en: "Our offices", ja: "オフィス" },
    "nav.leadership": { en: "Leadership team", ja: "経営陣" },
    "nav.contactUs": { en: "Contact us", ja: "お問い合わせ" },
    "nav.whoWeHelp": { en: "Who we help", ja: "対象のお客様" },
    "nav.jobSeekers": { en: "For job seekers", ja: "求職者の方へ" },
    "nav.employers": { en: "For employers", ja: "採用企業の方へ" },
    "nav.industries": { en: "Industries we serve", ja: "対応業界" },
    "nav.sector": { en: "Sector", ja: "業種" },
    "nav.country": { en: "Country", ja: "国" },
    "nav.arrival": { en: "Employee Arrival", ja: "従業員の到着" },
    "nav.twi": { en: "TWI partnership", ja: "TWI提携" },
    "nav.getStarted": { en: "Get started", ja: "ご利用開始" },
    "nav.howItWorks": { en: "How it works", ja: "ご利用の流れ" },
    "nav.trainingCert": { en: "Training & certification", ja: "研修・資格取得支援" },
    "nav.viewUpdates": { en: "View updates", ja: "最新情報を見る" },
    "nav.programs": { en: "Programs", ja: "プログラム" },
    "nav.overview": { en: "Overview", ja: "概要" },
    "nav.trainingPrograms": { en: "Training programs", ja: "研修プログラム" },
    "nav.scaffolding": { en: "Scaffolding training", ja: "足場組立研修" },
    "nav.interviewBriefings": { en: "Interview briefings", ja: "面接ブリーフィング" },
    "nav.galleryEnquiries": { en: "Gallery & enquiries", ja: "ギャラリー・お問い合わせ" },
    "nav.photoGallery": { en: "Photo gallery", ja: "フォトギャラリー" },
    "nav.bookTraining": { en: "Book training", ja: "研修のお申し込み" },
    "nav.viewAllPrograms": { en: "View all programs", ja: "すべてのプログラム" },
    "nav.browseUpdates": { en: "Browse updates", ja: "最新情報を見る" },
    "nav.allUpdates": { en: "All updates", ja: "すべての最新情報" },
    "nav.jobOpenings": { en: "Job openings", ja: "求人情報" },
    "nav.exhibitions": { en: "Exhibitions & events", ja: "展示会・イベント" },
    "nav.arrivals": { en: "Arrivals & mobilisation", ja: "到着・赴任" },
    "nav.stayInformed": { en: "Stay informed", ja: "情報を受け取る" },
    "nav.jobAlerts": { en: "Get job alerts", ja: "求人お知らせ" },
    "nav.viewAll": { en: "View all", ja: "すべて見る" },
    "nav.showMenu": { en: "Show {label} menu", ja: "{label}メニューを開く" },
    "nav.openMenu": { en: "Open menu", ja: "メニューを開く" },
    "nav.mainNav": { en: "Main navigation", ja: "メインナビゲーション" },
    "nav.homeAria": { en: "Global HR home", ja: "Global HR ホーム" },
    "nav.langGroup": { en: "Language", ja: "言語" },
    "nav.langEn": { en: "EN", ja: "EN" },
    "nav.langJa": { en: "日本語", ja: "日本語" },
    "nav.langKo": { en: "한국어", ja: "한국어" },
    "nav.langRu": { en: "RU", ja: "RU" },
    "nav.backToTop": { en: "Back to top", ja: "ページ上部へ" },
    "theme.toggle": { en: "Toggle color theme", ja: "カラーテーマを切り替える" },
    "theme.dark": { en: "Dark", ja: "ダーク" },
    "theme.light": { en: "Light", ja: "ライト" },

    "footer.tagline": {
      en: "Recruitment solutions across Asia-Pacific & beyond.",
      ja: "アジア太平洋地域およびその先へ、人材紹介サービスを提供しています。",
    },
    "footer.follow": { en: "Follow us", ja: "公式SNS" },
    "footer.facebook": { en: "Facebook", ja: "Facebook" },
    "footer.tiktok": { en: "TikTok", ja: "TikTok" },
    "footer.facebookAria": { en: "Global HR on Facebook", ja: "Global HRのFacebook" },
    "footer.tiktokAria": { en: "Global HR on TikTok", ja: "Global HRのTikTok" },
    "footer.quickLinks": { en: "Quick Links", ja: "クイックリンク" },
    "footer.jobAlerts": { en: "Job alerts", ja: "求人お知らせ" },
    "footer.staffLogin": { en: "Staff login", ja: "スタッフログイン" },
    "footer.contact": { en: "Contact", ja: "お問い合わせ" },
    "footer.myanmar": { en: "Myanmar: +95 1 356 0017 · +95 1 356 0018 · Mobile +95 9 449666683 · +95 9 449666685", ja: "ミャンマー: +95 1 356 0017 · +95 1 356 0018 · 携帯 +95 9 449666683 · +95 9 449666685" },
    "footer.singapore": {
      en: "Singapore: +65 6338 3266 · +65 6338 4566 · Mobile +65 9062 2272",
      ja: "シンガポール: +65 6338 3266 · +65 6338 4566 · 携帯 +65 9062 2272",
    },
    "footer.licenceLine": {
      en: "Singapore EA Licence No. 01C5543 · Established 2001 · ",
      ja: "シンガポール EA Licence No. 01C5543 · 設立2001年 · ",
    },
    "footer.licencesLink": { en: "Licences", ja: "免許・登録" },
    "footer.copyright": { en: "© 2026 Global HR. All rights reserved.", ja: "© 2026 Global HR. All rights reserved." },

    "home.heroAria": { en: "Global HR arrival and training moments", ja: "Global HRの到着・研修の様子" },
    "home.heroTitle": { en: "Connecting Great People With Great Companies", ja: "優れた人材と、優れた企業をつなぐ" },
    "home.heroLead": {
      en: "Asia-Pacific recruitment partner since 2001 — helping businesses hire faster and candidates find meaningful careers across Asia-Pacific & beyond.",
      ja: "2001年よりアジア太平洋地域の人材紹介パートナーとして、企業の採用と求職者のキャリアを支援しています。",
    },
    "home.viewUpdates": { en: "View updates", ja: "最新情報を見る" },
    "home.hireTalent": { en: "Hire Talent", ja: "人材のご相談" },
    "home.choosePhoto": { en: "Choose a photo", ja: "写真を選ぶ" },
    "home.countryMarquee": { en: "Countries we serve", ja: "対応国" },
    "home.brandAria": { en: "Global HR brand", ja: "Global HR" },
    "home.brandLead": {
      en: "Your trusted recruitment partner across Asia-Pacific & beyond since 2001.",
      ja: "2001年より、アジア太平洋地域およびその先で信頼される人材紹介パートナーです。",
    },
    "home.viewLicences": { en: "View our licences", ja: "免許・登録を見る" },
    "home.jobAlerts": { en: "Get job alerts", ja: "求人お知らせ" },
    "home.followFacebook": { en: "Follow us on Facebook", ja: "Facebookをフォロー" },
    "home.followTiktok": { en: "Follow us on TikTok", ja: "TikTokをフォロー" },
    "home.facebookAria": { en: "Follow Global HR on Facebook", ja: "Global HRのFacebookをフォロー" },
    "home.tiktokAria": { en: "Follow Global HR on TikTok", ja: "Global HRのTikTokをフォロー" },
    "home.statEstablished": { en: "Established", ja: "設立" },
    "home.statPlacements": { en: "Successful Placements", ja: "紹介実績" },
    "home.statMarkets": { en: "Markets served", ja: "対応市場" },
    "home.statClients": { en: "Employer Clients", ja: "取引企業" },
    "home.statApac": { en: "Asia-Pacific", ja: "アジア太平洋地域" },
    "home.statBeyond": { en: "& beyond", ja: "およびその先" },
    "home.whatWeDo": { en: "What We Do", ja: "事業内容" },
    "home.whatWeDoLead": {
      en: "From workforce planning to candidate placement, we support both employers and job seekers end-to-end.",
      ja: "人員計画から人材の紹介まで、採用企業と求職者の双方を一貫して支援します。",
    },
    "home.permTitle": { en: "Permanent Recruitment", ja: "正社員の人材紹介" },
    "home.permText": {
      en: "Matching qualified candidates to long-term business goals.",
      ja: "長期的な事業目標に合う人材をご紹介します。",
    },
    "home.contractTitle": { en: "Contract & Temporary Hiring", ja: "契約・期間採用" },
    "home.contractText": {
      en: "Flexible staffing solutions for urgent and project-based roles.",
      ja: "急募やプロジェクトに対応する、柔軟な採用支援です。",
    },
    "home.advisoryTitle": { en: "Employer Advisory", ja: "採用コンサルティング" },
    "home.advisoryText": {
      en: "Market insights, role scoping, and salary benchmarking support.",
      ja: "市場情報、職務要件の整理、給与水準の目安をご提供します。",
    },
    "home.trainingTitle": { en: "Training & Certification", ja: "研修・資格取得支援" },
    "home.trainingText": {
      en: "Briefings, skills training, and certification support before deployment.",
      ja: "赴任前のブリーフィング、技能研修、資格取得を支援します。",
    },
    "home.exploreServices": { en: "Explore industries →", ja: "対応業界を見る →" },
    "home.latestUpdates": { en: "Latest updates", ja: "最新情報" },
    "home.viewAllArrow": { en: "View all →", ja: "すべて見る →" },
    "home.loadingNews": { en: "Loading latest news", ja: "最新情報を読み込み中" },
    "home.noUpdates": { en: "No updates yet", ja: "まだ最新情報はありません" },
    "home.noUpdatesText": {
      en: "Check back soon for activities, job openings, and company news.",
      ja: "活動報告、求人、会社ニュースはこちらに掲載します。",
    },
    "home.clientsTitle": { en: "Some of Our Valuable Clients", ja: "お取引先の一例" },
    "home.clientsLead": {
      en: "A selection of valued employers Global HR supports across marine, shipyard, construction, and engineering in Asia-Pacific & beyond.",
      ja: "海洋・造船・建設・エンジニアリング分野を中心に、Global HRが支援する採用企業の一例です。",
    },
    "home.clientsAria": { en: "Client logos", ja: "お取引先ロゴ" },
    "home.ctaTitle": { en: "Ready to hire your next great employee?", ja: "次の人材採用をご検討ですか？" },
    "home.ctaText": {
      en: "Talk to Global HR for fast and reliable recruitment support.",
      ja: "迅速で確実な人材紹介は、Global HRにご相談ください。",
    },
    "home.contactUs": { en: "Contact Us", ja: "お問い合わせ" },

    "about.kicker": { en: "About Global HR", ja: "Global HRについて" },
    "about.heroTitle": {
      en: "People-first recruitment across Asia-Pacific & beyond",
      ja: "人を大切にする人材紹介 — アジア太平洋地域およびその先へ",
    },
    "about.heroLead": {
      en: 'Licensed employment agency · Serving employers and candidates since <strong class="text-white">2001</strong>',
      ja: 'シンガポールで許可を受けた人材紹介会社 · <strong class="text-white">2001</strong>年より企業と求職者を支援',
    },
    "about.storyTitle": { en: "Our story", ja: "私たちの歩み" },
    "about.story1": {
      en: "Global HR has supported recruitment across Asia-Pacific & beyond <strong>since 2001</strong>. We connect talent with opportunities in Singapore, Malaysia, Thailand, Japan, South Korea, Dubai, Vietnam, and the wider region—and help employers hire with confidence, combining local market knowledge with structured, compliant processes.",
      ja: "Global HRは<strong>2001年</strong>より、アジア太平洋地域およびその先で人材紹介を行っています。シンガポール、マレーシア、タイ、日本、韓国、ドバイ、ベトナム、およびその周辺地域で人材と機会をつなぎ、現地の市場知識と、法令を守った手続きにより、企業が安心して採用できるよう支援します。",
    },
    "about.story2": {
      en: "Whether you are hiring your next team member or taking the next step in your career, we focus on communication, respect, and outcomes you can measure.",
      ja: "次のメンバーを採用される企業の方も、次のキャリアを目指す求職者の方も、コミュニケーション、尊重、そして成果を大切にしています。",
    },
    "about.historyTitle": { en: "Our history", ja: "沿革" },
    "about.historyLead": {
      en: "From vocational certification and briefings to international partnerships and deployments across Asia-Pacific & beyond.",
      ja: "職業訓練・ブリーフィングから、国際的な提携、アジア太平洋地域およびその先への赴任支援まで。",
    },
    "about.historyFrom": { en: "2001", ja: "2001" },
    "about.historyTo": { en: "Present", ja: "現在" },
    "about.historySpanKicker": { en: "Certification · training · partnerships", ja: "認定 · 研修 · 提携" },
    "about.historySpanText": {
      en: "The photos below are from that same path — vocational certification, classroom training, TWI partnerships, and sector briefings that prepare candidates for overseas placement.",
      ja: "下の写真は、その同じ歩みです。職業訓練の認定、教室での研修、TWIとの提携、そして海外赴任前の業種別ブリーフィングまで。",
    },
    "about.hist1Title": { en: "Vocational certification", ja: "職業訓練の認定" },
    "about.hist1Text": { en: " — course completion ceremonies with training partners.", ja: " — 提携機関との修了式。" },
    "about.hist2Title": { en: "Building skilled talent", ja: "技能人材の育成" },
    "about.hist2Text": { en: " — preparing candidates before overseas placement.", ja: " — 海外赴任前の準備。" },
    "about.hist3Title": { en: "Training at scale", ja: "大規模研修" },
    "about.hist3Text": { en: " — safety-first briefings for worksite-ready candidates.", ja: " — 現場に必要な安全ブリーフィング。" },
    "about.hist4Title": { en: "International partnerships", ja: "国際提携" },
    "about.hist4Text": { en: " — TWI certification and training collaboration.", ja: " — TWIとの認定・研修協力。" },
    "about.hist5Title": { en: "Sector briefings", ja: "業種別ブリーフィング" },
    "about.hist5Text": { en: " — structured sessions across trades and industries.", ja: " — 職種・業界ごとの体系的な説明会。" },
    "about.hist6Title": { en: "Global HR training", ja: "Global HR研修" },
    "about.hist6Text": { en: " — hands-on preparation in Myanmar before mobilisation.", ja: " — 赴任前のミャンマーでの実地準備。" },
    "about.credentials": { en: "Credentials", ja: "免許・登録" },
    "about.licenceTitle": { en: "Licensed & established since 2001", ja: "2001年設立 · 許可を受けた人材紹介会社" },
    "about.licenceIntro": {
      en: "Global HR operates as a licensed employment agency in Singapore (EA Licence No. <strong>01C5543</strong>) with a long track record of compliant recruitment for clients across Asia-Pacific & beyond.",
      ja: "Global HR（GLOBAL-HR Staffing Services Pte Ltd）は、シンガポールで許可を受けた人材紹介会社です（EA Licence No. <strong>01C5543</strong>）。アジア太平洋地域およびその先のお客様に対し、法令を守った人材紹介の実績があります。",
    },
    "about.licenceBlurNote": {
      en: "Licence previews are shown blurred online. Contact us to request a clear copy.",
      ja: "ウェブサイト上の免許書類はぼかし表示です。鮮明な写しをご希望の場合はお問い合わせください。",
    },
    "about.badge2001": { en: "Established 2001", ja: "設立 2001年" },
    "about.badgeEa": { en: "EA Licence 01C5543", ja: "EA Licence 01C5543" },
    "about.badgeMm": { en: "Myanmar Co.Reg. 126668384", ja: "ミャンマー会社登記 126668384" },
    "about.twiCap1": { en: "TWI partnership · training & certification", ja: "TWI提携 · 研修・資格" },
    "about.twiCap2": { en: "International credentials & compliance", ja: "国際的な資格・コンプライアンス" },
    "about.sgLicenceTitle": { en: "Singapore EA licence", ja: "シンガポール EA 免許" },
    "about.sgLicenceSub": {
      en: "GLOBAL-HR Staffing Services Pte Ltd · EA Licence No. 01C5543",
      ja: "GLOBAL-HR Staffing Services Pte Ltd · EA Licence No. 01C5543",
    },
    "about.mmLicenceTitle": { en: "Myanmar EA licence", ja: "ミャンマー EA 免許" },
    "about.mmLicenceSub": {
      en: "Global HR Management Co., Ltd · Myanmar EA Lic: 108/2026",
      ja: "Global HR Management Co., Ltd · Myanmar EA Lic: 108/2026",
    },
    "about.coLicenceTitle": { en: "Global HR company licence", ja: "Global HR 会社登記書類" },
    "about.coLicenceSub": {
      en: "Official registration documentation for Global HR",
      ja: "Global HRの公式登録書類",
    },
    "about.blurred": { en: "Blurred preview", ja: "ぼかしプレビュー" },
    "about.blurHint": {
      en: "Request a clear copy using the button below.",
      ja: "下のボタンから、鮮明な写しをご請求ください。",
    },
    "about.requestLicence": { en: "Request to view licence", ja: "免許書類の確認を依頼" },
    "about.previewAria": { en: "Licence document blurred preview", ja: "免許書類のぼかしプレビュー" },
    "about.valuesTitle": { en: "Our Core Values", ja: "コアバリュー" },
    "about.val1Title": { en: "Integrity", ja: "誠実" },
    "about.val1Text": {
      en: "We uphold honesty, transparency, and ethical conduct, building trust with candidates, clients and partners.",
      ja: "誠実さ・透明性・倫理を守り、求職者・お客様・パートナーとの信頼を築きます。",
    },
    "about.val2Title": { en: "Ethical Recruitment", ja: "倫理的な人材紹介" },
    "about.val2Text": {
      en: "We value people, respect their aspirations, and create opportunities that improve lives.",
      ja: "人を大切にし、志を尊重し、人生を豊かにする機会をつくります。",
    },
    "about.val3Title": { en: "Excellence", ja: "卓越" },
    "about.val3Text": {
      en: "We pursue the highest standards in recruitment and workforce solutions.",
      ja: "人材紹介と人材ソリューションにおいて、最高水準を追求します。",
    },
    "about.val4Title": { en: "Accountability", ja: "責任" },
    "about.val4Text": {
      en: "We take ownership of our commitments and deliver with responsibility.",
      ja: "約束に責任を持ち、確実に実行します。",
    },
    "about.val5Title": { en: "Partnership", ja: "パートナーシップ" },
    "about.val5Text": {
      en: "We build trusted, long-term relationships that create sustainable value for employers and candidates.",
      ja: "採用企業と求職者の双方に持続的な価値を生む、信頼の長期関係を築きます。",
    },
    "about.valShort1": { en: "Integrity", ja: "誠実" },
    "about.valShort2": { en: "Ethical", ja: "倫理" },
    "about.valShort3": { en: "Excellence", ja: "卓越" },
    "about.valShort4": { en: "Accountability", ja: "責任" },
    "about.valShort5": { en: "Partnership", ja: "パートナーシップ" },
    "about.successTitle": { en: "Success stories", ja: "実績紹介" },
    "about.successLead": {
      en: "Candidates we prepared across Asia-Pacific & beyond, successfully deployed to China, India, and overseas worksites.",
      ja: "アジア太平洋地域で準備した人材が、中国、インド、および海外の現場へ赴任した事例です。",
    },
    "about.officesTitle": { en: "Our offices", ja: "オフィス" },
    "about.sgOffice": { en: "Singapore office", ja: "シンガポールオフィス" },
    "about.mmOffice": { en: "Myanmar office", ja: "ミャンマーオフィス" },
    "about.leadershipTitle": { en: "Leadership team", ja: "経営陣" },
    "about.leadershipKicker": { en: "The people behind Global HR", ja: "Global HRを率いるメンバー" },
    "about.leadershipLead": {
      en: "Photos and bios will be provided by the client.",
      ja: "写真と経歴は順次掲載します。",
    },
    "about.roleDirector": { en: "Director · Singapore", ja: "ディレクター · シンガポール" },
    "about.roleGm": { en: "General Manager · Singapore", ja: "ゼネラルマネージャー · シンガポール" },
    "about.roleMmOfficer": { en: "Myanmar Officer", ja: "ミャンマーオフィサー" },
    "about.locSingapore": { en: "Singapore", ja: "シンガポール" },
    "about.locMyanmar": { en: "Myanmar", ja: "ミャンマー" },
    "about.cta": { en: "Ready to work with us?", ja: "ご一緒に進めませんか？" },
    "about.contact": { en: "Contact", ja: "お問い合わせ" },

    "services.heroTitle": { en: "Industries", ja: "業界" },
    "services.heroLead": {
      en: "The sectors we recruit for across Asia-Pacific & beyond — from construction and shipyards to hospitality, healthcare, and cleaning.",
      ja: "アジア太平洋地域およびその先で人材をご紹介する業界 — 建設、シップヤード、ホスピタリティ、ヘルスケア、清掃まで。",
    },
    "services.seekersTitle": { en: "For job seekers", ja: "求職者の方へ" },
    "services.matchTitle": { en: "Career matching", ja: "求人のご紹介" },
    "services.matchText": {
      en: "We align your skills and goals with roles that fit your experience and growth plans.",
      ja: "ご経験と今後の目標に合う職務をご紹介します。",
    },
    "services.interviewTitle": { en: "Interview preparation", ja: "面接準備" },
    "services.interviewText": {
      en: "Guidance on expectations, documentation, and how to present your strengths with clarity.",
      ja: "面接の進め方、必要書類、強みの伝え方をご案内します。",
    },
    "services.offerTitle": { en: "Offer & onboarding support", ja: "内定・入社の支援" },
    "services.offerText": {
      en: "Help through offer review, timelines, and first-week priorities where needed.",
      ja: "条件確認、日程、入社初週の準備を必要に応じて支援します。",
    },
    "services.employersTitle": { en: "For employers", ja: "採用企業の方へ" },
    "services.scopeTitle": { en: "Role scoping & sourcing", ja: "職務整理と人材探索" },
    "services.scopeText": {
      en: "Clear job profiles, salary guidance, and targeted sourcing across our networks.",
      ja: "職務要件の整理、給与の目安、ネットワークを通じた人材探索を行います。",
    },
    "services.screenTitle": { en: "Screening & shortlisting", ja: "選考・候補者の絞り込み" },
    "services.screenText": {
      en: "Structured interviews and checks so you meet candidates who are ready to perform.",
      ja: "面接と確認を行い、実務に対応できる候補者をおつなぎします。",
    },
    "services.opsTitle": { en: "Hiring operations support", ja: "採用運営の支援" },
    "services.opsText": {
      en: "Coordination across stakeholders, timelines, and compliance-sensitive steps.",
      ja: "関係者・日程・法令に関わる手続きを調整します。",
    },
    "services.industriesTitle": { en: "Industries we serve", ja: "対応業界" },
    "services.sectorTitle": { en: "Sector", ja: "業種" },
    "services.countryTitle": { en: "Country", ja: "国" },
    "services.sectorService": { en: "Service", ja: "サービス" },
    "services.fnb": { en: "Food and Beverage", ja: "飲食" },
    "services.hss": { en: "Household Services Scheme (HSS)", ja: "家事サービス制度 (HSS)" },
    "services.indCleaningHss": { en: "Cleaning (HSS)", ja: "清掃 (HSS)" },
    "services.indBuildingConstruction": { en: "Building Construction", ja: "建築建設" },
    "services.indProcessConstruction": { en: "Process Construction", ja: "プロセス建設" },
    "services.indMarineShipyard": { en: "Marine Shipyard", ja: "マリン・シップヤード" },
    "services.countryMyanmar": { en: "Myanmar", ja: "ミャンマー" },
    "services.countryBangladesh": { en: "Bangladesh", ja: "バングラデシュ" },
    "services.countryIndia": { en: "India", ja: "インド" },
    "services.countryMalaysia": { en: "Malaysia", ja: "マレーシア" },
    "services.countryThailand": { en: "Thailand", ja: "タイ" },
    "services.countryThai": { en: "Thailand", ja: "タイ" },
    "services.countryNepal": { en: "Nepal", ja: "ネパール" },
    "services.countryJapan": { en: "Japan", ja: "日本" },
    "services.countryKorea": { en: "South Korea", ja: "韓国" },
    "services.countrySingapore": { en: "Singapore", ja: "シンガポール" },
    "services.countryVietnam": { en: "Vietnam", ja: "ベトナム" },
    "services.countryChina": { en: "China", ja: "中国" },
    "services.countryDubai": { en: "Dubai", ja: "ドバイ" },
    "services.indLogistics": { en: "Logistics", ja: "物流" },
    "services.indMfg": { en: "Manufacturing", ja: "製造" },
    "services.indRetail": { en: "Retail & FMCG", ja: "小売・消費財" },
    "services.indTech": { en: "Technology", ja: "テクノロジー" },
    "services.indHr": { en: "Human Resources", ja: "人事" },
    "services.indFinance": { en: "Finance & accounting", ja: "財務・経理" },
    "services.indHosp": { en: "Hospitality", ja: "ホスピタリティ" },
    "services.indMarine": { en: "Marine & Offshore", ja: "海洋・オフショア" },
    "services.indProcess": { en: "Process", ja: "プロセス" },
    "services.indConstruction": { en: "Construction", ja: "建設" },
    "services.indLandscape": { en: "Landscaping", ja: "造園" },
    "services.indAgritech": { en: "Agritech", ja: "農業テクノロジー" },
    "services.indHealth": { en: "Healthcare", ja: "ヘルスケア" },
    "services.indServices": { en: "Services", ja: "サービス業" },
    "services.arrivalTitle": { en: "Some of our Employee Arrival", ja: "従業員到着の様子" },
    "services.arrivalLead": {
      en: "Moments from airport welcome and group mobilisation — teams we received and sent on to worksites across Asia-Pacific & beyond.",
      ja: "空港での出迎えとグループ赴任の様子です。アジア太平洋地域およびその先の現場へ送り出したチームの写真です。",
    },
    "services.arr1Title": { en: "Welcome on arrival", ja: "到着時のお出迎え" },
    "services.arr1Text": {
      en: "Team arrival at the airport after successful placement.",
      ja: "紹介が決まり、空港に到着したチームをお出迎えします。",
    },
    "services.arr2Title": { en: "Ready for deployment", ja: "赴任の準備" },
    "services.arr2Text": {
      en: "Coordinated send-off with Global HR staff at the airport.",
      ja: "空港での見送りを、Global HRスタッフが調整します。",
    },
    "services.arr3Title": { en: "Asia-Pacific deployments", ja: "アジア太平洋地域への赴任" },
    "services.arr3Text": {
      en: "End-to-end support from selection to successful deployment across Asia-Pacific & beyond.",
      ja: "選考から赴任完了まで、一貫して支援します。",
    },
    "services.processTitle": { en: "How it works", ja: "ご利用の流れ" },
    "services.step1Title": { en: "Discovery", ja: "ヒアリング" },
    "services.step1Text": {
      en: "We clarify requirements, budget, and timelines.",
      ja: "要件、予算、日程を確認します。",
    },
    "services.step2Title": { en: "Sourcing", ja: "人材探索" },
    "services.step2Text": {
      en: "We search, screen, and shortlist qualified candidates.",
      ja: "探索・確認を行い、候補者を絞り込みます。",
    },
    "services.step3Title": { en: "Interviews", ja: "面接" },
    "services.step3Text": {
      en: "We coordinate interviews and feedback loops.",
      ja: "面接日程とフィードバックを調整します。",
    },
    "services.step4Title": { en: "Offer & placement", ja: "内定・入社" },
    "services.step4Text": {
      en: "We support offer stages through a successful start date.",
      ja: "内定から入社日までを支援します。",
    },
    "services.cta": {
      en: "Tell us what role you need to fill—or the role you want next.",
      ja: "採用したい職務、または次に目指す職務をお知らせください。",
    },
    "services.getInTouch": { en: "Get in touch", ja: "お問い合わせ" },

    "training.kicker": { en: "Professional development", ja: "人材育成" },
    "training.heroTitle": { en: "Training & Certification", ja: "研修・資格取得支援" },
    "training.heroLead": {
      en: "Practical workshops, briefings, and certification support for hiring managers, HR teams, and job seekers across Asia-Pacific & beyond.",
      ja: "採用担当者、人事、求職者向けの実地研修、ブリーフィング、資格取得支援です。",
    },
    "training.overviewTitle": {
      en: "Hands-on Training and Interview Briefings for Skilled Deployment",
      ja: "技能人材の送り出しに向けた実地研修と面接ブリーフィング",
    },
    "training.overviewText": {
      en: "Hands-on training at Global HR brings classroom instruction together with real interview briefings, so candidates understand both the technical work and the standards employers expect on site.",
      ja: "Global HRの実地研修は、座学と実際の面接ブリーフィングを組み合わせ、候補者が業務内容と現場で求められる基準の両方を理解できるようにしています。",
    },
    "training.overviewP2": {
      en: "Sessions range from theory tests and safety instruction to trade briefings ahead of client interviews, helping skilled workers from Myanmar and across the region present themselves with confidence.",
      ja: "学科試験や安全指導から、クライアント面接前の職種別ブリーフィングまで、ミャンマーをはじめ各地の技能人材が自信を持って臨めるよう支援しています。",
    },
    "training.overviewP3": {
      en: "These programmes sit alongside internationally recognised certification pathways, so trained candidates are ready for mobilisation onto oil & gas, construction, marine and industrial projects.",
      ja: "これらのプログラムは国際的に認められた資格取得の道筋と連動しており、研修を受けた候補者が石油・ガス、建設、海事、産業プロジェクトへ円滑に動員できる状態を整えます。",
    },
    "training.programsLabel": { en: "— Programs", ja: "— プログラム" },
    "training.programsTitle": { en: "Our training programs", ja: "研修プログラム" },
    "training.programsIntro": {
      en: "Click a program to view photos and full details. Training, skills testing, screening, and certification delivered by Global HR across Asia-Pacific & beyond.",
      ja: "プログラムを選ぶと、写真と詳細が表示されます。研修、技能試験、選考、資格取得をGlobal HRが実施しています。",
    },
    "training.p1Title": { en: "Briefing for Keppel Nakilat Interview", ja: "Keppel Nakilat 面接ブリーフィング" },
    "training.p1Teaser": {
      en: "Pre-departure interview briefing and preparation for Keppel Nakilat candidates.",
      ja: "Keppel Nakilat候補者向けの出発前面接ブリーフィングです。",
    },
    "training.p1Detail": {
      en: "Global HR runs structured pre-departure briefings for Keppel Nakilat candidates — covering interview expectations, documentation, safety, and workplace culture before mobilisation. Sessions combine classroom instruction with practical Q&A so candidates arrive prepared and confident.",
      ja: "Global HRは、Keppel Nakilat候補者向けに出発前ブリーフィングを実施しています。面接の進め方、書類、安全、職場の文化を赴任前に説明します。座学と質疑応答を組み合わせ、準備した状態で到着できるよう支援します。",
    },
    "training.p2Title": { en: "Household Services (HSS)", ja: "家事サービス（HSS）" },
    "training.p2Teaser": {
      en: "Training, certification, and interview preparation for Household Services Sector placements in Singapore.",
      ja: "シンガポールの家事サービス業（HSS）向けの研修、資格、面接準備です。",
    },
    "training.p2Detail": {
      en: "Global HR runs Household Services Sector (HSS) programs covering sector briefing, certification support, and interview preparation. Candidates are prepared for employer requirements in Singapore and overseas through practical sessions on workplace standards, safety, and deployment readiness before mobilisation.",
      ja: "Global HRは家事サービス業（HSS）プログラムを実施しています。業種説明、資格取得支援、面接準備を含みます。職場の基準、安全、赴任準備について実地で学び、シンガポールおよび海外の雇用主の要件に備えられます。",
    },
    "training.p3Title": { en: "Employee Arrival", ja: "従業員の到着サポート" },
    "training.p3Teaser": {
      en: "Group arrival support for one of our largest shipyard recruitment projects from Myanmar, Bangladesh and India.",
      ja: "ミャンマー、バングラデシュ、インドからの造船所向け大型人材紹介における、グループ到着サポートです。",
    },
    "training.p3Detail": {
      en: "One of Global HR's largest shipyard projects — coordinating briefing, travel, and on-arrival support for staff mobilised from Myanmar, Bangladesh and India. We manage group logistics from pre-departure through airport reception so employers receive work-ready teams.",
      ja: "Global HRの大型造船所プロジェクトの一つです。ミャンマー、バングラデシュ、インドからの赴任者に対し、ブリーフィング、渡航、到着時のサポートを調整します。出発前から空港での出迎えまでグループの手配を行い、企業に勤務可能なチームをおつなぎします。",
    },
    "training.p4Title": {
      en: "Keppel Fels Company Interview Mechanical Fitters",
      ja: "Keppel Fels 機械工面接",
    },
    "training.p4Teaser": {
      en: "Interview coaching and screening support for mechanical trades candidates in Myanmar.",
      ja: "ミャンマーの機械系職種候補者向けの面接指導と選考支援です。",
    },
    "training.p4Detail": {
      en: "Interview coaching and hands-on screening for mechanical trades at the Global Skill Training Institute. Candidates practice workshop tasks, safety procedures, and client interview formats before selection for Singapore and regional worksites.",
      ja: "Global Skill Training Instituteにて、機械系職種の面接指導と実地選考を行います。作業、安全手順、お客様の面接形式を練習し、シンガポールおよび地域の現場選考に備えます。",
    },
    "training.p5Title": { en: "Scaffolding Training", ja: "足場組立研修" },
    "training.p5Teaser": {
      en: "Practical scaffolding training for workers preparing for Singapore worksite requirements.",
      ja: "シンガポールの現場要件に備える、実地の足場組立研修です。",
    },
    "training.p5Detail": {
      en: "Practical scaffolding training with safety harnesses, hard hats, and live assembly exercises. Workers learn Singapore worksite standards and Global HR safety protocols before deployment to construction and shipyard projects.",
      ja: "安全帯、ヘルメットを用いた実地の足場組立研修です。建設・造船プロジェクトへの赴任前に、シンガポールの現場基準とGlobal HRの安全手順を学びます。",
    },
    "training.p6Title": {
      en: "Alpine Shipyard Scaffolding Interview (Myanmar)",
      ja: "Alpine Shipyard 足場面接（ミャンマー）",
    },
    "training.p6Teaser": {
      en: "Interview briefing and screening for Alpine Shipyard scaffolding candidates in Myanmar.",
      ja: "ミャンマーでのAlpine Shipyard足場候補者向け面接ブリーフィングと選考です。",
    },
    "training.p6Detail": {
      en: "Global HR runs interview briefings and screening for Alpine Shipyard scaffolding candidates at our Global Training Centre in Myanmar — covering safety requirements, client expectations, and practical readiness before selection and mobilisation to Singapore worksites.",
      ja: "ミャンマーのGlobal Training Centreにて、Alpine Shipyardの足場候補者向け面接ブリーフィングと選考を実施しています。安全要件、お客様の期待、実務準備を確認したうえで、シンガポール現場への選考・赴任につなげます。",
    },
    "training.p7Title": {
      en: "Selected Forklift Drivers Briefing by Sankyu (Singapore)",
      ja: "Sankyu フォークリフト運転者ブリーフィング（シンガポール）",
    },
    "training.p7Teaser": {
      en: "Pre-placement briefing for selected forklift drivers with Sankyu in Singapore.",
      ja: "シンガポールのSankyu向けに選ばれたフォークリフト運転者の赴任前ブリーフィングです。",
    },
    "training.p7Detail": {
      en: "Pre-placement briefing for selected forklift drivers with Sankyu in Singapore — covering licensing checks, warehouse safety, employer procedures, and first-day expectations. Global HR coordinates selection, briefing, and mobilisation for logistics and port operations roles.",
      ja: "シンガポールのSankyu向けに選ばれたフォークリフト運転者への赴任前ブリーフィングです。免許確認、倉庫の安全、雇用主の手順、初日の案内を含みます。物流・港湾業務の選考、説明、赴任をGlobal HRが調整します。",
    },
    "training.p8Title": {
      en: "Large-Scale Project Manpower Solutions",
      ja: "大規模プロジェクトの人員ソリューション",
    },
    "training.p8Teaser": {
      en: "Project manpower planning, recruitment, mobilisation and workforce management for Rotary Engineering at the Padauk Shwe War Oil Storage Terminal in Myanmar.",
      ja: "ミャンマーのPadauk Shwe War石油貯蔵ターミナル（Rotary Engineering）向けに、プロジェクト人員計画、採用、赴任、労務管理を実施しました。",
    },
    "training.p8P1": {
      en: "Global HR is proud to have successfully participated in the construction of the Padauk Shwe War Oil Storage Terminal in Myanmar, supporting our client Rotary Engineering with comprehensive project manpower planning, recruitment, mobilisation and workforce management.",
      ja: "Global HRは、ミャンマーのPadauk Shwe War石油貯蔵ターミナル建設に参画し、お客様のRotary Engineeringに対して、プロジェクト人員計画、採用、赴任、労務管理を一貫して支援できたことを誇りとしています。",
    },
    "training.p8P2": {
      en: "Global HR was entrusted with manpower requirements of approximately 350 personnel across a wide range of process construction disciplines, including project teams, safety personnel, project supervisors, skilled welders, mechanical and pipe fitters, electricians, scaffolders and other essential construction trades.",
      ja: "Global HRは、プロジェクトチーム、安全担当、現場監督、熟練溶接工、機械・配管工、電気工、足場工、その他の建設職種を含む、約350名規模のプロセス建設人材の確保を任されました。",
    },
    "training.p8P3": {
      en: "As part of the project's quality requirements, Welder Qualification Tests (WQT) were conducted with the participation and witnessing of an expert QC team from Surbana Jurong. Global HR successfully mobilised and managed a workforce comprising several hundred locally recruited personnel in Myanmar to support the project's construction activities.",
      ja: "プロジェクトの品質要件の一環として、溶接工資格試験（WQT）を実施し、Surbana JurongのQC専門家チームが立ち会いました。Global HRは、ミャンマーで現地採用した数百名規模の人材を赴任・管理し、建設作業を支援しました。",
    },
    "training.p8P4": {
      en: "We are proud to have contributed to the successful execution of this major oil storage terminal project. The experience demonstrates Global HR's capability to plan, source, mobilise and manage large-scale skilled workforces for complex oil & gas, process construction and industrial projects.",
      ja: "この大規模な石油貯蔵ターミナル案件の遂行に貢献できたことを誇りとしています。複雑な石油・ガス、プロセス建設、産業プロジェクト向けに、大規模な熟練人材を計画・確保・赴任・管理できることが、この実績に表れています。",
    },
    "training.p9Title": {
      en: "Electrical Installation Course Certification (CVT)",
      ja: "電気設備コース認定（CVT）",
    },
    "training.p9Teaser": {
      en: "Center for Vocational Training (CVT) electrical installation course certification ceremony in Myanmar.",
      ja: "ミャンマーのCenter for Vocational Training（CVT）電気設備コース修了式です。",
    },
    "training.p9Detail": {
      en: "In partnership with the Center for Vocational Training (CVT), Global HR supports the Electrical Installation Course — including practical training, assessment, and a formal certification ceremony for graduates in Myanmar.",
      ja: "Center for Vocational Training（CVT）と連携し、電気設備コースの実地研修、評価、ミャンマーでの修了式を支援しています。",
    },
    "training.alsoRun": {
      en: 'We also run <strong>Steel Plate Fitting Interview Myanmar</strong> and <strong>Welder Interview Myanmar</strong> briefings — <a href="contact.html" class="text-brandBlue font-semibold hover:text-brandNavy dark:text-sky-400">contact us</a> for schedules, photos, and custom in-house programs.',
      ja: '<strong>Steel Plate Fitting Interview Myanmar</strong>および<strong>Welder Interview Myanmar</strong>のブリーフィングも実施しています。日程、写真、社内向けプログラムについては<a href="contact.html" class="text-brandBlue font-semibold hover:text-brandNavy dark:text-sky-400">お問い合わせ</a>ください。',
    },
    "training.galleryLabel": { en: "— Gallery", ja: "— ギャラリー" },
    "training.galleryTitle": { en: "Training photo gallery", ja: "研修フォトギャラリー" },
    "training.galleryIntro": {
      en: "Real training, screening, and certification sessions delivered by Global HR across Asia-Pacific & beyond.",
      ja: "Global HRが実施した、実際の研修・選考・資格取得の様子です。",
    },
    "training.g1": { en: "Giving certificate", ja: "修了証の授与" },
    "training.g2": { en: "Certificate ceremony group photo", ja: "修了式の集合写真" },
    "training.g3": { en: "Ceremony speech", ja: "修了式のスピーチ" },
    "training.g4": { en: "Giving certificate", ja: "修了証の授与" },
    "training.g5": { en: "Global Skills briefing", ja: "Global Skillsブリーフィング" },
    "training.g6": { en: "Safety briefing", ja: "安全ブリーフィング" },
    "training.g7": { en: "Group briefing", ja: "グループブリーフィング" },
    "training.g8": { en: "Classroom briefing", ja: "座学ブリーフィング" },
    "training.g9": { en: "Instructor session", ja: "講師による説明" },
    "training.g10": { en: "Skills assessment", ja: "技能評価" },
    "training.g11": { en: "Training hall briefing", ja: "研修ホールでの説明" },
    "training.g12": { en: "Sector briefing", ja: "業種別ブリーフィング" },
    "training.g13": { en: "Interview preparation", ja: "面接準備" },
    "training.g14": { en: "Global HR training class", ja: "Global HR研修クラス" },
    "training.g15": { en: "Pre-interview briefing", ja: "面接前ブリーフィング" },
    "training.g16": { en: "Group training", ja: "グループ研修" },
    "training.g17": { en: "Airport arrival", ja: "空港到着" },
    "training.g18": { en: "Global Training Centre", ja: "Global Training Centre" },
    "training.g19": { en: "TWI agreement", ja: "TWI協定" },
    "training.g20": { en: "TWI signing", ja: "TWI調印" },
    "training.twiTitle": {
      en: "Bringing International Welding & Inspection Certification to Myanmar",
      ja: "ミャンマーへ、国際的な溶接・検査資格を",
    },
    "training.twiP1": {
      en: "Another significant milestone for Global Training Centre was the signing of an MOU with TWI Malaysia to promote internationally recognised technical training and certification in Myanmar across Welding, Welding Inspection, Painting Inspection, Non-Destructive Testing (NDT) and Health, Safety & Environment (HSE) disciplines.",
      ja: "Global Training Centreのもう一つの大きな節目は、TWI Malaysiaとの覚書（MOU）の締結です。溶接、溶接検査、塗装検査、非破壊検査（NDT）、労働安全衛生（HSE）の各分野で、国際的に認められた技術研修と資格認定をミャンマーで推進することを目的としています。",
    },
    "training.twiP2": {
      en: "Through this collaboration, Global Training Centre helped create greater access for Myanmar engineers, inspectors and skilled technical personnel to internationally recognised professional qualifications without having to travel overseas.",
      ja: "この協力により、Global Training Centreは、ミャンマーの技術者、検査員、熟練技術者が海外へ出向かずとも、国際的に認められた専門資格を取得できる機会を広げました。",
    },
    "training.twiP3": {
      en: "A major achievement came in June 2013, when the first Welding Inspection examination programmes were conducted in Myanmar for CSWIP 3.0, 3.1 and 3.2 certifications.",
      ja: "大きな成果として、2013年6月には、CSWIP 3.0、3.1、3.2の溶接検査試験プログラムがミャンマーで初めて実施されました。",
    },
    "training.twiP4": {
      en: "Global Training Centre is proud to have played a pioneering role in bringing internationally recognised welding and inspection certification opportunities closer to Myanmar's technical workforce, contributing to the development of skilled professionals capable of meeting international standards in oil & gas, construction, fabrication and other industrial sectors.",
      ja: "Global Training Centreは、国際的に認められた溶接・検査資格の機会をミャンマーの技術人材の身近に届け、石油・ガス、建設、製作、その他の産業分野で国際基準を満たせる専門人材の育成に先駆的な役割を果たしてきたことを誇りとしています。",
    },
    "training.smfTitle": {
      en: "Singapore Manufacturing Federation · Certificate of Membership",
      ja: "シンガポール製造業連盟（SMF）· 会員証書",
    },
    "training.smfLead": {
      en: "GLOBAL-HR Staffing Services Pte Ltd is a Manufacturing Services member of the Singapore Manufacturing Federation (SMF) since November 2020.",
      ja: "GLOBAL-HR Staffing Services Pte Ltdは、2020年11月よりシンガポール製造業連盟（Singapore Manufacturing Federation）のManufacturing Services会員です。",
    },
    "training.smfP2": {
      en: "This membership places Global HR within Singapore's manufacturing and industrial services community, supporting manpower solutions for employers across the sector.",
      ja: "この会員資格は、シンガポールの製造・産業サービス分野におけるGlobal HRの立場を示すものであり、同分野の雇用主向け人材ソリューションを支えています。",
    },
    "training.g21": { en: "Conducting Theory Test for Safety (Myanmar)", ja: "安全学科試験（ミャンマー）" },
    "training.g22": {
      en: "Interview for Technicians for Engie Service All S-Pass for Changi Airport",
      ja: "Engie Service 技術者面接（チャンギ空港 S-Pass）",
    },
    "training.g23": { en: "HSS Photo Memory Moments during training", ja: "HSS研修の記録" },
    "training.g24": { en: "Team group at airport", ja: "空港での集合写真" },
    "training.g25": { en: "Arrival group at baggage claim", ja: "手荷物受取での到着グループ" },
    "training.bookTitle": { en: "Book training for your team", ja: "チーム研修のお申し込み" },
    "training.bookText": {
      en: "Tell us your goals and we will recommend a program or design a custom session.",
      ja: "目的をお知らせいただければ、プログラムのご提案、または個別の内容を検討します。",
    },
    "training.enquire": { en: "Enquire now", ja: "お問い合わせ" },

    "news.kicker": { en: "Updates", ja: "最新情報" },
    "news.pageTitle": { en: "Updates", ja: "最新情報" },
    "news.pageSubtitle": {
      en: "Activities, arrivals, training, and job openings from Global HR — all in one feed.",
      ja: "Global HRの活動、到着、研修、求人を一覧でご覧いただけます。",
    },
    "news.filterAria": { en: "Filter by category", ja: "カテゴリーで絞り込む" },
    "news.loading": { en: "Loading news", ja: "最新情報を読み込み中" },
    "news.empty": { en: "No updates match this filter right now.", ja: "この条件に合う最新情報は現在ありません。" },
    "news.viewAll": { en: "View all updates", ja: "すべての最新情報を見る" },
    "news.ctaTitle": { en: "Want to hear about new job openings?", ja: "新しい求人のご案内をご希望ですか？" },
    "news.ctaText": {
      en: "We post roles when they come up. Subscribe and we’ll notify you when a relevant opening is published.",
      ja: "求人が出た際にお知らせします。登録いただくと、関連する求人を掲載したときにご連絡します。",
    },
    "news.jobAlerts": { en: "Get job alerts", ja: "求人お知らせ" },
    "news.all": { en: "All", ja: "すべて" },
    "news.readMore": { en: "Read more →", ja: "続きを読む →" },
    "news.back": { en: "← All updates", ja: "← すべての最新情報" },
    "news.notFound": {
      en: "This update could not be found. It may have been removed or is no longer active.",
      ja: "この情報は見つかりませんでした。削除されたか、掲載が終了した可能性があります。",
    },
    "news.loadError": {
      en: "Could not load updates right now. Please try again later.",
      ja: "最新情報を読み込めませんでした。しばらくしてから再度お試しください。",
    },
    "news.viewFull": { en: "View full photo", ja: "写真を拡大" },
    "news.videoTitle": { en: "News video", ja: "動画" },
    "news.galleryAria": { en: "News photos and videos", ja: "写真と動画" },
    "news.englishNote": {
      en: "",
      ja: "求人・記事の本文は英語で掲載しています。",
    },
    "news.catJob": { en: "Job opening", ja: "求人" },
    "news.catJobsShort": { en: "Jobs", ja: "求人" },
    "news.catExhibition": { en: "Exhibition", ja: "展示会" },
    "news.catArrival": { en: "Arrival", ja: "到着" },
    "news.catCert": { en: "Certification", ja: "資格" },
    "news.catCertShort": { en: "Cert", ja: "資格" },

    "contact.heroTitle": { en: "Contact us", ja: "お問い合わせ" },
    "contact.heroLead": {
      en: "Send a message, call our offices, or visit us across Asia-Pacific & beyond.",
      ja: "メッセージの送信、お電話、オフィスへのご来訪が可能です。",
    },
    "contact.formTitle": { en: "Send a message", ja: "メッセージを送る" },
    "contact.name": { en: "Name *", ja: "お名前 *" },
    "contact.email": { en: "Email *", ja: "メールアドレス *" },
    "contact.phone": { en: "Phone", ja: "電話番号" },
    "contact.message": { en: "Message *", ja: "メッセージ *" },
    "contact.submit": { en: "Submit", ja: "送信" },
    "contact.required": {
      en: "Please fill in all required fields (name, email, and message).",
      ja: "必須項目（お名前、メールアドレス、メッセージ）をご入力ください。",
    },
    "contact.thanks": {
      en: "Thank you — your message has been sent. We will reply soon.",
      ja: "送信しました。折り返しご連絡いたします。",
    },
    "contact.error": {
      en: "Something went wrong. Please try again or email us directly.",
      ja: "送信できませんでした。再度お試しいただくか、直接メールでご連絡ください。",
    },
    "contact.licenceSubject": {
      en: "Global HR — licence verification request",
      ja: "Global HR — 免許書類の確認依頼",
    },
    "contact.licenceMessage": {
      en: "I would like to request a copy or verification of your licence document(s). Please contact me with the details.",
      ja: "貴社の免許書類の写し、または確認をご依頼いたします。詳細をご連絡ください。",
    },
    "contact.sgMap": { en: "Singapore map", ja: "シンガポール地図" },
    "contact.mmMap": { en: "Myanmar map", ja: "ミャンマー地図" },
    "contact.sgMapTitle": { en: "Global HR Singapore office location", ja: "Global HR シンガポールオフィス" },
    "contact.mmMapTitle": { en: "Global HR Myanmar office location", ja: "Global HR ミャンマーオフィス" },
    "contact.phoneLabel": { en: "Phone:", ja: "電話:" },
    "contact.mobileLabel": { en: "Mobile:", ja: "携帯:" },
    "contact.emailLabel": { en: "Email:", ja: "メール:" },
    "contact.waTitle": { en: "Chat with us", ja: "チャットする" },
    "contact.waSub": { en: "Typically replies instantly", ja: "通常はすぐに返信します" },
    "contact.waIntro": {
      en: "Hi there! Choose your nearest office to chat with us",
      ja: "こんにちは。最寄りのオフィスを選んでチャットしてください",
    },
    "contact.waSg": { en: "Singapore Office", ja: "シンガポールオフィス" },
    "contact.waMm": { en: "Myanmar Office", ja: "ミャンマーオフィス" },
    "contact.waOpen": { en: "Open WhatsApp chat", ja: "WhatsAppチャットを開く" },
    "contact.waClose": { en: "Close chat", ja: "チャットを閉じる" },

    "subscribe.heroTitle": { en: "Get job alerts", ja: "求人お知らせ" },
    "subscribe.heroLead": {
      en: "Leave your email and phone — we’ll notify you about new openings in marine, shipyard, logistics, healthcare, and more across Asia-Pacific & beyond.",
      ja: "メールアドレスと電話番号をご記入ください。海洋・造船・物流・ヘルスケアなどの新しい求人をご案内します。",
    },
    "subscribe.formTitle": { en: "Stay in touch", ja: "ご連絡先の登録" },
    "subscribe.formLead": {
      en: "No account needed. Add your name and at least one way to reach you — email or phone.",
      ja: "アカウントは不要です。お名前と、メールまたは電話のいずれかをご記入ください。",
    },
    "subscribe.hint": {
      en: "All fields are optional, but contact details must be valid.",
      ja: "すべて任意ですが、ご連絡先は正しい形式でご入力ください。",
    },
    "subscribe.name": { en: "Name", ja: "お名前" },
    "subscribe.email": { en: "Email", ja: "メールアドレス" },
    "subscribe.phone": { en: "Phone", ja: "電話番号" },
    "subscribe.namePh": { en: "Your name", ja: "お名前" },
    "subscribe.emailPh": { en: "you@example.com", ja: "you@example.com" },
    "subscribe.phonePh": { en: "+65 9123 4567 or +95 9…", ja: "+65 9123 4567 または +95 9…" },
    "subscribe.leaveBlank": { en: "Leave blank", ja: "空欄のまま" },
    "subscribe.consent": {
      en: "I agree that Global HR may contact me by email or phone about job opportunities, training, and recruitment services.",
      ja: "求人、研修、人材紹介サービスに関して、Global HRがメールまたは電話で連絡することに同意します。",
    },
    "subscribe.submit": { en: "Notify me about jobs", ja: "求人のお知らせを希望する" },
    "subscribe.successTitle": { en: "You’re on the list", ja: "登録しました" },
    "subscribe.successText": {
      en: "Thank you — we’ve saved your details. Our team will contact you when relevant openings come up.",
      ja: "ご登録ありがとうございます。関連する求人が出た際に、担当よりご連絡します。",
    },
    "subscribe.viewUpdates": { en: "View updates", ja: "最新情報を見る" },
    "subscribe.backHome": { en: "Back to home", ja: "ホームへ戻る" },
    "subscribe.preferTalk": { en: "Prefer to talk now?", ja: "今すぐご相談の場合は" },
    "subscribe.contactOffices": { en: "Contact our offices", ja: "オフィスへお問い合わせ" },
    "subscribe.needContact": {
      en: "Please enter at least your name, email, or phone.",
      ja: "お名前、メールアドレス、または電話番号のいずれかをご入力ください。",
    },
    "subscribe.invalidEmail": {
      en: "Enter a valid email address (e.g. you@example.com).",
      ja: "正しいメールアドレスを入力してください（例: you@example.com）。",
    },
    "subscribe.invalidPhone": {
      en: "Enter a valid phone number with at least 6 digits.",
      ja: "6桁以上の電話番号を入力してください。",
    },
    "subscribe.needConsent": {
      en: "Please agree to be contacted about jobs and services.",
      ja: "求人・サービスに関するご連絡への同意が必要です。",
    },
    "subscribe.submitting": { en: "Submitting…", ja: "送信中…" },
    "subscribe.notConfigured": {
      en: "Signup service is not configured. Please try again later.",
      ja: "登録サービスが設定されていません。しばらくしてから再度お試しください。",
    },
    "subscribe.invalidResponse": {
      en: "Invalid response from signup service.",
      ja: "登録サービスからの応答が正しくありません。",
    },
    "subscribe.saveError": {
      en: "Could not save your details. Please try again.",
      ja: "保存できませんでした。再度お試しください。",
    },
    "subscribe.genericError": {
      en: "Something went wrong. Please try again or contact us directly.",
      ja: "送信できませんでした。再度お試しいただくか、直接お問い合わせください。",
    },

    "popup.close": { en: "Close job alerts popup", ja: "求人お知らせを閉じる" },
    "popup.eyebrow": { en: "Job alerts", ja: "求人お知らせ" },
    "popup.title": { en: "Get job alerts from Global HR", ja: "Global HRの求人お知らせ" },
    "popup.text": {
      en: "New openings in marine, shipyard, logistics, and more across Asia-Pacific & beyond. Enter your email — we’ll only contact you about relevant roles.",
      ja: "海洋・造船・物流などの新しい求人をご案内します。メールアドレスをご入力ください。関連する求人のみご連絡します。",
    },
    "popup.email": { en: "Email", ja: "メールアドレス" },
    "popup.consent": {
      en: "I agree that Global HR may contact me by email about job opportunities and recruitment services.",
      ja: "求人および人材紹介サービスに関して、Global HRがメールで連絡することに同意します。",
    },
    "popup.submit": { en: "Get job alerts", ja: "求人お知らせを受け取る" },
    "popup.notNow": { en: "Not now", ja: "今はしない" },
    "popup.fullSignup": { en: "Full signup", ja: "詳しい登録" },
    "popup.needEmail": { en: "Please enter a valid email address.", ja: "正しいメールアドレスを入力してください。" },
    "popup.needConsent": {
      en: "Please agree to be contacted about job opportunities.",
      ja: "求人に関するご連絡への同意が必要です。",
    },
    "popup.thanksTitle": { en: "Thank you", ja: "ありがとうございます" },
    "popup.thanksText": {
      en: "We’ll notify you about relevant job openings from Global HR. You can close this window and keep browsing.",
      ja: "関連する求人をご案内します。この画面を閉じて、サイトをご覧いただけます。",
    },
    "popup.successStatus": {
      en: "You’re on the list. We’ll email you when new roles are available.",
      ja: "登録しました。新しい求人が出た際にメールでご案内します。",
    },
  };

  var CATEGORY_KEYS = {
    "job opening": "news.catJob",
    jobs: "news.catJobsShort",
    exhibition: "news.catExhibition",
    arrival: "news.catArrival",
    certification: "news.catCert",
    cert: "news.catCertShort",
  };

  var SUPPORTED_LANGS = { en: true, ja: true, ko: true, ru: true };
  var DATE_LOCALES = { en: "en-GB", ja: "ja-JP", ko: "ko-KR", ru: "ru-RU" };

  function resolveLang(value) {
    return SUPPORTED_LANGS[value] ? value : "en";
  }

  function readStoredLang() {
    try {
      return resolveLang(localStorage.getItem(LANG_KEY));
    } catch (e) {
      return "en";
    }
  }

  var lang = readStoredLang();

  function interpolate(text, vars) {
    if (!vars) return text;
    return String(text).replace(/\{(\w+)\}/g, function (_, name) {
      return vars[name] != null ? vars[name] : "";
    });
  }

  function t(key, fallback, vars) {
    var entry = STRINGS[key];
    var value;
    if (entry && Object.prototype.hasOwnProperty.call(entry, lang) && entry[lang] != null) {
      value = entry[lang];
    } else if (fallback != null) {
      value = fallback;
    } else if (entry && entry.en != null) {
      value = entry.en;
    } else {
      value = key;
    }
    return interpolate(value, vars);
  }

  function translateCategory(value) {
    var raw = String(value || "").trim();
    if (!raw) return "";
    var mapped = CATEGORY_KEYS[raw.toLowerCase()];
    if (mapped) return t(mapped, raw);
    return raw;
  }

  function applyHtmlLang() {
    var root = document.documentElement;
    root.lang = lang;
    root.setAttribute("data-lang", lang);
    root.classList.toggle("is-ja", lang === "ja");
    root.classList.toggle("is-ko", lang === "ko");
    root.classList.toggle("is-ru", lang === "ru");
  }

  function applyNode(el) {
    if (!el || el.nodeType !== 1) return;
    var key = el.getAttribute("data-i18n");
    if (key) el.textContent = t(key);
    var htmlKey = el.getAttribute("data-i18n-html");
    if (htmlKey) el.innerHTML = t(htmlKey);
    var ph = el.getAttribute("data-i18n-placeholder");
    if (ph) el.setAttribute("placeholder", t(ph));
    var aria = el.getAttribute("data-i18n-aria");
    if (aria) el.setAttribute("aria-label", t(aria));
    var titleKey = el.getAttribute("data-i18n-title");
    if (titleKey) el.setAttribute("title", t(titleKey));
    var attrSpec = el.getAttribute("data-i18n-attr");
    if (attrSpec) {
      attrSpec.split(",").forEach(function (part) {
        var bits = part.split(":");
        if (bits.length < 2) return;
        el.setAttribute(bits[0].trim(), t(bits[1].trim()));
      });
    }
  }

  function apply(root) {
    var scope = root || document;
    if (scope.nodeType === 1) applyNode(scope);
    var nodes = scope.querySelectorAll
      ? scope.querySelectorAll("[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-aria], [data-i18n-title], [data-i18n-attr]")
      : [];
    Array.prototype.forEach.call(nodes, applyNode);

    var pageTitleKey = document.documentElement.getAttribute("data-page-title");
    if (pageTitleKey) document.title = t(pageTitleKey);
    var pageDescKey = document.documentElement.getAttribute("data-page-desc");
    if (pageDescKey) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", t(pageDescKey));
    }
    document.documentElement.classList.add("i18n-ready");
  }

  function setLang(next) {
    var resolved = resolveLang(next);
    if (resolved === lang) {
      applyHtmlLang();
      apply(document);
      return;
    }
    lang = resolved;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {}
    applyHtmlLang();
    apply(document);
    listeners.forEach(function (fn) {
      try {
        fn(lang);
      } catch (err) {
        console.error(err);
      }
    });
  }

  function onChange(fn) {
    if (typeof fn === "function") listeners.push(fn);
  }

  function dateLocale() {
    return DATE_LOCALES[lang] || "en-GB";
  }

  function mergeExtra(extra) {
    if (!extra) return;
    Object.keys(extra).forEach(function (key) {
      if (!STRINGS[key]) STRINGS[key] = {};
      var add = extra[key];
      if (!add) return;
      if (add.ko != null) STRINGS[key].ko = add.ko;
      if (add.ru != null) STRINGS[key].ru = add.ru;
      if (add.en != null && STRINGS[key].en == null) STRINGS[key].en = add.en;
      if (add.ja != null && STRINGS[key].ja == null) STRINGS[key].ja = add.ja;
    });
  }

  mergeExtra(window.GlobalHrI18nExtra);

  applyHtmlLang();

  function boot() {
    apply(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.GlobalHrI18n = {
    t: t,
    getLang: function () {
      return lang;
    },
    setLang: setLang,
    apply: apply,
    onChange: onChange,
    translateCategory: translateCategory,
    dateLocale: dateLocale,
    mergeExtra: mergeExtra,
    STRINGS: STRINGS,
  };
})(window, document);
