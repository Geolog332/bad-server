import fs from 'node:fs/promises'

const mimeTypeSignatures: { [key: string]: Buffer } = {
    'image/png': Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    'image/jpeg': Buffer.from([0xff, 0xd8, 0xff]),
    'image/gif': Buffer.from([0x47, 0x49, 0x46, 0x38]),
    'image/svg+xml': Buffer.from([0x3c, 0x3f, 0x78, 0x6d, 0x6c]),
}

export const validateMimeType = async (
    filePath: string
): Promise<string | null> => {
    const fileHandle = await fs.open(filePath, 'r')
    const buffer = Buffer.alloc(256)
    await fileHandle.read(buffer, 0, buffer.length, 0)
    await fileHandle.close()

    const foundMimeType = Object.entries(mimeTypeSignatures).find(
        ([_mime, signature]) =>
            buffer.slice(0, signature.length).equals(signature)
    )

    if (foundMimeType) {
        return foundMimeType[0]
    }

    const fileContent = buffer.toString('utf8').trim()
    if (fileContent.startsWith('<?xml') || fileContent.startsWith('<svg')) {
        return 'image/svg+xml'
    }

    return null
}
