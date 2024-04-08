import { UnauthorizedException } from '@nestjs/common';

export class DocumentNotFoundError extends Error {
  constructor() {
    super('DOCUMENT_NOT_FOUND');
  }
}

export class UpdateDocumentError extends Error {
  constructor() {
    super('UPDATE_FAILURE');
  }
}

export default [
  DocumentNotFoundError,
  UpdateDocumentError,
  UnauthorizedException,
];
