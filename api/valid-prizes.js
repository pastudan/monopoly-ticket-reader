const validPrizes = [
  {
    name:   '$100 Grocery Gift Card',
    pieces: [
      '129fa',
      '130fb',
      '131fc',
      '132fd',
    ]
  },
  {
    name:   '$100 Cash',
    pieces: [
      '125ea',
      '126eb',
      '127ec',
      '128ed',
    ]
  },
  {
    name:   '$50 Grocery Gift Card',
    pieces: [
      '121da',
      '122db',
      '123dc',
      '124dd',
    ]
  },
  {
    name:   '$25 Grocery Gift Card',
    pieces: [
      '117ca',
      '118cb',
      '119cc',
      '120cd',
    ]
  },
  {
    name:   '$500 Grocery Gift Card',
    pieces: [
      '145ka',
      '146kb',
      '147kc',
      '148kd',
    ]
  },
  {
    name:   '$300 Spa Day',
    pieces: [
      '141ja',
      '142jb',
      '143jc',
      '144jd',
    ]
  },
  {
    name:   '$200 Family Picnic',
    pieces: [
      '137ha',
      '138hb',
      '139hc',
      '140hd',
    ]
  },
  {
    name:   '$200 Cash',
    pieces: [
      '133ga',
      '134gb',
      '135gc',
      '136gd',
    ]
  },
  {
    name:   '$1,000 Cash',
    pieces: [
      '161oa',
      '162ob',
      '163oc',
      '164od',
    ]
  },
  {
    name:   '$1,000 Grocery Gift Card',
    pieces: [
      '157na',
      '158nb',
      '159nc',
      '160nd',
    ]
  },
  {
    name:   '$1,000 Weekend Getaway',
    pieces: [
      '153ma',
      '154mb',
      '155mc',
      '156md',
    ]
  },
  {
    name:   '$1,000 Laptop Computer',
    pieces: [
      '149la',
      '150lb',
      '151lc',
      '152ld',
    ]
  },
  {
    name:   '$5,000 Cash',
    pieces: [
      '177sa',
      '178sb',
      '179sc',
      '180sd',
    ]
  },
  {
    name:   '$5,000 Groceries',
    pieces: [
      '173ra',
      '174rb',
      '175rc',
      '176rd',
    ]
  },
  {
    name:   '$2,600 Movies For A Year',
    pieces: [
      '169qa',
      '170qb',
      '171qc',
      '172qd',
    ]
  },
  {
    name:   '$1,500 Gas Grill & Groceries',
    pieces: [
      '165pa',
      '166pb',
      '167pc',
      '168pd',
    ]
  },
  {
    name:   '$25 Gift Card Mall',
    pieces: [
      '212aa',
      '213ab',
      '214ac',
      '215ad',
    ]
  },
  {
    name:   '$25 Cash',
    pieces: [
      '216ba',
      '217bb',
      '218bc',
      '219bd',
    ]
  },
  {
    name:   '$20 Cash',
    pieces: [
      '220ca',
      '221cb',
      '222cc',
      '223cd',
    ]
  },
  {
    name:   '$15 Grocery Gift Card',
    pieces: [
      '224da',
      '225db',
      '226dc',
      '227dd',
    ]
  },
  {
    name:   '$10 Grocery Gift Card',
    pieces: [
      '228ea',
      '229eb',
      '230ec',
      '231ed',
    ]
  },
  {
    name:   '$10 Cash',
    pieces: [
      '232fa',
      '233fb',
      '234fc',
      '235fd',
    ]
  },
  {
    name:   '$5 Grocery Gift Card',
    pieces: [
      '236ga',
      '237gb',
      '238gc',
      '239gd',
    ]
  },
  {
    name:   '$5 Cash',
    pieces: [
      '240ha',
      '241hb',
      '242hc',
      '243hd',
    ]
  },
  {
    name:   '$100,000 Cash or Luxury Car',
    pieces: [
      '181ta',
      '182tb',
      '183tc',
      '184td',
      '185te',
    ]
  },
  {
    name:   '$40,000 Vehicle of Choice',
    pieces: [
      '186va',
      '187vb',
      '188vc',
      '189vd',
      '190ve',
    ]
  },
  {
    name:   '$25,000 Kitchen Makeover',
    pieces: [
      '191wa',
      '192wb',
      '193wc',
      '194wd',
      '195we',
    ]
  },
  {
    name:   '$20,000 College Tuition',
    pieces: [
      '196xa',
      '197xb',
      '198xc',
      '199xd',
      '200xe',
    ]
  },
  {
    name:   '$10,000 Cash',
    pieces: [
      '202ya',
      '203yb',
      '204yc',
      '205yd',
      '206ye',
    ]
  },
  {
    name:   '$7,500 Family Vacation',
    pieces: [
      '207za',
      '208zb',
      '209zc',
      '210zd',
      '211ze',
    ]
  },
  {
    name:   '$1 Million Cash',
    pieces: [
      '101aa',
      '102ab',
      '103ac',
      '104ad',
      '105ae',
      '106af',
      '107ag',
      '108ah',
    ]
  },
  {
    name:   '$1 Million Vacation Home',
    pieces: [
      '109ba',
      '110bb',
      '111bc',
      '112bd',
      '113be',
      '114bf',
      '115bg',
      '116bh',
    ]
  }
]

let validPieces = ['xxxxx']
validPrizes.forEach(prize => {
  validPieces = validPieces.concat(prize.pieces)
})

module.exports = {
  validPrizes,
  validPieces
}