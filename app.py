import random
import string

from flask import Flask, render_template, request, redirect, url_for, flash, session, get_flashed_messages, jsonify, g
from datetime import timedelta
import os

from flask_mail import Message
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

import config
from exts import db, mail
from forms import RegisterForm, LoginForm
from models import UserModel, EmailCaptchaModel, VideoUri, FavoriteVideo
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
app.config.from_object(config)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = os.urandom(24)  # 随机数密钥
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=500)  # 生成过期日期

db.init_app(app)
mail.init_app(app)

migration = Migrate(app, db)

video_information = []
connected_video_information = []


@app.route('/index')
def index():
    return render_template("index.html")


@app.before_request
def my_before_request():
    username = session.get('username')
    if username:
        user = UserModel.query.filter_by(username=username).first()
        setattr(g, "user", user)
        # print(f"{username}+cookie") # 已成功,测试用
    else:
        setattr(g, "user", None)


@app.route('/resources')
def resources():
    Session_Mysql = sessionmaker()
    session_Mysql = Session_Mysql()
    id = session.get('user_id')
    user_id = id
    user = UserModel.query.filter_by(id=user_id).first()
    # if user:
    #     session['user_url'] = user.user_avatar_url
    #     print(session.get('user_url'))
    #     session.update('user_url') 开了就会报错，不想解决了，就是要去更新session['user_url']的值，但是不知道怎么更新
    video = session_Mysql.query(VideoUri.id, VideoUri.video_img_src, VideoUri.video_url,
                                VideoUri.video_tite).filter_by()
    video_lists = db.session.execute(video).all()
    video_information.clear()
    for video_list in video_lists:
        video_information.append({
            'video_id': video_list[0],
            'video_href': video_list[2],
            'video_img_src': video_list[1],
            'video_title': video_list[3]
        })

    user_name = session.get('username')
    id = session.get('user_id')
    favorite = session_Mysql.query(FavoriteVideo.video_id).filter_by(favorite_id=id)
    favorite_list = db.session.execute(favorite).all()  # 根据用户id获得所有收藏视频id
    connected_video_information.clear()
    for i in favorite_list:  # 遍历
        for j in i:
            video = session_Mysql.query(VideoUri.id, VideoUri.video_img_src, VideoUri.video_url,
                                        VideoUri.video_tite).filter_by(id=j)
            video_list = db.session.execute(video).all()
            for k in video_list:  # 更新视频收藏表
                connected_video_information.append({
                    'video_id': k[0],
                    'video_href': k[2],
                    'video_img_src': k[1],
                    'video_title': k[3]
                })
    print(f"connected_video_information={connected_video_information}")
    # print(f"video_information={video_information}")
    # print(f"first_session['video_information']={session.get('video_information')}")

    return render_template("resources.html", video_information=video_information,
                           connected_video_information=connected_video_information, user= user)


@app.context_processor
def my_context_processor():
    return {'user': g.user}


# g.user是全局变量，可以在html中使用
# user的表


# 测试用，实际要sql操作
# 有关数据库的操作(以UserModel表为例)
# 1.添加行
# user = UserModel(email=email, username=username, password=generate_password_hash(password),stu_id=stu_id)
# db.session.add(user)
# db.session.commit()
# 2.删除行,下面的所有first保证有值输出(在数据库中找不到会用NONE代替)，以免报错
# user = UserModel.query.filter_by(email=email).first()
#         UserModel表                        表里的email字段=传入的email
# db.session.delete(user)
# db.session.commit()
# 3.修改行
# user = UserModel.query.filter_by(email=email).first()
# user.username = username
# db.session.commit()
# 4.查询行
# user = UserModel.query.filter_by(email=email).first()
# print(user.username)
# 5.查询所有行
# users = UserModel.query.all()
# for user in users:
#     print(user.username)

