import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { ZodError } from 'zod';
import { Error } from 'mongoose';
import { ERROR_TYPE } from '@app/contracts/error/error-types';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Response } from 'express';
import { XOR } from 'libs/interfaces/XOR';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const httpContext = { ctx, res, status };

    if (exception.message === ERROR_TYPE.ZOD)
      return sendError({
        ...httpContext,
        code: exception.message,
        errorObject: {
          validation: extractErrorMessagesZod(exception.cause as ZodError),
        },
      });
    else if (exception.message === ERROR_TYPE.MONGOOSE)
      return sendError({
        ...httpContext,
        code: exception.message,
        errorObject: {
          validation: extractErrorMessagesMongoose(
            exception.cause as Error.ValidationError,
          ),
        },
      });
    else if (
      exception.message === ERROR_TYPE.CUSTOM_VALIDATION ||
      exception.message === ERROR_TYPE.NO_TOKEN ||
      exception.message === ERROR_TYPE.INVALID_TOKEN ||
      exception.message === ERROR_TYPE.FORBIDDEN
    )
      return sendError({
        ...httpContext,
        code: exception.message,
        errorObject: {
          message: exception.cause as string,
        },
      });
    else if (exception.message === ERROR_TYPE.DUPLICATION)
      return sendError({
        ...httpContext,
        code: exception.message,
        errorObject: {
          message: exception.cause as string,
        },
      });
    else if (exception.message === ERROR_TYPE.NOT_FOUND)
      return sendError({
        ...httpContext,
        code: exception.message,
        errorObject: {
          message: exception.cause as string,
        },
      });
    else {
      return sendError({
        ...httpContext,
        status: 500,
        code: ERROR_TYPE.INTERNAL_SERVER_ERROR,
        errorObject: {
          message: 'An unexpected error occured!',
        },
        isUnexpected: true,
        unexpcetedError: exception,
      });
    }
  }
}

function extractErrorMessagesZod(err: ZodError) {
  let returningError: {
    path: (string | number)[];
    message: string;
  }[] = [];
  returningError = err.issues.map(({ path, message }) => ({ path, message }));
  return returningError;
}

function extractErrorMessagesMongoose(errs: Error.ValidationError) {
  return Object.keys(errs.errors).reduce(
    (objectAccumlator, propertyName) => ({
      ...objectAccumlator,
      [propertyName]: errs.errors[propertyName].message,
    }),
    {},
  );
}

//sends erorr based on the request type (HTTP or GraphQL)
function sendError({
  ctx,
  code,
  res,
  status,
  errorObject,
  isUnexpected,
  unexpcetedError,
}: {
  ctx: any;
  code: ERROR_TYPE;
  errorObject: XOR<{ message: string }, { validation: object }>;
  res: Response;
  status: number;
  isUnexpected?: boolean;
  unexpcetedError?: any;
}) {
  if (ctx.contextType === 'graphql') {
    if (isUnexpected)
      throw new GraphQLError(code, { extensions: unexpcetedError });
    throw new GraphQLError(code, { extensions: errorObject });
  }
  if (isUnexpected)
    return res.status(status).json({ code, ...unexpcetedError });
  return res.status(status).json({ code, ...errorObject });
}
