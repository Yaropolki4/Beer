from .friend_models import Friends
from app.authentication.models import Users

def create_friends_list(user_id):
    friends = Friends.objects.get_all_friends(user_id)

    friends_names = []
    for friend in friends:
        friends_names.append(Users.query.filter_by(id=friend.friend_id).first().name)
    friends_list = {"friends_names": friends_names}
    return friends_list


def notifications_to_dict(notifications):
    notifications_dict = {}
    for notification in notifications:
        pass