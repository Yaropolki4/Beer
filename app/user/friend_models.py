import datetime

from sqlalchemy import or_

from app import db, login


class FriendshipRequest(db.Model):

    from_user = db.Column(db.Integer, db.ForeignKey("users.id"),
                          primary_key=True, nullable=False)
    to_user = db.Column(db.Integer, db.ForeignKey("users.id"),
                        nullable=False)
    message = db.Column(db.String(100), nullable=True)

    @staticmethod
    def create_friendship_request(from_user, to_user):
        print(1)
        if FriendshipRequest.query.filter_by(from_user=from_user, to_user=to_user).first():
            print(2)
            # If friendship request exist
            return False
        else:
            print(3)
            friendship_request = FriendshipRequest(from_user=from_user, to_user=to_user)
            db.session.add(friendship_request)
            db.session.commit()
            return True

    @staticmethod
    def get_request(from_user, to_user):
        return FriendshipRequest.query.filter_by(from_user=from_user, to_user=to_user).first()

    def accept(self):
        """Принять запрос в друзья"""
        Friends.objects.create_friendship(user_id=self.from_user, friend_id=self.to_user)

        self.delete()

        # Для удаления зеркальных запросов(если такие вообще возможны)
        FriendshipRequest.query.filter_by(from_user=self.to_user,
                                          to_user=self.from_user).delete()
        db.session.commit()
        return True

    def reject(self):
        self.delete()
        db.session.commit()
        return True

    def cansel(self):
        self.delete()
        db.session.commit()
        return True



class FriendshipManager():

    def create_friendship(self, user_id, friend_id):
        friendship = Friends(user_id=user_id, friend_id=friend_id)
        friendship_reverse = Friends(user_id=friend_id, friend_id=user_id)
        db.session.add(friendship, friendship_reverse)
        db.session.commit()

    def delete_friend(self, user_id, friend_id):
        friendship = Friends.quary.filter(Friends.user_id.in_([user_id, friend_id]),
                                          Friends.friend_id.in_([friend_id, user_id]))
        if friendship:
            friendship.delete()
            db.session.commit()
            return True
        else:
            return False

class Friends(db.Model):
    __tablename__ = "friends"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True, nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user_info_id = db.Column(db.Integer, db.ForeignKey("usersinfo.id"), nullable=False)
    created_time = db.Column(db.DateTime(timezone=True), default=datetime.datetime.utcnow)

    objects = FriendshipManager()