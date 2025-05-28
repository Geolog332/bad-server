import { faker } from '@faker-js/faker'
import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import fs from 'fs'
import { extname, join } from 'path'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const tmpDir = join(
    __dirname,
    process.env.UPLOAD_PATH_TEMP
        ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        : '../public'
)

fs.mkdirSync(tmpDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(null, tmpDir)
    },

    filename: (
        _req: Request,
        _file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, faker.string.uuid() + extname(_file?.originalname))
    },
})

export const fileTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!fileTypes.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

export default multer({ storage, fileFilter })
