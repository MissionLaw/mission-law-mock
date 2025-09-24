import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function setup() {
  console.log('🚀 Setting up Mission Law with Database...')

  try {
    // Start Supabase
    console.log('📦 Starting Supabase...')
    await execAsync('npx supabase start')

    // Apply migrations
    console.log('🗃️  Applying database migrations...')
    await execAsync('npm run db:push')

    // Seed database
    console.log('🌱 Seeding database...')
    await execAsync('npm run script seed')

    console.log('✅ Setup complete!')
    console.log('')
    console.log('🎉 Your Mission Law app is ready!')
    console.log('🔗 Database Studio: http://localhost:54323')
    console.log('💻 Next.js App: http://localhost:3001')
    console.log('')
    console.log('Demo accounts:')
    console.log('  Client: sarah.johnson@techcorp.com')
    console.log('  Admin: david.morrison@missionlaw.com')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

setup()