import { createWriteStream, promises } from 'fs';
import path from 'path';

const fileUpload = async (fileInformation, maxFileSize, fileRename, savedFilePath, supportedFileFormat) => {
  try {

    const { filename, mimetype, encoding, createReadStream } = await fileInformation.file;

    // FILE VALIDATION
    if (!supportedFileFormat.includes(mimetype)) {
      throw new Error('Unsupported File Format');
    }
    if (encoding !== '7bit') {
      throw new Error('Unsupported File Encoding');
    }

    // GENRATING FILE NAME
    const fileExtension = path.extname(filename);
    const fileName = fileRename + fileExtension;

    // REMOVING EXISTING FILES
    const baseFileName = path.basename(fileName, path.extname(fileName));
    const filesWithSameBaseName = await promises.readdir(savedFilePath);
    for (const file of filesWithSameBaseName) {
      const filePath = path.join(savedFilePath, file);
      await promises.unlink(filePath);
    }

    // FILE SIZE VALIDATION
    const chunks = [];
    let fileSize = 0;
    for await (const chunk of createReadStream()) {
      chunks.push(chunk);
      fileSize += chunk.length;
      if (fileSize > parseInt(maxFileSize)) {
        throw new Error('File Size Exceeds The Limit');
      }
    }

    // SAVE THE FILE
    const filePath = path.join(savedFilePath, fileName);
    const writeStream = createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      writeStream
        .on('finish', resolve)
        .on('error', (error) => {
          reject(error);
        });

      for (const chunk of chunks) {
        writeStream.write(chunk);
      }
      writeStream.end();
    });

    return { status: true, fileName };
  } catch (error) {
    throw error;
  }
};

export default fileUpload;