# 测试用，实际要sql操作


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        form = LoginForm(request.form)
        if form.validate():
            email = form.email.data
            password = form.password.data
            user = UserModel.query.filter_by(email=email).first()
            if not user:
                print("邮箱未注册")
                return redirect('/login')
            # 下面是验证密码是否正确,check_password_hash()函数的第一个参数是数据库中的密码，第二个参数是用户输入的密码
            if check_password_hash(user.password, password):
                print("登录成功")
                # return jsonify({'code': 200, 'message': '登录成功'})
                session['username'] = user.username
                session['user_id'] = user.id
                session['user_avatar_url'] = user.user_avatar_url
                session['user_signature'] = user.user_say
                print(f"session['user_signature']={session.get('user_signature')}")
                # print(f"{session['username']}+test") # 已成功,测试用
                return render_template("resources.html", user_name=user.username, video_information=video_information)
            else:
                print("密码错误")
                return redirect('/login')
        else:
            print(form.errors)
            return redirect('/login')
        return render_template('login.html')
    return render_template('login.html')


@app.route('/users_manage', methods=['POST', 'GET'])
def users_managing():
    user_id = session.get('user_id')
    user = UserModel.query.filter_by(id=user_id).first()
    return render_template('user_manage.html', user=user)


@app.route('/upload-avatar', methods=['POST', 'GET'])
def upload_avatar():
    file = request.files['avatar']
    user_id = session.get('user_id')
    user = UserModel.query.filter_by(id=user_id).first()
    if file:
        # Generate a secure filename
        filename = secure_filename(file.filename)
        print(f"filename={filename}")

        # Specify the directory path for saving uploaded files
        upload_folder = 'static/imgs/users'
        os.makedirs(upload_folder, exist_ok=True)

        # Save the file with the new name in the upload folder
        new_filename = str(filename)  # Provide the desired new filename with the appropriate extension
        file.save(os.path.join(upload_folder, new_filename))
        user.user_avatar_url = f"imgs/users/{new_filename}"
        db.session.commit()
        print(f"user.user_avatar_url={session.get('user_url')}")
        # Continue processing or return a response
        return 'File uploaded successfully.'
    return 'No file uploaded.'


@app.route('/upload-stu_id', methods=['POST', 'GET'])
def upload_stu_id():
    update_stu_id_dict = request.get_json()
    user_id = update_stu_id_dict['user_id']
    user = UserModel.query.filter_by(id=user_id).first()
    user.stu_id = update_stu_id_dict['stu_id']
    db.session.commit()
    print(f"user.stu_id={user.stu_id}")
    return jsonify(list({'statick', 'ok'}))


@app.route('/upload-email', methods=['POST', 'GET'])
def upload_email():
    return 'ok'


@app.route('/upload-address', methods=['POST', 'GET'])
def upload_address():
    update_address_dict = request.get_json()
    user_id = update_address_dict['user_id']
    user = UserModel.query.filter_by(id=user_id).first()
    user.address = update_address_dict['address']
    db.session.commit()
    return jsonify(list({'statick', 'ok'}))


@app.route('/upload-enterprise', methods=['POST', 'GET'])
def upload_enterprise():
    update_enterprise_dict = request.get_json()
    user_id = update_enterprise_dict['user_id']
    user = UserModel.query.filter_by(id=user_id).first()
    user.enterprise = update_enterprise_dict['enterprise']
    db.session.commit()
    return jsonify(list({'statick', 'ok'}))


@app.route('/user_data', methods=['GET'])
def user_data():
    username = session.get('username')
    user_id = session.get('user_id')
    user_url = session.get('user_avatar_url')
    user_signature = session.get('user_signature')
    print(f"{user_url}+1111111111111")  # 已成功,测试用
    # print(f"{username}+1111111111111") # 已成功,测试用
    if username:
        # 根据需要获取用户数据的逻辑，例如从数据库中查询用户信息
        # ...
        # 构造包含用户名的响应数据
        # data = {'username': username}
        data = {'username': username, 'user_id': user_id, 'user_url': user_url, 'user_signature': user_signature}
        print(jsonify(data))
        print(data)
        # 返回 JSON 格式的响应数据
        return jsonify(data)
    else:
        # 如果用户未登录，则返回空数据或错误信息
        return jsonify({'error': 'User not logged in'})


@app.route('/logout')
def logout():
    session.clear()
    return redirect('/index')


