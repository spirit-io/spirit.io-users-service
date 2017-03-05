import { model, required, invisible, hook } from 'spirit.io/lib/decorators';
import { IModelHelper } from 'spirit.io/lib/interfaces';
import { AdminHelper } from 'spirit.io/lib/core';
import { ModelBase } from 'spirit.io/lib/base';
import * as authHelper from '../helper';
import { Role } from './role';


@model()
export class User extends ModelBase {

    constructor(data) {
        super(data);
    }

    //@unique 
    @required
    login: string

    firstName: string;

    @required
    lastName: string;

    //@unique @required
    email: string;

    @required @invisible(true)
    password: string;

    @invisible(true)
    salt: string;

    role: Role;

    @hook('beforeSave')
    static beforeSave(user: User) {
        if (user.isModified('password') || (user.getMetadata('$isCreated') && user.salt == null)) {
            var salt = authHelper.genRandomString(16); /** Gives us salt of length 16 */
            var shaPwd = authHelper.sha512(user.password, salt);
            user.password = shaPwd.hash;
            user.salt = salt;
        }
    }

    static login(params: any) {
        let userHelper: IModelHelper = AdminHelper.model(User);
        let user: User = userHelper.fetchInstance({ login: params.login });
        if (!user) throw new Error(`User '${params.login}' not found`);
        let salt = user.salt;
        let truePwd = user.password;
        var shaPwd = authHelper.sha512(params.password, salt);
        if (shaPwd.hash !== truePwd) throw new Error("Wrong password !");
        return {
            login: user.login,
            role: user.role && user.role.id
        };
    }
}