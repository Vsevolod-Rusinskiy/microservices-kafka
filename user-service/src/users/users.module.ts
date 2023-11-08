import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), KafkaModule],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
