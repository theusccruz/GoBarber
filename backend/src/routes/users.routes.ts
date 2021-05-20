import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

interface NewUserReturned {
	id: string;
	name: string;
	email: string;
	password?: string;
	created_at: Date;
	updated_at: Date;
}

usersRouter.post('/', async (request, response) => {
	const { name, email, password } = request.body;
	const createUser = new CreateUserService();

	try {
		const newUser = await createUser.execute({
			name,
			email,
			password,
		});
		const newUserReturned: NewUserReturned = newUser;
		delete newUserReturned.password;

		return response.status(201).json(newUserReturned);
	} catch (error) {
		return response.status(400).json({
			message: error.message,
		});
	}
});

export default usersRouter;
