export enum ERROR_TYPE {
  MONGOOSE = 'MongooseError',
  ZOD = 'ZodError',
  DUPLICATION = 'Duplication',
  NOT_FOUND = 'notFound',
  CUSTOM_VALIDATION = 'customValidation',
  NO_TOKEN = 'noToken',
  FORBIDDEN = 'Forbidden',
  INVALID_TOKEN = 'invalidToken',
  INTERNAL_SERVER_ERROR = 'InternalServerError',
}
