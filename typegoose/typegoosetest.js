const mongoose = require('mongoose');
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
mongoose.connect('mongodb://localhost:27017/typegoosetest', {
  useNewUrlParser: true
}, (err) => {
  if (err)
    return console.log('Unable to connect to Mongodb Server');
});

class User extends Typegoose {
  @prop()
  name?: string;
}

const UserModel = new User().getModelForClass(User);

(async () => {
  const u = new UserModel({ name: 'JohnDoe' });
  await u.save();
  const user = await UserModel.findOne();
  console.log(user); // { _id: 59218f686409d670a97e53e0, name: 'JohnDoe', __v: 0 }
})();
