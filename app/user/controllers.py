import json

from flask import (
    Blueprint, render_template,
    request, Response,
    abort, redirect,
    url_for, session,
)
###
from flask_login import login_user, logout_user, login_required, current_user
from marshmallow import  ValidationError
from flask_socketio import send, emit, join_room

from app import socketio
from app.authentication.models import Users
from .friend_models import Friends, FriendshipRequest
from .user_models import UserInfo
from .utils import create_friends_list


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
    friends_list = create_friends_list(current_user.id)

    return render_template("profile.html", name=name, description=description, friends_list=friends_list)

@user.route('/edit_profile', methods=['POST'])
@login_required
def edit_profile():
    resp = Response()
    description = request.form.get('description')
    name = request.form.get('username')
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
    friend_status = Friends.objects.get_friend_status(current_user.id, user.id)
    if name==current_user.name:
        return redirect(url_for(".profile"))

    if user:
        description = user.user_info[0].profile_description
        friends_list = create_friends_list(user.id)
        return render_template("other_profile.html", name=name, description=description, friend_status=friend_status,
                               friends_list=friends_list)
    else:
        return redirect(url_for(".index"))



"""SOCKET"""

@socketio.on('connect')
def connect():
    room = current_user.name
    join_room(room)
    #notifications = UserNotifications.get_notifications(current_user.user_info.id)
    #friend_list = Friends.objects.get_all_friends(current_user.id)

    #emit('friend_notification', )

@socketio.on('message')
def message(data):
    #print(f"\n\n{data}\n\n")
    send(data, broadcast=True)

@socketio.on('friendship_request')
def friendship_request(name):
    to_user = Users.get_user_by_name(name)
    FriendshipRequest.create_friendship_request(from_user=current_user.id, to_user=to_user.id)
    send_data = current_user.name
    resp = {"name": current_user.name, "info_status": "friend_notification"}
    emit('update_friendship_info', resp, to=to_user.name)
    emit("friendship_request", to=current_user.name)

@socketio.on('cancel_friendship_request')
def cancel_friendship_request(name):
    to_user = Users.get_user_by_name(name)
    friendship_request = FriendshipRequest.get_request(from_user=current_user.id, to_user=to_user.id)
    friendship_request.cansel()
    resp = {"name": current_user.name, "info_status": "cancel"}
    emit('update_friendship_info', resp, to=to_user.name)
    emit('cancel_friendship_request', to=current_user.name)


@socketio.on('resp_friendship_request')
def resp_friendship_request(data):
    from_user = Users.get_user_by_name(data['name'])
    f_request = FriendshipRequest.get_request(from_user=from_user.id, to_user=current_user.id)

    # ответ, добавить или нет
    if data['resp']:
        print(123)
        user_info_id = current_user.user_info[0].id
        friend_info_id = from_user.user_info[0].id
        f_request.accept(user_info_id=user_info_id, friend_info_id=friend_info_id)

        resp = {"name": current_user.name, "info_status": "friends", "resp": data['resp']}
        emit('update_friendship_info', resp, to=data['name'])
        emit('resp_friendship_request', data['resp'], to=current_user.name)
    else:
        f_request.reject()

        resp = {"name": current_user.name, "info_status": "reject"}
        emit('update_friendship_info', resp, to=data['name'])
        emit('resp_friendship_request', data['resp'], to=current_user.name)

@socketio.on('delete_friendship')
def delete_friendship(name):
    friend = Users.get_user_by_name(name)
    Friends.objects.delete_friendship(user_id=current_user.id, friend_id=friend.id)
    resp = {"name": current_user.name, "info_status": "delete"}
    emit('update_friendship_info', resp, to=name)
    emit('delete_friendship', to=current_user.name)

