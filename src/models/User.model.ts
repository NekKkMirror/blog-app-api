import { server } from '../dependencies/index.dependencies';

const mongo = server.mongo;
const validator = server.validator;
const bcrypt = server.bcrypt;

const UserSchema = new mongo.Schema(
	{
		username: {
			type: String,
			required: [true, 'Please provide name'],
			minlength: 3,
			maxlength: 50
		},
		email: {
			type: String,
			unique: true,
			required: [true, 'Please provide email'],
			validate: {
				validator: validator.default.isEmail,
				message: 'Please provide valid email'
			}
		},
		password: {
			type: String,
			required: [true, 'Please provide name'],
			minlength: 8
		},
		role: {
			type: String,
			enum: ['admin', 'user'],
			default: 'user'
		}
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function () {
	if (!this.isModified('password')) return;

	const salt: string = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (
	candidatePassword: string,
	userPassword: string
): Promise<boolean> {
	const isMatch: boolean = await bcrypt.compare(
		candidatePassword,
		userPassword
	);

	return isMatch;
};

export const User = mongo.model('User', UserSchema);
