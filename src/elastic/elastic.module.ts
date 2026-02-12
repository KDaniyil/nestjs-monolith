import { Global, Module } from '@nestjs/common';
import { ElasticService } from './elastic.service';
import { ElasticController } from './elastic.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        requestTimeout: 600,
        ssl: false,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ElasticController],
  providers: [ElasticService],
})
export class ElasticModule {}
