import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { dataProvider } from './modules/config/dataProvider';

const bootstrap = async () => {
    dotenv.config();
    dataProvider.initialize();
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
};

bootstrap();
