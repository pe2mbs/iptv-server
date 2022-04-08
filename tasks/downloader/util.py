


def normalizeChannelName( name ):
    """This removed spaces between <chars> <digit>

    :param name:
    :return:
    """
    arr = [ ch  for ch in name.replace( '  ', ' ' ) ]
    fIdx = 0
    dIdx = 2
    while ( dIdx < len( arr ) ):
        ch, sp, d = arr[ fIdx : dIdx + 1 ]
        fIdx += 1
        if not ch.isdigit() and sp == ' ' and d.isdigit():
            del arr[ fIdx ]

        dIdx += 1

    return ''.join( arr )

