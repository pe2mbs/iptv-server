from runonce.util import *


def upgrade():
    session = getSession()
    #
    #   Add the ROLE records
    #
    executeListCommands( session,
                         loadDataFile( "roles.yaml", __name__ ),
                         "INSERT INTO roles ( r_id, r_role, r_remark ) "
                         "VALUES( :r_id, :r_role, :r_remark )" )
    #
    #   Add the MODULE ACCESS records
    #
    executeListCommands( session,
                         loadDataFile( "module_access.yaml", __name__ ),
                         "INSERT INTO mod_access ( ma_id, ma_module, ma_description ) "
                         "VALUES ( :ma_id, :ma_module, :ma_description)" )
    #
    #   Add the USER records
    #
    executeListCommands( session,
                         loadDataFile( "users.yaml", __name__ ),
                         "INSERT INTO user ( u_id, u_active, u_name, u_role, u_hash_password, u_must_change, "
                                            "u_first_name, u_last_name, u_email, u_locale, u_listitems ) "
                         "VALUES( :u_id, :u_active, :u_name, :u_role, :u_hash_password, :u_must_change, "
                                 ":u_first_name, :u_last_name, :u_email, :u_locale, :u_listitems )" )

    #
    #   Add the ROLE ACCESS records
    #
    executeListCommands( session,
                         loadDataFile( "role_access.yaml", __name__ ),
                         "INSERT INTO role_access ( ra_id, ra_r_id, ra_ma_id, ra_create, ra_read, ra_update, ra_delete, r_remark ) "
                         "VALUES ( :ra_id, :ra_r_id, :ra_ma_id, :ra_create, :ra_read, :ra_update, :ra_delete, :r_remark )" )
    #
    #   Add the NEWS records
    #
    startDate = datetime.utcnow().date()
    endDate = ( datetime.utcnow() + timedelta( days = 100 ) ).date()
    executeListCommands( session,
                         [ {   'n_id': 1,
                               'n_message': 'NOTIFICATION, this is an alert message',
                               'n_active': True,
                               'n_alert': True,
                               'n_keep': True,
                               'n_start_date': startDate,
                               'n_end_date': endDate },
                            {  "n_id": 2,
                               'n_message': 'Hello world, this is a normal message',
                               'n_active': True,
                               'n_alert': False,
                               'n_keep': True,
                               'n_start_date': startDate,
                               'n_end_date': endDate }
                        ],
                         "INSERT INTO news ( n_id, n_message, n_active, n_alert, n_keep, n_start_date, n_end_date ) "
                         "VALUES( :n_id, :n_message, :n_active, :n_alert, :n_keep, :n_start_date, :n_end_date )" )
    #
    #   Add the LANGUAGE records
    #
    executeListCommands( session,
                         loadDataFile( "languages.yaml", __name__ ),
                         "INSERT INTO language ( la_id, la_label, la_code2, la_code3, la_country_code2, la_country_code3 )"
                         "VALUES ( :la_id, :la_label, :la_code2, :la_code3, :la_country_code2, :la_country_code3 )" )
    #
    #   Add the LANGUAGE TRANSACTION label records
    #
    session.execute( "DELETE FROM language_translates" )
    executeListCommands( session,
                         loadDataFile( "language_reference.yaml", __name__ ),
                         "INSERT INTO language_translates ( lt_id, lt_label )"
                         "VALUES ( :lt_id, :lt_label )" )
    #
    #   Add the X records
    #
    session.execute( "DELETE FROM language_reference" )
    for language in ( 'en', 'nl', 'de', 'fr', 'it' ):
        executeListCommands( session,
                             loadDataFile( "language-{}.yaml".format( language ), __name__ ),
                             "INSERT INTO language_reference ( lr_la_id, lr_lt_id, tr_text )"
                             "VALUES ( :lr_la_id, :lr_lt_id, :tr_text )" )

    session.commit()
    return


def downgrade():
    return