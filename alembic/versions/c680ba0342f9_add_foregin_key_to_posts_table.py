"""add Foregin-key to posts table

Revision ID: c680ba0342f9
Revises: 58e098b6233c
Create Date: 2026-08-22 23:52:11.502420

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c680ba0342f9'
down_revision: Union[str, Sequence[str], None] = '58e098b6233c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('posts', sa.Column("owner_id", sa.Integer(), nullable=False))
    op.create_foreign_key('posts_users_fk', source_table="posts", referent_table="users",
                          local_cols=["owner_id"], remote_cols=['id'], ondelete="CASCADE")


def downgrade() -> None:
    op.drop_constraint('posts_users_fk', table_name="posts")
    op.drop_column('posts', 'owner_id')

