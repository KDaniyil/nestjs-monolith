import { ArrayNotEmpty, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsArray()
  @ArrayNotEmpty()
  orderProduct: { productId: number }[];
}
