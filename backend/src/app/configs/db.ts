import mongoose from 'mongoose';
import { Stylog } from 'nhb-toolbox/stylog';
import configs from '@/configs';
import { User } from '@/modules/user/user.model';

/** * Connect to MongoDB using Mongoose. */
export const connectDB = async (): Promise<void> => {
	try {
		// Throw error if there is no connection string
		if (!configs?.mongoUri) {
			throw new Error('MongoDB URI is Not Defined!');
		}

		await mongoose.connect(configs.mongoUri);

		console.info(Stylog.cyan.toANSI('🔗 MongoDB is Connected!'));

		await seedAdmin();

		// Listen for established connection
		mongoose.connection.on('connected', () => {
			console.info(Stylog.cyan.toANSI('🔗 MongoDB is Connected!'));
		});

		// Listen for connection errors
		mongoose.connection.on('error', (err) => {
			console.error(Stylog.error.toANSI(`⛔ MongoDB Connection Error: ${err.message}`));
		});

		// Optional: Listen for disconnection
		mongoose.connection.on('disconnected', () => {
			console.error(Stylog.error.toANSI('⛔ MongoDB is Disconnected!'));
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(Stylog.error.toANSI(`🚫 MongoDB Error: ${error.message}`));
		} else {
			console.error(Stylog.error.toANSI('🛑 Unknown Error Occurred!'));
		}
	}
};

async function seedAdmin() {
	const admin = await User.findOne({ role: 'admin' });

	const { seedAdminEMail, seedAdminPassword } = configs;

	if (admin) return;

	if (!seedAdminEMail || !seedAdminPassword) {
		throw new Error('Admin credentials are not defined in the .env!');
	}

	const user = await User.create({
		name: 'Memento Admin',
		email: seedAdminEMail,
		password: seedAdminPassword,
		role: 'admin',
	});

	if (user) {
		console.info(
			Stylog.ansi16('greenBright').bold.toANSI('✅ Admin User Created Successfully!')
		);
	}
}
