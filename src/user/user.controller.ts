import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayloadDTO } from 'src/auth/dto/jwt.payload.dto';
import { RequestUser } from 'src/common/decorators/user.request.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserOutputDTO } from './dto/get-user.output.dto';
import { UserService } from './user.service';
import { UpdateUserOutputDTO } from './dto/update-user.output.dto';
import { BindTagDTO } from './dto/bind-tag.dto';
import { BindTagOutputDTO } from './dto/bind-tag.output.dto';
import { IdParamInputDTO } from 'src/common/dto/id.param.input.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async user(@RequestUser() jwtPayload: JwtPayloadDTO) {
    const user = await this.userService.findById(jwtPayload.userId);
    return new GetUserOutputDTO(user);
  }

  @Put()
  async update(
    @RequestUser() jwtPayload: JwtPayloadDTO,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateById(
      jwtPayload.userId,
      updateUserDto,
    );
    return new UpdateUserOutputDTO(user);
  }

  @Delete()
  async delete(@RequestUser() jwtPayload: JwtPayloadDTO) {
    await this.userService.deleteById(jwtPayload.userId);
    await this.authService.revokeToken(jwtPayload.tokenId);
  }

  @Post('tag')
  async bindTag(
    @RequestUser() jwtPayload: JwtPayloadDTO,
    @Body() bindTagDto: BindTagDTO,
  ) {
    const tags = await this.userService.bindTag(jwtPayload.userId, bindTagDto);
    return tags.map((tag) => new BindTagOutputDTO(tag));
  }

  // TODO: pick DTP
  @Delete('tag/:id')
  async unbindTag(
    @RequestUser() jwtPayload: JwtPayloadDTO,
    @Param() param: IdParamInputDTO,
  ) {
    const tags = await this.userService.unbindTag(jwtPayload.userId, param.id);
    return tags.map((tag) => new BindTagOutputDTO(tag));
  }

  // TODO: DTO
  @Get('tag/my')
  async createdTags(@RequestUser() jwtPayload: JwtPayloadDTO) {
    const tags = await this.userService.getCreatedTag(jwtPayload.userId);
    return tags.map((tag) => new BindTagOutputDTO(tag));
  }
}
