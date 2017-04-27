//http://openweathermap.org/weather-conditions
//Names are translated to finnish for convenience
//Severity: 0 = none, 1 = Light effect to driving, 2 = medium effect to driving, 3 = Extremely hard to drive
const weatherTypes = [

    {
        id: 201,
        name: 'thunderstorm with rain',
        nameFi: 'Ukkosta ja sadetta',
        severity: 2
    },
    {
        id: 202,
        name: 'thunderstorm with heavy rain',
        nameFi: 'Ukkosta ja kovaa sadetta',
        severity: 2
    },
    {
        id: 231,
        name: 'thunderstorm with drizzle',
        nameFi: 'Ukkosta ja tihkua',
        severity: 1
    },
    {
        id: 232,
        name: 'thunderstorm with heavy drizzle',
        nameFi: 'Ukkosta ja kovaa tihkua',
        severity: 1
    },
    {
        id: 301,
        name: 'drizzle',
        nameFi: 'Tihkua',
        severity: 1
    },
    {
        id: 302,
        name: 'heavy intensity drizzle',
        nameFi: 'Kovaa tihkua',
        severity: 1
    },
    {
        id: 311,
        name: 'drizzle rain',
        nameFi: 'Tihkusadetta',
        severity: 1
    },
    {
        id: 312,
        name: 'heavy intensity drizzle rain',
        nameFi: 'Kovaa tihkusadetta',
        severity: 1
    },
    {
        id: 313,
        name: 'shower rain and drizzle',
        nameFi: 'Kuurosateita ja tihkua',
        severity: 1
    },
    {
        id: 314,
        name: 'heavy shower rain and drizzle',
        nameFi: 'Kovia kuurosateita ja tihkua',
        severity: 2
    },
    {
        id: 321,
        name: 'shower drizzle',
        nameFi: 'Kuurottaista tihkua',
        severity: 1
    },
    {
        id: 501,
        name: 'moderate rain',
        nameFi: 'Sadetta',
        severity: 1
    },
    {
        id: 502,
        name: 'heavy intensity rain',
        nameFi: 'Kovaa sadetta',
        severity: 2
    },
    {
        id: 503,
        name: 'very heavy rain',
        nameFi: 'Erittäin kovaa sadetta',
        severity: 2
    },
    {
        id: 504,
        name: 'extreme rain',
        nameFi: 'Äärimmäisen kovaa sadetta',
        severity: 3
    },
    {
        id: 511,
        name: 'freezing rain',
        nameFi: 'Alijäätynyttä vettä',
        severity: 2
    },
    {
        id: 521,
        name: 'shower rain',
        nameFi: 'Sadekuuroja',
        severity: 1
    },
    {
        id: 522,
        name: 'heavy intensity shower rain',
        nameFi: 'Kovia sadekuuroja',
        severity: 2
    },
    {
        id: 531,
        name: 'heavy intensity shower rain',
        nameFi: 'Repaleisia sadekuuroja',
        severity: 1
    },
    {
        id: 601,
        name: 'Snow',
        nameFi: 'Lumisade',
        severity: 1
    },
    {
        id: 602,
        name: 'heavy snow',
        nameFi: 'Kovaa lumisadetta',
        severity: 2
    },
    {
        id: 611,
        name: 'sleet',
        nameFi: 'Räntää',
        severity: 1
    },
    {
        id: 612,
        name: 'shower sleet',
        nameFi: 'Räntäkuuro',
        severity: 1
    },
    {
        id: 615,
        name: 'light rain and snow',
        nameFi: 'Kevyttä lumi- ja vesisadetta',
        severity: 1
    },
    {
        id: 616,
        name: 'rain and snow',
        nameFi: 'Lumi- ja vesisadetta',
        severity: 2
    },
    {
        id: 621,
        name: 'shower snow',
        nameFi: 'Lumikuuroja',
        severity: 1
    },
    {
        id: 622,
        name: 'heavy shower snow',
        nameFi: 'Kovia lumikuuroja',
        severity: 2
    },
    {
        id: 701,
        name: 'mist',
        nameFi: 'Usvaa',
        severity: 1
    },
    {
        id: 711,
        name: 'smoke',
        nameFi: 'Savua',
        severity: 2
    },
    {
        id: 731,
        name: 'sand, dust whirls',
        nameFi: 'Hiekkapyörteitä',
        severity: 1
    },
    {
        id: 741,
        name: 'fog',
        nameFi: 'Sumua',
        severity: 2
    },
    {
        id: 751,
        name: 'sand',
        nameFi: 'Hiekkamyrsky',
        severity: 3
    },
    {
        id: 761,
        name: 'dust',
        nameFi: 'Pölymyrsky',
        severity: 3
    },
    {
        id: 762,
        name: 'volcanic ash',
        nameFi: 'Vulkaanista tuhkaa',
        severity: 3
    },
    {
        id: 771,
        name: 'squalls',
        nameFi: 'Syöksyvirtauksia',
        severity: 3
    },
    {
        id: 781,
        name: 'tornado',
        nameFi: 'Tornado',
        severity: 3
    },
    {
        id: 900,
        name: 'tornado',
        nameFi: 'Tornado',
        severity: 3
    },
    {
        id: 901,
        name: 'tropical storm',
        nameFi: 'Trooppinen myrsky',
        severity: 3
    },
    {
        id: 902,
        name: 'hurricane',
        nameFi: 'Hurrikaani',
        severity: 3
    },
    {
        id: 906,
        name: 'hail',
        nameFi: 'Sataa rakeita',
        severity: 1
    },
    {
        id: 958,
        name: 'gale',
        nameFi: 'Navakkaa tuulta',
        severity: 1
    },
    {
        id: 959,
        name: 'severe gale',
        nameFi: 'Kovaa tuulta',
        severity: 2
    },
    {
        id: 960,
        name: 'storm',
        nameFi: 'Myrsky',
        severity: 3
    },
    {
        id: 961,
        name: 'violent storm',
        nameFi: 'Erittäin kova myrsky',
        severity: 3
    },
    {
        id: 962,
        name: 'hurricane',
        nameFi: 'Hurrikaani',
        severity: 3
    }
];
