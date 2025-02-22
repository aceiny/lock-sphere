import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {  createGoogleUserDto, CreateUserDto } from './types/create-user.dto';
import { UpdateUserDto } from './types/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { TfaState } from './types/tfa-state.enum';
import { CreateOrCheckMasterKeyDto } from './types/master-key.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // user service 
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
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
  async findOneByIdWithSecret(id : string){
    return this.userRepository
    .createQueryBuilder('user')
    .where('user.id = :id' , {id})
    .addSelect('user.tfa_secret')
    .getOne()
  }
  async findOneByIdWithMasterKey(id : string){
    return this.userRepository
    .createQueryBuilder('user')
    .where('user.id = :id' , {id})
    .addSelect('user.master_key')
    .getOne()
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
  async createWithGoogle(createGoogleUserDto: createGoogleUserDto) {
    const user = this.userRepository.create(createGoogleUserDto);
    return this.userRepository.save(user);
  }
  async changeTfaState(user : User, state: TfaState): Promise<boolean> {
    if (user.tfa_state === state) {
      switch (state) {
        case TfaState.ENABLED:
          throw new ConflictException(
            'Two factor authentication already enabled',
          );
        case TfaState.DISABLED:
          throw new ConflictException(
            'Two factor authentication already disabled',
          );
      }
    }
    user.tfa_state = state;
    await this.userRepository.save(user);
    return true;
  }
  async findOneById(id: string) {
    if(!id){
      throw new UnauthorizedException('User not found');
    }
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
  async createOrCheckMasterKey(id : string , createOrCheckMasterKeyDto : CreateOrCheckMasterKeyDto) : Promise<{message : string}>{
    const user = await this.findOneByIdWithMasterKey(id);
    if(!user.master_key){
      user.master_key = createOrCheckMasterKeyDto.master_key
      await this.userRepository.save(user)
      return {
        message : 'Master key created',
      }
    }
    if(user.master_key !== createOrCheckMasterKeyDto.master_key){
      throw new UnauthorizedException('Master key not match')
    }
    return {
      message : 'Master key match'
    }
  }
  async updateAvatar(id : string , avatar : Express.Multer.File){
    if(!avatar){
      throw new ConflictException('Avatar is required')
    }
    const user = await this.findOneById(id);
    user.profile_picture = avatar.path
    return this.userRepository.save(user);
  }
  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  async changeUserTfaSecret(user : User , newSecret : string | null){
    user.tfa_secret = newSecret
    return this.userRepository.save(user)
  }
  async remove(id: string) {
    const user = await this.findOneById(id);
    // disable all sessions of user need to be done
    return this.userRepository.remove(user);
  }
}
