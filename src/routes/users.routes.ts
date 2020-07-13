import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();

const upload = multer(uploadConfig);


usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({ 
        name,
        email, 
        password });
    
    delete user.password;
    
    return response.json(user);
});


//utilizado pra atualizar uma unica informação
usersRouter.patch('/', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename
    });

    return response.json(user);
});


export default usersRouter;