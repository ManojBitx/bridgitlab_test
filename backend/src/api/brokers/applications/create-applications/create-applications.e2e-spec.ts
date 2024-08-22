import * as request from 'supertest';
import { AUTH_ERROR, INVALID_JWT_TOKEN_ERROR } from 'src/common/constants/response-messages';
import { Broker } from 'src/models/brokers/broker.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from 'src/config/jwt/jwt.service';
import { Sequelize } from 'sequelize';
import { faker } from '@faker-js/faker';
import { getTestApp } from 'src/test.helper';

describe('/brokers/applications/create-applications', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    app = await getTestApp();
    sequelize = app?.get<Sequelize>('SEQUELIZE');
    jwtService = app.get<JwtService>(JwtService);
  });

  describe('/brokers/applications/create-applications (GET)', () => {
    it('should reject no token', async () => {
      const {
        status,
        body: { message },
      } = await request(app.getHttpServer()).post('/brokers/applications/create-applications');
      expect(status).toBe(HttpStatus.UNAUTHORIZED);
      expect(message).toBe(AUTH_ERROR);
    });

    it('should reject invalid token', async () => {
      const {
        status,
        body: { message },
      } = await request(app.getHttpServer())
        .post('/brokers/applications/create-applications')
        .set('authorization', `Bearer invalid-token`);
      expect(status).toBe(HttpStatus.BAD_REQUEST);
      expect(message).toBe(INVALID_JWT_TOKEN_ERROR);
    });

    it('should create applications', async () => {
      const broker = (await sequelize.models.Broker.findByPk(1)) as Broker;
      const token = jwtService.generateBrokerToken(broker);
      const applicantData = {
        applicantName: faker.person.fullName(),
        applicantEmail: faker.internet.email(),
        applicantMobilePhoneNumber: faker.phone.number('##########'),
        applicantAddress: faker.location.streetAddress(),
        annualIncomeBeforeTax: parseFloat(faker.finance.amount(20000, 100000, 2)),
        incomingAddress: faker.location.streetAddress(),
        incomingDeposit: parseFloat(faker.finance.amount(1000, 50000, 2)),
        incomingPrice: parseFloat(faker.finance.amount(50000, 300000, 2)),
        incomingStampDuty: parseFloat(faker.finance.amount(500, 5000, 2)),
        loanAmount: parseFloat(faker.finance.amount(5000, 250000, 2)),
        loanDuration: faker.number.int({ min: 60, max: 360 }), // Loan duration in months (5 to 30 years)
        monthlyExpenses: parseFloat(faker.finance.amount(500, 5000, 2)),
        outgoingAddress: faker.location.streetAddress(),
        outgoingMortgage: parseFloat(faker.finance.amount(10000, 200000, 2)),
        outgoingValuation: parseFloat(faker.finance.amount(50000, 300000, 2)),
        savingsContribution: parseFloat(faker.finance.amount(1000, 50000, 2)),
      };
      const { body } = await request(app.getHttpServer())
        .post('/brokers/applications/create-applications')
        .set('authorization', `Bearer ${token}`)
        .send(applicantData);
      expect(body.success).toBe(true);
    });
  });
});
