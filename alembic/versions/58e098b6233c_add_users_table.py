"""add users table

Revision ID: 58e098b6233c
Revises: fee3e4e8e186
Create Date: 2026-08-22 23:43:52.289534

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '58e098b6233c'
down_revision: Union[str, Sequence[str], None] = 'fee3e4e8e186'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table("users",
                    sa.Column("id", sa.Integer(), nullable=False),
                    sa.Column("email", sa.String(), nullable=False),
                    sa.Column("password", sa.String(), nullable=False),
                    sa.Column("created_at", sa.TIMESTAMP(timezone=True),
                              server_default=sa.text("now()"),nullable=False),
                    sa.PrimaryKeyConstraint("id"),
                    sa.UniqueConstraint("email"))


def downgrade() -> None:
    op.drop_table('usres')
    pass
