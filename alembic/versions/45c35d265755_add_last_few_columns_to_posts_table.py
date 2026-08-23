"""add last few columns to posts table

Revision ID: 45c35d265755
Revises: c680ba0342f9
Create Date: 2026-08-23 00:02:35.853577

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '45c35d265755'
down_revision: Union[str, Sequence[str], None] = 'c680ba0342f9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('posts', sa.Column(
        'published', sa.Boolean(), nullable=False, server_default="True"),)
    op.add_column('posts', sa.Column('created_at',
                                      sa.TIMESTAMP(timezone=True),
                                      nullable=False,
                                        server_default=sa.text('NOW()')))



def downgrade() -> None:
    op.drop_column('posts', 'published')
    op.drop_column('posts', 'created_at')
    

