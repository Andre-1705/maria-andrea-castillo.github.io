import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const file = formData.get('file') as File

    if (!title || !description || !category || !file) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos', success: false },
        { status: 400 }
      )
    }

    // Crear directorio de uploads si no existe
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true })
    } catch (e) {
      console.log('Upload directory already exists')
    }

    // Generar nombre único para el archivo
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${uuidv4().slice(0, 8)}.${ext}`
    const filepath = path.join(UPLOAD_DIR, filename)

    // Guardar archivo
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filepath, buffer)

    // Guardar trabajo en JSON
    const jobsFilePath = path.join(process.cwd(), 'lib', 'jobs-db.json')
    let jobs: any = {}

    try {
      const data = await fs.readFile(jobsFilePath, 'utf-8')
      jobs = JSON.parse(data)
    } catch (e) {
      jobs = {}
    }

    if (!jobs[category]) {
      jobs[category] = []
    }

    const newJob = {
      id: uuidv4().slice(0, 8),
      title,
      description,
      image: `/uploads/${filename}`,
      link: `/jobs/${uuidv4().slice(0, 8)}`,
      created_at: new Date().toISOString(),
    }

    jobs[category].push(newJob)

    await fs.writeFile(jobsFilePath, JSON.stringify(jobs, null, 2))

    return NextResponse.json(
      { success: true, job: newJob, message: 'Trabajo guardado correctamente' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error uploading job:', error)
    return NextResponse.json(
      { error: error.message || 'Error al guardar el trabajo', success: false },
      { status: 500 }
    )
  }
}
