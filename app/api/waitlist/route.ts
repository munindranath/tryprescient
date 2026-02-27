import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DATA_DIR = process.env.DATA_DIR || '/tmp/prescient-waitlist'
const DATA_FILE = path.join(DATA_DIR, 'emails.json')

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'invalid email' }, { status: 400 })
    }

    if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true })

    let emails: string[] = []
    if (existsSync(DATA_FILE)) {
      const raw = await readFile(DATA_FILE, 'utf8')
      emails = JSON.parse(raw)
    }

    if (!emails.includes(email)) {
      emails.push(email)
      await writeFile(DATA_FILE, JSON.stringify(emails, null, 2))
    }

    return NextResponse.json({ ok: true, count: emails.length })
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
