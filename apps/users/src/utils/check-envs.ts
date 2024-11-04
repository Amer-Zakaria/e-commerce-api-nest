import { ConfigService } from '@nestjs/config';

export default function checkEnvs(Config: ConfigService) {
  if (!Config.get<string>('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
  }
  if (!Config.get<string>('db.uri')) {
    console.error('FATAL ERROR: DB URI is not defined.');
    process.exit(1);
  }
  if (
    process.env.NODE_ENV === 'production' &&
    !Config.get<string>('clientOptions.host')
  ) {
    console.error('FATAL ERROR: the host of the users client is not supplied.');
    process.exit(1);
  }
}
