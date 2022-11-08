import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import * as CryptoJs from 'crypto-js';
import { BufferedFile, FileResponseVo } from 'src/common/interfaces';

@Injectable()
export class FileService {
  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(FileService.name);
  private readonly bucketName = this.configService.get('minio.bucket');

  public get minioClient() {
    return this.minioService.client;
  }

  public getFilesAndCount(
    pagination,
  ): Promise<[projectEntities: FileResponseVo[], totalFiles: number]> {
    // eslint-disable-next-line prefer-const
    let { skip, size: take } = pagination;
    return new Promise((resolve, reject) => {
      const fileList: FileResponseVo[] = [];
      const stream = this.minioClient.listObjects(this.bucketName);
      let total = 0;
      stream.on('data', (obj) => {
        total++;
        if (skip) {
          skip--;
        } else if (fileList.length < take) {
          fileList.push({
            ...obj,
            url: this.getFileUrl(obj.name),
          });
        }
      });
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('end', () => {
        resolve([fileList, total]);
      });
    });
  }

  public async uploadFile(file: BufferedFile, mimetypes: string[] = []) {
    if (!file) {
      throw new HttpException(
        'Error FileInterceptor Upload Name',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 验证文件类型
    if (mimetypes.length) {
      let flag = false;
      let minetype = '';
      while ((minetype = mimetypes.pop())) {
        if (file.mimetype.includes(minetype)) {
          flag = true;
        }
      }
      if (!flag) {
        throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
      }
    }

    const temp_filename = Date.now().toString();
    this.logger.debug('temp_filename: ' + temp_filename);
    const hashedFileName = CryptoJs.SHA512(temp_filename).toString();
    this.logger.debug('hashed_file_name: ' + hashedFileName);
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    const filename = hashedFileName + ext;
    const fileName = `${filename}`;
    const fileBuffer = file.buffer;
    this.logger.debug('bucketName: ' + this.bucketName);
    this.logger.debug('fileName: ' + fileName);
    // this.logger.debug('fileBuffer: ' + fileBuffer);
    this.logger.debug('fileSize: ' + file.size);
    this.logger.debug('metaData: ' + metaData);
    this.minioClient.putObject(
      this.bucketName,
      fileName,
      fileBuffer,
      file.size,
      metaData,
      function (err, objInfo) {
        if (err) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
        // console.log('Success', objInfo);
      },
    );

    return {
      url: this.getFileUrl(filename),
      name: filename,
    };
  }

  getFileUrl(objectName: string) {
    return `https://${this.configService.get<string>('minio.url')}/${
      this.bucketName
    }/${objectName}`;
  }
}
