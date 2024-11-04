import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definationsFactory = new GraphQLDefinitionsFactory();
definationsFactory.generate({
  typePaths: ['./**/*.graphql'],
  path: join(__dirname, '/graphql.ts'),
  outputAs: 'class',
  watch: true,
  skipResolverArgs: true,
});
