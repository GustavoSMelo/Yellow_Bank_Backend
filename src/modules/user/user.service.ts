import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { Account } from '../account/entity/account.entity';
import { IAccount } from '../account/types/account.interface';
import { User } from './entity/user.entity';
import { IUser } from './types/user.interface';

@Injectable()
export class UserService {
    public constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly accountService: AccountService,
    ) {}

    public async save(user: IUser): Promise<User> {
        try {
            const userRegistred = await this.userRepository.save(user);

            const account = new Account();

            account.balance = 0.0;
            account.accountType = 'checking account';
            account.userId = userRegistred;

            await this.accountService.save(account);

            return userRegistred;
        } catch (err) {
            throw new BadRequestException(err);
        }
    }

    public index(): Promise<User[]> {
        return this.userRepository.find();
    }

    public show(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    public async update(id: number, user: IUser): Promise<User> {
        const userRegistred = await this.show(id);

        userRegistred.email = user.email;
        userRegistred.firstName = user.firstName;
        userRegistred.lastName = user.lastName;
        userRegistred.document = user.document;

        await this.userRepository.update(id, userRegistred);

        return userRegistred;
    }

    public destroy(id: number) {
        return this.userRepository.delete(id);
    }
}
