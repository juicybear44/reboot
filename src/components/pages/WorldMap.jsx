import { useEffect, useRef, useState, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAME_ALIASES = {
  "Greenland":"Greenland","Antarctica":"Antarctica","Vanuatu":"Vanuatu","New Hebrides":"Vanuatu",
  "Brunei Darussalam":"Brunei","Brunei":"Brunei","W. Sahara":"Western Sahara","Western Sahara":"Western Sahara",
  "Puerto Rico":"Puerto Rico","Belize":"Belize","Bhutan":"Bhutan",
  "Fr. S. Antarctic Lands":"French Southern Antarctic Lands",
  "French Southern and Antarctic Lands":"French Southern Antarctic Lands",
  "Palestine":"Palestine","West Bank":"Palestine","Gaza Strip":"Palestine","Palestinian Territory":"Palestine",
  "Cyprus":"Cyprus","N. Cyprus":"Northern Cyprus","Northern Cyprus":"Northern Cyprus",
  "Somaliland":"Somaliland","Bahamas":"The Bahamas","The Bahamas":"The Bahamas",
  "Côte d'Ivoire":"Ivory Coast","Cote d'Ivoire":"Ivory Coast","S. Sudan":"South Sudan",
  "Solomon Is.":"Solomon Islands","Falkland Is.":"Falkland Islands",
  "Falkland Islands (Islas Malvinas)":"Falkland Islands",
  "Czechia":"Czech Republic","Czech Rep.":"Czech Republic","Czech Republic":"Czech Republic",
  "Kosovo":"Kosovo","Macedonia":"North Macedonia","North Macedonia":"North Macedonia",
  "Fiji":"Fiji","New Caledonia":"New Caledonia",
  "Bosnia and Herz.":"Bosnia and Herzegovina","Bosnia and Herzegovina":"Bosnia and Herzegovina",
  "Dem. Rep. Congo":"DR Congo","Congo, Dem. Rep.":"DR Congo","Democratic Republic of the Congo":"DR Congo",
  "Congo":"Republic of Congo","Republic of the Congo":"Republic of Congo",
  "Central African Rep.":"Central African Republic","Dominican Rep.":"Dominican Republic",
  "Eq. Guinea":"Equatorial Guinea","Equatorial Guinea":"Equatorial Guinea",
  "S. Korea":"South Korea","Republic of Korea":"South Korea",
  "N. Korea":"North Korea","Dem. Rep. Korea":"North Korea",
  "United States of America":"United States","United States":"United States",
  "Russian Federation":"Russia","Lao PDR":"Laos","Laos":"Laos",
  "eSwatini":"Eswatini","Swaziland":"Eswatini",
  "Timor-Leste":"Timor-Leste","East Timor":"Timor-Leste",
  "Taiwan":"Taiwan","Luxembourg":"Luxembourg",
};

const DB = {
  "Afghanistan":{"code":"af","capital":"Kabul","population":"40M","pop":40,"area":"652K km²","currency":"AFN","language":"Dari / Pashto","region":"Asia","gdp":"$14B","gdpN":14,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Albania":{"code":"al","capital":"Tirana","population":"2.8M","pop":2.8,"area":"28.7K km²","currency":"ALL (L)","language":"Albanian","region":"Europe","gdp":"$22B","gdpN":22,"religion":"Islam / Christianity","status":"Independent nation"},
  "Algeria":{"code":"dz","capital":"Algiers","population":"45M","pop":45,"area":"2.38M km²","currency":"DZD","language":"Arabic / Berber","region":"Africa","gdp":"$194B","gdpN":194,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Angola":{"code":"ao","capital":"Luanda","population":"34M","pop":34,"area":"1.25M km²","currency":"AOA (Kz)","language":"Portuguese","region":"Africa","gdp":"$92B","gdpN":92,"religion":"Roman Catholic","status":"Independent nation"},
  "Antarctica":{"code":"aq","capital":"None","population":"~5K seasonal","pop":0.005,"area":"14M km²","currency":"N/A","language":"Various","region":"Antarctica","gdp":"N/A","gdpN":0,"religion":"N/A","status":"International territory"},
  "Argentina":{"code":"ar","capital":"Buenos Aires","population":"46M","pop":46,"area":"2.78M km²","currency":"ARS ($)","language":"Spanish","region":"South America","gdp":"$632B","gdpN":632,"religion":"Roman Catholic","status":"Independent nation"},
  "Armenia":{"code":"am","capital":"Yerevan","population":"3M","pop":3,"area":"29.7K km²","currency":"AMD","language":"Armenian","region":"Asia","gdp":"$24B","gdpN":24,"religion":"Armenian Apostolic","status":"Independent nation"},
  "Australia":{"code":"au","capital":"Canberra","population":"26M","pop":26,"area":"7.69M km²","currency":"AUD ($)","language":"English","region":"Oceania","gdp":"$1.7T","gdpN":1700,"religion":"Christian (majority)","status":"Independent nation"},
  "Austria":{"code":"at","capital":"Vienna","population":"9M","pop":9,"area":"83.9K km²","currency":"EUR (€)","language":"German","region":"Europe","gdp":"$471B","gdpN":471,"religion":"Roman Catholic","status":"Independent nation"},
  "Azerbaijan":{"code":"az","capital":"Baku","population":"10M","pop":10,"area":"86.6K km²","currency":"AZN (₼)","language":"Azerbaijani","region":"Asia","gdp":"$78B","gdpN":78,"religion":"Islam (Shia)","status":"Independent nation"},
  "Bangladesh":{"code":"bd","capital":"Dhaka","population":"167M","pop":167,"area":"148K km²","currency":"BDT (৳)","language":"Bengali","region":"Asia","gdp":"$460B","gdpN":460,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Belarus":{"code":"by","capital":"Minsk","population":"9.4M","pop":9.4,"area":"207K km²","currency":"BYN (Br)","language":"Belarusian / Russian","region":"Europe","gdp":"$73B","gdpN":73,"religion":"Eastern Orthodox","status":"Independent nation"},
  "Belgium":{"code":"be","capital":"Brussels","population":"11M","pop":11,"area":"30.5K km²","currency":"EUR (€)","language":"Dutch / French","region":"Europe","gdp":"$579B","gdpN":579,"religion":"Roman Catholic","status":"Independent nation"},
  "Belize":{"code":"bz","capital":"Belmopan","population":"420K","pop":0.42,"area":"22.9K km²","currency":"BZD ($)","language":"English","region":"North America","gdp":"$3.2B","gdpN":3.2,"religion":"Roman Catholic","status":"Independent nation"},
  "Benin":{"code":"bj","capital":"Porto-Novo","population":"13M","pop":13,"area":"114K km²","currency":"XOF (Fr)","language":"French","region":"Africa","gdp":"$17B","gdpN":17,"religion":"Christianity / Islam / Vodou","status":"Independent nation"},
  "Bhutan":{"code":"bt","capital":"Thimphu","population":"780K","pop":0.78,"area":"38.4K km²","currency":"BTN (Nu)","language":"Dzongkha","region":"Asia","gdp":"$2.9B","gdpN":2.9,"religion":"Buddhism (Vajrayana)","status":"Independent nation"},
  "Bolivia":{"code":"bo","capital":"Sucre","population":"12M","pop":12,"area":"1.1M km²","currency":"BOB (Bs)","language":"Spanish","region":"South America","gdp":"$44B","gdpN":44,"religion":"Roman Catholic","status":"Independent nation"},
  "Bosnia and Herzegovina":{"code":"ba","capital":"Sarajevo","population":"3.3M","pop":3.3,"area":"51.2K km²","currency":"BAM (KM)","language":"Bosnian / Serbian / Croatian","region":"Europe","gdp":"$25B","gdpN":25,"religion":"Islam / Orthodox / Catholic","status":"Independent nation"},
  "Botswana":{"code":"bw","capital":"Gaborone","population":"2.6M","pop":2.6,"area":"582K km²","currency":"BWP (P)","language":"English / Setswana","region":"Africa","gdp":"$19B","gdpN":19,"religion":"Christian (majority)","status":"Independent nation"},
  "Brazil":{"code":"br","capital":"Brasília","population":"215M","pop":215,"area":"8.51M km²","currency":"BRL (R$)","language":"Portuguese","region":"South America","gdp":"$2.1T","gdpN":2100,"religion":"Roman Catholic","status":"Independent nation"},
  "Brunei":{"code":"bn","capital":"Bandar Seri Begawan","population":"450K","pop":0.45,"area":"5.77K km²","currency":"BND ($)","language":"Malay","region":"Asia","gdp":"$14B","gdpN":14,"religion":"Islam (official)","status":"Independent nation"},
  "Bulgaria":{"code":"bg","capital":"Sofia","population":"6.5M","pop":6.5,"area":"110K km²","currency":"BGN (lv)","language":"Bulgarian","region":"Europe","gdp":"$100B","gdpN":100,"religion":"Eastern Orthodox","status":"Independent nation"},
  "Burkina Faso":{"code":"bf","capital":"Ouagadougou","population":"22M","pop":22,"area":"274K km²","currency":"XOF (Fr)","language":"French","region":"Africa","gdp":"$18B","gdpN":18,"religion":"Islam / Christianity","status":"Independent nation"},
  "Burundi":{"code":"bi","capital":"Gitega","population":"12M","pop":12,"area":"27.8K km²","currency":"BIF (Fr)","language":"Kirundi / French","region":"Africa","gdp":"$3B","gdpN":3,"religion":"Christianity","status":"Independent nation"},
  "Cambodia":{"code":"kh","capital":"Phnom Penh","population":"17M","pop":17,"area":"181K km²","currency":"KHR (៛)","language":"Khmer","region":"Asia","gdp":"$29B","gdpN":29,"religion":"Theravada Buddhism","status":"Independent nation"},
  "Cameroon":{"code":"cm","capital":"Yaoundé","population":"27M","pop":27,"area":"475K km²","currency":"XAF (Fr)","language":"French / English","region":"Africa","gdp":"$44B","gdpN":44,"religion":"Christianity / Islam","status":"Independent nation"},
  "Canada":{"code":"ca","capital":"Ottawa","population":"38M","pop":38,"area":"9.98M km²","currency":"CAD ($)","language":"English / French","region":"North America","gdp":"$2.1T","gdpN":2100,"religion":"Christian (majority)","status":"Independent nation"},
  "Central African Republic":{"code":"cf","capital":"Bangui","population":"5.5M","pop":5.5,"area":"623K km²","currency":"XAF (Fr)","language":"French / Sango","region":"Africa","gdp":"$3B","gdpN":3,"religion":"Christianity / Islam","status":"Independent nation"},
  "Chad":{"code":"td","capital":"N'Djamena","population":"17M","pop":17,"area":"1.28M km²","currency":"XAF (Fr)","language":"French / Arabic","region":"Africa","gdp":"$11B","gdpN":11,"religion":"Islam / Christianity","status":"Independent nation"},
  "Chile":{"code":"cl","capital":"Santiago","population":"19M","pop":19,"area":"756K km²","currency":"CLP ($)","language":"Spanish","region":"South America","gdp":"$317B","gdpN":317,"religion":"Roman Catholic","status":"Independent nation"},
  "China":{"code":"cn","capital":"Beijing","population":"1.4B","pop":1400,"area":"9.6M km²","currency":"CNY (¥)","language":"Mandarin","region":"Asia","gdp":"$17.9T","gdpN":17900,"religion":"Buddhist / Folk / Non-religious","status":"Independent nation"},
  "Colombia":{"code":"co","capital":"Bogotá","population":"52M","pop":52,"area":"1.14M km²","currency":"COP ($)","language":"Spanish","region":"South America","gdp":"$343B","gdpN":343,"religion":"Roman Catholic","status":"Independent nation"},
  "Republic of Congo":{"code":"cg","capital":"Brazzaville","population":"5.8M","pop":5.8,"area":"342K km²","currency":"XAF (Fr)","language":"French","region":"Africa","gdp":"$11B","gdpN":11,"religion":"Christianity","status":"Independent nation"},
  "Costa Rica":{"code":"cr","capital":"San José","population":"5.2M","pop":5.2,"area":"51.1K km²","currency":"CRC (₡)","language":"Spanish","region":"North America","gdp":"$68B","gdpN":68,"religion":"Roman Catholic","status":"Independent nation"},
  "Croatia":{"code":"hr","capital":"Zagreb","population":"3.9M","pop":3.9,"area":"56.6K km²","currency":"EUR (€)","language":"Croatian","region":"Europe","gdp":"$71B","gdpN":71,"religion":"Roman Catholic","status":"Independent nation"},
  "Cuba":{"code":"cu","capital":"Havana","population":"11M","pop":11,"area":"109K km²","currency":"CUP ($)","language":"Spanish","region":"North America","gdp":"$107B","gdpN":107,"religion":"Roman Catholic / Santería","status":"Independent nation"},
  "Cyprus":{"code":"cy","capital":"Nicosia","population":"1.2M","pop":1.2,"area":"9.25K km²","currency":"EUR (€)","language":"Greek / Turkish","region":"Europe","gdp":"$32B","gdpN":32,"religion":"Greek Orthodox","status":"Independent nation"},
  "Czech Republic":{"code":"cz","capital":"Prague","population":"10.9M","pop":10.9,"area":"78.9K km²","currency":"CZK (Kč)","language":"Czech","region":"Europe","gdp":"$290B","gdpN":290,"religion":"Non-religious (majority)","status":"Independent nation"},
  "DR Congo":{"code":"cd","capital":"Kinshasa","population":"100M","pop":100,"area":"2.34M km²","currency":"CDF (Fr)","language":"French","region":"Africa","gdp":"$65B","gdpN":65,"religion":"Christianity","status":"Independent nation"},
  "Denmark":{"code":"dk","capital":"Copenhagen","population":"5.9M","pop":5.9,"area":"43K km²","currency":"DKK (kr)","language":"Danish","region":"Europe","gdp":"$406B","gdpN":406,"religion":"Evangelical Lutheran","status":"Independent nation"},
  "Djibouti":{"code":"dj","capital":"Djibouti","population":"1M","pop":1,"area":"23.2K km²","currency":"DJF (Fr)","language":"French / Arabic","region":"Africa","gdp":"$4B","gdpN":4,"religion":"Islam","status":"Independent nation"},
  "Dominican Republic":{"code":"do","capital":"Santo Domingo","population":"11M","pop":11,"area":"48.7K km²","currency":"DOP ($)","language":"Spanish","region":"North America","gdp":"$119B","gdpN":119,"religion":"Roman Catholic","status":"Independent nation"},
  "Ecuador":{"code":"ec","capital":"Quito","population":"18M","pop":18,"area":"284K km²","currency":"USD ($)","language":"Spanish","region":"South America","gdp":"$115B","gdpN":115,"religion":"Roman Catholic","status":"Independent nation"},
  "Egypt":{"code":"eg","capital":"Cairo","population":"107M","pop":107,"area":"1M km²","currency":"EGP","language":"Arabic","region":"Africa","gdp":"$476B","gdpN":476,"religion":"Islam (Sunni)","status":"Independent nation"},
  "El Salvador":{"code":"sv","capital":"San Salvador","population":"6.5M","pop":6.5,"area":"21K km²","currency":"USD ($)","language":"Spanish","region":"North America","gdp":"$32B","gdpN":32,"religion":"Roman Catholic","status":"Independent nation"},
  "Equatorial Guinea":{"code":"gq","capital":"Malabo","population":"1.5M","pop":1.5,"area":"28.1K km²","currency":"XAF (Fr)","language":"Spanish / French","region":"Africa","gdp":"$12B","gdpN":12,"religion":"Roman Catholic","status":"Independent nation"},
  "Eritrea":{"code":"er","capital":"Asmara","population":"3.5M","pop":3.5,"area":"117K km²","currency":"ERN (Nfk)","language":"Tigrinya / Arabic","region":"Africa","gdp":"$2B","gdpN":2,"religion":"Christianity / Islam","status":"Independent nation"},
  "Estonia":{"code":"ee","capital":"Tallinn","population":"1.3M","pop":1.3,"area":"45.2K km²","currency":"EUR (€)","language":"Estonian","region":"Europe","gdp":"$38B","gdpN":38,"religion":"Lutheran / Non-religious","status":"Independent nation"},
  "Eswatini":{"code":"sz","capital":"Mbabane","population":"1.2M","pop":1.2,"area":"17.4K km²","currency":"SZL (L)","language":"Swati / English","region":"Africa","gdp":"$5B","gdpN":5,"religion":"Christianity","status":"Independent nation"},
  "Ethiopia":{"code":"et","capital":"Addis Ababa","population":"123M","pop":123,"area":"1.1M km²","currency":"ETB (Br)","language":"Amharic","region":"Africa","gdp":"$127B","gdpN":127,"religion":"Ethiopian Orthodox / Islam","status":"Independent nation"},
  "Falkland Islands":{"code":"fk","capital":"Stanley","population":"3.5K","pop":0.004,"area":"12.2K km²","currency":"FKP (£)","language":"English","region":"South America","gdp":"$282M","gdpN":0.3,"religion":"Christianity","status":"British Overseas Territory"},
  "Fiji":{"code":"fj","capital":"Suva","population":"930K","pop":0.93,"area":"18.3K km²","currency":"FJD ($)","language":"English / Fijian / Hindi","region":"Oceania","gdp":"$4.9B","gdpN":4.9,"religion":"Christianity / Hinduism","status":"Independent nation"},
  "Finland":{"code":"fi","capital":"Helsinki","population":"5.5M","pop":5.5,"area":"338K km²","currency":"EUR (€)","language":"Finnish","region":"Europe","gdp":"$301B","gdpN":301,"religion":"Evangelical Lutheran","status":"Independent nation"},
  "France":{"code":"fr","capital":"Paris","population":"68M","pop":68,"area":"640K km²","currency":"EUR (€)","language":"French","region":"Europe","gdp":"$2.9T","gdpN":2900,"religion":"Roman Catholic","status":"Independent nation"},
  "French Southern Antarctic Lands":{"code":"tf","capital":"Port-aux-Français","population":"~150","pop":0.00015,"area":"439K km²","currency":"EUR (€)","language":"French","region":"Antarctica","gdp":"N/A","gdpN":0,"religion":"N/A","status":"French overseas territory"},
  "Gabon":{"code":"ga","capital":"Libreville","population":"2.3M","pop":2.3,"area":"268K km²","currency":"XAF (Fr)","language":"French","region":"Africa","gdp":"$20B","gdpN":20,"religion":"Christianity","status":"Independent nation"},
  "Gambia":{"code":"gm","capital":"Banjul","population":"2.6M","pop":2.6,"area":"11.3K km²","currency":"GMD (D)","language":"English","region":"Africa","gdp":"$2B","gdpN":2,"religion":"Islam","status":"Independent nation"},
  "Georgia":{"code":"ge","capital":"Tbilisi","population":"3.7M","pop":3.7,"area":"69.7K km²","currency":"GEL (₾)","language":"Georgian","region":"Asia","gdp":"$28B","gdpN":28,"religion":"Georgian Orthodox","status":"Independent nation"},
  "Germany":{"code":"de","capital":"Berlin","population":"84M","pop":84,"area":"357K km²","currency":"EUR (€)","language":"German","region":"Europe","gdp":"$4.1T","gdpN":4100,"religion":"Christian (mixed)","status":"Independent nation"},
  "Ghana":{"code":"gh","capital":"Accra","population":"32M","pop":32,"area":"239K km²","currency":"GHS (₵)","language":"English","region":"Africa","gdp":"$77B","gdpN":77,"religion":"Christian / Islam","status":"Independent nation"},
  "Greece":{"code":"gr","capital":"Athens","population":"10.7M","pop":10.7,"area":"132K km²","currency":"EUR (€)","language":"Greek","region":"Europe","gdp":"$217B","gdpN":217,"religion":"Greek Orthodox","status":"Independent nation"},
  "Greenland":{"code":"gl","capital":"Nuuk","population":"56K","pop":0.056,"area":"836K km²","currency":"DKK (kr)","language":"Greenlandic / Danish","region":"North America","gdp":"$3.2B","gdpN":3.2,"religion":"Christianity (Lutheran)","status":"Autonomous territory of Denmark"},
  "Guatemala":{"code":"gt","capital":"Guatemala City","population":"17M","pop":17,"area":"109K km²","currency":"GTQ (Q)","language":"Spanish","region":"North America","gdp":"$89B","gdpN":89,"religion":"Roman Catholic / Protestant","status":"Independent nation"},
  "Guinea":{"code":"gn","capital":"Conakry","population":"13M","pop":13,"area":"246K km²","currency":"GNF (Fr)","language":"French","region":"Africa","gdp":"$16B","gdpN":16,"religion":"Islam","status":"Independent nation"},
  "Guinea-Bissau":{"code":"gw","capital":"Bissau","population":"2M","pop":2,"area":"36.1K km²","currency":"XOF (Fr)","language":"Portuguese","region":"Africa","gdp":"$2B","gdpN":2,"religion":"Islam / Indigenous","status":"Independent nation"},
  "Guyana":{"code":"gy","capital":"Georgetown","population":"0.8M","pop":0.8,"area":"215K km²","currency":"GYD ($)","language":"English","region":"South America","gdp":"$15B","gdpN":15,"religion":"Christianity / Hinduism","status":"Independent nation"},
  "Haiti":{"code":"ht","capital":"Port-au-Prince","population":"11M","pop":11,"area":"27.8K km²","currency":"HTG (G)","language":"Haitian Creole / French","region":"North America","gdp":"$20B","gdpN":20,"religion":"Roman Catholic / Vodou","status":"Independent nation"},
  "Honduras":{"code":"hn","capital":"Tegucigalpa","population":"10M","pop":10,"area":"112K km²","currency":"HNL (L)","language":"Spanish","region":"North America","gdp":"$31B","gdpN":31,"religion":"Roman Catholic","status":"Independent nation"},
  "Hungary":{"code":"hu","capital":"Budapest","population":"10M","pop":10,"area":"93K km²","currency":"HUF (Ft)","language":"Hungarian","region":"Europe","gdp":"$197B","gdpN":197,"religion":"Roman Catholic","status":"Independent nation"},
  "Iceland":{"code":"is","capital":"Reykjavík","population":"0.4M","pop":0.4,"area":"103K km²","currency":"ISK (kr)","language":"Icelandic","region":"Europe","gdp":"$25B","gdpN":25,"religion":"Evangelical Lutheran","status":"Independent nation"},
  "India":{"code":"in","capital":"New Delhi","population":"1.44B","pop":1440,"area":"3.29M km²","currency":"INR (₹)","language":"Hindi / English","region":"Asia","gdp":"$3.5T","gdpN":3500,"religion":"Hindu","status":"Independent nation"},
  "Indonesia":{"code":"id","capital":"Jakarta","population":"276M","pop":276,"area":"1.9M km²","currency":"IDR (Rp)","language":"Indonesian","region":"Asia","gdp":"$1.4T","gdpN":1400,"religion":"Islam (majority)","status":"Independent nation"},
  "Iran":{"code":"ir","capital":"Tehran","population":"88M","pop":88,"area":"1.65M km²","currency":"IRR","language":"Persian","region":"Asia","gdp":"$367B","gdpN":367,"religion":"Islam (Shia)","status":"Independent nation"},
  "Iraq":{"code":"iq","capital":"Baghdad","population":"42M","pop":42,"area":"438K km²","currency":"IQD","language":"Arabic","region":"Asia","gdp":"$264B","gdpN":264,"religion":"Islam","status":"Independent nation"},
  "Ireland":{"code":"ie","capital":"Dublin","population":"5.1M","pop":5.1,"area":"70.3K km²","currency":"EUR (€)","language":"English / Irish","region":"Europe","gdp":"$590B","gdpN":590,"religion":"Roman Catholic","status":"Independent nation"},
  "Israel":{"code":"il","capital":"Jerusalem","population":"9.7M","pop":9.7,"area":"20.8K km²","currency":"ILS (₪)","language":"Hebrew / Arabic","region":"Asia","gdp":"$522B","gdpN":522,"religion":"Judaism","status":"Independent nation"},
  "Italy":{"code":"it","capital":"Rome","population":"59M","pop":59,"area":"301K km²","currency":"EUR (€)","language":"Italian","region":"Europe","gdp":"$2.1T","gdpN":2100,"religion":"Roman Catholic","status":"Independent nation"},
  "Ivory Coast":{"code":"ci","capital":"Yamoussoukro","population":"27M","pop":27,"area":"322K km²","currency":"XOF (Fr)","language":"French","region":"Africa","gdp":"$70B","gdpN":70,"religion":"Islam / Christianity","status":"Independent nation"},
  "Jamaica":{"code":"jm","capital":"Kingston","population":"3M","pop":3,"area":"10.9K km²","currency":"JMD ($)","language":"English","region":"North America","gdp":"$17B","gdpN":17,"religion":"Christianity","status":"Independent nation"},
  "Japan":{"code":"jp","capital":"Tokyo","population":"124M","pop":124,"area":"378K km²","currency":"JPY (¥)","language":"Japanese","region":"Asia","gdp":"$4.2T","gdpN":4200,"religion":"Shinto / Buddhist","status":"Independent nation"},
  "Jordan":{"code":"jo","capital":"Amman","population":"10M","pop":10,"area":"89.3K km²","currency":"JOD","language":"Arabic","region":"Asia","gdp":"$49B","gdpN":49,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Kazakhstan":{"code":"kz","capital":"Astana","population":"19M","pop":19,"area":"2.72M km²","currency":"KZT (₸)","language":"Kazakh / Russian","region":"Asia","gdp":"$261B","gdpN":261,"religion":"Islam / Russian Orthodox","status":"Independent nation"},
  "Kenya":{"code":"ke","capital":"Nairobi","population":"55M","pop":55,"area":"582K km²","currency":"KES (KSh)","language":"Swahili / English","region":"Africa","gdp":"$118B","gdpN":118,"religion":"Christian (majority)","status":"Independent nation"},
  "Kosovo":{"code":"xk","capital":"Pristina","population":"1.8M","pop":1.8,"area":"10.9K km²","currency":"EUR (€)","language":"Albanian / Serbian","region":"Europe","gdp":"$10B","gdpN":10,"religion":"Islam","status":"Partially recognised state"},
  "Kuwait":{"code":"kw","capital":"Kuwait City","population":"4.3M","pop":4.3,"area":"17.8K km²","currency":"KWD","language":"Arabic","region":"Asia","gdp":"$162B","gdpN":162,"religion":"Islam","status":"Independent nation"},
  "Kyrgyzstan":{"code":"kg","capital":"Bishkek","population":"6.7M","pop":6.7,"area":"200K km²","currency":"KGS (с)","language":"Kyrgyz / Russian","region":"Asia","gdp":"$11B","gdpN":11,"religion":"Islam","status":"Independent nation"},
  "Laos":{"code":"la","capital":"Vientiane","population":"7.4M","pop":7.4,"area":"237K km²","currency":"LAK (₭)","language":"Lao","region":"Asia","gdp":"$15B","gdpN":15,"religion":"Theravada Buddhism","status":"Independent nation"},
  "Latvia":{"code":"lv","capital":"Riga","population":"1.8M","pop":1.8,"area":"64.6K km²","currency":"EUR (€)","language":"Latvian","region":"Europe","gdp":"$41B","gdpN":41,"religion":"Lutheran / Catholic","status":"Independent nation"},
  "Lebanon":{"code":"lb","capital":"Beirut","population":"5.5M","pop":5.5,"area":"10.5K km²","currency":"LBP","language":"Arabic","region":"Asia","gdp":"$18B","gdpN":18,"religion":"Islam / Christianity","status":"Independent nation"},
  "Lesotho":{"code":"ls","capital":"Maseru","population":"2.2M","pop":2.2,"area":"30.4K km²","currency":"LSL (L)","language":"Sesotho / English","region":"Africa","gdp":"$2B","gdpN":2,"religion":"Christianity","status":"Independent nation"},
  "Liberia":{"code":"lr","capital":"Monrovia","population":"5.2M","pop":5.2,"area":"111K km²","currency":"LRD ($)","language":"English","region":"Africa","gdp":"$4B","gdpN":4,"religion":"Christianity / Islam","status":"Independent nation"},
  "Libya":{"code":"ly","capital":"Tripoli","population":"7M","pop":7,"area":"1.76M km²","currency":"LYD","language":"Arabic","region":"Africa","gdp":"$50B","gdpN":50,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Lithuania":{"code":"lt","capital":"Vilnius","population":"2.8M","pop":2.8,"area":"65.3K km²","currency":"EUR (€)","language":"Lithuanian","region":"Europe","gdp":"$72B","gdpN":72,"religion":"Roman Catholic","status":"Independent nation"},
  "Luxembourg":{"code":"lu","capital":"Luxembourg City","population":"660K","pop":0.66,"area":"2.59K km²","currency":"EUR (€)","language":"Luxembourgish / French / German","region":"Europe","gdp":"$86B","gdpN":86,"religion":"Roman Catholic","status":"Independent nation"},
  "Madagascar":{"code":"mg","capital":"Antananarivo","population":"28M","pop":28,"area":"587K km²","currency":"MGA (Ar)","language":"Malagasy / French","region":"Africa","gdp":"$14B","gdpN":14,"religion":"Christianity / Indigenous","status":"Independent nation"},
  "Malawi":{"code":"mw","capital":"Lilongwe","population":"20M","pop":20,"area":"118K km²","currency":"MWK (MK)","language":"English / Chichewa","region":"Africa","gdp":"$12B","gdpN":12,"religion":"Christianity","status":"Independent nation"},
  "Malaysia":{"code":"my","capital":"Kuala Lumpur","population":"33M","pop":33,"area":"330K km²","currency":"MYR (RM)","language":"Malay","region":"Asia","gdp":"$440B","gdpN":440,"religion":"Islam (official)","status":"Independent nation"},
  "Mali":{"code":"ml","capital":"Bamako","population":"22M","pop":22,"area":"1.24M km²","currency":"XOF (Fr)","language":"French","region":"Africa","gdp":"$19B","gdpN":19,"religion":"Islam","status":"Independent nation"},
  "Mauritania":{"code":"mr","capital":"Nouakchott","population":"4.6M","pop":4.6,"area":"1.03M km²","currency":"MRU (UM)","language":"Arabic","region":"Africa","gdp":"$10B","gdpN":10,"religion":"Islam","status":"Independent nation"},
  "Mexico":{"code":"mx","capital":"Mexico City","population":"130M","pop":130,"area":"1.96M km²","currency":"MXN ($)","language":"Spanish","region":"North America","gdp":"$1.3T","gdpN":1300,"religion":"Roman Catholic","status":"Independent nation"},
  "Moldova":{"code":"md","capital":"Chișinău","population":"2.6M","pop":2.6,"area":"33.8K km²","currency":"MDL (L)","language":"Romanian","region":"Europe","gdp":"$15B","gdpN":15,"religion":"Eastern Orthodox","status":"Independent nation"},
  "Mongolia":{"code":"mn","capital":"Ulaanbaatar","population":"3.4M","pop":3.4,"area":"1.56M km²","currency":"MNT (₮)","language":"Mongolian","region":"Asia","gdp":"$17B","gdpN":17,"religion":"Buddhism / Shamanism","status":"Independent nation"},
  "Montenegro":{"code":"me","capital":"Podgorica","population":"0.6M","pop":0.6,"area":"13.8K km²","currency":"EUR (€)","language":"Montenegrin","region":"Europe","gdp":"$6B","gdpN":6,"religion":"Eastern Orthodox","status":"Independent nation"},
  "Morocco":{"code":"ma","capital":"Rabat","population":"37M","pop":37,"area":"447K km²","currency":"MAD","language":"Arabic / Berber","region":"Africa","gdp":"$142B","gdpN":142,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Mozambique":{"code":"mz","capital":"Maputo","population":"32M","pop":32,"area":"802K km²","currency":"MZN (MT)","language":"Portuguese","region":"Africa","gdp":"$18B","gdpN":18,"religion":"Christianity / Islam","status":"Independent nation"},
  "Myanmar":{"code":"mm","capital":"Naypyidaw","population":"55M","pop":55,"area":"677K km²","currency":"MMK (K)","language":"Burmese","region":"Asia","gdp":"$65B","gdpN":65,"religion":"Theravada Buddhism","status":"Independent nation"},
  "Namibia":{"code":"na","capital":"Windhoek","population":"2.6M","pop":2.6,"area":"824K km²","currency":"NAD ($)","language":"English","region":"Africa","gdp":"$12B","gdpN":12,"religion":"Christianity","status":"Independent nation"},
  "Nepal":{"code":"np","capital":"Kathmandu","population":"30M","pop":30,"area":"147K km²","currency":"NPR (₨)","language":"Nepali","region":"Asia","gdp":"$40B","gdpN":40,"religion":"Hinduism","status":"Independent nation"},
  "Netherlands":{"code":"nl","capital":"Amsterdam","population":"17M","pop":17,"area":"41.5K km²","currency":"EUR (€)","language":"Dutch","region":"Europe","gdp":"$1.1T","gdpN":1100,"religion":"Christian / Non-religious","status":"Independent nation"},
  "New Caledonia":{"code":"nc","capital":"Nouméa","population":"270K","pop":0.27,"area":"18.6K km²","currency":"XPF (Fr)","language":"French","region":"Oceania","gdp":"$9.4B","gdpN":9.4,"religion":"Christianity","status":"French special collectivity"},
  "New Zealand":{"code":"nz","capital":"Wellington","population":"5.1M","pop":5.1,"area":"268K km²","currency":"NZD ($)","language":"English / Māori","region":"Oceania","gdp":"$249B","gdpN":249,"religion":"Christian / Non-religious","status":"Independent nation"},
  "Nicaragua":{"code":"ni","capital":"Managua","population":"6.8M","pop":6.8,"area":"130K km²","currency":"NIO (C$)","language":"Spanish","region":"North America","gdp":"$15B","gdpN":15,"religion":"Roman Catholic","status":"Independent nation"},
  "Niger":{"code":"ne","capital":"Niamey","population":"25M","pop":25,"area":"1.27M km²","currency":"XOF (Fr)","language":"French","region":"Africa","gdp":"$14B","gdpN":14,"religion":"Islam","status":"Independent nation"},
  "Nigeria":{"code":"ng","capital":"Abuja","population":"220M","pop":220,"area":"924K km²","currency":"NGN (₦)","language":"English","region":"Africa","gdp":"$477B","gdpN":477,"religion":"Islam / Christianity","status":"Independent nation"},
  "North Korea":{"code":"kp","capital":"Pyongyang","population":"26M","pop":26,"area":"120K km²","currency":"KPW (₩)","language":"Korean","region":"Asia","gdp":"$18B","gdpN":18,"religion":"Non-religious / Juche","status":"Independent nation"},
  "North Macedonia":{"code":"mk","capital":"Skopje","population":"2.1M","pop":2.1,"area":"25.7K km²","currency":"MKD (den)","language":"Macedonian","region":"Europe","gdp":"$14B","gdpN":14,"religion":"Eastern Orthodox","status":"Independent nation"},
  "Northern Cyprus":{"code":"cy","capital":"North Nicosia","population":"372K","pop":0.37,"area":"3.36K km²","currency":"TRY (₺)","language":"Turkish","region":"Europe","gdp":"~$5B","gdpN":5,"religion":"Islam","status":"Recognised only by Turkey"},
  "Norway":{"code":"no","capital":"Oslo","population":"5.4M","pop":5.4,"area":"385K km²","currency":"NOK (kr)","language":"Norwegian","region":"Europe","gdp":"$546B","gdpN":546,"religion":"Church of Norway (Lutheran)","status":"Independent nation"},
  "Oman":{"code":"om","capital":"Muscat","population":"4.5M","pop":4.5,"area":"310K km²","currency":"OMR","language":"Arabic","region":"Asia","gdp":"$104B","gdpN":104,"religion":"Islam (Ibadi)","status":"Independent nation"},
  "Pakistan":{"code":"pk","capital":"Islamabad","population":"231M","pop":231,"area":"881K km²","currency":"PKR (₨)","language":"Urdu","region":"Asia","gdp":"$374B","gdpN":374,"religion":"Islam","status":"Independent nation"},
  "Palestine":{"code":"ps","capital":"Ramallah (adm.)","population":"5.4M","pop":5.4,"area":"6.02K km²","currency":"ILS / JOD","language":"Arabic","region":"Asia","gdp":"$19B","gdpN":19,"religion":"Islam / Christianity","status":"Partially recognised state"},
  "Panama":{"code":"pa","capital":"Panama City","population":"4.4M","pop":4.4,"area":"75.4K km²","currency":"USD ($)","language":"Spanish","region":"North America","gdp":"$76B","gdpN":76,"religion":"Roman Catholic","status":"Independent nation"},
  "Papua New Guinea":{"code":"pg","capital":"Port Moresby","population":"10M","pop":10,"area":"463K km²","currency":"PGK (K)","language":"English / Tok Pisin","region":"Oceania","gdp":"$30B","gdpN":30,"religion":"Christianity","status":"Independent nation"},
  "Paraguay":{"code":"py","capital":"Asunción","population":"7.4M","pop":7.4,"area":"407K km²","currency":"PYG (₲)","language":"Spanish / Guaraní","region":"South America","gdp":"$43B","gdpN":43,"religion":"Roman Catholic","status":"Independent nation"},
  "Peru":{"code":"pe","capital":"Lima","population":"33M","pop":33,"area":"1.28M km²","currency":"PEN (S/)","language":"Spanish","region":"South America","gdp":"$242B","gdpN":242,"religion":"Roman Catholic","status":"Independent nation"},
  "Philippines":{"code":"ph","capital":"Manila","population":"115M","pop":115,"area":"300K km²","currency":"PHP (₱)","language":"Filipino / English","region":"Asia","gdp":"$440B","gdpN":440,"religion":"Roman Catholic","status":"Independent nation"},
  "Poland":{"code":"pl","capital":"Warsaw","population":"38M","pop":38,"area":"313K km²","currency":"PLN (zł)","language":"Polish","region":"Europe","gdp":"$688B","gdpN":688,"religion":"Roman Catholic","status":"Independent nation"},
  "Portugal":{"code":"pt","capital":"Lisbon","population":"10M","pop":10,"area":"92K km²","currency":"EUR (€)","language":"Portuguese","region":"Europe","gdp":"$268B","gdpN":268,"religion":"Roman Catholic","status":"Independent nation"},
  "Puerto Rico":{"code":"pr","capital":"San Juan","population":"3.2M","pop":3.2,"area":"9.1K km²","currency":"USD ($)","language":"Spanish / English","region":"North America","gdp":"$105B","gdpN":105,"religion":"Roman Catholic","status":"Unincorporated US territory"},
  "Qatar":{"code":"qa","capital":"Doha","population":"2.7M","pop":2.7,"area":"11.6K km²","currency":"QAR","language":"Arabic","region":"Asia","gdp":"$235B","gdpN":235,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Romania":{"code":"ro","capital":"Bucharest","population":"19M","pop":19,"area":"238K km²","currency":"RON (lei)","language":"Romanian","region":"Europe","gdp":"$301B","gdpN":301,"religion":"Eastern Orthodox","status":"Independent nation"},
  "Russia":{"code":"ru","capital":"Moscow","population":"144M","pop":144,"area":"17.1M km²","currency":"RUB (₽)","language":"Russian","region":"Europe / Asia","gdp":"$1.8T","gdpN":1800,"religion":"Russian Orthodox","status":"Independent nation"},
  "Rwanda":{"code":"rw","capital":"Kigali","population":"13M","pop":13,"area":"26.3K km²","currency":"RWF (Fr)","language":"Kinyarwanda / French / English","region":"Africa","gdp":"$13B","gdpN":13,"religion":"Christianity","status":"Independent nation"},
  "Saudi Arabia":{"code":"sa","capital":"Riyadh","population":"36M","pop":36,"area":"2.15M km²","currency":"SAR","language":"Arabic","region":"Asia","gdp":"$1.1T","gdpN":1100,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Senegal":{"code":"sn","capital":"Dakar","population":"17M","pop":17,"area":"197K km²","currency":"XOF (Fr)","language":"French","region":"Africa","gdp":"$28B","gdpN":28,"religion":"Islam","status":"Independent nation"},
  "Serbia":{"code":"rs","capital":"Belgrade","population":"6.8M","pop":6.8,"area":"77.5K km²","currency":"RSD (din)","language":"Serbian","region":"Europe","gdp":"$63B","gdpN":63,"religion":"Serbian Orthodox","status":"Independent nation"},
  "Sierra Leone":{"code":"sl","capital":"Freetown","population":"8.1M","pop":8.1,"area":"71.7K km²","currency":"SLE (Le)","language":"English","region":"Africa","gdp":"$4B","gdpN":4,"religion":"Islam / Christianity","status":"Independent nation"},
  "Slovakia":{"code":"sk","capital":"Bratislava","population":"5.5M","pop":5.5,"area":"49K km²","currency":"EUR (€)","language":"Slovak","region":"Europe","gdp":"$116B","gdpN":116,"religion":"Roman Catholic","status":"Independent nation"},
  "Slovenia":{"code":"si","capital":"Ljubljana","population":"2.1M","pop":2.1,"area":"20.3K km²","currency":"EUR (€)","language":"Slovenian","region":"Europe","gdp":"$67B","gdpN":67,"religion":"Roman Catholic","status":"Independent nation"},
  "Solomon Islands":{"code":"sb","capital":"Honiara","population":"720K","pop":0.72,"area":"28.9K km²","currency":"SBD ($)","language":"English","region":"Oceania","gdp":"$1.6B","gdpN":1.6,"religion":"Christianity","status":"Independent nation"},
  "Somalia":{"code":"so","capital":"Mogadishu","population":"17M","pop":17,"area":"638K km²","currency":"SOS (Sh)","language":"Somali / Arabic","region":"Africa","gdp":"$8B","gdpN":8,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Somaliland":{"code":"so","capital":"Hargeisa","population":"5.7M","pop":5.7,"area":"176K km²","currency":"SOS (Sh)","language":"Somali","region":"Africa","gdp":"~$2B","gdpN":2,"religion":"Islam (Sunni)","status":"Self-declared republic — unrecognised"},
  "South Africa":{"code":"za","capital":"Pretoria","population":"60M","pop":60,"area":"1.22M km²","currency":"ZAR (R)","language":"11 official langs","region":"Africa","gdp":"$405B","gdpN":405,"religion":"Christian (majority)","status":"Independent nation"},
  "South Korea":{"code":"kr","capital":"Seoul","population":"52M","pop":52,"area":"100K km²","currency":"KRW (₩)","language":"Korean","region":"Asia","gdp":"$1.7T","gdpN":1700,"religion":"Christian / Buddhist","status":"Independent nation"},
  "South Sudan":{"code":"ss","capital":"Juba","population":"11M","pop":11,"area":"620K km²","currency":"SSP (£)","language":"English / Arabic","region":"Africa","gdp":"$5B","gdpN":5,"religion":"Christianity / Indigenous","status":"Independent nation"},
  "Spain":{"code":"es","capital":"Madrid","population":"47M","pop":47,"area":"506K km²","currency":"EUR (€)","language":"Spanish","region":"Europe","gdp":"$1.6T","gdpN":1600,"religion":"Roman Catholic","status":"Independent nation"},
  "Sri Lanka":{"code":"lk","capital":"Colombo","population":"22M","pop":22,"area":"65.6K km²","currency":"LKR (Rs)","language":"Sinhala / Tamil","region":"Asia","gdp":"$74B","gdpN":74,"religion":"Theravada Buddhism","status":"Independent nation"},
  "Sudan":{"code":"sd","capital":"Khartoum","population":"46M","pop":46,"area":"1.88M km²","currency":"SDG","language":"Arabic","region":"Africa","gdp":"$30B","gdpN":30,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Suriname":{"code":"sr","capital":"Paramaribo","population":"0.6M","pop":0.6,"area":"164K km²","currency":"SRD ($)","language":"Dutch","region":"South America","gdp":"$4B","gdpN":4,"religion":"Christianity / Hinduism","status":"Independent nation"},
  "Sweden":{"code":"se","capital":"Stockholm","population":"10M","pop":10,"area":"450K km²","currency":"SEK (kr)","language":"Swedish","region":"Europe","gdp":"$585B","gdpN":585,"religion":"Church of Sweden (Lutheran)","status":"Independent nation"},
  "Switzerland":{"code":"ch","capital":"Bern","population":"8.7M","pop":8.7,"area":"41.3K km²","currency":"CHF (Fr)","language":"German / French / Italian","region":"Europe","gdp":"$869B","gdpN":869,"religion":"Christian (mixed)","status":"Independent nation"},
  "Syria":{"code":"sy","capital":"Damascus","population":"22M","pop":22,"area":"185K km²","currency":"SYP","language":"Arabic","region":"Asia","gdp":"$11B","gdpN":11,"religion":"Islam (majority)","status":"Independent nation"},
  "Taiwan":{"code":"tw","capital":"Taipei","population":"23M","pop":23,"area":"36K km²","currency":"TWD ($)","language":"Mandarin","region":"Asia","gdp":"$756B","gdpN":756,"religion":"Buddhism / Taoism","status":"Self-governing — disputed status"},
  "Tajikistan":{"code":"tj","capital":"Dushanbe","population":"10M","pop":10,"area":"143K km²","currency":"TJS (SM)","language":"Tajik","region":"Asia","gdp":"$11B","gdpN":11,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Tanzania":{"code":"tz","capital":"Dodoma","population":"63M","pop":63,"area":"945K km²","currency":"TZS (Sh)","language":"Swahili","region":"Africa","gdp":"$79B","gdpN":79,"religion":"Christian / Islam","status":"Independent nation"},
  "The Bahamas":{"code":"bs","capital":"Nassau","population":"410K","pop":0.41,"area":"13.9K km²","currency":"BSD ($)","language":"English","region":"North America","gdp":"$13.6B","gdpN":13.6,"religion":"Christianity","status":"Independent nation"},
  "Thailand":{"code":"th","capital":"Bangkok","population":"71M","pop":71,"area":"513K km²","currency":"THB (฿)","language":"Thai","region":"Asia","gdp":"$574B","gdpN":574,"religion":"Theravada Buddhism","status":"Independent nation"},
  "Timor-Leste":{"code":"tl","capital":"Dili","population":"1.3M","pop":1.3,"area":"14.9K km²","currency":"USD ($)","language":"Tetum / Portuguese","region":"Asia","gdp":"$2B","gdpN":2,"religion":"Roman Catholic","status":"Independent nation"},
  "Togo":{"code":"tg","capital":"Lomé","population":"8.5M","pop":8.5,"area":"56.8K km²","currency":"XOF (Fr)","language":"French","region":"Africa","gdp":"$8B","gdpN":8,"religion":"Christianity / Islam / Indigenous","status":"Independent nation"},
  "Trinidad and Tobago":{"code":"tt","capital":"Port of Spain","population":"1.4M","pop":1.4,"area":"5.13K km²","currency":"TTD ($)","language":"English","region":"North America","gdp":"$24B","gdpN":24,"religion":"Christianity / Hinduism","status":"Independent nation"},
  "Tunisia":{"code":"tn","capital":"Tunis","population":"12M","pop":12,"area":"164K km²","currency":"TND","language":"Arabic","region":"Africa","gdp":"$47B","gdpN":47,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Turkey":{"code":"tr","capital":"Ankara","population":"85M","pop":85,"area":"783K km²","currency":"TRY (₺)","language":"Turkish","region":"Asia / Europe","gdp":"$1.0T","gdpN":1000,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Turkmenistan":{"code":"tm","capital":"Ashgabat","population":"6M","pop":6,"area":"488K km²","currency":"TMT (T)","language":"Turkmen","region":"Asia","gdp":"$60B","gdpN":60,"religion":"Islam","status":"Independent nation"},
  "Uganda":{"code":"ug","capital":"Kampala","population":"48M","pop":48,"area":"242K km²","currency":"UGX (Sh)","language":"English / Swahili","region":"Africa","gdp":"$49B","gdpN":49,"religion":"Christianity","status":"Independent nation"},
  "Ukraine":{"code":"ua","capital":"Kyiv","population":"44M","pop":44,"area":"604K km²","currency":"UAH (₴)","language":"Ukrainian","region":"Europe","gdp":"$160B","gdpN":160,"religion":"Eastern Orthodox","status":"Independent nation"},
  "United Arab Emirates":{"code":"ae","capital":"Abu Dhabi","population":"9.7M","pop":9.7,"area":"83.6K km²","currency":"AED (د.إ)","language":"Arabic","region":"Asia","gdp":"$509B","gdpN":509,"religion":"Islam","status":"Independent nation"},
  "United Kingdom":{"code":"gb","capital":"London","population":"68M","pop":68,"area":"243K km²","currency":"GBP (£)","language":"English","region":"Europe","gdp":"$3.1T","gdpN":3100,"religion":"Christian (Anglican)","status":"Independent nation"},
  "United States":{"code":"us","capital":"Washington, D.C.","population":"335M","pop":335,"area":"9.83M km²","currency":"USD ($)","language":"English","region":"North America","gdp":"$27.4T","gdpN":27400,"religion":"Protestant / Catholic","status":"Independent nation"},
  "Uruguay":{"code":"uy","capital":"Montevideo","population":"3.5M","pop":3.5,"area":"176K km²","currency":"UYU ($)","language":"Spanish","region":"South America","gdp":"$71B","gdpN":71,"religion":"Roman Catholic","status":"Independent nation"},
  "Uzbekistan":{"code":"uz","capital":"Tashkent","population":"35M","pop":35,"area":"448K km²","currency":"UZS","language":"Uzbek","region":"Asia","gdp":"$90B","gdpN":90,"religion":"Islam (Sunni)","status":"Independent nation"},
  "Vanuatu":{"code":"vu","capital":"Port Vila","population":"330K","pop":0.33,"area":"12.2K km²","currency":"VUV (Vt)","language":"Bislama / English / French","region":"Oceania","gdp":"$980M","gdpN":0.98,"religion":"Christianity","status":"Independent nation"},
  "Venezuela":{"code":"ve","capital":"Caracas","population":"29M","pop":29,"area":"912K km²","currency":"VES","language":"Spanish","region":"South America","gdp":"$106B","gdpN":106,"religion":"Roman Catholic","status":"Independent nation"},
  "Vietnam":{"code":"vn","capital":"Hanoi","population":"98M","pop":98,"area":"331K km²","currency":"VND (₫)","language":"Vietnamese","region":"Asia","gdp":"$409B","gdpN":409,"religion":"Buddhist / Folk","status":"Independent nation"},
  "Western Sahara":{"code":"eh","capital":"El Aaiún","population":"600K","pop":0.6,"area":"266K km²","currency":"MAD","language":"Arabic / Spanish","region":"Africa","gdp":"~$906M","gdpN":0.9,"religion":"Islam (Sunni)","status":"Disputed — administered by Morocco"},
  "Yemen":{"code":"ye","capital":"Sana'a","population":"34M","pop":34,"area":"528K km²","currency":"YER","language":"Arabic","region":"Asia","gdp":"$21B","gdpN":21,"religion":"Islam","status":"Independent nation"},
  "Zambia":{"code":"zm","capital":"Lusaka","population":"19M","pop":19,"area":"753K km²","currency":"ZMW (K)","language":"English","region":"Africa","gdp":"$29B","gdpN":29,"religion":"Christianity","status":"Independent nation"},
  "Zimbabwe":{"code":"zw","capital":"Harare","population":"15M","pop":15,"area":"391K km²","currency":"ZWL ($)","language":"English / Shona / Ndebele","region":"Africa","gdp":"$26B","gdpN":26,"religion":"Christianity","status":"Independent nation"},
};

const REGION_COLORS = {
  "Africa":"#F0997B","Asia":"#AFA9EC","Europe":"#5DCAA5",
  "North America":"#EF9F27","South America":"#ED93B1",
  "Oceania":"#85B7EB","Antarctica":"#B4B2A9",
  "Europe / Asia":"#97C459","Asia / Europe":"#97C459",
};

const QUIZ_POOL = Object.entries(DB).filter(([, v]) => v.status === "Independent nation" && v.gdpN > 1);
const ALL_NAMES = Object.keys(DB).sort();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveCountry(name) {
  if (DB[name]) return [DB[name], name];
  const canonical = NAME_ALIASES[name];
  if (canonical && DB[canonical]) return [DB[canonical], canonical];
  const lo = name.toLowerCase();
  for (const k of Object.keys(DB)) {
    if (k.toLowerCase() === lo) return [DB[k], k];
  }
  return [null, name];
}

function interpolateLog(value, min, max, colorFn) {
  const t = (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min));
  const clamped = Math.min(1, Math.max(0, t));
  return colorFn(clamped);
}

function blueScale(t) {
  const r = Math.round(247 - t * 150);
  const g = Math.round(251 - t * 180);
  const b = Math.round(255 - t * 50);
  return `rgb(${r},${g},${b})`;
}

function greenScale(t) {
  const r = Math.round(240 - t * 150);
  const g = Math.round(253 - t * 120);
  const b = Math.round(244 - t * 200);
  return `rgb(${r},${g},${b})`;
}

function getCountryColor(name, mode) {
  const [info] = resolveCountry(name);
  if (!info) return "#c8dff0";
  if (mode === "population") return interpolateLog(Math.max(0.00015, info.pop), 0.00015, 1440, blueScale);
  if (mode === "gdp") return info.gdpN > 0 ? interpolateLog(Math.max(0.001, info.gdpN), 0.001, 27400, greenScale) : "#c8dff0";
  if (mode === "region") return REGION_COLORS[info.region] || "#B5D4F4";
  return "#c8e8f5";
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function pickRandom(exclude, n) { return shuffle(QUIZ_POOL.filter(([k]) => k !== exclude)).slice(0, n); }
function flagUrl(code) { return `https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/${code}.svg`; }

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value }) {
  return (
    <div style={{ background: "#f5f5f3", borderRadius: 8, padding: "10px 12px" }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", color: "#888", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function InfoPanel({ name, info }) {
  if (!name) {
    return (
      <div style={{ textAlign: "center", padding: "1.5rem", fontSize: 13, color: "#aaa" }}>
        Click any country or territory, or search above
      </div>
    );
  }
  if (!info) {
    return <div style={{ padding: "1rem" }}><strong>{name}</strong><p style={{ color: "#888", fontSize: 13 }}>Stats not yet available.</p></div>;
  }
  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
      <img src={flagUrl(info.code)} alt={`Flag of ${name}`} style={{ width: 80, height: 53, objectFit: "cover", borderRadius: 4, border: "0.5px solid #ddd", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 2 }}>{name}</div>
        {info.status && info.status !== "Independent nation" && (
          <span style={{ fontSize: 12, background: "#e6f1fb", color: "#185fa5", padding: "2px 8px", borderRadius: 6, display: "inline-block", marginBottom: 10 }}>{info.status}</span>
        )}
        <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>{info.region}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
          <StatCard label="Capital" value={info.capital} />
          <StatCard label="Population" value={info.population} />
          <StatCard label="Area" value={info.area} />
          <StatCard label="GDP" value={info.gdp} />
          <StatCard label="Currency" value={info.currency} />
          <StatCard label="Language" value={info.language} />
          <StatCard label="Religion" value={info.religion} />
        </div>
      </div>
    </div>
  );
}

function QuizPanel({ onExit }) {
  const [screen, setScreen] = useState("start"); // start | game
  const [quizMode, setQuizMode] = useState("flag");
  const [question, setQuestion] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState("");

  const buildQuestion = useCallback(() => {
    const [correctName, correctData] = QUIZ_POOL[Math.floor(Math.random() * QUIZ_POOL.length)];
    const wrongs = pickRandom(correctName, 3);
    const opts = shuffle([[correctName, correctData], ...wrongs]);
    setQuestion({ correctName, correctData, opts });
    setAnswered(false);
    setChosen(null);
    setFeedback("");
  }, []);

  const handleStart = () => { setScore(0); setTotal(0); buildQuestion(); setScreen("game"); };

  const handleAnswer = (pick, correct) => {
    if (answered) return;
    setAnswered(true);
    setChosen(pick);
    setTotal(t => t + 1);
    if (pick === correct) { setScore(s => s + 1); setFeedback("Correct!"); }
    else setFeedback(`Not quite — the answer is ${correct}.`);
  };

  const btnStyle = (name, correct) => {
    if (!answered) return { padding: "9px 12px", fontSize: 13, border: "0.5px solid #ddd", borderRadius: 8, background: "transparent", cursor: "pointer", textAlign: "left" };
    if (name === correct) return { padding: "9px 12px", fontSize: 13, border: "1.5px solid #1D9E75", borderRadius: 8, background: "#E1F5EE", color: "#085041", cursor: "default", textAlign: "left" };
    if (name === chosen) return { padding: "9px 12px", fontSize: 13, border: "1.5px solid #E24B4A", borderRadius: 8, background: "#FCEBEB", color: "#501313", cursor: "default", textAlign: "left" };
    return { padding: "9px 12px", fontSize: 13, border: "0.5px solid #ddd", borderRadius: 8, background: "transparent", cursor: "default", textAlign: "left", opacity: 0.5 };
  };

  const qmodes = ["flag", "capital", "map", "population"];
  const qmodeLabels = { flag: "Identify the flag", capital: "Name the capital", population: "Biggest population?" };

  if (screen === "start") return (
    <div style={{ textAlign: "center", padding: "1rem 0" }}>
      <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Geography Quiz</div>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Choose a quiz type then click start.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
        {["flag","capital","population"].map(m => (
          <button key={m} onClick={() => setQuizMode(m)}
            style={{ padding: "6px 12px", fontSize: 12, border: "0.5px solid #ddd", borderRadius: 8, background: quizMode === m ? "#7F77DD" : "transparent", color: quizMode === m ? "#fff" : "#888", cursor: "pointer" }}>
            {qmodeLabels[m]}
          </button>
        ))}
      </div>
      <button onClick={handleStart} style={{ padding: "9px 24px", fontSize: 14, border: "0.5px solid #7F77DD", borderRadius: 8, background: "#7F77DD", color: "#fff", cursor: "pointer" }}>
        Start quiz
      </button>
      <div style={{ marginTop: 12 }}>
        <button onClick={onExit} style={{ fontSize: 12, color: "#aaa", background: "transparent", border: "none", cursor: "pointer" }}>← back to map</button>
      </div>
    </div>
  );

  if (!question) return null;
  const { correctName, correctData, opts } = question;

  const renderOptions = () => {
    if (quizMode === "flag") {
      return opts.map(([n]) => (
        <button key={n} onClick={() => handleAnswer(n, correctName)} style={btnStyle(n, correctName)} disabled={answered}>{n}</button>
      ));
    }
    if (quizMode === "capital") {
      return opts.map(([n, d]) => (
        <button key={n} onClick={() => handleAnswer(d.capital, correctData.capital)} style={btnStyle(d.capital, correctData.capital)} disabled={answered}>{d.capital}</button>
      ));
    }
    if (quizMode === "population") {
      const group = opts.slice(0, 4);
      const biggest = group.reduce((a, b) => a[1].pop > b[1].pop ? a : b);
      return group.map(([n, d]) => (
        <button key={n} onClick={() => handleAnswer(n, biggest[0])} style={btnStyle(n, biggest[0])} disabled={answered}>
          {n}<br /><span style={{ fontSize: 11, color: "#888" }}>{d.population}</span>
        </button>
      ));
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "#888" }}>Score: {score} / {total}</span>
        <button onClick={onExit} style={{ fontSize: 12, color: "#888", background: "transparent", border: "0.5px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>End quiz</button>
      </div>
      {quizMode === "flag" && (
        <img src={flagUrl(correctData.code)} alt="Flag" style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 4, border: "0.5px solid #ddd", marginBottom: 14, display: "block" }} />
      )}
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
        {quizMode === "flag" && "Which country does this flag belong to?"}
        {quizMode === "capital" && `What is the capital of ${correctName}?`}
        {quizMode === "population" && "Which of these has the largest population?"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {renderOptions()}
      </div>
      {feedback && <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: feedback === "Correct!" ? "#1D9E75" : "#E24B4A" }}>{feedback}</div>}
      {answered && (
        <button onClick={buildQuestion} style={{ padding: "8px 16px", fontSize: 13, border: "0.5px solid #ddd", borderRadius: 8, background: "#f5f5f3", cursor: "pointer" }}>
          Next question →
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WorldMap() {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const featuresRef = useRef([]);
  const pathGenRef = useRef(null);
  const zoomRef = useRef(null);
  const d3Ref = useRef(null);

  const [mode, setMode] = useState("default");
  const [selectedName, setSelectedName] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [quizActive, setQuizActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeSearchIdx, setActiveSearchIdx] = useState(-1);
  const [searchOpen, setSearchOpen] = useState(false);

  const W = 1010, H = 560;

  // Load D3 + TopoJSON dynamically
  useEffect(() => {
    const loadLibs = async () => {
      const [d3, topo] = await Promise.all([
        import("https://cdn.jsdelivr.net/npm/d3@7/+esm"),
        import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm"),
      ]);
      d3Ref.current = { d3, topo };
      initMap(d3, topo);
    };
    loadLibs();
  }, []);

  const initMap = (d3, topo) => {
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    const proj = d3.geoNaturalEarth1().scale(153).translate([W / 2, H / 2]);
    const pathGen = d3.geoPath().projection(proj);
    pathGenRef.current = pathGen;

    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", (e) => {
      g.attr("transform", e.transform);
    });
    zoomRef.current = zoom;
    svg.call(zoom);

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((r) => r.json())
      .then((world) => {
        const features = topo.feature(world, world.objects.countries).features;
        const nameById = {};
        world.objects.countries.geometries.forEach((geo) => {
          if (geo.properties?.name) nameById[+geo.id] = geo.properties.name;
        });
        features.forEach((f) => {
          f._name = f.properties?.name || nameById[+f.id] || String(f.id);
        });
        featuresRef.current = features;

        g.selectAll(".country")
          .data(features)
          .enter()
          .append("path")
          .attr("class", "country")
          .attr("d", pathGen)
          .attr("fill", (d) => getCountryColor(d._name, "default"))
          .attr("stroke", "#4a7fa8")
          .attr("stroke-width", 0.6)
          .style("cursor", "pointer")
          .on("click", (event, d) => {
            handleCountryClick(d._name, g, features);
          })
          .append("title")
          .text((d) => d._name);
      });
  };

  const handleCountryClick = useCallback((geoName, g, features) => {
    const [info, canonical] = resolveCountry(geoName);
    if (g) {
      g.selectAll(".country").attr("stroke", "#4a7fa8").attr("stroke-width", 0.6).attr("stroke-dasharray", null);
      g.selectAll(".country").filter((d) => {
        const [, can] = resolveCountry(d._name);
        return can === canonical;
      })
        .attr("stroke", "#111")
        .attr("stroke-width", 2)
        .attr("fill", "#FAC775");
    }
    setSelectedName(canonical || geoName);
    setSelectedInfo(info);
  }, []);

  const flyToCountry = useCallback((dbName) => {
    const { d3 } = d3Ref.current || {};
    if (!d3 || !zoomRef.current || !pathGenRef.current) return;
    const feat = featuresRef.current.find((f) => {
      const [, can] = resolveCountry(f._name);
      return can === dbName;
    });
    if (!feat) return;
    const bounds = pathGenRef.current.bounds(feat);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const cx = (bounds[0][0] + bounds[1][0]) / 2;
    const cy = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = Math.max(1.5, Math.min(8, 0.85 / Math.max(dx / W, dy / H)));
    const tx = W / 2 - scale * cx;
    const ty = H / 2 - scale * cy;
    d3.select(svgRef.current).transition().duration(750)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }, []);

  const applyMode = useCallback((newMode) => {
    const { d3 } = d3Ref.current || {};
    if (!d3) return;
    const g = d3.select(gRef.current);
    const isChoropleth = newMode !== "default";
    g.selectAll(".country")
      .attr("fill", (d) => getCountryColor(d._name, newMode))
      .attr("stroke", isChoropleth ? "#fff" : "#4a7fa8")
      .attr("stroke-width", isChoropleth ? 0.4 : 0.6);
    setMode(newMode);
  }, []);

  const selectCountry = useCallback((dbName) => {
    const { d3 } = d3Ref.current || {};
    if (!d3) return;
    const g = d3.select(gRef.current);
    const info = DB[dbName];
    g.selectAll(".country").attr("stroke", mode === "default" ? "#4a7fa8" : "#fff").attr("stroke-width", mode === "default" ? 0.6 : 0.4);
    g.selectAll(".country").filter((d) => {
      const [, can] = resolveCountry(d._name);
      return can === dbName;
    })
      .attr("stroke", "#111")
      .attr("stroke-width", 2)
      .attr("fill", "#FAC775");
    setSelectedName(dbName);
    setSelectedInfo(info || null);
    flyToCountry(dbName);
    setSearchQuery("");
    setSearchOpen(false);
  }, [mode, flyToCountry]);

  const resetZoom = () => {
    const { d3 } = d3Ref.current || {};
    if (!d3) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.transform, d3.zoomIdentity);
  };
  const zoomIn = () => {
    const { d3 } = d3Ref.current || {};
    if (!d3) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.6);
  };
  const zoomOut = () => {
    const { d3 } = d3Ref.current || {};
    if (!d3) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.625);
  };

  // Search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setSearchOpen(false); return; }
    const q = searchQuery.toLowerCase();
    const matches = ALL_NAMES.filter((n) => n.toLowerCase().includes(q)).slice(0, 8);
    setSearchResults(matches);
    setSearchOpen(matches.length > 0);
    setActiveSearchIdx(-1);
  }, [searchQuery]);

  const handleSearchKey = (e) => {
    if (!searchResults.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveSearchIdx((i) => Math.min(i + 1, searchResults.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveSearchIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && activeSearchIdx >= 0) { selectCountry(searchResults[activeSearchIdx]); }
    else if (e.key === "Escape") { setSearchOpen(false); }
  };

  const btnBase = { padding: "7px 13px", fontSize: 13, border: "0.5px solid #ddd", borderRadius: 8, background: "transparent", color: "#888", cursor: "pointer", whiteSpace: "nowrap" };
  const btnActive = { ...btnBase, background: "#e6f1fb", color: "#185fa5", borderColor: "#85b7eb" };
  const quizBtnBase = { ...btnBase };
  const quizBtnActive = { ...btnBase, background: "#7F77DD", color: "#fff", borderColor: "#7F77DD" };

  const legendItems = mode === "region"
    ? Object.entries(REGION_COLORS).filter(([r]) => !r.includes("/"))
    : null;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "1rem 0", maxWidth: "100%" }}>
      {/* Top bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKey}
            onFocus={() => searchResults.length && setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            placeholder="Search for a country or territory..."
            style={{ width: "100%", boxSizing: "border-box", padding: "8px 12px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }}
          />
          {searchOpen && (
            <div style={{ position: "absolute", zIndex: 20, background: "#fff", border: "0.5px solid #ddd", borderRadius: 8, width: "100%", maxHeight: 200, overflowY: "auto", marginTop: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              {searchResults.map((n, i) => (
                <div key={n} onMouseDown={() => selectCountry(n)}
                  style={{ padding: "8px 14px", fontSize: 14, cursor: "pointer", background: i === activeSearchIdx ? "#f5f5f3" : "#fff" }}>
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>
        {["default","population","gdp","region"].map((m) => (
          <button key={m} onClick={() => !quizActive && applyMode(m)} style={mode === m && !quizActive ? btnActive : btnBase}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
        <button onClick={() => setQuizActive((v) => !v)} style={quizActive ? quizBtnActive : quizBtnBase}>
          {quizActive ? "Exit quiz" : "Quiz mode"}
        </button>
      </div>

      {/* Legend */}
      {mode !== "default" && !quizActive && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
          {mode === "region" ? legendItems.map(([r, c]) => (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#888" }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: c, flexShrink: 0 }} />
              <span>{r}</span>
            </div>
          )) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#888" }}>{mode === "population" ? "Population" : "GDP"}:</span>
              <div style={{ height: 10, width: 160, borderRadius: 4, background: mode === "population" ? "linear-gradient(to right, #e8f4ff, #0d3b6e)" : "linear-gradient(to right, #e8f8e8, #0d4a0d)" }} />
              <span style={{ fontSize: 11, color: "#aaa" }}>{mode === "population" ? "1.4B+" : "$27T+"}</span>
            </div>
          )}
        </div>
      )}

      {/* Map */}
      <div style={{ position: "relative", borderRadius: 12, border: "0.5px solid #ddd", overflow: "hidden", cursor: "grab" }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", userSelect: "none" }}>
          <defs>
            <linearGradient id="ocean-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a6ea8" />
              <stop offset="100%" stopColor="#0d4f80" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="url(#ocean-grad)" />
          <g ref={gRef} />
        </svg>
        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", flexDirection: "column", gap: 4, zIndex: 10 }}>
          {[{ label: "+", fn: zoomIn }, { label: "⊙", fn: resetZoom }, { label: "−", fn: zoomOut }].map(({ label, fn }) => (
            <button key={label} onClick={fn}
              style={{ width: 28, height: 28, border: "0.5px solid #ddd", borderRadius: 8, background: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Info / Quiz panel */}
      <div style={{ background: "#fff", border: "0.5px solid #ddd", borderRadius: 12, padding: "1.25rem", marginTop: 12 }}>
        {quizActive
          ? <QuizPanel onExit={() => setQuizActive(false)} />
          : <InfoPanel name={selectedName} info={selectedInfo} />
        }
      </div>
    </div>
  );
}
