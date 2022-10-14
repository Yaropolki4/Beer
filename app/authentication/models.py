from flask_login import UserMixin, login_user
from marshmallow import ValidationError
from werkzeug.security import check_password_hash, generate_password_hash

from .validation import RegisterSchema
from app import db, login


class Users(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    hash_password = db.Column(db.String(128), nullable=False)

    user_info = db.relationship('UserInfo',
                            backref='user')

    def __init__(self, name, email, hash_password):
        self.name = name
        self.email = email
        self.hash_password = hash_password

    @staticmethod
    def create_user(name: str, email: str, psw: str, r_psw: str):
        reg_schema = {"name": name, "email": email, "psw": psw, "r_psw": r_psw}

        RegisterSchema().load(reg_schema)
        user = Users(name=name, email=email, hash_password=generate_password_hash(psw))

        if not Users.query.filter_by(email=email).first():
            if not Users.query.filter_by(name=name).first():
                db.session.add(user)
                db.session.commit()
                return user
            else:
                raise ValidationError("Пользователь с таким именем существует")
        else:
            raise ValidationError("Пользователь с таким email существует")

    @staticmethod
    def get_user_for_login(name_or_email: str, psw: str):
        if name_or_email:
            user = Users.query.filter_by(name=name_or_email).first()
            if not user:
                user = Users.query.filter_by(email=name_or_email).first()
        else:
            raise ValidationError("Введите свой email или ник")

        try:
            if check_password_hash(user.hash_password, psw):
                return user
            else:
                raise ValidationError("Неправильный пароль")
        except AttributeError:
            raise ValidationError("Неправильный логин")

    @staticmethod
    def get_user_by_name(name):
        return Users.query.filter_by(name=name).first()

@login.user_loader
def load_user(id):
    return Users.query.get(id)


