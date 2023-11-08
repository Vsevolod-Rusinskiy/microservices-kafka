import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { KafkaProducerService } from '../kafka/kafka.producer.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private kafkaProducerService: KafkaProducerService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(createUserDto);
        const savedUser = await this.usersRepository.save(user);

        await this.kafkaProducerService.sendUserEvent(
            'USER_CREATED',
            savedUser,
        );

        return savedUser;
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async update(
        id: number,
        updateUserDto,
    ): Promise<(DeepPartial<User> & User)[]> {
        const updatedUser = await this.usersRepository.save({
            id,
            ...updateUserDto,
        });

        await this.kafkaProducerService.sendUserEvent('USER_UPDATED', {
            id,
            ...updateUserDto,
        });

        return updatedUser;
    }
}
