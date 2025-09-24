import { seed } from './seed'

async function main() {
  const command = process.argv[2]

  switch (command) {
    case 'seed':
      await seed()
      break
    default:
      console.log('Available commands:')
      console.log('  seed - Seed the database with initial data')
      break
  }
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})