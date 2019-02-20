import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username field is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password field is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    roles: Array,
    registeredAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.post('validate', (doc, next) => {
    doc.password = bcrypt.hashSync(doc.password, 10);

    return next();
});

userSchema.statics.seed = async function () {
    try {
        const users = await this.find();
        if (!users.length) {
            let user = new User({
                username: 'admin',
                password: '123456',
                roles: ['admin']
            });
            user.save((err) => {
                if (err) console.log(err);
            });
        }
    } catch (e) {
        console.log(e);
    }
};

const User = mongoose.model('User', userSchema);

User.seed();

export default User;