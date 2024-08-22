import { APPLICATION_REPOSITORY } from 'src/common/constants/repositories';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Application } from 'src/models/applications/application.entity';
import {
  ApplicationDto,
  BrokerApplicationPostResponseDto,
  BrokerApplicationsPostBadRequestResponseDto,
} from './create-applications.dto';
import { ApplicationStatus } from 'src/enums/application-status.enum';
import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { BrokerDto } from 'src/models/brokers/broker.dto';
import { BrokerGuard } from '../../broker.guard';
import { INTERNAL_SERVER_ERROR } from 'src/common/constants/response-messages';
import { InternalServerErrorResponseDto } from 'src/common/responses';
import { formatResponseTable } from 'src/common/swagger';
import User from 'src/common/decorators/user';

/**
 * Broker API endpoint for creating applications.
 */
@Controller('brokers/applications')
@ApiTags('Broker API')
export class BrokerApplicationsCreateController {
  /**
   * Initializes the controller
   * @param applicationEntity {Application} Database entity for querying the applications table
   */
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private applicationEntity: typeof Application,
  ) {}

  @Post('create-applications')
  @UseGuards(BrokerGuard)
  @ApiBearerAuth('BROKER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create applications',
    description: 'Create the applications that the broker has submitted.',
  })
  @ApiOkResponse({
    type: BrokerApplicationPostResponseDto,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorResponseDto,
    description: `Returns \`${INTERNAL_SERVER_ERROR}\` when the result could not be computed`,
  })
  @ApiBadRequestResponse({
    type: BrokerApplicationsPostBadRequestResponseDto,
    description: formatResponseTable({}),
  })
  async post(@User() user: BrokerDto, @Body() body: ApplicationDto): Promise<BrokerApplicationPostResponseDto> {
    const avgLoanAmount = await this.applicationEntity.getAverageLoanAmount();
    const loanAmount = body.loanAmount !== avgLoanAmount ? body.loanAmount : null;
    await this.applicationEntity.create({ ...body, status: ApplicationStatus.Submitted, brokerId: user.id });
    return {
      success: true,
      loanAmount,
    };
  }
}
