import { ApiProperty, PickType } from '@nestjs/swagger';
import { Application } from 'src/models/applications/application.entity';
import {
  INVALID_MAXIMUM_DATE_ERROR,
  INVALID_MINIMUM_DATE_ERROR,
  MINIMUM_DATE_EXCEEDS_MAXIMUM_DATE_ERROR,
} from 'src/common/constants/response-messages';
import { IsEnum } from 'class-validator';
import { SuccessResponseDto } from 'src/common/responses';

export class ApplicationDto extends PickType(Application, [
  'applicantName',
  'applicantEmail',
  'applicantMobilePhoneNumber',
  'applicantAddress',
  'annualIncomeBeforeTax',
  'incomingAddress',
  'incomingDeposit',
  'incomingPrice',
  'incomingStampDuty',
  'loanAmount',
  'loanDuration',
  'monthlyExpenses',
  'outgoingAddress',
  'outgoingMortgage',
  'outgoingValuation',
  'savingsContribution',
]) {}

export class BrokerApplicationPostResponseDto extends SuccessResponseDto {
  readonly loanAmount: number;
}

/**
 * Error codes this endpoint can return
 */
const BAD_REQUEST_ERRORS = [
  INVALID_MINIMUM_DATE_ERROR,
  INVALID_MAXIMUM_DATE_ERROR,
  MINIMUM_DATE_EXCEEDS_MAXIMUM_DATE_ERROR,
];

/**
 * The response data when an error code is returned
 */
export class BrokerApplicationsPostBadRequestResponseDto {
  /**
   * Failure message and reason
   */
  @ApiProperty({
    description: 'Failure message and reason',
    enum: BAD_REQUEST_ERRORS,
  })
  @IsEnum(BAD_REQUEST_ERRORS)
  readonly message: string;
}
