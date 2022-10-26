import datetime

from sqlalchemy import or_

from app import db, login


class FriendshipRequest(db.Model):
    """
    Запроса в друзья
    from_user и to_user это id соответствующих юзеров
    """

    from_user = db.Column(db.Integer, db.ForeignKey("users.id"),
                          primary_key=True, nullable=False)
    to_user = db.Column(db.Integer, db.ForeignKey("users.id"),
                        nullable=False)
    message = db.Column(db.String(100), nullable=True)

    @staticmethod
    def create_friendship_request(from_user: int, to_user: int):
        """
        Создание запроса в друзья

        :param from_user: int
        :param to_user: int
        :return:
        """

        if from_user==to_user:
            return False
        req_1 = FriendshipRequest.query.filter_by(from_user=from_user, to_user=to_user).first()
        req_2 = FriendshipRequest.query.filter_by(from_user=to_user, to_user=from_user).first()
        if req_1 or req_2:
            # Если запрос на дружбу существует
            return False
        else:
            friendship_request = FriendshipRequest(from_user=from_user, to_user=to_user)
            db.session.add(friendship_request)
            db.session.commit()
            return True

    @staticmethod
    def get_request(from_user, to_user):
        return FriendshipRequest.query.filter_by(from_user=from_user, to_user=to_user).first()

    def accept(self, user_info_id: int, friend_info_id: int):
        """
        Принять запрос в друзья

        :param user_info_id: int
        :param friend_info_id: int
        :return:
        """
        Friends.objects.create_friendship(user_id=self.from_user, friend_id=self.to_user,
                                          user_info_id=user_info_id, friend_info_id=friend_info_id)

        db.session.delete(self)
        db.session.commit()
        return True

    def reject(self):
        db.session.delete(self)
        db.session.commit()
        return True

    def cansel(self):
        db.session.delete(self)
        db.session.commit()
        return True



class FriendshipManager():

    def create_friendship(self, user_id, friend_id, user_info_id, friend_info_id):
        friendship = Friends(user_id=user_id, friend_id=friend_id, user_info_id=user_info_id)
        friendship_reverse = Friends(user_id=friend_id, friend_id=user_id, user_info_id=friend_info_id)

        db.session.add(friendship)
        db.session.add(friendship_reverse)
        db.session.commit()

    def delete_friendship(self, user_id, friend_id):
        friendship = Friends.query.filter(Friends.user_id.in_([user_id, friend_id]),
                                          Friends.friend_id.in_([friend_id, user_id])).all()
        print(friendship)
        if friendship:
            db.session.delete(friendship[0])
            db.session.delete(friendship[1])
            db.session.commit()
            return True
        else:
            return False

    def get_all_friends(self, user_id):
        friends = Friends.query.filter_by(user_id=user_id).all()
        return friends

    def get_friend_status(self, user1_id, user2_id):
        if Friends.query.filter_by(user_id=user1_id, friend_id=user2_id).first():
            return "friends"
        elif FriendshipRequest.get_request(user1_id, user2_id):
            return "cansel"
        elif FriendshipRequest.get_request(user2_id, user1_id):
            return "add_reject"
        else:
            return "not_friendship"

class Friends(db.Model):
    __tablename__ = "friends"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True, nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user_info_id = db.Column(db.Integer, db.ForeignKey("usersinfo.id"), nullable=False)
    created_time = db.Column(db.DateTime(timezone=True), default=datetime.datetime.utcnow)

    objects = FriendshipManager()

