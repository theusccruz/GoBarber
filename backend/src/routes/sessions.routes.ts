import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

interface UserAuthenticated {
	id: string;
	name: string;
	email: string;
	password?: string;
	created_at: Date;
	updated_at: Date;
}

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
	const { email, password } = request.body;
	const authenticateUser = new AuthenticateUserService();

	try {
		const { user, token } = await authenticateUser.execute({
			email,
			password,
		});

		const userAuthenticated: UserAuthenticated = user;
		delete userAuthenticated.password;

		return response.status(201).json({ userAuthenticated, token });
	} catch (error) {
		return response.status(400).json({
			message: error.message,
		});
	}
});

export default sessionsRouter;
