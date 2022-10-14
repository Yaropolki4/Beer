import json

from flask import (
    Blueprint, render_template,
    request, Response,
    abort, redirect,
    url_for,
)
###
from flask_login import login_user, logout_user, login_required, current_user
from  marshmallow import  ValidationError
from flask_socketio import send, emit, join_room

from app import socketio
from app.authentication.models import Users
from .friend_models import Friends, FriendshipRequest
from .user_models import UserInfo


user = Blueprint('user', __name__, template_folder='templates/user',
                 static_folder='static/user')


@user.route('/')
@user.route('/index')
@login_required
def index():
    return render_template('main.html')

@user.route('/profile')
@login_required
def profile():
    name = current_user.name
    description = current_user.user_info[0].profile_description
    return render_template("profile.html", name=name, description=description)

@user.route('/edit_profile', methods=['POST'])
@login_required
def edit_profile():
    resp = Response()
    description = request.form.get('description')
    name = request.form.get('username')
    print(name, description)
    try:
        current_user.user_info[0].edit_user_profile(name, description)
        resp.data = json.dumps({"url-redirect": url_for('.profile')})
        return resp
    except ValidationError as err:
        print(err)
        resp.data = json.dumps({"error": err.messages})
        return resp

@user.route('/profile/<name>')
@login_required
def other_profile(name):
    user = Users.get_user_by_name(name)

    if name==current_user.name:
        return redirect(url_for(".profile"))


    if user:
        description = user.user_info[0].profile_description
        return render_template("other_profile.html", name=name, description=description)
    else:
        return redirect(url_for(".index"))



"""SOCKET"""
@socketio.on('message')
def message(data):
    #print(f"\n\n{data}\n\n")
    send(data, broadcast=True)

@socketio.on('friendship_request')
def friendship_request(name):
    to_user = Users.get_user_by_name(name)
    FriendshipRequest.create_friendship_request(from_user=current_user.id, to_user=to_user.id)
    send_data = current_user.name
    emit('friend_notification', send_data, broadcast = True)


@socketio.on('resp_friendship_request')
def resp_friendship_request(data):
    f_request = FriendshipRequest.get_request(data.from_user, current_user.id)

    if data.resp == "accept":
        f_request.accept()
    elif data.resp == "reject":
        f_request.reject()

