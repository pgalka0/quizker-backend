import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { DatabaseModule } from 'src/database/database.module';
import { classProvider } from './class.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [ClassController],
  providers: [ClassService, ...classProvider],
  exports: [ClassService],
})
export class ClassModule {}
