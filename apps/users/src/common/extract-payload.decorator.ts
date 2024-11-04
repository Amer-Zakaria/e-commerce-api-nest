import { PipeTransform, Type } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';

@Injectable()
class ExtractPayloadPipe implements PipeTransform {
  transform(value: any) {
    return value.payload; // Returns only the inner payload
  }
}

const ExtractedPayloadDec = (
  ...additionalPipes: (Type<PipeTransform> | PipeTransform)[]
) => Payload(new ExtractPayloadPipe(), ...additionalPipes);

export default ExtractedPayloadDec;
