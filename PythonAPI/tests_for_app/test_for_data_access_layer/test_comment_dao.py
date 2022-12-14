from pytest import fixture
from util.database_connection import connection
from custom_exceptions.comment_not_found import CommentNotFound
from custom_exceptions.post_not_found import PostNotFound
from custom_exceptions.user_not_found import UserNotFound
from entities.post import Post
from entities.comment import Comment
from data_access_layer.implementation_classes.comment_dao import CommentDAO, CommentDAOImp

create_comment_dao: CommentDAO = CommentDAOImp()

@fixture
def create_fake_user():
    
    """For putting a fake user into the database for testing then removing the fake user."""
    # this is the setup
    sql = "Delete from user_table where user_id >= 100000000;" \
          "Insert into user_table values(100000000, 'first10000', 'last10000', 'email@email.com', 'username1000000', " \
          "'passcode100000', 'about', '1991-08-06', 'gif');"
    cursor = connection.cursor()
    cursor.execute(sql)
    connection.commit()
    yield  # everything after the yield is the teardown and called after each test
    sql = "delete from user_table where user_id >= 100000000;"
    cursor = connection.cursor()
    cursor.execute(sql)
    connection.commit()


@fixture
def create_fake_post(create_fake_user):  # notice that the other fixture has been injected into this one.
    """For putting a fake post into the database for testing then removing the fake user."""
    sql = "Insert into post_table values(100000000, 100000000); " \
          "Insert into post_table values(100000001, 100000000);"
    cursor = connection.cursor()
    cursor.execute(sql)
    connection.commit()
    # no yield necessary because of the database cascade delete,
    # deleting the user will also delete the post from the user in the database

@fixture
def create_fake_comment(create_fake_post):
    """For putting a fake post into the database for testing then removing the fake user."""
    sql = "insert into comment_table values(10000, 10000, 10000, 10000, NULL, 'unit test', 0, default);"
    cursor = connection.cursor()
    cursor.execute(sql)
    connection.commit()
    yield  # everything after the yield is the teardown and called after each test
    sql = "delete from comment_table where user_id = 10000;"
    cursor = connection.cursor()
    cursor.execute(sql)
    connection.commit()



def test_create_comment_success():
    new_comment = create_comment_dao.create_comment(post_id=10_000, user_id=10_000, comment_text="success", group_id=10_000, reply_user=10_000)
    print(new_comment.make_dictionary())
    assert new_comment

def test_create_comment_failure():
    try:
        create_comment_dao.create_comment(post_id=100_000, user_id=10_000, comment_text="failure", group_id=10_000, reply_user=10_000)
        assert False
    except PostNotFound as e:
        assert str(e) == 'The post could not be found.'    

def test_get_comment_by_post_id_success():
    assert create_comment_dao.get_comment_by_post_id(post_id=10_000)

def test_get_comment_by_post_id_failure():
    try:
        create_comment_dao.get_comment_by_post_id(post_id=100_000)
        assert False
    except PostNotFound as e:
        assert str(e) == 'The post could not be found.'

def test_delete_comment_success(create_fake_comment):
    try:
        create_comment_dao.delete_comment(10000)
        assert True
    except CommentNotFound as e:
        assert str(e) == 'Comment Not Found.'

def test_delete_comment_failure(create_fake_comment):
    try:
        create_comment_dao.delete_comment(10001)
        assert True
    except CommentNotFound as e:
        assert str(e) == 'Comment Not Found'
