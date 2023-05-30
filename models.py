# 此文件用于定义数据库表的模型
# 使用命令行创建数据库表
# flask db init # 初始化(只要执行一次)
# flask db migrate #检查模型文件，生成迁移文件
# flask db upgrade # 更新数据库
# 后续添加表只要执行 migrate 和 upgrade 命令即可

from exts import db
from datetime import datetime


class UserModel(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True) #也是视频收藏号，与视频收藏表关联，得到收藏号去视频收藏表中查找收藏的视频id
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(500), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    stu_id = db.Column(db.String(100), nullable=False, unique=True)
    user_say = db.Column(db.String(500), nullable=True)
    join_time = db.Column(db.DateTime, default=datetime.now)
    address = db.Column(db.String(100), nullable=True)
    enterprise = db.Column(db.String(100), nullable=True)
    user_avatar_url = db.Column(db.String(100), nullable=False, default='/static/imgs/users/root.png')


class VideoUri(db.Model):
    __tablename__ = 'videouri'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)    #视频id
    video_url = db.Column(db.String(100), nullable=False)
    video_img_src = db.Column(db.String(100), nullable=False)
    video_tite = db.Column(db.String(100), nullable=False)


class FavoriteVideo(db.Model):
     __tablename__ = 'favorite'
     favorite_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
     video_id = db.Column(db.Integer, db.ForeignKey('videouri.id'), primary_key=True)


class EmailCaptchaModel(db.Model):
    __tablename__ = 'email_captcha'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), nullable=False)
    captcha = db.Column(db.String(100), nullable=False)



