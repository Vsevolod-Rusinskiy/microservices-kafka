import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { Kafka } from 'kafkajs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

type UserEventDto = CreateUserDto | UpdateUserDto;
import { Logger } from '@nestjs/common';

@Injectable()
export class KafkaProducerService {
    private producer: Producer;
    private readonly logger = new Logger(KafkaProducerService.name);

    constructor(private configService: ConfigService) {
        const kafka = new Kafka({
            clientId: 'user-service',
            brokers: [this.configService.get<string>('KAFKA_BROKER')],
        });
        this.producer = kafka.producer();
    }

    async sendUserEvent(eventType: string, userData: UserEventDto) {
        await this.producer.connect();

        await this.producer.send({
            topic: 'user-events',
            messages: [{ value: JSON.stringify({ eventType, userData }) }],
        });

        this.logger.log(`${eventType} event sent to Kafka successfully`);

        await this.producer.disconnect();
    }
}
