"""empty message

Revision ID: R2022_01
Revises: R2021_00
Create Date: 2022-04-09 07:14:33.793349

"""
from alembic import op
import sqlalchemy as sa
import importlib
import logging
import webapp2.extensions.database
from sqlalchemy import orm


# revision identifiers, used by Alembic.
revision = 'R2022_01'
down_revision = 'R2021_00'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('alias',
    sa.Column('ia_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('ia_name', sa.String(length=64), nullable=False),
    sa.Column('ia_alias', sa.String(length=64), nullable=False),
    sa.Column('ia_index', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('ia_id', name=op.f('pk_alias'))
    )
    op.create_table('bouget',
    sa.Column('ib_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('ib_enabled', sa.Boolean(), nullable=True),
    sa.Column('ib_name', sa.String(length=64), nullable=False),
    sa.Column('ib_alias', sa.String(length=64), nullable=True),
    sa.Column('ib_index', sa.Integer(), nullable=True),
    sa.Column('ib_update', sa.DateTime(), nullable=True),
    sa.Column('ib_locale', sa.String(length=5), nullable=True),
    sa.PrimaryKeyConstraint('ib_id', name=op.f('pk_bouget'))
    )
    op.create_table('config',
    sa.Column('if_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('if_enabled', sa.Boolean(), nullable=True),
    sa.Column('if_name', sa.String(length=50), nullable=False),
    sa.Column('if_location', sa.String(length=255), nullable=False),
    sa.Column('if_username', sa.String(length=50), nullable=True),
    sa.Column('if_password', sa.String(length=50), nullable=True),
    sa.Column('if_auth', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('if_id', name=op.f('pk_config'))
    )
    op.create_table('movie',
    sa.Column('im_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('im_enabled', sa.Boolean(), nullable=True),
    sa.Column('im_name', sa.String(length=64), nullable=False),
    sa.Column('im_stitle', sa.String(length=128), nullable=True),
    sa.Column('im_group', sa.String(length=64), nullable=False),
    sa.Column('im_index', sa.Integer(), nullable=True),
    sa.Column('im_update', sa.DateTime(), nullable=True),
    sa.Column('im_duration', sa.Integer(), nullable=True),
    sa.Column('im_link', sa.String(length=255), nullable=False),
    sa.Column('im_tvg_id', sa.String(length=64), nullable=True),
    sa.Column('im_tvg_logo', webapp2.extensions.database.LONGTEXT(), nullable=True),
    sa.Column('im_tvg_name', sa.String(length=64), nullable=True),
    sa.Column('im_tvg_attr', webapp2.extensions.database.LONGTEXT(), nullable=True),
    sa.Column('im_locale', sa.String(length=5), nullable=True),
    sa.PrimaryKeyConstraint('im_id', name=op.f('pk_movie'))
    )
    op.create_table('replace',
    sa.Column('ir_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('ir_find', sa.String(length=128), nullable=False),
    sa.Column('ir_replace', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('ir_id', name=op.f('pk_replace'))
    )
    op.create_table('serie',
    sa.Column('is_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('is_enabled', sa.Boolean(), nullable=True),
    sa.Column('is_name', sa.String(length=64), nullable=False),
    sa.Column('is_index', sa.Integer(), nullable=True),
    sa.Column('is_locale', sa.String(length=5), nullable=True),
    sa.Column('is_update', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('is_id', name=op.f('pk_serie'))
    )
    op.create_table('channel',
    sa.Column('ic_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('ic_enabled', sa.Boolean(), nullable=True),
    sa.Column('ic_name', sa.String(length=64), nullable=False),
    sa.Column('ic_alias', sa.String(length=64), nullable=True),
    sa.Column('ic_ib_id', sa.Integer(), nullable=False),
    sa.Column('ic_index', sa.Integer(), nullable=True),
    sa.Column('ic_update', sa.DateTime(), nullable=True),
    sa.Column('ic_duration', sa.Integer(), nullable=True),
    sa.Column('ic_link', sa.String(length=255), nullable=False),
    sa.Column('ic_tvg_id', sa.String(length=64), nullable=True),
    sa.Column('ic_tvg_logo', webapp2.extensions.database.LONGTEXT(), nullable=True),
    sa.Column('ic_tvg_name', sa.String(length=64), nullable=True),
    sa.Column('ic_tvg_attr', webapp2.extensions.database.LONGTEXT(), nullable=True),
    sa.Column('ic_locale', sa.String(length=5), nullable=True),
    sa.ForeignKeyConstraint(['ic_ib_id'], ['bouget.ib_id'], name=op.f('fk_channel_ic_ib_id_bouget')),
    sa.PrimaryKeyConstraint('ic_id', name=op.f('pk_channel'))
    )
    op.create_table('episode',
    sa.Column('ie_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('ie_name', sa.String(length=64), nullable=False),
    sa.Column('ie_group', sa.String(length=64), nullable=False),
    sa.Column('ie_season', sa.Integer(), nullable=False),
    sa.Column('ie_episode', sa.Integer(), nullable=False),
    sa.Column('ie_is_id', sa.Integer(), nullable=False),
    sa.Column('ie_update', sa.DateTime(), nullable=True),
    sa.Column('ie_duration', sa.Integer(), nullable=True),
    sa.Column('ie_link', sa.String(length=255), nullable=False),
    sa.Column('ie_tvg_id', sa.String(length=64), nullable=True),
    sa.Column('ie_tvg_logo', webapp2.extensions.database.LONGTEXT(), nullable=True),
    sa.Column('ie_tvg_name', sa.String(length=64), nullable=True),
    sa.Column('ie_tvg_attr', webapp2.extensions.database.LONGTEXT(), nullable=True),
    sa.Column('ie_locale', sa.String(length=5), nullable=True),
    sa.ForeignKeyConstraint(['ie_is_id'], ['serie.is_id'], name=op.f('fk_episode_ie_is_id_serie')),
    sa.PrimaryKeyConstraint('ie_id', name=op.f('pk_episode'))
    )
    # ### end Alembic commands ###
    try:
        module = importlib.import_module( 'runonce.{}'.format( revision ) )
        if hasattr( module, 'upgrade' ):
            module.upgrade()

        else:
            logging.warning( "Revision '{}' has no upgrade() function".format( revision ) )

    except ModuleNotFoundError:
        logging.warning( "Revision '{}' has no runonce script".format( revision ) )

    except Exception:
        raise

    return


def downgrade():
    try:
        module = importlib.import_module( 'runonce.{}'.format( revision ) )
        if hasattr( module, 'downgrade' ):
            module.downgrade()

        else:
            logging.warning( "Revision '{}' has no downgrade() function".format( revision ) )

    except ModuleNotFoundError:
        logging.warning( "Revision '{}' has no runonce script".format( revision ) )

    except Exception:
        raise

    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('episode')
    op.drop_table('channel')
    op.drop_table('serie')
    op.drop_table('replace')
    op.drop_table('movie')
    op.drop_table('config')
    op.drop_table('bouget')
    op.drop_table('alias')
    # ### end Alembic commands ###
    return