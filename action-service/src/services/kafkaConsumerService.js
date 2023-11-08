const { Kafka } = require('kafkajs');
const actionService = require('./actionService');

class KafkaConsumerService {
    constructor() {
        this.kafka = new Kafka({
            clientId: 'action-service',
            brokers: [process.env.KAFKA_BROKER],
        });
        this.consumer = this.kafka.consumer({ groupId: 'action-group' });
    }

    async connect() {
        await this.consumer.connect();
        await this.consumer.subscribe({
            topic: 'user-events',
            fromBeginning: true,
        });

        await this.consumer.run({
            eachMessage: async ({ message }) => {
                const { value } = message;
                const { eventType, userData } = JSON.parse(value);

                switch (eventType) {
                    case 'USER_CREATED':
                        await this.handleUserCreated(userData);
                        break;
                    case 'USER_UPDATED':
                        await this.handleUserUpdated(userData);
                        break;
                    default:
                        console.log(
                            `Received unhandled event type: ${eventType}`,
                        );
                }
            },
        });
    }

    async handleUserCreated(userData) {
        await actionService.createAction({
            userId: userData.id,
            actionType: 'USER_CREATED',
        });
    }

    async handleUserUpdated(userData) {
        await actionService.updateAction({
            userId: userData.id,
            actionType: 'USER_UPDATED',
        });
    }
}

module.exports = KafkaConsumerService;
