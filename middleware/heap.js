import fs from 'fs'
import path from 'path'

export default defineEventHandler((event) => {
  const memory = []
  const dir = 'bin'
  const date = new Date()
  const time = date.getHours() + ':' + date.getMinutes()
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()

  const today = `${mm}-${dd}-${yyyy}`
  const filePath = path.join(dir, `log__${today}.log`)

  const bytesToMb = bytes => Math.round(bytes / 1000, 2) / 1000
  const usage = process.memoryUsage()
  const row = {
    url: event.req.url,
    time,
    rss: bytesToMb(usage.rss),
    heapTotal: bytesToMb(usage.heapTotal),
    heapUsed: bytesToMb(usage.heapUsed),
    external: bytesToMb(usage.external),
    stack: bytesToMb(usage.rss - usage.heapTotal)
  }
  memory.push(row)
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    fs.appendFileSync(filePath, JSON.stringify(memory), 'utf8')
    fs.appendFileSync(filePath, '\n', 'utf8')
  } catch (e) {
    console.error(e, 'file write error')
  }
  console.table(memory)
})
