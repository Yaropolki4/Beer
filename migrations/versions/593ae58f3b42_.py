"""empty message

Revision ID: 593ae58f3b42
Revises: 91394469001f
Create Date: 2022-10-11 21:04:16.702698

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '593ae58f3b42'
down_revision = '91394469001f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('friends',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('friend_id', sa.Integer(), nullable=False),
    sa.Column('created_time', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['friend_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id')
    )
    op.create_table('friendship_request',
    sa.Column('from_user', sa.Integer(), nullable=False),
    sa.Column('to_user', sa.Integer(), nullable=False),
    sa.Column('message', sa.String(length=100), nullable=True),
    sa.ForeignKeyConstraint(['from_user'], ['users.id'], ),
    sa.ForeignKeyConstraint(['to_user'], ['users.id'], ),
    sa.PrimaryKeyConstraint('from_user')
    )
    op.create_table('usersinfo',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.String(length=20), nullable=False),
    sa.Column('profile_description', sa.String(length=300), nullable=True),
    sa.Column('avatar_icon', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('usersinfo')
    op.drop_table('friendship_request')
    op.drop_table('friends')
    # ### end Alembic commands ###