import { exec } from 'child_process'
import { promisify } from 'util'
import { readFileSync, writeFileSync } from 'fs'

const execAsync = promisify(exec)

async function setup() {
  console.log('🚀 Setting up Mission Law with Database...')

  try {
    // Start Supabase
    console.log('📦 Starting Supabase...')
    const { stdout } = await execAsync('npx supabase start')

    // Extract keys from Supabase output
    const publishableMatch = stdout.match(/Publishable key: (sb_publishable_[^\s]+)/)
    const secretMatch = stdout.match(/Secret key: (sb_secret_[^\s]+)/)

    if (publishableMatch && secretMatch) {
      console.log('🔑 Updating environment variables...')
      const envContent = readFileSync('.env.local', 'utf8')
      const updatedEnv = envContent
        .replace(/SUPABASE_ANON_KEY=.*/, `SUPABASE_ANON_KEY=${publishableMatch[1]}`)
        .replace(/SUPABASE_SERVICE_ROLE_KEY=.*/, `SUPABASE_SERVICE_ROLE_KEY=${secretMatch[1]}`)
      writeFileSync('.env.local', updatedEnv)
    }

    // Apply migrations
    console.log('🗃️  Applying database migrations...')
    await execAsync('set -a && source .env.local && npm run db:push')

    // Seed database
    console.log('🌱 Seeding database...')
    await execAsync('set -a && source .env.local && npm run script seed')

    console.log('✅ Setup complete!')
    console.log('')
    console.log('🎉 Your Mission Law app is ready!')
    console.log('🔗 Database Studio: http://localhost:54323')
    console.log('💻 Next.js App: http://localhost:3000')
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