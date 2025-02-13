import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async checkUsedEmail(email: string): Promise<boolean | void> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (user) {
      throw new ConflictException('Email already used');
    }
    return false;
  }
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }
  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.password')
      .getOne();
  }
  async create(createUserDto: CreateUserDto) {
    await this.checkUsedEmail(createUserDto.email);
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }
  async changeTfaState(id: string , state : boolean) {
    const user = await this.findOneById(id);
    user.is_tfa_enabled = state;
    return this.userRepository.save(user);
  }
  async changeTfaSecret(user: User , secret : string) {
    user.tfa_secret = secret;
    return this.userRepository.save(user);
  }

  async findOneById(id: string) {
    const user = this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.findOneById(id);
    // disable all sessions of user need to be done 
    return this.userRepository.remove(user);
  }
}
