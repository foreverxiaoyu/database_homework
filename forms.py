import wtforms
from wtforms.validators import Email, Length
from models import UserModel, EmailCaptchaModel


class RegisterForm(wtforms.Form):
    username = wtforms.StringField(validators=[Length(min=3, max=20, message='用户名长度不正确')])
    email = wtforms.StringField(validators=[Email(message='邮箱格式不正确')])
    captcha = wtforms.StringField(validators=[Length(min=4, max=4, message='验证码长度不正确')])
    password = wtforms.StringField(validators=[Length(min=6, max=20, message='密码长度不正确')])
    stu_id = wtforms.StringField(validators=[Length(min=10, max=20, message='学号长度不正确')])

    def validate_email(self, filed):
        email = filed.data
        user = UserModel.query.filter_by(email=email).first()
        if user:
            raise wtforms.ValidationError(message='邮箱已经被注册')

    def validate_captcha(self, filed):
        captcha = filed.data
        email = self.email.data
        email_captcha = EmailCaptchaModel.query.filter_by(email=email, captcha=captcha).first()
        if not email_captcha:
            raise wtforms.ValidationError(message='邮箱验证码不正确')
        # else:
        #     db.session.delete(email_captcha)
        #     db.session.commit()


class LoginForm(wtforms.Form):
    email = wtforms.StringField(validators=[Email(message='邮箱格式不正确')])
    password = wtforms.StringField(validators=[Length(min=6, max=20, message='密码长度不正确')])

    # def validate_email(self, filed):
    #     email = filed.data
    #     user = UserModel.query.filter_by(email=email).first()
    #     if not user:
    #         raise wtforms.ValidationError(message='邮箱未注册')
    #
    # def validate_password(self, filed):
    #     password = filed.data
    #     email = self.email.data
    #     user = UserModel.query.filter_by(email=email).first()
    #     if not user.check_password(password):
    #         raise wtforms.ValidationError(message='密码错误')