'''@app.route('/user/favorite')
def get_favorite():
    Session_Mysql = sessionmaker()
    session_Mysql = Session_Mysql()
    user = get_flashed_messages(session['username'])                                   #从session中获取用户名
    id = session_Mysql.query(UserModel.id).filter_by(username=user)                    #查找id
    favorite = session_Mysql.query(FavoriteVideo.video_id).filter_by(favorite_id=id)   #用id查找收藏的视频id
    favorite_uri_list = []                                                             #创建收藏视频地址的列表 
    for i in favorite:                                                                 
        favorite_uri_list.append(session_Mysql.query(VideoUri.video_uri).filter_by(id=i))
    session['favorite_list'] = favorite_uri_list                                       #将视频地址列表放入session中
    return render_template()这里填一个页面
'''  # 这个可能需要改进，还要完成用户收藏页面（应该也可以直接在用户页面显示）


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    else:
        form = RegisterForm(request.form)
        if form.validate():
            email = form.email.data
            username = form.username.data
            password = form.password.data
            stu_id = form.stu_id.data
            user = UserModel(email=email, username=username, password=generate_password_hash(password), stu_id=stu_id)
            db.session.add(user)
            db.session.commit()
            return redirect('/login')
        else:
            print(form.errors)
            return redirect('/register')


@app.route('/captcha/email')
def captcha_email():
    email = request.args.get('email')
    source = string.digits * 4
    captcha = ''.join(random.sample(source, 4))
    message = Message(subject="数据库作业验证码", recipients=[email], body=f"验证码为：{captcha}")
    mail.send(message)
    email_captcha = EmailCaptchaModel(email=email, captcha=captcha)
    db.session.add(email_captcha)
    db.session.commit()
    # RESTful API
    # {code: 200/400/500, message: '', data: {}}
    return jsonify({"code": 200, "message": '', "data": None})


@app.after_request
def add_header(response):
    response.cache_control.no_store = True
    return response


@app.route('/resources/video/collection_update', methods=['POST'])
def update_video_collection():
    data = request.get_json()  # Get the JSON data from the request
    print(data)
    username = data['username']
    video_href = data['video_href']
    id = data['id']
    user_id = data['user_id']
    # video_tite = data['video_tite']
    favo = FavoriteVideo.query.filter_by(video_id=id,
                                         favorite_id=user_id).first()  # 这里查找是否已经收藏过了，如果为空则没有收藏，因为进入resources时就已经更新过了
    if favo is None:
        fav = FavoriteVideo(video_id=id, favorite_id=user_id)
        db.session.add(fav)
        db.session.commit()
        video = VideoUri.query.filter_by(id=id).first()
        video_information.append({
            'video_id': id,
            'video_href': video_href,
            'video_img_src': video.video_img_src,
            # 'video_tite': video_tite,
        })
    return jsonify({'static': 'OK'})


@app.route('/resources/video/collecting_cancel', methods=['POST'])
def cancel_collecting():
    data = request.get_json()
    print(data)
    username = data['username']
    video_href = data['video_href']
    id = data['id']
    user_id = data['user_id']
    fav = FavoriteVideo.query.filter_by(favorite_id=user_id, video_id=id).first()
    db.session.delete(fav)
    db.session.commit()
    return jsonify({'static': 'OK'})


@app.route('/resources/video/init', methods=['POST'])
def videoPage_init():
    local_connected_video_information = []
    Session_Mysql = sessionmaker()
    session_Mysql = Session_Mysql()
    id = request.get_json()['user_id']
    favorite = session_Mysql.query(FavoriteVideo.video_id).filter_by(favorite_id=id)
    favorite_list = db.session.execute(favorite).all()  # 根据用户id获得所有收藏视频id
    local_connected_video_information.clear()
    for i in favorite_list:  # 遍历
        for j in i:
            video = session_Mysql.query(VideoUri.id, VideoUri.video_img_src, VideoUri.video_url,
                                        VideoUri.video_tite).filter_by(id=j)
            video_list = db.session.execute(video).all()
            print(f"video_list: {video_list}")
            for k in video_list:  # 更新视频收藏表
                local_connected_video_information.append({
                    'video_id': k[0],
                    'video_href': k[2],
                    'video_img_src': k[1],
                    'video_tite': k[3]
                })
    print(f"local_connected_video_information: {local_connected_video_information}")
    return jsonify(local_connected_video_information)


if __name__ == '__main__':
    app.run(debug=True)
