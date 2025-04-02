"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCloudStorageService = void 0;
const storage_1 = require("@google-cloud/storage");
class GoogleCloudStorageService {
    constructor(projectId, bucketName) {
        this.storage = new storage_1.Storage({ projectId });
        this.bucket = bucketName;
    }
    async uploadFile(file, options) {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(options.path);
        const metadata = {
            contentType: options.contentType || 'application/octet-stream',
            metadata: options.metadata || {}
        };
        await blob.save(file, metadata);
        const [url] = await blob.getSignedUrl({
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        const [metadataResult] = await blob.getMetadata();
        return {
            url,
            path: options.path,
            size: metadataResult.size,
            contentType: metadataResult.contentType,
            metadata: metadataResult.metadata || {},
            uploadedAt: metadataResult.timeCreated
        };
    }
    async downloadFile(path) {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(path);
        const [buffer] = await blob.download();
        return buffer;
    }
    async deleteFile(path) {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(path);
        await blob.delete();
    }
    async listFiles(prefix) {
        const bucket = this.storage.bucket(this.bucket);
        const [files] = await bucket.getFiles({ prefix });
        return files.map(file => file.name);
    }
    async getFileMetadata(path) {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(path);
        const [metadata] = await blob.getMetadata();
        return metadata.metadata || {};
    }
}
exports.GoogleCloudStorageService = GoogleCloudStorageService;
//# sourceMappingURL=GoogleCloudStorageService.js.map