/* Timezones are borrowed from Google Calendar */

// eslint-disable-next-line max-len
// [...$0.children].map(el => ({ name: (el.getAttribute('aria-name')|| '').replace(/\(.*?\)(.+)/, '$1').trim(), id: el.getAttribute('data-value'), offset: +(el.getAttribute('aria-name')|| '').replace(/\(.*?(-?[0-9]{2}):([0-9]{2})\).*/, (all, one, two) => +one + (two / 60) * (one > 0 ? 1 : -1)) }))

export default [
  {
    name: 'Niue Time',
    id: 'Pacific/Niue',
    offset: -11,
  },
  {
    name: 'Samoa Standard Time',
    id: 'Pacific/Pago_Pago',
    offset: -11,
  },
  {
    name: 'Cook Islands Standard Time',
    id: 'Pacific/Rarotonga',
    offset: -10,
  },
  {
    name: 'Hawaii-Aleutian Standard Time',
    id: 'Pacific/Honolulu',
    offset: -10,
  },
  {
    name: 'Hawaii-Aleutian Time',
    id: 'America/Adak',
    offset: -10,
  },
  {
    name: 'Tahiti Time',
    id: 'Pacific/Tahiti',
    offset: -10,
  },
  {
    name: 'Marquesas Time',
    id: 'Pacific/Marquesas',
    offset: -9.5,
  },
  {
    name: 'Alaska Time - Anchorage',
    id: 'America/Anchorage',
    offset: -9,
  },
  {
    name: 'Alaska Time - Juneau',
    id: 'America/Juneau',
    offset: -9,
  },
  {
    name: 'Alaska Time - Nome',
    id: 'America/Nome',
    offset: -9,
  },
  {
    name: 'Alaska Time - Sitka',
    id: 'America/Sitka',
    offset: -9,
  },
  {
    name: 'Alaska Time - Yakutat',
    id: 'America/Yakutat',
    offset: -9,
  },
  {
    name: 'Gambier Time',
    id: 'Pacific/Gambier',
    offset: -9,
  },
  {
    name: 'Pacific Time - Dawson',
    id: 'America/Dawson',
    offset: -8,
  },
  {
    name: 'Pacific Time - Los Angeles',
    id: 'America/Los_Angeles',
    offset: -8,
  },
  {
    name: 'Pacific Time - Metlakatla',
    id: 'America/Metlakatla',
    offset: -8,
  },
  {
    name: 'Pacific Time - Tijuana',
    id: 'America/Tijuana',
    offset: -8,
  },
  {
    name: 'Pacific Time - Vancouver',
    id: 'America/Vancouver',
    offset: -8,
  },
  {
    name: 'Pacific Time - Whitehorse',
    id: 'America/Whitehorse',
    offset: -8,
  },
  {
    name: 'Pitcairn Time',
    id: 'Pacific/Pitcairn',
    offset: -8,
  },
  {
    name: 'Mexican Pacific Standard Time',
    id: 'America/Hermosillo',
    offset: -7,
  },
  {
    name: 'Mexican Pacific Time - Chihuahua',
    id: 'America/Chihuahua',
    offset: -7,
  },
  {
    name: 'Mexican Pacific Time - Mazatlan',
    id: 'America/Mazatlan',
    offset: -7,
  },
  {
    name: 'Mountain Standard Time - Creston',
    id: 'America/Creston',
    offset: -7,
  },
  {
    name: 'Mountain Standard Time - Dawson Creek',
    id: 'America/Dawson_Creek',
    offset: -7,
  },
  {
    name: 'Mountain Standard Time - Fort Nelson',
    id: 'America/Fort_Nelson',
    offset: -7,
  },
  {
    name: 'Mountain Standard Time - Phoenix',
    id: 'America/Phoenix',
    offset: -7,
  },
  {
    name: 'Mountain Time - Boise',
    id: 'America/Boise',
    offset: -7,
  },
  {
    name: 'Mountain Time - Cambridge Bay',
    id: 'America/Cambridge_Bay',
    offset: -7,
  },
  {
    name: 'Mountain Time - Denver',
    id: 'America/Denver',
    offset: -7,
  },
  {
    name: 'Mountain Time - Edmonton',
    id: 'America/Edmonton',
    offset: -7,
  },
  {
    name: 'Mountain Time - Inuvik',
    id: 'America/Inuvik',
    offset: -7,
  },
  {
    name: 'Mountain Time - Ojinaga',
    id: 'America/Ojinaga',
    offset: -7,
  },
  {
    name: 'Mountain Time - Yellowknife',
    id: 'America/Yellowknife',
    offset: -7,
  },
  {
    name: 'Central Standard Time - Belize',
    id: 'America/Belize',
    offset: -6,
  },
  {
    name: 'Central Standard Time - Costa Rica',
    id: 'America/Costa_Rica',
    offset: -6,
  },
  {
    name: 'Central Standard Time - El Salvador',
    id: 'America/El_Salvador',
    offset: -6,
  },
  {
    name: 'Central Standard Time - Guatemala',
    id: 'America/Guatemala',
    offset: -6,
  },
  {
    name: 'Central Standard Time - Managua',
    id: 'America/Managua',
    offset: -6,
  },
  {
    name: 'Central Standard Time - Regina',
    id: 'America/Regina',
    offset: -6,
  },
  {
    name: 'Central Standard Time - Swift Current',
    id: 'America/Swift_Current',
    offset: -6,
  },
  {
    name: 'Central Standard Time - Tegucigalpa',
    id: 'America/Tegucigalpa',
    offset: -6,
  },
  {
    name: 'Central Time - Bahia Banderas',
    id: 'America/Bahia_Banderas',
    offset: -6,
  },
  {
    name: 'Central Time - Beulah, North Dakota',
    id: 'America/North_Dakota/Beulah',
    offset: -6,
  },
  {
    name: 'Central Time - Center, North Dakota',
    id: 'America/North_Dakota/Center',
    offset: -6,
  },
  {
    name: 'Central Time - Chicago',
    id: 'America/Chicago',
    offset: -6,
  },
  {
    name: 'Central Time - Knox, Indiana',
    id: 'America/Indiana/Knox',
    offset: -6,
  },
  {
    name: 'Central Time - Matamoros',
    id: 'America/Matamoros',
    offset: -6,
  },
  {
    name: 'Central Time - Menominee',
    id: 'America/Menominee',
    offset: -6,
  },
  {
    name: 'Central Time - Merida',
    id: 'America/Merida',
    offset: -6,
  },
  {
    name: 'Central Time - Mexico City',
    id: 'America/Mexico_City',
    offset: -6,
  },
  {
    name: 'Central Time - Monterrey',
    id: 'America/Monterrey',
    offset: -6,
  },
  {
    name: 'Central Time - New Salem, North Dakota',
    id: 'America/North_Dakota/New_Salem',
    offset: -6,
  },
  {
    name: 'Central Time - Rainy River',
    id: 'America/Rainy_River',
    offset: -6,
  },
  {
    name: 'Central Time - Rankin Inlet',
    id: 'America/Rankin_Inlet',
    offset: -6,
  },
  {
    name: 'Central Time - Resolute',
    id: 'America/Resolute',
    offset: -6,
  },
  {
    name: 'Central Time - Tell City, Indiana',
    id: 'America/Indiana/Tell_City',
    offset: -6,
  },
  {
    name: 'Central Time - Winnipeg',
    id: 'America/Winnipeg',
    offset: -6,
  },
  {
    name: 'Galapagos Time',
    id: 'Pacific/Galapagos',
    offset: -6,
  },
  {
    name: 'Acre Standard Time - Eirunepe',
    id: 'America/Eirunepe',
    offset: -5,
  },
  {
    name: 'Acre Standard Time - Rio Branco',
    id: 'America/Rio_Branco',
    offset: -5,
  },
  {
    name: 'Colombia Standard Time',
    id: 'America/Bogota',
    offset: -5,
  },
  {
    name: 'Cuba Time',
    id: 'America/Havana',
    offset: -5,
  },
  {
    name: 'Easter Island Time',
    id: 'Pacific/Easter',
    offset: -5,
  },
  {
    name: 'Eastern Standard Time - Atikokan',
    id: 'America/Atikokan',
    offset: -5,
  },
  {
    name: 'Eastern Standard Time - Cancun',
    id: 'America/Cancun',
    offset: -5,
  },
  {
    name: 'Eastern Standard Time - Jamaica',
    id: 'America/Jamaica',
    offset: -5,
  },
  {
    name: 'Eastern Standard Time - Panama',
    id: 'America/Panama',
    offset: -5,
  },
  {
    name: 'Eastern Time - Detroit',
    id: 'America/Detroit',
    offset: -5,
  },
  {
    name: 'Eastern Time - Grand Turk',
    id: 'America/Grand_Turk',
    offset: -5,
  },
  {
    name: 'Eastern Time - Indianapolis',
    id: 'America/Indiana/Indianapolis',
    offset: -5,
  },
  {
    name: 'Eastern Time - Iqaluit',
    id: 'America/Iqaluit',
    offset: -5,
  },
  {
    name: 'Eastern Time - Louisville',
    id: 'America/Kentucky/Louisville',
    offset: -5,
  },
  {
    name: 'Eastern Time - Marengo, Indiana',
    id: 'America/Indiana/Marengo',
    offset: -5,
  },
  {
    name: 'Eastern Time - Monticello, Kentucky',
    id: 'America/Kentucky/Monticello',
    offset: -5,
  },
  {
    name: 'Eastern Time - Nassau',
    id: 'America/Nassau',
    offset: -5,
  },
  {
    name: 'Eastern Time - New York',
    id: 'America/New_York',
    offset: -5,
  },
  {
    name: 'Eastern Time - Nipigon',
    id: 'America/Nipigon',
    offset: -5,
  },
  {
    name: 'Eastern Time - Pangnirtung',
    id: 'America/Pangnirtung',
    offset: -5,
  },
  {
    name: 'Eastern Time - Petersburg, Indiana',
    id: 'America/Indiana/Petersburg',
    offset: -5,
  },
  {
    name: 'Eastern Time - Port-au-Prince',
    id: 'America/Port-au-Prince',
    offset: -5,
  },
  {
    name: 'Eastern Time - Thunder Bay',
    id: 'America/Thunder_Bay',
    offset: -5,
  },
  {
    name: 'Eastern Time - Toronto',
    id: 'America/Toronto',
    offset: -5,
  },
  {
    name: 'Eastern Time - Vevay, Indiana',
    id: 'America/Indiana/Vevay',
    offset: -5,
  },
  {
    name: 'Eastern Time - Vincennes, Indiana',
    id: 'America/Indiana/Vincennes',
    offset: -5,
  },
  {
    name: 'Eastern Time - Winamac, Indiana',
    id: 'America/Indiana/Winamac',
    offset: -5,
  },
  {
    name: 'Ecuador Time',
    id: 'America/Guayaquil',
    offset: -5,
  },
  {
    name: 'Peru Standard Time',
    id: 'America/Lima',
    offset: -5,
  },
  {
    name: 'Amazon Standard Time - Boa Vista',
    id: 'America/Boa_Vista',
    offset: -4,
  },
  {
    name: 'Amazon Standard Time - Manaus',
    id: 'America/Manaus',
    offset: -4,
  },
  {
    name: 'Amazon Standard Time - Porto Velho',
    id: 'America/Porto_Velho',
    offset: -4,
  },
  {
    name: 'Atlantic Standard Time - Barbados',
    id: 'America/Barbados',
    offset: -4,
  },
  {
    name: 'Atlantic Standard Time - Blanc-Sablon',
    id: 'America/Blanc-Sablon',
    offset: -4,
  },
  {
    name: 'Atlantic Standard Time - Curaçao',
    id: 'America/Curacao',
    offset: -4,
  },
  {
    name: 'Atlantic Standard Time - Martinique',
    id: 'America/Martinique',
    offset: -4,
  },
  {
    name: 'Atlantic Standard Time - Port of Spain',
    id: 'America/Port_of_Spain',
    offset: -4,
  },
  {
    name: 'Atlantic Standard Time - Puerto Rico',
    id: 'America/Puerto_Rico',
    offset: -4,
  },
  {
    name: 'Atlantic Standard Time - Santo Domingo',
    id: 'America/Santo_Domingo',
    offset: -4,
  },
  {
    name: 'Atlantic Time - Bermuda',
    id: 'Atlantic/Bermuda',
    offset: -4,
  },
  {
    name: 'Atlantic Time - Glace Bay',
    id: 'America/Glace_Bay',
    offset: -4,
  },
  {
    name: 'Atlantic Time - Goose Bay',
    id: 'America/Goose_Bay',
    offset: -4,
  },
  {
    name: 'Atlantic Time - Halifax',
    id: 'America/Halifax',
    offset: -4,
  },
  {
    name: 'Atlantic Time - Moncton',
    id: 'America/Moncton',
    offset: -4,
  },
  {
    name: 'Atlantic Time - Thule',
    id: 'America/Thule',
    offset: -4,
  },
  {
    name: 'Bolivia Time',
    id: 'America/La_Paz',
    offset: -4,
  },
  {
    name: 'Guyana Time',
    id: 'America/Guyana',
    offset: -4,
  },
  {
    name: 'Venezuela Time',
    id: 'America/Caracas',
    offset: -4,
  },
  {
    name: 'Newfoundland Time',
    id: 'America/St_Johns',
    offset: -3.5,
  },
  {
    name: 'Amazon Time (Campo Grande)',
    id: 'America/Campo_Grande',
    offset: -3,
  },
  {
    name: 'Amazon Time (Cuiaba)',
    id: 'America/Cuiaba',
    offset: -3,
  },
  {
    name: 'Argentina Standard Time - Buenos Aires',
    id: 'America/Argentina/Buenos_Aires',
    offset: -3,
  },
  {
    name: 'Argentina Standard Time - Catamarca',
    id: 'America/Argentina/Catamarca',
    offset: -3,
  },
  {
    name: 'Argentina Standard Time - Cordoba',
    id: 'America/Argentina/Cordoba',
    offset: -3,
  },
  {
    name: 'Argentina Standard Time - Jujuy',
    id: 'America/Argentina/Jujuy',
    offset: -3,
  },
  {
    name: 'Argentina Standard Time - La Rioja',
    id: 'America/Argentina/La_Rioja',
    offset: -3,
  },
  {
    name: 'Argentina Standard Time - Mendoza',
    id: 'America/Argentina/Mendoza',
    offset: -3,
  },
  {
    name: 'Argentina Standard Time - Rio Gallegos',
    id: 'America/Argentina/Rio_Gallegos',
    offset: -3,
  },
  {
    name: 'Argentina Standard Time - Salta',
    id: 'America/Argentina/Salta',
    offset: -3,
  },
  {
    name: 'Argentina Standard Time - San Juan',
    id: 'America/Argentina/San_Juan',
    offset: -3,
  },
  {
    name: 'Argentina Standard Time - Tucuman',
    id: 'America/Argentina/Tucuman',
    offset: -3,
  },
  {
    name: 'Argentina Standard Time - Ushuaia',
    id: 'America/Argentina/Ushuaia',
    offset: -3,
  },
  {
    name: 'Brasilia Standard Time - Araguaina',
    id: 'America/Araguaina',
    offset: -3,
  },
  {
    name: 'Brasilia Standard Time - Bahia',
    id: 'America/Bahia',
    offset: -3,
  },
  {
    name: 'Brasilia Standard Time - Belem',
    id: 'America/Belem',
    offset: -3,
  },
  {
    name: 'Brasilia Standard Time - Fortaleza',
    id: 'America/Fortaleza',
    offset: -3,
  },
  {
    name: 'Brasilia Standard Time - Maceio',
    id: 'America/Maceio',
    offset: -3,
  },
  {
    name: 'Brasilia Standard Time - Recife',
    id: 'America/Recife',
    offset: -3,
  },
  {
    name: 'Brasilia Standard Time - Santarem',
    id: 'America/Santarem',
    offset: -3,
  },
  {
    name: 'Chile Time',
    id: 'America/Santiago',
    offset: -3,
  },
  {
    name: 'Falkland Islands Standard Time',
    id: 'Atlantic/Stanley',
    offset: -3,
  },
  {
    name: 'French Guiana Time',
    id: 'America/Cayenne',
    offset: -3,
  },
  {
    name: 'Palmer Time',
    id: 'Antarctica/Palmer',
    offset: -3,
  },
  {
    name: 'Paraguay Time',
    id: 'America/Asuncion',
    offset: -3,
  },
  {
    name: 'Punta Arenas Time',
    id: 'America/Punta_Arenas',
    offset: -3,
  },
  {
    name: 'Rothera Time',
    id: 'Antarctica/Rothera',
    offset: -3,
  },
  {
    name: 'St. Pierre & Miquelon Time',
    id: 'America/Miquelon',
    offset: -3,
  },
  {
    name: 'Suriid Time',
    id: 'America/Paramaribo',
    offset: -3,
  },
  {
    name: 'Uruguay Standard Time',
    id: 'America/Montevideo',
    offset: -3,
  },
  {
    name: 'West Greenland Time',
    id: 'America/Godthab',
    offset: -3,
  },
  {
    name: 'Western Argentina Standard Time',
    id: 'America/Argentina/San_Luis',
    offset: -3,
  },
  {
    name: 'Brasilia Time',
    id: 'America/Sao_Paulo',
    offset: -2,
  },
  {
    name: 'Fernando de Noronha Standard Time',
    id: 'America/Noronha',
    offset: -2,
  },
  {
    name: 'South Georgia Time',
    id: 'Atlantic/South_Georgia',
    offset: -2,
  },
  {
    name: 'Azores Time',
    id: 'Atlantic/Azores',
    offset: -1,
  },
  {
    name: 'Cape Verde Standard Time',
    id: 'Atlantic/Cape_Verde',
    offset: -1,
  },
  {
    name: 'East Greenland Time',
    id: 'America/Scoresbysund',
    offset: -1,
  },
  {
    name: 'Coordinated Universal Time',
    id: 'UTC',
    offset: 0,
  },
  {
    name: 'Greenwich Mean Time',
    id: 'Etc/GMT',
    offset: 0,
  },
  {
    name: 'Greenwich Mean Time - Abidjan',
    id: 'Africa/Abidjan',
    offset: 0,
  },
  {
    name: 'Greenwich Mean Time - Accra',
    id: 'Africa/Accra',
    offset: 0,
  },
  {
    name: 'Greenwich Mean Time - Bissau',
    id: 'Africa/Bissau',
    offset: 0,
  },
  {
    name: 'Greenwich Mean Time - Danmarkshavn',
    id: 'America/Danmarkshavn',
    offset: 0,
  },
  {
    name: 'Greenwich Mean Time - Monrovia',
    id: 'Africa/Monrovia',
    offset: 0,
  },
  {
    name: 'Greenwich Mean Time - Reykjavik',
    id: 'Atlantic/Reykjavik',
    offset: 0,
  },
  {
    name: 'Greenwich Mean Time - São Tomé',
    id: 'Africa/Sao_Tome',
    offset: 0,
  },
  {
    name: 'Ireland Time',
    id: 'Europe/Dublin',
    offset: 0,
  },
  {
    name: 'Troll Time',
    id: 'Antarctica/Troll',
    offset: 0,
  },
  {
    name: 'United Kingdom Time',
    id: 'Europe/London',
    offset: 0,
  },
  {
    name: 'Western European Time - Canary',
    id: 'Atlantic/Canary',
    offset: 0,
  },
  {
    name: 'Western European Time - Faroe',
    id: 'Atlantic/Faroe',
    offset: 0,
  },
  {
    name: 'Western European Time - Lisbon',
    id: 'Europe/Lisbon',
    offset: 0,
  },
  {
    name: 'Western European Time - Madeira',
    id: 'Atlantic/Madeira',
    offset: 0,
  },
  {
    name: 'Central European Standard Time - Algiers',
    id: 'Africa/Algiers',
    offset: 1,
  },
  {
    name: 'Central European Standard Time - Tunis',
    id: 'Africa/Tunis',
    offset: 1,
  },
  {
    name: 'Central European Time - Amsterdam',
    id: 'Europe/Amsterdam',
    offset: 1,
  },
  {
    name: 'Central European Time - Andorra',
    id: 'Europe/Andorra',
    offset: 1,
  },
  {
    name: 'Central European Time - Belgrade',
    id: 'Europe/Belgrade',
    offset: 1,
  },
  {
    name: 'Central European Time - Berlin',
    id: 'Europe/Berlin',
    offset: 1,
  },
  {
    name: 'Central European Time - Brussels',
    id: 'Europe/Brussels',
    offset: 1,
  },
  {
    name: 'Central European Time - Budapest',
    id: 'Europe/Budapest',
    offset: 1,
  },
  {
    name: 'Central European Time - Ceuta',
    id: 'Africa/Ceuta',
    offset: 1,
  },
  {
    name: 'Central European Time - Copenhagen',
    id: 'Europe/Copenhagen',
    offset: 1,
  },
  {
    name: 'Central European Time - Gibraltar',
    id: 'Europe/Gibraltar',
    offset: 1,
  },
  {
    name: 'Central European Time - Luxembourg',
    id: 'Europe/Luxembourg',
    offset: 1,
  },
  {
    name: 'Central European Time - Madrid',
    id: 'Europe/Madrid',
    offset: 1,
  },
  {
    name: 'Central European Time - Malta',
    id: 'Europe/Malta',
    offset: 1,
  },
  {
    name: 'Central European Time - Monaco',
    id: 'Europe/Monaco',
    offset: 1,
  },
  {
    name: 'Central European Time - Oslo',
    id: 'Europe/Oslo',
    offset: 1,
  },
  {
    name: 'Central European Time - Paris',
    id: 'Europe/Paris',
    offset: 1,
  },
  {
    name: 'Central European Time - Prague',
    id: 'Europe/Prague',
    offset: 1,
  },
  {
    name: 'Central European Time - Rome',
    id: 'Europe/Rome',
    offset: 1,
  },
  {
    name: 'Central European Time - Stockholm',
    id: 'Europe/Stockholm',
    offset: 1,
  },
  {
    name: 'Central European Time - Tirane',
    id: 'Europe/Tirane',
    offset: 1,
  },
  {
    name: 'Central European Time - Vienna',
    id: 'Europe/Vienna',
    offset: 1,
  },
  {
    name: 'Central European Time - Warsaw',
    id: 'Europe/Warsaw',
    offset: 1,
  },
  {
    name: 'Central European Time - Zurich',
    id: 'Europe/Zurich',
    offset: 1,
  },
  {
    name: 'Morocco Time',
    id: 'Africa/Casablanca',
    offset: 1,
  },
  {
    name: 'West Africa Standard Time - Lagos',
    id: 'Africa/Lagos',
    offset: 1,
  },
  {
    name: 'West Africa Standard Time - Ndjamena',
    id: 'Africa/Ndjamena',
    offset: 1,
  },
  {
    name: 'Western Sahara Time',
    id: 'Africa/El_Aaiun',
    offset: 1,
  },
  {
    name: 'Central Africa Time - Khartoum',
    id: 'Africa/Khartoum',
    offset: 2,
  },
  {
    name: 'Central Africa Time - Maputo',
    id: 'Africa/Maputo',
    offset: 2,
  },
  {
    name: 'Central Africa Time - Windhoek',
    id: 'Africa/Windhoek',
    offset: 2,
  },
  {
    name: 'Eastern European Standard Time - Cairo',
    id: 'Africa/Cairo',
    offset: 2,
  },
  {
    name: 'Eastern European Standard Time - Kaliningrad',
    id: 'Europe/Kaliningrad',
    offset: 2,
  },
  {
    name: 'Eastern European Standard Time - Tripoli',
    id: 'Africa/Tripoli',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Amman',
    id: 'Asia/Amman',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Athens',
    id: 'Europe/Athens',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Beirut',
    id: 'Asia/Beirut',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Bucharest',
    id: 'Europe/Bucharest',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Chisinau',
    id: 'Europe/Chisinau',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Damascus',
    id: 'Asia/Damascus',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Gaza',
    id: 'Asia/Gaza',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Hebron',
    id: 'Asia/Hebron',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Helsinki',
    id: 'Europe/Helsinki',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Kiev',
    id: 'Europe/Kiev',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Nicosia',
    id: 'Asia/Nicosia',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Riga',
    id: 'Europe/Riga',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Sofia',
    id: 'Europe/Sofia',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Tallinn',
    id: 'Europe/Tallinn',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Uzhhorod',
    id: 'Europe/Uzhgorod',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Vilnius',
    id: 'Europe/Vilnius',
    offset: 2,
  },
  {
    name: 'Eastern European Time - Zaporozhye',
    id: 'Europe/Zaporozhye',
    offset: 2,
  },
  {
    name: 'Famagusta Time',
    id: 'Asia/Famagusta',
    offset: 2,
  },
  {
    name: 'Israel Time',
    id: 'Asia/Jerusalem',
    offset: 2,
  },
  {
    name: 'South Africa Standard Time',
    id: 'Africa/Johannesburg',
    offset: 2,
  },
  {
    name: 'Arabian Standard Time - Baghdad',
    id: 'Asia/Baghdad',
    offset: 3,
  },
  {
    name: 'Arabian Standard Time - Qatar',
    id: 'Asia/Qatar',
    offset: 3,
  },
  {
    name: 'Arabian Standard Time - Riyadh',
    id: 'Asia/Riyadh',
    offset: 3,
  },
  {
    name: 'East Africa Time - Juba',
    id: 'Africa/Juba',
    offset: 3,
  },
  {
    name: 'East Africa Time - Nairobi',
    id: 'Africa/Nairobi',
    offset: 3,
  },
  {
    name: 'Kirov Time',
    id: 'Europe/Kirov',
    offset: 3,
  },
  {
    name: 'Moscow Standard Time - Minsk',
    id: 'Europe/Minsk',
    offset: 3,
  },
  {
    name: 'Moscow Standard Time - Moscow',
    id: 'Europe/Moscow',
    offset: 3,
  },
  {
    name: 'Moscow Standard Time - Simferopol',
    id: 'Europe/Simferopol',
    offset: 3,
  },
  {
    name: 'Syowa Time',
    id: 'Antarctica/Syowa',
    offset: 3,
  },
  {
    name: 'Turkey Time',
    id: 'Europe/Istanbul',
    offset: 3,
  },
  {
    name: 'Iran Time',
    id: 'Asia/Tehran',
    offset: 3.5,
  },
  {
    name: 'Armenia Standard Time',
    id: 'Asia/Yerevan',
    offset: 4,
  },
  {
    name: 'Astrakhan Time',
    id: 'Europe/Astrakhan',
    offset: 4,
  },
  {
    name: 'Azerbaijan Standard Time',
    id: 'Asia/Baku',
    offset: 4,
  },
  {
    name: 'Georgia Standard Time',
    id: 'Asia/Tbilisi',
    offset: 4,
  },
  {
    name: 'Gulf Standard Time',
    id: 'Asia/Dubai',
    offset: 4,
  },
  {
    name: 'Mauritius Standard Time',
    id: 'Indian/Mauritius',
    offset: 4,
  },
  {
    name: 'Réunion Time',
    id: 'Indian/Reunion',
    offset: 4,
  },
  {
    name: 'Samara Standard Time',
    id: 'Europe/Samara',
    offset: 4,
  },
  {
    name: 'Saratov Time',
    id: 'Europe/Saratov',
    offset: 4,
  },
  {
    name: 'Seychelles Time',
    id: 'Indian/Mahe',
    offset: 4,
  },
  {
    name: 'Ulyanovsk Time',
    id: 'Europe/Ulyanovsk',
    offset: 4,
  },
  {
    name: 'Volgograd Standard Time',
    id: 'Europe/Volgograd',
    offset: 4,
  },
  {
    name: 'Afghanistan Time',
    id: 'Asia/Kabul',
    offset: 4.5,
  },
  {
    name: 'French Southern & Antarctic Time',
    id: 'Indian/Kerguelen',
    offset: 5,
  },
  {
    name: 'Maldives Time',
    id: 'Indian/Maldives',
    offset: 5,
  },
  {
    name: 'Mawson Time',
    id: 'Antarctica/Mawson',
    offset: 5,
  },
  {
    name: 'Pakistan Standard Time',
    id: 'Asia/Karachi',
    offset: 5,
  },
  {
    name: 'Tajikistan Time',
    id: 'Asia/Dushanbe',
    offset: 5,
  },
  {
    name: 'Turkmenistan Standard Time',
    id: 'Asia/Ashgabat',
    offset: 5,
  },
  {
    name: 'Uzbekistan Standard Time - Samarkand',
    id: 'Asia/Samarkand',
    offset: 5,
  },
  {
    name: 'Uzbekistan Standard Time - Tashkent',
    id: 'Asia/Tashkent',
    offset: 5,
  },
  {
    name: 'West Kazakhstan Time - Aqtau',
    id: 'Asia/Aqtau',
    offset: 5,
  },
  {
    name: 'West Kazakhstan Time - Aqtobe',
    id: 'Asia/Aqtobe',
    offset: 5,
  },
  {
    name: 'West Kazakhstan Time - Atyrau',
    id: 'Asia/Atyrau',
    offset: 5,
  },
  {
    name: 'West Kazakhstan Time - Oral',
    id: 'Asia/Oral',
    offset: 5,
  },
  {
    name: 'West Kazakhstan Time - Qyzylorda',
    id: 'Asia/Qyzylorda',
    offset: 5,
  },
  {
    name: 'Yekaterinburg Standard Time',
    id: 'Asia/Yekaterinburg',
    offset: 5,
  },
  {
    name: 'India Standard Time - Colombo',
    id: 'Asia/Colombo',
    offset: 5.5,
  },
  {
    name: 'India Standard Time - Kolkata',
    id: 'Asia/Kolkata',
    offset: 5.5,
  },
  {
    name: 'Nepal Time',
    id: 'Asia/Kathmandu',
    offset: 5.75,
  },
  {
    name: 'Bangladesh Standard Time',
    id: 'Asia/Dhaka',
    offset: 6,
  },
  {
    name: 'Bhutan Time',
    id: 'Asia/Thimphu',
    offset: 6,
  },
  {
    name: 'East Kazakhstan Time - Almaty',
    id: 'Asia/Almaty',
    offset: 6,
  },
  {
    name: 'East Kazakhstan Time - Qostanay',
    id: 'Asia/Qostanay',
    offset: 6,
  },
  {
    name: 'Indian Ocean Time',
    id: 'Indian/Chagos',
    offset: 6,
  },
  {
    name: 'Kyrgyzstan Time',
    id: 'Asia/Bishkek',
    offset: 6,
  },
  {
    name: 'Omsk Standard Time',
    id: 'Asia/Omsk',
    offset: 6,
  },
  {
    name: 'Urumqi Time',
    id: 'Asia/Urumqi',
    offset: 6,
  },
  {
    name: 'Vostok Time',
    id: 'Antarctica/Vostok',
    offset: 6,
  },
  {
    name: 'Cocos Islands Time',
    id: 'Indian/Cocos',
    offset: 6.5,
  },
  {
    name: 'Myanmar Time',
    id: 'Asia/Yangon',
    offset: 6.5,
  },
  {
    name: 'Barnaul Time',
    id: 'Asia/Barnaul',
    offset: 7,
  },
  {
    name: 'Christmas Island Time',
    id: 'Indian/Christmas',
    offset: 7,
  },
  {
    name: 'Davis Time',
    id: 'Antarctica/Davis',
    offset: 7,
  },
  {
    name: 'Hovd Standard Time',
    id: 'Asia/Hovd',
    offset: 7,
  },
  {
    name: 'Indochina Time - Bangkok',
    id: 'Asia/Bangkok',
    offset: 7,
  },
  {
    name: 'Indochina Time - Ho Chi Minh City',
    id: 'Asia/Ho_Chi_Minh',
    offset: 7,
  },
  {
    name: 'Krasnoyarsk Standard Time - Krasnoyarsk',
    id: 'Asia/Krasnoyarsk',
    offset: 7,
  },
  {
    name: 'Krasnoyarsk Standard Time - Novokuznetsk',
    id: 'Asia/Novokuznetsk',
    offset: 7,
  },
  {
    name: 'Novosibirsk Standard Time',
    id: 'Asia/Novosibirsk',
    offset: 7,
  },
  {
    name: 'Tomsk Time',
    id: 'Asia/Tomsk',
    offset: 7,
  },
  {
    name: 'Western Indonesia Time - Jakarta',
    id: 'Asia/Jakarta',
    offset: 7,
  },
  {
    name: 'Western Indonesia Time - Pontianak',
    id: 'Asia/Pontianak',
    offset: 7,
  },
  {
    name: 'Australian Western Standard Time - Casey',
    id: 'Antarctica/Casey',
    offset: 8,
  },
  {
    name: 'Australian Western Standard Time - Perth',
    id: 'Australia/Perth',
    offset: 8,
  },
  {
    name: 'Brunei Darussalam Time',
    id: 'Asia/Brunei',
    offset: 8,
  },
  {
    name: 'Central Indonesia Time',
    id: 'Asia/Makassar',
    offset: 8,
  },
  {
    name: 'China Standard Time - Macau',
    id: 'Asia/Macau',
    offset: 8,
  },
  {
    name: 'China Standard Time - Shanghai',
    id: 'Asia/Shanghai',
    offset: 8,
  },
  {
    name: 'Choibalsan Standard Time',
    id: 'Asia/Choibalsan',
    offset: 8,
  },
  {
    name: 'Hong Kong Standard Time',
    id: 'Asia/Hong_Kong',
    offset: 8,
  },
  {
    name: 'Irkutsk Standard Time',
    id: 'Asia/Irkutsk',
    offset: 8,
  },
  {
    name: 'Malaysia Time - Kuala Lumpur',
    id: 'Asia/Kuala_Lumpur',
    offset: 8,
  },
  {
    name: 'Malaysia Time - Kuching',
    id: 'Asia/Kuching',
    offset: 8,
  },
  {
    name: 'Philippine Standard Time',
    id: 'Asia/Manila',
    offset: 8,
  },
  {
    name: 'Singapore Standard Time',
    id: 'Asia/Singapore',
    offset: 8,
  },
  {
    name: 'Taipei Standard Time',
    id: 'Asia/Taipei',
    offset: 8,
  },
  {
    name: 'Ulaanbaatar Standard Time',
    id: 'Asia/Ulaanbaatar',
    offset: 8,
  },
  {
    name: 'Australian Central Western Standard Time',
    id: 'Australia/Eucla',
    offset: 8.75,
  },
  {
    name: 'East Timor Time',
    id: 'Asia/Dili',
    offset: 9,
  },
  {
    name: 'Eastern Indonesia Time',
    id: 'Asia/Jayapura',
    offset: 9,
  },
  {
    name: 'Japan Standard Time',
    id: 'Asia/Tokyo',
    offset: 9,
  },
  {
    name: 'Korean Standard Time - Pyongyang',
    id: 'Asia/Pyongyang',
    offset: 9,
  },
  {
    name: 'Korean Standard Time - Seoul',
    id: 'Asia/Seoul',
    offset: 9,
  },
  {
    name: 'Palau Time',
    id: 'Pacific/Palau',
    offset: 9,
  },
  {
    name: 'Yakutsk Standard Time - Chita',
    id: 'Asia/Chita',
    offset: 9,
  },
  {
    name: 'Yakutsk Standard Time - Khandyga',
    id: 'Asia/Khandyga',
    offset: 9,
  },
  {
    name: 'Yakutsk Standard Time - Yakutsk',
    id: 'Asia/Yakutsk',
    offset: 9,
  },
  {
    name: 'Australian Central Standard Time',
    id: 'Australia/Darwin',
    offset: 9.5,
  },
  {
    name: 'Australian Eastern Standard Time - Brisbane',
    id: 'Australia/Brisbane',
    offset: 10,
  },
  {
    name: 'Australian Eastern Standard Time - Lindeman',
    id: 'Australia/Lindeman',
    offset: 10,
  },
  {
    name: 'Chamorro Standard Time',
    id: 'Pacific/Guam',
    offset: 10,
  },
  {
    name: 'Chuuk Time',
    id: 'Pacific/Chuuk',
    offset: 10,
  },
  {
    name: 'Dumont-d’Urville Time',
    id: 'Antarctica/DumontDUrville',
    offset: 10,
  },
  {
    name: 'Papua New Guinea Time',
    id: 'Pacific/Port_Moresby',
    offset: 10,
  },
  {
    name: 'Vladivostok Standard Time - Ust-Nera',
    id: 'Asia/Ust-Nera',
    offset: 10,
  },
  {
    name: 'Vladivostok Standard Time - Vladivostok',
    id: 'Asia/Vladivostok',
    offset: 10,
  },
  {
    name: 'Central Australia Time - Adelaide',
    id: 'Australia/Adelaide',
    offset: 10.5,
  },
  {
    name: 'Central Australia Time - Broken Hill',
    id: 'Australia/Broken_Hill',
    offset: 10.5,
  },
  {
    name: 'Bougainville Time',
    id: 'Pacific/Bougainville',
    offset: 11,
  },
  {
    name: 'Eastern Australia Time - Currie',
    id: 'Australia/Currie',
    offset: 11,
  },
  {
    name: 'Eastern Australia Time - Hobart',
    id: 'Australia/Hobart',
    offset: 11,
  },
  {
    name: 'Eastern Australia Time - Melbourne',
    id: 'Australia/Melbourne',
    offset: 11,
  },
  {
    name: 'Eastern Australia Time - Sydney',
    id: 'Australia/Sydney',
    offset: 11,
  },
  {
    name: 'Kosrae Time',
    id: 'Pacific/Kosrae',
    offset: 11,
  },
  {
    name: 'Lord Howe Time',
    id: 'Australia/Lord_Howe',
    offset: 11,
  },
  {
    name: 'Macquarie Island Time',
    id: 'Antarctica/Macquarie',
    offset: 11,
  },
  {
    name: 'Magadan Standard Time',
    id: 'Asia/Magadan',
    offset: 11,
  },
  {
    name: 'New Caledonia Standard Time',
    id: 'Pacific/Noumea',
    offset: 11,
  },
  {
    name: 'Norfolk Island Time',
    id: 'Pacific/Norfolk',
    offset: 11,
  },
  {
    name: 'Ponape Time',
    id: 'Pacific/Pohnpei',
    offset: 11,
  },
  {
    name: 'Sakhalin Standard Time',
    id: 'Asia/Sakhalin',
    offset: 11,
  },
  {
    name: 'Solomon Islands Time',
    id: 'Pacific/Guadalcanal',
    offset: 11,
  },
  {
    name: 'Srednekolymsk Time',
    id: 'Asia/Srednekolymsk',
    offset: 11,
  },
  {
    name: 'Vanuatu Standard Time',
    id: 'Pacific/Efate',
    offset: 11,
  },
  {
    name: 'Anadyr Standard Time',
    id: 'Asia/Anadyr',
    offset: 12,
  },
  {
    name: 'Fiji Time',
    id: 'Pacific/Fiji',
    offset: 12,
  },
  {
    name: 'Gilbert Islands Time',
    id: 'Pacific/Tarawa',
    offset: 12,
  },
  {
    name: 'Marshall Islands Time - Kwajalein',
    id: 'Pacific/Kwajalein',
    offset: 12,
  },
  {
    name: 'Marshall Islands Time - Majuro',
    id: 'Pacific/Majuro',
    offset: 12,
  },
  {
    name: 'Nauru Time',
    id: 'Pacific/Nauru',
    offset: 12,
  },
  {
    name: 'Petropavlovsk-Kamchatski Standard Time',
    id: 'Asia/Kamchatka',
    offset: 12,
  },
  {
    name: 'Tuvalu Time',
    id: 'Pacific/Funafuti',
    offset: 12,
  },
  {
    name: 'Wake Island Time',
    id: 'Pacific/Wake',
    offset: 12,
  },
  {
    name: 'Wallis & Futuna Time',
    id: 'Pacific/Wallis',
    offset: 12,
  },
  {
    name: 'New Zealand Time',
    id: 'Pacific/Auckland',
    offset: 13,
  },
  {
    name: 'Phoenix Islands Time',
    id: 'Pacific/Enderbury',
    offset: 13,
  },
  {
    name: 'Tokelau Time',
    id: 'Pacific/Fakaofo',
    offset: 13,
  },
  {
    name: 'Tonga Standard Time',
    id: 'Pacific/Tongatapu',
    offset: 13,
  },
  {
    name: 'Chatham Time',
    id: 'Pacific/Chatham',
    offset: 13.75,
  },
  {
    name: 'Apia Time',
    id: 'Pacific/Apia',
    offset: 14,
  },
  {
    name: 'Line Islands Time',
    id: 'Pacific/Kiritimati',
    offset: 14,
  },
];
