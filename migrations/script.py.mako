"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}

"""
from alembic import op
import sqlalchemy as sa
import importlib
import logging
import webapp2.extensions.database
from sqlalchemy import orm
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}


def upgrade():
    ${upgrades if upgrades else "pass"}
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

    ${downgrades if downgrades else "pass"}
    return