import { PickType } from '@nestjs/mapped-types';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';

export class LoginDTO extends PickType(CreateUserDTO, [
  'email',
  'password',
] as const) {}