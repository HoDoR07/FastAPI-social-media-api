"""create posts table

Revision ID: 0a30972afe5a
Revises: 
Create Date: 2026-08-22 23:02:03.293980

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0a30972afe5a'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table("posts", sa.Column(
        "id", sa.Integer(),
        nullable=False,
        primary_key=True),

    sa.Column("title", sa.String(),
              nullable=False,))

    pass


def downgrade() -> None:
    op.drop_table("posts")
    pass
