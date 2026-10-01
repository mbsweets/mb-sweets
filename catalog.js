/*
  MB Sweets — दाम और स्टॉक की एक ही लिस्ट।
  ग्राहक वाला मेन्यू (order/) और बिलिंग ऐप, दोनों यही फ़ाइल पढ़ते हैं।

  दाम बदलना / नया आइटम:
    1. items में दाम बदलो और उस लाइन का आखिरी नंबर (v) = नया version करो
    2. ऊपर version को +1 करो
  बिलिंग ऐप अगली बार खुलते ही सिर्फ वही आइटम अपडेट करेगा जिनका v नया है।

  स्टॉक खत्म: off में आइटम की id डालो (जैसे 'i7'), वापस आए तो हटा दो।
  पूरे दिन ऑनलाइन ऑर्डर बंद: pause:true
*/
window.MB_CATALOG = {
  version: 6,
  updated: '2026-10-01',

  shop: {
    name: 'Maa Bhagwati Misthan Bhandar',
    brand: 'MB Sweets',
    phone: '8002010218',
    wa: '918002010218',
    upi: 'paytmqr71dbbc@ptys',
    upiPayload: 'upi://pay?pa=paytmqr71dbbc@ptys&pn=Paytm',
    lat: 26.2379445,
    lng: 85.904298,
    addrHi: 'ननौरा मेन रोड (NH 527B), दरभंगा, बिहार 846005 · एयरपोर्ट से ~5 km',
    addrEn: 'Nanaura Main Rd (NH 527B), Darbhanga, Bihar 846005 · ~5 km from airport',
    maps: 'https://www.google.com/maps/search/?api=1&query=26.2379445,85.904298',
    review: 'https://g.page/r/CZ_aeVeX-ilKEBE/review',
    instagram: 'https://www.instagram.com/maabhagwatimisthanbhandar/',
    openHour: 7,        // दुकान खुलती है
    closeHour: 21,      // दुकान बंद
    orderStartHour: 7,  // "जल्दी" ऑर्डर कब से
    orderEndHour: 19,   // शाम 7 के बाद सिर्फ आगे की तारीख
    minOrder: 499,
    radiusKm: 6
  },

  /* ऑनलाइन ऑर्डर रजिस्टर (Google Sheet) का Web app URL — खाली हो तो ऑर्डर WhatsApp से जाते हैं */
  orderApi: 'https://script.google.com/macros/s/AKfycbymPk6T9oOO9UtNOs1W4v_qmg4vZEyuS5e1bxtMOlyPodrUHgmbKoBeqJ6RIELvJfdb2Q/exec',

  pause: false,
  noticeHi: 'जितिया के लिए दही — 2 अक्टूबर (शुक्रवार) शाम 7 बजे तक होम डिलीवरी। पहले से बुक कर लें।',
  noticeEn: 'Dahi for Jitiya — home delivery till 7 PM on Fri, 2 Oct. Please book early.',
  off: [],

  /* [id, बिलिंग वाला नाम, category, unit, दाम, v] */
  items: [
    ['i1', 'रसगुल्ला (किलो)', 'mithai', 'किलो', 300, 1],
    ['i2', 'रसगुल्ला (पीस)', 'mithai', 'पीस', 15, 1],
    ['i3', 'बालूशाही (किलो)', 'mithai', 'किलो', 300, 1],
    ['i4', 'बालूशाही (पीस)', 'mithai', 'पीस', 12, 1],
    ['i5', 'गुलाब जामुन (किलो)', 'mithai', 'किलो', 350, 1],
    ['i6', 'गुलाब जामुन (पीस)', 'mithai', 'पीस', 15, 1],
    ['i7', 'चमचम (किलो)', 'mithai', 'किलो', 320, 1],
    ['i8', 'चमचम (पीस)', 'mithai', 'पीस', 15, 1],
    ['i9', 'पेड़ा', 'mithai', 'किलो', 500, 1],
    ['i10', 'मिल्क केक', 'mithai', 'किलो', 300, 1],
    ['i11', 'लड्डू', 'mithai', 'किलो', 180, 1],
    ['i12', 'जलेबी', 'mithai', 'किलो', 140, 1],
    ['i13', 'बूंदी', 'mithai', 'किलो', 140, 1],
    ['i14', 'दूध (फुल क्रीम)', 'dairy', 'लीटर', 65, 1],
    ['i15', 'दूध (टी.एम. हाफ क्रीम)', 'dairy', 'लीटर', 60, 1],
    ['i16', 'पनीर पैकेट (200 ग्राम)', 'dairy', 'पैकेट', 95, 1],
    ['i17', 'खुला पनीर', 'dairy', 'किलो', 320, 1],
    ['i18', 'दही अमृत (2 किलो पैक)', 'dairy', 'पैक', 250, 4],
    ['i19', 'दही अमूल (5 किलो पैक)', 'dairy', 'पैक', 550, 4],
    ['i20', 'दही (15 किलो पैक)', 'dairy', 'पैक', 1500, 6],
    ['i21', 'नमकीन', 'namkeen', 'किलो', 200, 1],
    ['i22', 'रसमलाई (प्लेट)', 'mithai', 'प्लेट', 50, 2],
    ['i23', 'दही अमूल (1 किलो पैक)', 'dairy', 'पैक', 125, 4],
    ['i24', 'दही अमूल (400 ग्राम)', 'dairy', 'पैक', 55, 4],
    ['i25', 'दही अमूल (200 ग्राम)', 'dairy', 'पैक', 30, 4],
    ['i26', 'वनीला केक (½ किलो)', 'cake', 'पीस', 350, 2],
    ['i27', 'वनीला केक (1 किलो)', 'cake', 'पीस', 600, 2],
    ['i28', 'चॉकलेट केक (1 किलो)', 'cake', 'पीस', 700, 2],
    ['i29', 'चॉकलेट केक (½ किलो)', 'cake', 'पीस', 380, 3],
    ['i30', 'दही अमृत (200 ग्राम)', 'dairy', 'पैक', 35, 4],
    ['i31', 'दही अमृत (400 ग्राम)', 'dairy', 'पैक', 60, 4],
    ['i32', 'दही अमृत (1 किलो पैक)', 'dairy', 'पैक', 130, 4]
  ],

  /* ग्राहक वाले मेन्यू के कार्ड। opts = कौन-कौन से आइटम इस कार्ड में चुन सकते हैं
     lineHi/lineEn = ऑर्डर की लाइन में दिखने वाला नाम (जैसे दो कंपनी का दही अलग दिखे) */
  menu: [
    { tab: 'sweets', key: 'rasgulla', hi: 'रसगुल्ला', en: 'Rasgulla', img: 'rasgulla', opts: ['i1', 'i2'] },
    { tab: 'sweets', key: 'gulabjamun', hi: 'गुलाब जामुन', en: 'Gulab Jamun', img: 'gulabjamun', opts: ['i5', 'i6'] },
    { tab: 'sweets', key: 'chamcham', hi: 'चमचम', en: 'Cham Cham', img: 'chamcham', opts: ['i7', 'i8'] },
    { tab: 'sweets', key: 'balushahi', hi: 'बालूशाही', en: 'Balushahi', img: 'balushahi', opts: ['i3', 'i4'] },
    { tab: 'sweets', key: 'rasmalai', hi: 'रसमलाई', en: 'Rasmalai', img: 'rasmalai', opts: [{ id: 'i22', hi: 'प्लेट (1 बड़ा पीस)', en: 'plate (1 big piece)' }] },
    { tab: 'sweets', key: 'peda', hi: 'पेड़ा', en: 'Peda', img: 'peda', opts: ['i9'] },
    { tab: 'sweets', key: 'laddoo', hi: 'लड्डू', en: 'Laddoo', img: 'laddoo', opts: ['i11'] },
    { tab: 'sweets', key: 'milkcake', hi: 'मिल्क केक', en: 'Milk Cake', art: 'milkcake', opts: ['i10'] },
    { tab: 'sweets', key: 'jalebi', hi: 'जलेबी', en: 'Jalebi', art: 'jalebi', opts: ['i12'] },
    { tab: 'sweets', key: 'boondi', hi: 'बूंदी', en: 'Boondi', art: 'boondi', opts: ['i13'] },

    { tab: 'dairy', key: 'milk', hi: 'दूध', en: 'Milk', brandHi: 'सुधा', brandEn: 'Sudha', img: 'milk', art: 'milk',
      opts: [{ id: 'i14', hi: 'फुल क्रीम', en: 'Full cream' }, { id: 'i15', hi: 'हाफ क्रीम (टोंड)', en: 'Toned' }] },
    { tab: 'dairy', key: 'dahi', hi: 'दही', en: 'Dahi (Curd)', brandHi: 'अमूल', brandEn: 'Amul', lineHi: 'अमूल दही', lineEn: 'Amul curd', art: 'dahi',
      opts: [{ id: 'i25', hi: '200 ग्राम', en: '200 g' }, { id: 'i24', hi: '400 ग्राम', en: '400 g' }, { id: 'i23', hi: '1 किलो', en: '1 kg' },
             { id: 'i19', hi: '5 किलो', en: '5 kg' }] },
    { tab: 'dairy', key: 'dahi-amrit', hi: 'दही', en: 'Dahi (Curd)', brandHi: 'अमृत', brandEn: 'Amrit', lineHi: 'अमृत दही', lineEn: 'Amrit curd', art: 'dahi',
      opts: [{ id: 'i30', hi: '200 ग्राम', en: '200 g' }, { id: 'i31', hi: '400 ग्राम', en: '400 g' }, { id: 'i32', hi: '1 किलो', en: '1 kg' },
             { id: 'i18', hi: '2 किलो', en: '2 kg' }] },
    { tab: 'dairy', key: 'dahi-15', hi: 'दही — 15 किलो पैक', en: 'Dahi — 15 kg pack', brandHi: 'सुधा · अमृत · अमूल', brandEn: 'Sudha · Amrit · Amul', art: 'dahi',
      opts: ['i20'] },
    { tab: 'dairy', key: 'paneer', hi: 'पनीर', en: 'Paneer', img: 'paneer', art: 'paneer',
      opts: [{ id: 'i16', hi: 'पैकेट 200 ग्राम', en: 'Pack 200 g' }, { id: 'i17', hi: 'खुला पनीर', en: 'Loose paneer' }] },

    { tab: 'cake', key: 'cake-vanilla', hi: 'वनीला केक', en: 'Vanilla Cake', img: 'cake-vanilla', sample: true, art: 'cakeVanilla',
      opts: [{ id: 'i26', hi: '½ किलो', en: '½ kg' }, { id: 'i27', hi: '1 किलो', en: '1 kg' }] },
    { tab: 'cake', key: 'cake-choco', hi: 'चॉकलेट केक', en: 'Chocolate Cake', img: 'cake-choco', sample: true, art: 'cakeChoco',
      opts: [{ id: 'i29', hi: '½ किलो', en: '½ kg' }, { id: 'i28', hi: '1 किलो', en: '1 kg' }] }
  ],

  packImg: 'pack',

  /* दूध का हिसाब — 1 यूनिट (किलो/पीस) मिठाई में कितने लीटर दूध लगता है।
     0 = दूध नहीं लगता। जो आइटम यहाँ नहीं है उसकी सिर्फ गिनती दिखेगी (दूध नहीं जुड़ेगा)।
     बिलिंग ऐप में आइटम खोलकर हर आइटम का अलग से बदला जा सकता है। */
  milk: {
    i1: 2, i5: 2, i7: 2, i9: 2, i10: 2,     // रसगुल्ला, गुलाब जामुन, चमचम, पेड़ा, मिल्क केक — 1 किलो = 2 लीटर
    i2: 0.1, i6: 0.1, i8: 0.1,              // पीस वाले — 20 पीस ≈ 1 किलो मानकर
    i3: 0, i4: 0, i11: 0, i12: 0, i13: 0    // बालूशाही, लड्डू, जलेबी, बूंदी — दूध नहीं
    // रसमलाई (i22) जानबूझकर नहीं — उसकी सिर्फ गिनती आती है (कितनी प्लेट)
  },

  /* कस्टम केक — दाम WhatsApp पर बताया जाता है */
  customCakes: [
    { key: 'redvelvet', hi: 'रेड वेलवेट केक', en: 'Red Velvet Cake', img: 'cake-redvelvet' },
    { key: 'rasmalai', hi: 'रसमलाई केक', en: 'Rasmalai Cake', img: 'cake-rasmalai' },
    { key: 'pineapple', hi: 'पाइनएप्पल केक', en: 'Pineapple Cake', img: 'cake-pineapple' },
    { key: 'butterscotch', hi: 'बटरस्कॉच केक', en: 'Butterscotch Cake', img: 'cake-butterscotch' },
    { key: 'photo', hi: 'फोटो केक', en: 'Photo Cake', img: 'cake-photo', photo: true },
    { key: 'anniversary', hi: 'दिल वाला / एनिवर्सरी केक', en: 'Heart / Anniversary Cake', img: 'cake-anniversary' },
    { key: 'theme', hi: 'थीम / डिज़ाइनर केक', en: 'Theme / Designer Cake', img: 'cake-princess' }
  ]
};
