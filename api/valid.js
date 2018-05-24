pieces = [
  '181ta',
  '186va',
  '191wa',
  '196xa',
  '207za',
  '212ya',
]

pieces.map(piece => {
  console.log(`{`)
  console.log(`  name: 'PRIZENAME', `)
  console.log(`  pieces: [`)
  console.log(`    '${piece}',`)
  console.log(`    '${(parseInt(piece.substr(0, 3)) + 1) + piece.substr(3, 1) + 'b'}',`)
  console.log(`    '${(parseInt(piece.substr(0, 3)) + 2) + piece.substr(3, 1) + 'c'}',`)
  console.log(`    '${(parseInt(piece.substr(0, 3)) + 3) + piece.substr(3, 1) + 'd'}',`)
  console.log(`    '${(parseInt(piece.substr(0, 3)) + 4) + piece.substr(3, 1) + 'e'}',`)
  console.log(`  ]`)
  console.log(`},`)
})