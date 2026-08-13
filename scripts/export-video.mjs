import { createServer } from 'node:http'
import { mkdir, readFile, rm, stat } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const root = resolve(import.meta.dirname, '..')
const dist = join(root, 'dist')
const outputDir = join(root, 'exports')
const tempDir = join(root, '.video-export')
const standardOutput = join(outputDir, 'dream-hill-room-rates-1080x1920.mp4')
const usbOutput = join(outputDir, 'dream-hill-room-rates-1080x1920-usb.mp4')
const durationSeconds = 36

const mime = { '.html': 'text/html', '.png': 'image/png', '.jpg': 'image/jpeg' }

function command(program, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(program, args, { cwd: root, stdio: 'inherit', ...options })
    child.once('error', reject)
    child.once('exit', (code) => code === 0 ? resolvePromise() : reject(new Error(`${program} exited with ${code}`)))
  })
}

async function probe(file) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], { cwd: root })
    let output = ''
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.pipe(process.stderr)
    child.once('error', reject)
    child.once('exit', (code) => code === 0 ? resolvePromise(JSON.parse(output)) : reject(new Error(`ffprobe exited with ${code}`)))
  })
}

async function validate(file) {
  const data = await probe(file)
  const video = data.streams.find((stream) => stream.codec_type === 'video')
  const audio = data.streams.find((stream) => stream.codec_type === 'audio')
  const duration = Number(data.format.duration)
  if (!video || video.codec_name !== 'h264') throw new Error(`${file}: expected H.264 video`)
  if (video.width !== 1080 || video.height !== 1920) throw new Error(`${file}: expected 1080x1920`)
  if (video.pix_fmt !== 'yuv420p') throw new Error(`${file}: expected yuv420p`)
  if (video.avg_frame_rate !== '30/1') throw new Error(`${file}: expected 30 fps`)
  if (audio) throw new Error(`${file}: expected no audio`)
  if (Math.abs(duration - durationSeconds) > 0.15) throw new Error(`${file}: expected ~36 seconds, got ${duration}`)
  return { duration, size: (await stat(file)).size }
}

await mkdir(outputDir, { recursive: true })
await rm(tempDir, { recursive: true, force: true })
await mkdir(tempDir, { recursive: true })
await command('npm', ['run', 'build'])

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '')
    const file = join(dist, relative)
    if (!file.startsWith(dist)) throw new Error('Invalid path')
    response.setHeader('Content-Type', mime[extname(file)] ?? 'application/octet-stream')
    response.end(await readFile(file))
  } catch {
    response.statusCode = 404
    response.end('Not found')
  }
})

await new Promise((resolvePromise, reject) => {
  server.once('error', reject)
  server.listen(0, '127.0.0.1', resolvePromise)
})

let browser
let context
try {
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Could not resolve export server port')
  browser = await chromium.launch({ headless: true })
  context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    recordVideo: { dir: tempDir, size: { width: 1080, height: 1920 } },
  })
  const page = await context.newPage()
  await page.goto(`http://127.0.0.1:${address.port}/?video=1&capture=1`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0))
  await page.evaluate(() => {
    for (const animation of document.getAnimations()) {
      animation.currentTime = 0
      animation.pause()
    }
    window.dispatchEvent(new Event('dreamhill-video-start'))
    for (const animation of document.getAnimations()) animation.play()
  })
  console.log(`Recording ${durationSeconds}-second portrait loop…`)
  await page.waitForTimeout((durationSeconds + 0.4) * 1000)
  const video = page.video()
  await page.close()
  const raw = await video.path()
  await context.close()
  context = undefined

  const rawProbe = await probe(raw)
  const rawDuration = Number(rawProbe.format.duration)
  const start = Math.max(0, rawDuration - durationSeconds - 0.08)
  const common = ['-y', '-ss', start.toFixed(3), '-i', raw, '-t', String(durationSeconds), '-an', '-r', '30', '-vf', 'scale=1080:1920:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-movflags', '+faststart']
  await command('ffmpeg', [...common, '-preset', 'slow', '-crf', '18', standardOutput])
  await command('ffmpeg', [...common, '-preset', 'medium', '-crf', '23', '-maxrate', '8M', '-bufsize', '16M', usbOutput])
  const standard = await validate(standardOutput)
  const usb = await validate(usbOutput)
  console.log(`Verified ${standardOutput} (${(standard.size / 1_048_576).toFixed(1)} MiB, ${standard.duration.toFixed(2)}s)`)
  console.log(`Verified ${usbOutput} (${(usb.size / 1_048_576).toFixed(1)} MiB, ${usb.duration.toFixed(2)}s)`)
} finally {
  if (context) await context.close().catch(() => undefined)
  if (browser) await browser.close().catch(() => undefined)
  await new Promise((resolvePromise) => server.close(resolvePromise))
  await rm(tempDir, { recursive: true, force: true })
}
