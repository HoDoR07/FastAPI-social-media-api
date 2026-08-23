"""add column to posts table

Revision ID: fee3e4e8e186
Revises: 0a30972afe5a
Create Date: 2026-08-22 23:30:35.645342

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fee3e4e8e186'
down_revision: Union[str, Sequence[str], None] = '0a30972afe5a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "posts",
        sa.Column("content", sa.String(), nullable=False)
    )


def downgrade() -> None:
    op.drop_column("posts", "content")
